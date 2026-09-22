import { MAIN_ROAD, PHASES, PRIMARY_SLOT_DAYS, SECONDARY_SLOT_DAYS, TARGET_TO_TRACK, TRACKS } from "@/content/phases";
import { TOPIC_MAP } from "@/content/topics";
import { PHASE_PROJECTS } from "@/content/projects";
import { CAREER_TASKS, MILESTONES } from "@/content/mastery";
import { DSA_FOR_HW } from "@/content/skills";
import { RESOURCE_MAP } from "@/content/resources";
import { PRACTICE } from "@/content/practice";
import type { Topic, TrackId } from "@/content/schema";
import type { Intensity, State } from "./store";

export type DayKind = "learn" | "slot" | "consolidate" | "project" | "milestone" | "graduation";

export interface PlanDay {
  day: number;
  week: number;
  dow: number; // 1..7 within the study week
  kind: DayKind;
  phase: string;
  topicId?: string;
  part?: number;
  parts?: number;
  slot?: { which: "primary" | "secondary"; index: number };
  weekTopics?: string[];
  projectId?: string;
  month?: number;
  careerTask?: string;
  dsa?: number;
}

type Unit = { kind: "learn"; topicId: string; part: number; parts: number; phase: string } | { kind: "slot"; which: "primary" | "secondary"; index: number; phase: string };

function buildUnits(): Unit[] {
  const units: Unit[] = [];
  for (const id of MAIN_ROAD) {
    const t = TOPIC_MAP[id];
    for (let p = 1; p <= t.days; p++) units.push({ kind: "learn", topicId: id, part: p, parts: t.days, phase: t.phase });
    if (id === "specialization-gate") {
      for (let i = 0; i < PRIMARY_SLOT_DAYS; i++) units.push({ kind: "slot", which: "primary", index: i, phase: "p9" });
      for (let i = 0; i < SECONDARY_SLOT_DAYS; i++) units.push({ kind: "slot", which: "secondary", index: i, phase: "p9" });
    }
  }
  return units;
}

function generate(): PlanDay[] {
  const units = buildUnits();
  const days: PlanDay[] = [];
  const projectCursor: Record<string, number> = {};
  let u = 0;
  let week = 0;
  let lastPhase = "p0";
  while (u < units.length) {
    week++;
    const weekTopics: string[] = [];
    for (let dow = 1; dow <= 5 && u < units.length; dow++, u++) {
      const unit = units[u];
      lastPhase = unit.phase;
      const day = days.length + 1;
      if (unit.kind === "learn") {
        if (!weekTopics.includes(unit.topicId)) weekTopics.push(unit.topicId);
        days.push({ day, week, dow, kind: "learn", phase: unit.phase, topicId: unit.topicId, part: unit.part, parts: unit.parts });
      } else {
        days.push({ day, week, dow, kind: "slot", phase: unit.phase, slot: { which: unit.which, index: unit.index } });
      }
    }
    days.push({ day: days.length + 1, week, dow: 6, kind: "consolidate", phase: lastPhase, weekTopics, dsa: (week - 1) % DSA_FOR_HW.length });
    if (week % 4 === 0) {
      days.push({ day: days.length + 1, week, dow: 7, kind: "milestone", phase: lastPhase, month: Math.min(week / 4, MILESTONES.length), careerTask: CAREER_TASKS[week] });
    } else {
      const queue = PHASE_PROJECTS[lastPhase] || [];
      const k = projectCursor[lastPhase] || 0;
      projectCursor[lastPhase] = k + 1;
      days.push({ day: days.length + 1, week, dow: 7, kind: "project", phase: lastPhase, projectId: queue.length ? queue[Math.min(k, queue.length - 1)] : undefined, careerTask: CAREER_TASKS[week] });
    }
  }
  days.push({ day: days.length + 1, week: week + 1, dow: 1, kind: "graduation", phase: "p12" });
  return days;
}

export const PLAN: PlanDay[] = generate();
export const PLAN_LENGTH = PLAN.length;

export function primaryTrack(s: State): TrackId {
  return s.spec.primary || TARGET_TO_TRACK[s.settings.target] || "rtl";
}

/** Map a specialization slot to (topic, part) using the learner's chosen tracks. */
export function resolveSlot(slot: { which: "primary" | "secondary"; index: number }, s: State): { topicId?: string; part: number; parts: number; note?: string } {
  const trackId = slot.which === "primary" ? primaryTrack(s) : s.spec.secondary;
  if (!trackId) return { part: 1, parts: 1, note: "No secondary track chosen: use this day for your primary track's flagship project." };
  const track = TRACKS.find((t) => t.id === trackId)!;
  const seq: { id: string; part: number; parts: number }[] = [];
  for (const id of track.topics) { const t = TOPIC_MAP[id]; for (let p = 1; p <= t.days; p++) seq.push({ id, part: p, parts: t.days }); }
  const item = seq[slot.index];
  if (!item) return { part: 1, parts: 1, note: `Track topics finished: continue your ${track.title} flagship project.` };
  return { topicId: item.id, part: item.part, parts: item.parts, note: slot.which === "secondary" ? "Secondary track, compressed: aim for Basic depth." : undefined };
}

