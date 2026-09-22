// Content integrity check: node --experimental-strip-types scripts/validate.ts
import { TOPICS, TOPIC_MAP } from "../content/topics/index.ts";
import { MODULES, PHASES, TRACKS, MAIN_ROAD } from "../content/phases.ts";
import { RESOURCE_MAP } from "../content/resources.ts";
import { LEARNING_MAP, PHASE_PROJECTS } from "../content/projects.ts";
import { FLAGSHIPS, FLAGSHIP_MAP } from "../content/flagship.ts";
import { PAPER_MAP } from "../content/papers.ts";
import { CERT_MAP } from "../content/certifications.ts";
import { CAREER_MAP } from "../content/careers.ts";
import { BANK } from "../content/interview.ts";
import { PRACTICE } from "../content/practice.ts";
import { GLOSSARY } from "../content/glossary.ts";
import { ENTRY_ROLES, READINESS_CHECKLIST } from "../content/jobs.ts";
import { MASTERY_MAP, MILESTONES } from "../content/mastery.ts";

const errors: string[] = [];
const err = (m: string) => errors.push(m);
const projectExists = (id: string) => !!LEARNING_MAP[id] || !!FLAGSHIP_MAP[id];

const ids = new Set<string>();
for (const t of TOPICS) {
  if (ids.has(t.id)) err(`duplicate topic ${t.id}`); ids.add(t.id);
  const mod = MODULES.find((m) => m.id === t.module);
  if (!mod) err(`${t.id}: unknown module ${t.module}`);
  else if (!mod.topics.includes(t.id)) err(`${t.id}: not listed in module ${t.module}`);
  if (mod && mod.phase !== t.phase) err(`${t.id}: phase mismatch`);
  t.prereqs.forEach((p) => !TOPIC_MAP[p] && !projectExists(p) && err(`${t.id}: prereq ${p} missing`));
  t.resources.forEach((r) => !RESOURCE_MAP[r] && err(`${t.id}: resource ${r} missing`));
  (t.projects || []).forEach((p) => !projectExists(p) && err(`${t.id}: project ${p} missing`));
  (t.papers || []).forEach((p) => !PAPER_MAP[p] && err(`${t.id}: paper ${p} missing`));
  (t.certs || []).forEach((c) => !CERT_MAP[c] && err(`${t.id}: cert ${c} missing`));
  (t.roles || []).forEach((c) => !CAREER_MAP[c] && err(`${t.id}: role ${c} missing`));
  if (!t.interview.length) err(`${t.id}: no interview question`);
  if (!t.practice.length) err(`${t.id}: no practice`);
}
for (const m of MODULES) m.topics.forEach((id) => !TOPIC_MAP[id] && err(`module ${m.id}: topic ${id} missing`));
for (const p of PHASES) p.modules.forEach((id) => !MODULES.find((m) => m.id === id) && err(`phase ${p.id}: module ${id} missing`));
for (const tr of TRACKS) { tr.topics.forEach((id) => !TOPIC_MAP[id] && err(`track ${tr.id}: ${id} missing`)); tr.careers.forEach((c) => !CAREER_MAP[c] && err(`track ${tr.id}: career ${c} missing`)); }
for (const f of FLAGSHIPS) {
  f.prereqs.forEach((p) => !TOPIC_MAP[p] && !projectExists(p) && err(`${f.id}: prereq ${p} missing`));
  (f.resources || []).forEach((r) => !RESOURCE_MAP[r] && err(`${f.id}: resource ${r} missing`));
  f.certs.forEach((c) => !CERT_MAP[c] && err(`${f.id}: cert ${c} missing`));
  f.roles.forEach((c) => !CAREER_MAP[c] && err(`${f.id}: role ${c} missing`));
}
for (const lp of Object.values(LEARNING_MAP)) { if (!TOPIC_MAP[lp.afterTopic]) err(`${lp.id}: afterTopic missing`); lp.topics.forEach((t) => !TOPIC_MAP[t] && err(`${lp.id}: topic ${t} missing`)); }
for (const [ph, list] of Object.entries(PHASE_PROJECTS)) list.forEach((p) => !projectExists(p) && err(`PHASE_PROJECTS ${ph}: ${p} missing`));
for (const c of Object.values(CAREER_MAP)) c.projects.forEach((p) => !projectExists(p) && err(`career ${c.id}: project ${p} missing`));
for (const b of BANK) b.topics.forEach((t) => !TOPIC_MAP[t] && err(`bank ${b.id}: topic ${t} missing`));
for (const p of PRACTICE) p.topics.forEach((t) => !TOPIC_MAP[t] && err(`practice ${p.id}: topic ${t} missing`));
for (const g of GLOSSARY) if (g.topic && !TOPIC_MAP[g.topic]) err(`glossary ${g.term}: topic ${g.topic} missing`);
const checkItems = [...ENTRY_ROLES.flatMap((r) => r.reqs), ...READINESS_CHECKLIST.flatMap((g) => g.items)];
for (const it of checkItems) {
  if (it.check.kind === "topics") it.check.ids.forEach((t) => !TOPIC_MAP[t] && err(`req '${it.label}': topic ${t} missing`));
  if (it.check.kind === "projects") (it.check.ids || []).forEach((p) => !projectExists(p) && err(`req '${it.label}': project ${p} missing`));
}
for (const m of MILESTONES) { if (!MASTERY_MAP[m.test]) err(`milestone ${m.month}: test ${m.test} missing`); if (!projectExists(m.miniProject)) err(`milestone ${m.month}: project missing`); }
for (const ph of PHASES) if (!MASTERY_MAP[ph.id]) err(`no mastery test for ${ph.id}`);
// prerequisite order on the main road
const pos = new Map(MAIN_ROAD.map((id, i) => [id, i]));
for (const id of MAIN_ROAD) for (const p of TOPIC_MAP[id].prereqs) if (pos.has(p) && pos.get(p)! > pos.get(id)!) err(`order: ${id} comes before its prereq ${p}`);

const roadDays = MAIN_ROAD.reduce((s, id) => s + TOPIC_MAP[id].days, 0);
console.log(`topics=${TOPICS.length} mainRoad=${MAIN_ROAD.length} roadDays=${roadDays} flagships=${FLAGSHIPS.length} resources=${Object.keys(RESOURCE_MAP).length} papers=${Object.keys(PAPER_MAP).length} certs=${Object.keys(CERT_MAP).length}`);
if (errors.length) { console.error(errors.join("\n")); console.error(`${errors.length} problems`); process.exit(1); }
console.log("content OK");
