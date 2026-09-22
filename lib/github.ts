"use client";
import { PHASES } from "@/content/phases";
import { TOPIC_MAP } from "@/content/topics";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { LEARNING_MAP } from "@/content/projects";
import { PLAN, PLAN_LENGTH, dayTopic, DAY_KIND_LABEL } from "./plan";
import { activeDays, overallProgress, phaseProgress, projectDone, streaks } from "./derive";
import { today } from "./dates";
import type { State } from "./store";

/** Token lives in its own key so it never travels inside a progress export. */
export const TOKEN_KEY = "signoff-vlsi:gh-token";

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  autoSync: boolean;
  includeNotes: boolean;
  lastSync?: string;
  lastStatus?: string;
}

export const defaultGitHub = (): GitHubConfig => ({ owner: "", repo: "", branch: "main", path: "progress", autoSync: true, includeNotes: false });

export function getToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}
export function setToken(t: string) {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage disabled */ }
}

const API = "https://api.github.com";

function b64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

function headers(token: string) {
  return { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" };
}

function explain(status: number, body: string): string {
  if (status === 401) return "GitHub rejected the token (401). It may be expired, mistyped, or revoked.";
  if (status === 403) return "GitHub refused the request (403). The token is probably missing Contents: Read and write permission for this repository, or you hit a rate limit.";
  if (status === 404) return "Repository, branch or path not found (404). Check the owner and repository names, and that the token grants access to this repository.";
  if (status === 409) return "Conflict (409). The branch may be empty; make one commit in the repository first, or check the branch name.";
  if (status === 422) return `GitHub could not process the request (422). ${body.slice(0, 160)}`;
  return `GitHub returned ${status}. ${body.slice(0, 160)}`;
}

export async function testConnection(cfg: GitHubConfig, token: string): Promise<{ ok: boolean; message: string }> {
  if (!token) return { ok: false, message: "Add a personal access token first." };
  if (!cfg.owner || !cfg.repo) return { ok: false, message: "Add the repository owner and name first." };
  try {
    const res = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}/branches/${encodeURIComponent(cfg.branch)}`, { headers: headers(token) });
    if (!res.ok) return { ok: false, message: explain(res.status, await res.text()) };
    const data = await res.json();
    return { ok: true, message: `Connected to ${cfg.owner}/${cfg.repo}, branch ${cfg.branch} (latest commit ${String(data?.commit?.sha || "").slice(0, 7)}).` };
  } catch {
    return { ok: false, message: "Could not reach GitHub. Check your internet connection." };
  }
}

async function putFile(cfg: GitHubConfig, token: string, file: string, content: string, message: string): Promise<{ ok: boolean; message: string }> {
  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${file.split("/").map(encodeURIComponent).join("/")}`;
  let sha: string | undefined;
  try {
    const head = await fetch(`${url}?ref=${encodeURIComponent(cfg.branch)}`, { headers: headers(token) });
    if (head.ok) sha = (await head.json())?.sha;
    else if (head.status !== 404) return { ok: false, message: explain(head.status, await head.text()) };
  } catch {
    return { ok: false, message: "Could not reach GitHub. Check your internet connection." };
  }
  const res = await fetch(url, { method: "PUT", headers: headers(token), body: JSON.stringify({ message, content: b64(content), branch: cfg.branch, ...(sha ? { sha } : {}) }) });
  if (!res.ok) return { ok: false, message: explain(res.status, await res.text()) };
  return { ok: true, message: `${file} updated.` };
}

const pad = (n: number) => String(n).padStart(3, "0");

/** Human-readable progress page, in the style of a repository README. */
export function buildProgressMarkdown(s: State): string {
  const cur = Math.min(s.plan.current, PLAN_LENGTH);
  const st = streaks(s);
  const prog = overallProgress(s);
  const doneTopics = Object.entries(s.topics).filter(([, t]) => t.status === "done");
  const flagshipsDone = Object.keys(s.projects).filter((id) => FLAGSHIP_MAP[id] && s.projects[id].finished);
  const projectsDone = Object.keys(s.projects).filter((id) => LEARNING_MAP[id] && projectDone(s, id));
  const days = activeDays(s);
  const L = (n: number) => { const d = new Date(today() + "T00:00:00"); d.setDate(d.getDate() - n); return d.toLocaleDateString("en-CA"); };

  const out: string[] = [];
  out.push(`# My VLSI learning progress`, "");
  out.push(`Tracked with Signoff. Updated ${today()}.`, "");
  out.push("| | Progress |", "|---|---|");
  out.push(`| **Plan day** | **${cur}** of ${PLAN_LENGTH} |`);
  out.push(`| Topics completed | ${doneTopics.length} of ${Object.keys(TOPIC_MAP).length} |`);
  out.push(`| Main road | ${prog.done} of ${prog.total} (${Math.round(prog.pct * 100)}%) |`);
  out.push(`| Flagship projects finished | ${flagshipsDone.length} |`);
  out.push(`| Smaller projects completed | ${projectsDone.length} |`);
  out.push(`| Plan days finished | ${Object.keys(s.plan.done).length} |`);
  out.push(`| Mastery tests taken | ${Object.values(s.mastery).reduce((a, x) => a + x.length, 0)} |`);
  out.push(`| Interview answers | ${Object.values(s.interview).reduce((a, x) => a + x.n, 0)} |`, "");
  out.push(`Current streak: **${st.current} days**. Longest: ${st.longest} days. Active days: ${st.activeDays}.`, "");

  out.push("## Phases", "", "| Phase | Topics | Progress |", "|---|---|---|");
  for (const p of PHASES) {
    const pp = phaseProgress(s, p.id);
    const bar = "#".repeat(Math.round(pp.pct * 10)).padEnd(10, ".");
    out.push(`| ${p.num}. ${p.title} | ${pp.done}/${pp.total} | \`${bar}\` ${Math.round(pp.pct * 100)}% |`);
  }
  out.push("");

  out.push("## Last 14 days", "", "| Day | Active | Actions |", "|---|---|---|");
  for (let i = 0; i < 14; i++) {
    const d = L(i);
    const n = s.log.filter((e) => e.d === d).length;
    out.push(`| ${d} | ${days.has(d) ? "yes" : "-"} | ${n} |`);
  }
  out.push("");

  const finished = Object.entries(s.plan.done).map(([day, date]) => ({ day: Number(day), date })).sort((a, b) => b.day - a.day);
  out.push("## Plan days", "", "| Day | Week | Kind | Topic | Status |", "|---|---|---|---|---|");
  for (const d of PLAN) {
    const done = s.plan.done[d.day];
    if (!done && d.day > cur) continue;
    const { topic } = dayTopic(d, s);
    const status = done ? `finished ${done}` : d.day === cur ? "in progress" : "not finished";
    out.push(`| ${pad(d.day)} | ${d.week} | ${DAY_KIND_LABEL[d.kind]} | ${topic ? topic.title : "-"} | ${status} |`);
  }
  if (finished.length === 0) out.push("| - | - | - | - | nothing finished yet |");
  out.push("");

  const recent = doneTopics.filter(([id]) => TOPIC_MAP[id]).sort((a, b) => (b[1].doneAt || "").localeCompare(a[1].doneAt || "")).slice(0, 20);
  out.push("## Recently completed topics", "", "| Date | Topic | Phase | Confidence | Evidence |", "|---|---|---|---|---|");
  const CONF = ["do not understand", "weak", "okay", "strong", "can teach it"];
  for (const [id, t] of recent) {
    const top = TOPIC_MAP[id];
    out.push(`| ${t.doneAt || "-"} | ${top.title} | ${top.phase.toUpperCase()} | ${t.conf === undefined ? "-" : CONF[t.conf]} | ${t.ev.join(", ") || "-"} |`);
  }
  if (!recent.length) out.push("| - | - | - | - | - |");
  out.push("");

  if (flagshipsDone.length) {
    out.push("## Flagship projects", "", "| Project | Finished | Repository |", "|---|---|---|");
    for (const id of flagshipsDone) out.push(`| ${FLAGSHIP_MAP[id].title} | ${s.projects[id].finished} | ${s.projects[id].links.repo || "-"} |`);
    out.push("");
  }
  out.push("---", "", "Generated by the Signoff app from local progress. Numbers are self-reported study records, not certified results.", "");
  return out.join("\n");
}

/** Machine-readable state. Notes and reflections are excluded unless explicitly enabled. */
export function buildProgressJson(s: State, includeNotes: boolean): string {
  const data: Record<string, unknown> = { ...s, app: "signoff-vlsi", exportedAt: new Date().toISOString() };
  if (!includeNotes) { delete data.notes; delete data.reflections; }
  return JSON.stringify(data, null, 2);
}

export async function syncProgress(s: State, cfg: GitHubConfig, token: string): Promise<{ ok: boolean; message: string }> {
  if (!token) return { ok: false, message: "No token saved: add one in Settings." };
  if (!cfg.owner || !cfg.repo) return { ok: false, message: "Set the repository owner and name in Settings." };
  const base = cfg.path.replace(/^\/+|\/+$/g, "");
  const day = Math.min(s.plan.current, PLAN_LENGTH);
  const md = await putFile(cfg, token, `${base}/README.md`, buildProgressMarkdown(s), `Progress: day ${day} of ${PLAN_LENGTH} (${today()})`);
  if (!md.ok) return md;
  const js = await putFile(cfg, token, `${base}/progress.json`, buildProgressJson(s, cfg.includeNotes), `Progress data: day ${day} (${today()})`);
  if (!js.ok) return js;
  return { ok: true, message: `Pushed to ${cfg.owner}/${cfg.repo}/${base} at ${new Date().toLocaleTimeString()}.` };
}