export function dayTopic(d: PlanDay, s: State): { topic?: Topic; part: number; parts: number; note?: string } {
  if (d.kind === "learn" && d.topicId) return { topic: TOPIC_MAP[d.topicId], part: d.part || 1, parts: d.parts || 1 };
  if (d.kind === "slot" && d.slot) {
    const r = resolveSlot(d.slot, s);
    return { topic: r.topicId ? TOPIC_MAP[r.topicId] : undefined, part: r.part, parts: r.parts, note: r.note };
  }
  return { part: 1, parts: 1 };
}

export const PHASE_OF_DAY = (d: PlanDay) => PHASES.find((p) => p.id === d.phase)!;

export function phaseDayRange(phaseId: string): [number, number] {
  const ds = PLAN.filter((d) => d.phase === phaseId);
  return ds.length ? [ds[0].day, ds[ds.length - 1].day] : [0, 0];
}

export type TaskKind = "learn" | "watch" | "practice" | "code" | "explain" | "interview" | "revision" | "debug" | "stretch" | "project" | "document" | "career" | "quiz" | "dsa" | "catchup" | "test" | "confidence";

export interface Task { key: string; kind: TaskKind; label: string; minutes: number; detail: string; href?: string; external?: boolean; optional?: boolean }

const MIN: Record<Intensity, Record<string, number>> = {
  light: { learn: 30, watch: 20, practice: 20, code: 25, explain: 10, interview: 10, revision: 10, debug: 20, stretch: 30, project: 45, document: 15, career: 10, quiz: 20, dsa: 15, catchup: 20, test: 40, confidence: 5 },
  standard: { learn: 45, watch: 30, practice: 30, code: 30, explain: 20, interview: 15, revision: 20, debug: 25, stretch: 45, project: 90, document: 20, career: 15, quiz: 30, dsa: 20, catchup: 30, test: 45, confidence: 5 },
  intensive: { learn: 60, watch: 30, practice: 40, code: 60, explain: 20, interview: 20, revision: 30, debug: 30, stretch: 45, project: 120, document: 30, career: 20, quiz: 40, dsa: 30, catchup: 30, test: 60, confidence: 5 },
};

function firstVideo(t: Topic) {
  return t.resources.map((r) => RESOURCE_MAP[r]).find((r) => r && (r.type === "video" || r.type === "course") && r.url);
}

/**
 * Builds the task list for one plan day. Intensity changes the number of tasks and depth,
 * never the order of the curriculum.
 */
