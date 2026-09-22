import { MAIN_ROAD, PHASES, TRACKS } from "@/content/phases";
import { TOPICS, TOPIC_MAP } from "@/content/topics";
import { LEARNING_MAP } from "@/content/projects";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { BANK } from "@/content/interview";
import { PAPER_MAP } from "@/content/papers";
import type { Check } from "@/content/jobs";
import type { SkillId } from "@/content/schema";
import { SKILLS } from "@/content/skills";
import { addDays, today } from "./dates";
import type { ActivityKind, State } from "./store";
import { primaryTrack } from "./plan";

export function dueRevisions(s: State, on = today()) {
  return Object.entries(s.topics)
    .filter(([id, t]) => t.status === "done" && t.rev && t.rev.due <= on && TOPIC_MAP[id])
    .sort((a, b) => a[1].rev!.due.localeCompare(b[1].rev!.due))
    .map(([id]) => id);
}

/** A day counts toward the streak with at least one meaningful action, or two or more plan tasks. */
export function activeDays(s: State): Set<string> {
  const meaningful = new Set<string>();
  const planCounts: Record<string, number> = {};
  for (const e of s.log) {
    if (e.m) meaningful.add(e.d);
    else if (e.k === "plan") planCounts[e.d] = (planCounts[e.d] || 0) + 1;
  }
  for (const [d, n] of Object.entries(planCounts)) if (n >= 2) meaningful.add(d);
  return meaningful;
}

export function streaks(s: State) {
  const days = activeDays(s);
  let current = 0;
  let cursor = days.has(today()) ? today() : today(-1);
  while (days.has(cursor)) { current++; cursor = addDays(cursor, -1); }
  const sorted = [...days].sort();
  let longest = 0, run = 0, prev = "";
  for (const d of sorted) { run = prev && addDays(prev, 1) === d ? run + 1 : 1; longest = Math.max(longest, run); prev = d; }
  return { current, longest, activeDays: days.size };
}

export function activityByDay(s: State, kinds?: ActivityKind[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of s.log) {
    if (kinds && !kinds.includes(e.k)) continue;
    out[e.d] = (out[e.d] || 0) + 1;
  }
  return out;
}

export const isDone = (s: State, id: string) => s.topics[id]?.status === "done";

export function roadTopics(s: State): string[] {
  const tr = TRACKS.find((t) => t.id === primaryTrack(s));
  return [...MAIN_ROAD, ...(tr ? tr.topics : [])];
}

export function overallProgress(s: State) {
  const ids = roadTopics(s);
  const done = ids.filter((id) => isDone(s, id)).length;
  return { done, total: ids.length, pct: ids.length ? done / ids.length : 0 };
}

export function phaseProgress(s: State, phaseId: string) {
  const ids = TOPICS.filter((t) => t.phase === phaseId && (phaseId !== "p9" || !TRACKS.some((tr) => tr.topics.includes(t.id)) || roadTopics(s).includes(t.id))).map((t) => t.id);
  const done = ids.filter((id) => isDone(s, id)).length;
  return { done, total: ids.length, pct: ids.length ? done / ids.length : 0 };
}

export function bestMastery(s: State, phase: string): number | undefined {
  const list = s.mastery[phase];
  return list?.length ? Math.max(...list.map((x) => x.score)) : undefined;
}

/** Soft gate: the previous phase's mastery test at 80%, or an explicit override. */
export function gateStatus(s: State, phaseId: string): { open: boolean; reason?: string } {
  const idx = PHASES.findIndex((p) => p.id === phaseId);
  if (idx <= 1) return { open: true };
  const prev = PHASES[idx - 1];
  const best = bestMastery(s, prev.id);
  if ((best ?? 0) >= 0.8) return { open: true };
  if (s.gates[phaseId]) return { open: true, reason: "Continued with a warning" };
  return { open: false, reason: `${prev.title} mastery test: ${best === undefined ? "not taken" : Math.round(best * 100) + "%"} (target 80%)` };
}

export function projectDone(s: State, id: string): boolean {
  const p = s.projects[id];
  if (!p) return false;
  if (FLAGSHIP_MAP[id]) return !!p.finished;
  const lp = LEARNING_MAP[id];
  return !!lp && lp.milestones.every((m) => p.ms[m.id]);
}

export function projectPct(s: State, id: string): number {
  const p = s.projects[id];
  const ms = FLAGSHIP_MAP[id]?.milestones || LEARNING_MAP[id]?.milestones || [];
  if (!p || !ms.length) return 0;
  return ms.filter((m) => p.ms[m.id]).length / ms.length;
}

const allProjectIds = () => [...Object.keys(LEARNING_MAP), ...Object.keys(FLAGSHIP_MAP)];

function projectsUsingSkill(skill: SkillId): string[] {
  return allProjectIds().filter((id) => {
    const lp = LEARNING_MAP[id];
    if (lp) return lp.skills.includes(skill);
    const f = FLAGSHIP_MAP[id];
    return f.prereqs.some((t) => TOPIC_MAP[t]?.skills.includes(skill));
  });
}

