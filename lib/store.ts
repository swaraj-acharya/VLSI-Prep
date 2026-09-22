"use client";
import { useSyncExternalStore } from "react";
import type { RoleTarget, TrackId } from "@/content/schema";
import { today } from "./dates";
import { firstReview, review as reviewRev, type Rev } from "./revision";
import { defaultGitHub, type GitHubConfig } from "./github";

export const STORAGE_KEY = "signoff-vlsi:v1";
export const SCHEMA_VERSION = 1;

export type Intensity = "light" | "standard" | "intensive";
export type Conf = 0 | 1 | 2 | 3 | 4;
export const CONF_LABELS = ["Don't understand", "Weak", "Okay", "Strong", "Can teach it"] as const;
export const EVIDENCE = ["read", "explained", "practiced", "coded", "built", "debugged", "verified", "interview-ready"] as const;
export type PaperStatus = "queued" | "reading" | "read" | "reproduced" | "extended";
export type CertStatus = "interested" | "planned" | "studying" | "done" | "skipped";
export type ActivityKind = "learning" | "revision" | "project" | "interview" | "practice" | "research" | "certification" | "reflection" | "confidence" | "plan";

export interface TopicState { status: "learning" | "done"; conf?: Conf; ev: string[]; doneAt?: string; rev?: Rev; flag?: boolean }
export interface ProjState { ms: Record<string, boolean>; proof: Record<string, boolean>; show: Record<string, boolean>; started?: string; finished?: string; links: { repo?: string; post?: string; demo?: string } }
export interface LogEntry { d: string; t: number; k: ActivityKind; label: string; ref?: string; m: boolean }
export interface Reflection { understood?: string; confused?: string; built?: string; revisit?: string }
export interface EvidenceItem { id: string; kind: string; title: string; url?: string; d: string }

export interface State {
  v: number;
  settings: { name: string; intensity: Intensity; theme: "system" | "light" | "dark"; target: RoleTarget; mode: "learn" | "research"; startDate?: string };
  plan: { current: number; done: Record<string, string>; tasks: Record<string, Record<string, boolean>> };
  topics: Record<string, TopicState>;
  projects: Record<string, ProjState>;
  active?: string;
  interview: Record<string, { n: number; ok: number; last?: "ok" | "partial" | "miss"; flag?: boolean }>;
  practice: Record<string, "tried" | "solved" | "revisit">;
  papers: Record<string, PaperStatus>;
  certs: Record<string, CertStatus>;
  mastery: Record<string, { d: string; score: number }[]>;
  gates: Record<string, string>;
  spec: { primary?: TrackId; secondary?: TrackId; decidedAt?: string; answers: Record<string, string> };
  notes: Record<string, string>;
  reflections: Record<string, Reflection>;
  checks: Record<string, boolean>;
  evidence: EvidenceItem[];
  github: GitHubConfig;
  log: LogEntry[];
}

export const defaultState = (): State => ({
  v: SCHEMA_VERSION,
  settings: { name: "Swaraj", intensity: "standard", theme: "system", target: "rtl", mode: "learn" },
  plan: { current: 1, done: {}, tasks: {} },
  topics: {}, projects: {}, interview: {}, practice: {}, papers: {}, certs: {}, mastery: {}, gates: {},
  spec: { answers: {} }, notes: {}, reflections: {}, checks: {}, evidence: [], github: defaultGitHub(), log: [],
});

/** Migrations keyed by the version they upgrade from. Add entries when the schema changes. */
const MIGRATIONS: Record<number, (s: Record<string, unknown>) => Record<string, unknown>> = {};

export function migrate(raw: unknown): State {
  if (!raw || typeof raw !== "object") return defaultState();
  let s = raw as Record<string, unknown>;
  let v = typeof s.v === "number" ? s.v : 1;
  while (v < SCHEMA_VERSION && MIGRATIONS[v]) { s = MIGRATIONS[v](s); v++; }
  const d = defaultState();
  const r = s as Partial<State>;
  return {
    ...d, ...r, v: SCHEMA_VERSION,
    settings: { ...d.settings, ...(r.settings || {}) },
    plan: { ...d.plan, ...(r.plan || {}) },
    spec: { ...d.spec, ...(r.spec || {}) },
    github: { ...d.github, ...(r.github || {}) },
    evidence: Array.isArray(r.evidence) ? r.evidence : [],
    log: Array.isArray(r.log) ? r.log : [],
  };
}

let state: State = defaultState();
let hydrated = false;
const subs = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = migrate(JSON.parse(raw));
  } catch { /* corrupted storage: start fresh but do not overwrite until the next save */ }
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY || !e.newValue) return;
    try { state = migrate(JSON.parse(e.newValue)); subs.forEach((f) => f()); } catch { /* ignore */ }
  });
}

function commit(next: State) {
  state = next;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage full or disabled */ }
  subs.forEach((f) => f());
}

const SERVER_STATE = defaultState();