export function buildTasks(d: PlanDay, s: State, dueCount: number): Task[] {
  const inten = s.settings.intensity;
  const m = MIN[inten];
  const light = inten === "light";
  const intensive = inten === "intensive";
  const tasks: Task[] = [];
  const add = (t: Omit<Task, "minutes"> & { minutes?: number }) => tasks.push({ minutes: m[t.kind], ...t });

  if (d.kind === "learn" || d.kind === "slot") {
    const { topic, part, parts, note } = dayTopic(d, s);
    if (!topic) {
      add({ key: "project", kind: "project", label: "Work on your specialization flagship", detail: note || "Advance your current flagship project by one milestone.", href: "/projects" });
    } else {
      const href = `/topics/${topic.id}`;
      const objs = topic.objectives;
      const per = Math.max(1, Math.ceil(objs.length / parts));
      const focus = objs.slice((part - 1) * per, part * per);
      const first = part === 1;
      const last = part === parts;
      add({ key: "learn", kind: "learn", label: first ? `Learn: ${topic.title}` : `Deepen: ${topic.title}`, detail: (first ? "Read why it matters, the simple explanation and the visual, then the technical explanation. " : "Revisit the technical explanation, equations and worked example. ") + (focus.length ? `Focus: ${focus.join("; ")}.` : ""), href });
      const vid = first ? firstVideo(topic) : undefined;
      if (vid) add({ key: "watch", kind: "watch", label: `Watch: ${vid.title}`, detail: `${vid.source}. Find the part that covers this topic; the full course is long.`, href: vid.url, external: true, optional: light });
      const pr = topic.practice[(part - 1) % topic.practice.length];
      const coding = topic.kind === "coding" || topic.kind === "tool" || !!topic.code;
      if (coding && (!first || parts === 1)) add({ key: "code", kind: "code", label: "Code it", detail: pr, href: `${href}#practice` });
      else add({ key: "practice", kind: "practice", label: "Practice", detail: pr, href: `${href}#practice` });
      if (!coding || first) add({ key: "explain", kind: "explain", label: "Explain it in your own words", detail: "Write 5 sentences in the topic notes as if teaching a friend. Gaps in the explanation are gaps in understanding.", href: `${href}#notes`, optional: light });
      const iq = topic.interview[(part - 1) % topic.interview.length];
      add({ key: "interview", kind: "interview", label: "Interview question", detail: iq.q, href: `${href}#interview`, optional: light });
      if (intensive || (last && !light)) {
        const dbg = topic.debug?.[0] || topic.mistakes[0];
        if (dbg) add({ key: "debug", kind: "debug", label: "Debug check", detail: `${dbg} Why does this happen, and which test or assertion would catch it?`, href, optional: !intensive });
      }
      if (intensive) add({ key: "stretch", kind: "stretch", label: "Stretch: go deeper with Ask AI", detail: topic.senior?.[0] ? `Senior thinking: ${topic.senior[0]}` : "Open Ask AI on the topic page and work through steps 8 to 13 of the prompt.", href });
      if (intensive && topic.projects?.length) add({ key: "project", kind: "project", label: "Project time", detail: "Apply today's topic to its connected project.", href: `/projects/${topic.projects[0]}` });
      if (last) add({ key: "confidence", kind: "confidence", label: "Mark confidence and evidence, then complete the topic", detail: "Be honest: this drives your revisions, skills and readiness.", href });
    }
    if (dueCount > 0) add({ key: "revision", kind: "revision", label: `Revise ${dueCount} due topic${dueCount === 1 ? "" : "s"}`, detail: "Try to recall before revealing, then mark Remembered or Forgot.", href: "/today#revision" });
  } else if (d.kind === "consolidate") {
    const names = (d.weekTopics || []).map((id) => TOPIC_MAP[id]?.title).filter(Boolean);
    add({ key: "revision", kind: "revision", label: dueCount ? `Revision session (${dueCount} due)` : "Revision session", detail: "Clear all due revisions. If nothing is due, re-explain this week's hardest topic aloud.", href: "/today#revision", minutes: m.revision + 20 });
    add({ key: "quiz", kind: "quiz", label: "Weekly quiz", detail: names.length ? `Mock interview on this week's topics: ${names.slice(0, 4).join(", ")}${names.length > 4 ? "..." : ""}.` : "Mock interview on recent topics.", href: `/interview?topics=${(d.weekTopics || []).join(",")}` });
    const ex = PRACTICE.find((p) => p.topics.some((t) => (d.weekTopics || []).includes(t))) || PRACTICE.find((p) => p.phase === d.phase);
    if (ex) add({ key: "practice", kind: "practice", label: `Engineer thinking: ${ex.title}`, detail: "Solve before revealing hints. Write your reasoning.", href: `/practice#${ex.id}` });
    if (!light && d.dsa !== undefined) { const ds = DSA_FOR_HW[d.dsa]; add({ key: "dsa", kind: "dsa", label: `DSA for hardware: ${ds.topic}`, detail: ds.practice, href: "/toolkit#dsa", optional: true }); }
    add({ key: "document", kind: "document", label: "Weekly notes", detail: "Write what you understood, what confused you, and one thing to revisit (the reflection box below).", href: "/today#reflection", optional: light });
    add({ key: "catchup", kind: "catchup", label: "Catch-up", detail: "Finish anything left from this week. Nothing left? Take the time off; rest is part of the plan.", optional: true });
  } else if (d.kind === "project") {
    add({ key: "project", kind: "project", label: "Project milestone", detail: "Complete the next milestone of your active project (shown on the right). Commit and push.", href: s.active ? `/projects/${s.active}` : d.projectId ? `/projects/${d.projectId}` : "/projects" });
    add({ key: "document", kind: "document", label: "Document progress", detail: "Update the README or a devlog with what changed, results and open issues.", optional: light });
    if (d.careerTask) add({ key: "career", kind: "career", label: "Career step", detail: d.careerTask, href: "/build-in-public" });
    if (intensive) add({ key: "stretch", kind: "stretch", label: "Project extension", detail: "Pick one extension from the project card, or add a test that would have caught your last bug.", href: "/projects" });
  } else if (d.kind === "milestone") {
    const ms = MILESTONES[(d.month || 1) - 1];
    add({ key: "test", kind: "test", label: `Monthly milestone test: ${ms.title}`, detail: "Take the mastery test. 80% marks the phase as strong; you can retake it.", href: `/roadmap#test-${ms.test}` });
    add({ key: "practice", kind: "practice", label: "Practical task", detail: ms.practical });
    add({ key: "project", kind: "project", label: "Mini-project check", detail: "Make sure this month's mini-project is complete and documented.", href: `/projects/${ms.miniProject}` });
    add({ key: "confidence", kind: "confidence", label: "Confidence review", detail: "Open My skills. Where is confidence lower than evidence (or the reverse)?", href: "/skills" });
    if (d.careerTask) add({ key: "career", kind: "career", label: "Career step", detail: d.careerTask, href: "/build-in-public" });
  } else {
    add({ key: "document", kind: "document", label: "Year review", detail: "Compare your skills, portfolio and readiness with day 1. Write your two-year growth plan.", href: "/job-readiness" });
    add({ key: "career", kind: "career", label: "Apply", detail: "Send targeted applications using your evidence map.", href: "/job-readiness" });
  }
  return tasks;
}

export const DAY_KIND_LABEL: Record<DayKind, string> = {
  learn: "Learning day", slot: "Specialization day", consolidate: "Consolidation day", project: "Project day", milestone: "Milestone day", graduation: "Graduation",
};

export const REVISION_CAP: Record<Intensity, number> = { light: 3, standard: 6, intensive: 10 };