export function interviewStats(s: State, cats?: string[]) {
  let n = 0, ok = 0;
  const catOf = (qid: string) => BANK.find((b) => b.id === qid)?.cat || qid.split(":")[1];
  for (const [qid, r] of Object.entries(s.interview)) {
    if (cats && !cats.includes(catOf(qid) || "")) continue;
    n += r.n; ok += r.ok;
  }
  return { n, ok, acc: n ? ok / n : 0 };
}

const SKILL_TO_CATS: Partial<Record<SkillId, string[]>> = {
  digital: ["digital"], hdl: ["hdl"], rtl: ["rtl"], verification: ["verification"], timing: ["timing"], asic: ["asic"], pd: ["pd"], dft: ["dft"],
  arch: ["arch"], riscv: ["riscv"], protocols: ["protocols"], linux: ["linux"], python: ["programming"], cpp: ["programming"], aihw: ["aihw"],
};

export interface SkillReport { id: SkillId; level: number; completed: number; total: number; must: number; mustDone: number; projects: string[]; papers: string[]; reasons: string[] }

export function skillReport(s: State, skill: SkillId): SkillReport {
  const topics = TOPICS.filter((t) => t.skills.includes(skill));
  const done = topics.filter((t) => isDone(s, t.id));
  const must = topics.filter((t) => t.priority === "must");
  const mustOk = must.filter((t) => isDone(s, t.id) && (s.topics[t.id]?.conf ?? 0) >= 2);
  const projs = projectsUsingSkill(skill).filter((id) => projectDone(s, id));
  const flagshipDone = projs.some((id) => FLAGSHIP_MAP[id]);
  const hands = done.filter((t) => s.topics[t.id]?.ev.some((e) => e === "coded" || e === "practiced")).length;
  const strong = done.filter((t) => (s.topics[t.id]?.conf ?? 0) >= 3).length;
  const cats = SKILL_TO_CATS[skill];
  const iv = cats ? interviewStats(s, cats) : { n: 0, acc: 0 };
  const papers = Object.entries(s.papers).filter(([pid, st]) => (st === "reproduced" || st === "extended") && PAPER_MAP[pid]?.prereqs.some((t) => TOPIC_MAP[t]?.skills.includes(skill))).map(([pid]) => pid);
  const reasons: string[] = [];
  let level = -1;
  if (done.length) { level = 0; reasons.push(`${done.length} topic(s) completed`); }
  const basic = must.length ? mustOk.length >= Math.ceil(must.length / 2) : done.length >= 2;
  if (level >= 0 && basic) { level = 1; reasons.push(`${mustOk.length}/${must.length} must-know topics at Okay or better`); }
  if (level >= 1 && projs.length && hands >= Math.ceil(done.length / 2)) { level = 2; reasons.push(`${projs.length} completed project(s) using it; hands-on evidence on ${hands} topic(s)`); }
  if (level >= 2 && flagshipDone && strong >= Math.ceil(done.length * 0.7) && (!cats || (iv.n >= 10 && iv.acc >= 0.7))) { level = 3; reasons.push("Flagship done, strong confidence, interview accuracy 70%+"); }
  if (level >= 3 && papers.length) { level = 4; reasons.push(`${papers.length} paper(s) reproduced or extended`); }
  return { id: skill, level, completed: done.length, total: topics.length, must: must.length, mustDone: mustOk.length, projects: projs, papers, reasons };
}

export function allSkills(s: State): SkillReport[] {
  return SKILLS.map((k) => skillReport(s, k.id));
}

export function evaluate(check: Check, s: State): { met: boolean; detail: string } {
  switch (check.kind) {
    case "topics": {
      const ok = check.ids.filter((id) => isDone(s, id) && (s.topics[id]?.conf ?? 0) >= check.minConf);
      return { met: ok.length === check.ids.length, detail: `${ok.length}/${check.ids.length} topics at Okay confidence or better` };
    }
    case "skill": {
      const r = skillReport(s, check.skill);
      return { met: r.level >= check.level, detail: `current level ${r.level < 0 ? "none" : r.level}` };
    }
    case "projects": {
      const pool = check.ids || allProjectIds().filter((id) => check.tier !== "flagship" || FLAGSHIP_MAP[id]);
      const done = pool.filter((id) => projectDone(s, id) && (check.tier !== "flagship" || FLAGSHIP_MAP[id]));
      return { met: done.length >= check.count, detail: `${done.length}/${check.count} completed` };
    }
    case "interview": {
      const st = interviewStats(s, check.cats);
      return { met: st.n >= check.attempts && st.acc >= check.accuracy, detail: `${st.n} answers, ${Math.round(st.acc * 100)}% accuracy` };
    }
    case "manual":
      return { met: !!s.checks[check.key], detail: s.checks[check.key] ? "marked done" : "mark when true" };
  }
}