export function useStore(): State {
  return useSyncExternalStore(
    (cb) => { load(); subs.add(cb); return () => { subs.delete(cb); }; },
    () => { load(); return state; },
    () => SERVER_STATE,
  );
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => { load(); subs.add(cb); return () => { subs.delete(cb); }; },
    () => { load(); return true; },
    () => false,
  );
}

export const getState = () => state;

function log(s: State, k: ActivityKind, label: string, ref?: string, m = true): LogEntry[] {
  const entry: LogEntry = { d: today(), t: Date.now(), k, label, ref, m };
  return [...s.log, entry].slice(-6000);
}

function topic(s: State, id: string): TopicState {
  return s.topics[id] || { status: "learning", ev: [] };
}

function proj(s: State, id: string): ProjState {
  return s.projects[id] || { ms: {}, proof: {}, show: {}, links: {} };
}

export const actions = {
  settings(patch: Partial<State["settings"]>) {
    commit({ ...state, settings: { ...state.settings, ...patch } });
  },
  setGitHub(patch: Partial<GitHubConfig>) {
    commit({ ...state, github: { ...state.github, ...patch } });
  },
  startPlan() {
    commit({ ...state, settings: { ...state.settings, startDate: state.settings.startDate || today() }, plan: { ...state.plan, current: Math.max(1, state.plan.current) } });
  },
  toggleTask(day: number, key: string, label: string) {
    const dayTasks = { ...(state.plan.tasks[day] || {}) };
    dayTasks[key] = !dayTasks[key];
    const s = { ...state, plan: { ...state.plan, tasks: { ...state.plan.tasks, [day]: dayTasks } } };
    commit({ ...s, log: dayTasks[key] ? log(s, "plan", label, `day:${day}`, false) : s.log });
  },
  finishDay(day: number, total: number) {
    const done = { ...state.plan.done, [day]: today() };
    const s = { ...state, plan: { ...state.plan, done, current: Math.min(total, Math.max(state.plan.current, day + 1)) } };
    commit({ ...s, log: log(s, "learning", `Finished plan day ${day}`, `day:${day}`) });
  },
  goToDay(day: number) {
    commit({ ...state, plan: { ...state.plan, current: Math.max(1, day) } });
  },
  completeTopic(id: string, title: string) {
    const t = topic(state, id);
    const on = today();
    const next: TopicState = { ...t, status: "done", doneAt: t.doneAt || on, rev: t.rev || firstReview(on), ev: t.ev.includes("read") ? t.ev : [...t.ev, "read"] };
    const s = { ...state, topics: { ...state.topics, [id]: next } };
    commit({ ...s, log: log(s, "learning", `Completed: ${title}`, id) });
  },
  reopenTopic(id: string) {
    const t = topic(state, id);
    commit({ ...state, topics: { ...state.topics, [id]: { ...t, status: "learning", doneAt: undefined, rev: undefined } } });
  },
  setConf(id: string, conf: Conf, title: string) {
    const t = topic(state, id);
    const s = { ...state, topics: { ...state.topics, [id]: { ...t, conf } } };
    commit({ ...s, log: log(s, "confidence", `${title}: ${CONF_LABELS[conf]}`, id, false) });
  },
  toggleEvidence(id: string, ev: string) {
    const t = topic(state, id);
    const has = t.ev.includes(ev);
    commit({ ...state, topics: { ...state.topics, [id]: { ...t, ev: has ? t.ev.filter((x) => x !== ev) : [...t.ev, ev] } } });
  },
  review(id: string, ok: boolean, title: string) {
    const t = topic(state, id);
    const on = today();
    const rev = reviewRev(t.rev || firstReview(on), ok, on);
    const s = { ...state, topics: { ...state.topics, [id]: { ...t, rev, flag: ok ? t.flag : true } } };
    commit({ ...s, log: log(s, "revision", `${ok ? "Remembered" : "Forgot"}: ${title}`, id) });
  },
  unflag(id: string) {
    const t = topic(state, id);
    commit({ ...state, topics: { ...state.topics, [id]: { ...t, flag: false } } });
  },
  note(key: string, text: string) {
    commit({ ...state, notes: { ...state.notes, [key]: text } });
  },
  toggleMilestone(pid: string, mid: string, label: string) {
    const p = proj(state, pid);
    const ms = { ...p.ms, [mid]: !p.ms[mid] };
    const s = { ...state, projects: { ...state.projects, [pid]: { ...p, ms, started: p.started || today() } } };
    commit({ ...s, log: ms[mid] ? log(s, "project", `Milestone: ${label}`, pid) : s.log });
  },
  toggleProof(pid: string, stage: string) {
    const p = proj(state, pid);
    const proof = { ...p.proof, [stage]: !p.proof[stage] };
    const s = { ...state, projects: { ...state.projects, [pid]: { ...p, proof } } };
    commit({ ...s, log: proof[stage] ? log(s, "project", `Evidence: ${stage}`, pid) : s.log });
  },
  toggleShowcase(pid: string, item: string) {
    const p = proj(state, pid);
    commit({ ...state, projects: { ...state.projects, [pid]: { ...p, show: { ...p.show, [item]: !p.show[item] } } } });
  },
  setLinks(pid: string, links: ProjState["links"]) {
    const p = proj(state, pid);
    commit({ ...state, projects: { ...state.projects, [pid]: { ...p, links: { ...p.links, ...links } } } });
  },
  setActive(pid?: string) {
    commit({ ...state, active: pid });
  },
  finishProject(pid: string, title: string, done: boolean) {
    const p = proj(state, pid);
    const s = { ...state, projects: { ...state.projects, [pid]: { ...p, finished: done ? today() : undefined } } };
    commit({ ...s, log: done ? log(s, "project", `Finished project: ${title}`, pid) : s.log });
  },
  answer(qid: string, result: "ok" | "partial" | "miss", label: string) {
    const cur = state.interview[qid] || { n: 0, ok: 0 };
    const next = { ...cur, n: cur.n + 1, ok: cur.ok + (result === "ok" ? 1 : result === "partial" ? 0.5 : 0), last: result, flag: result !== "ok" ? true : cur.flag };
    const s = { ...state, interview: { ...state.interview, [qid]: next } };
    commit({ ...s, log: log(s, "interview", `${result === "ok" ? "Correct" : result === "partial" ? "Partly" : "Missed"}: ${label}`, qid) });
  },
  flagQuestion(qid: string) {
    const cur = state.interview[qid] || { n: 0, ok: 0 };
    commit({ ...state, interview: { ...state.interview, [qid]: { ...cur, flag: !cur.flag } } });
  },
  setPractice(pid: string, st: "tried" | "solved" | "revisit", label: string) {
    const s = { ...state, practice: { ...state.practice, [pid]: st } };
    commit({ ...s, log: log(s, "practice", `${st === "solved" ? "Solved" : st === "tried" ? "Attempted" : "Revisit"}: ${label}`, pid) });
  },
  setPaper(pid: string, st: PaperStatus, label: string) {
    const s = { ...state, papers: { ...state.papers, [pid]: st } };
    commit({ ...s, log: log(s, "research", `${st}: ${label}`, pid) });
  },
  setCert(cid: string, st: CertStatus | undefined, label: string) {
    const certs = { ...state.certs };
    if (st) certs[cid] = st; else delete certs[cid];
    const s = { ...state, certs };
    commit({ ...s, log: st && st !== "skipped" && st !== "interested" ? log(s, "certification", `${st}: ${label}`, cid) : s.log });
  },
  saveMastery(phase: string, score: number, title: string) {
    const list = [...(state.mastery[phase] || []), { d: today(), score }];
    const s = { ...state, mastery: { ...state.mastery, [phase]: list } };
    commit({ ...s, log: log(s, "learning", `Mastery test ${title}: ${Math.round(score * 100)}%`, phase) });
  },
  overrideGate(phase: string) {
    commit({ ...state, gates: { ...state.gates, [phase]: today() } });
  },
  setSpec(patch: Partial<State["spec"]>) {
    commit({ ...state, spec: { ...state.spec, ...patch } });
  },
  setReflection(date: string, patch: Reflection) {
    const cur = state.reflections[date] || {};
    const next = { ...cur, ...patch };
    const had = Object.values(cur).some(Boolean);
    const s = { ...state, reflections: { ...state.reflections, [date]: next } };
    commit({ ...s, log: !had && Object.values(next).some(Boolean) ? log(s, "reflection", "Daily reflection", date) : s.log });
  },
  toggleCheck(key: string) {
    commit({ ...state, checks: { ...state.checks, [key]: !state.checks[key] } });
  },
  addEvidence(item: Omit<EvidenceItem, "id" | "d">) {
    const e: EvidenceItem = { ...item, id: `ev-${Date.now()}`, d: today() };
    const s = { ...state, evidence: [...state.evidence, e] };
    commit({ ...s, log: log(s, "project", `Evidence added: ${item.title}`, e.id) });
  },
  removeEvidence(id: string) {
    commit({ ...state, evidence: state.evidence.filter((e) => e.id !== id) });
  },
  exportJSON(): string {
    return JSON.stringify({ app: "signoff-vlsi", exportedAt: new Date().toISOString(), ...state }, null, 2);
  },
  importJSON(text: string): { ok: boolean; message: string } {
    try {
      const raw = JSON.parse(text);
      if (!raw || typeof raw !== "object" || typeof raw.v !== "number" || !raw.settings) return { ok: false, message: "This file is not a Signoff progress export." };
      commit(migrate(raw));
      return { ok: true, message: "Progress imported." };
    } catch {
      return { ok: false, message: "The file could not be read as JSON." };
    }
  },
  reset() {
    commit(defaultState());
  },
};
