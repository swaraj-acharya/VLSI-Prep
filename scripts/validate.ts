// Content integrity check: node --experimental-strip-types scripts/validate.ts
import { TOPICS, TOPIC_MAP } from "../content/topics/index.ts";
import { MODULES, PHASES, TRACKS, MAIN_ROAD, ALL_PHASES, EMBEDDED_PHASES, EMBEDDED_ROAD } from "../content/phases.ts";
import { RESOURCES } from "../content/resources.ts";
import { LEARNING_PROJECTS } from "../content/projects.ts";
import { CAREERS } from "../content/careers.ts";
import { OPEN_SOURCE } from "../content/open-source.ts";
import { MASTERY } from "../content/mastery.ts";
import { LEVELS, ROLE_PATHS, SHARED_FOUNDATIONS, VLSI_TO_EMBEDDED, EMBEDDED_TO_VLSI, READ_REAL_CODE, VIDEO_NOTES } from "../content/embedded.ts";
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
for (const p of ALL_PHASES) p.modules.forEach((id) => !MODULES.find((m) => m.id === id) && err(`phase ${p.id}: module ${id} missing`));
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
for (const ph of ALL_PHASES) if (!MASTERY_MAP[ph.id]) err(`no mastery test for ${ph.id}`);
// prerequisite order on the main road
const pos = new Map(MAIN_ROAD.map((id, i) => [id, i]));
for (const id of MAIN_ROAD) for (const p of TOPIC_MAP[id].prereqs) if (pos.has(p) && pos.get(p)! > pos.get(id)!) err(`order: ${id} comes before its prereq ${p}`);

// ---- Embedded road and cross-program checks (added 2026-09-24) ----
const phaseIds = new Set(ALL_PHASES.map((p) => p.id));
for (const t of TOPICS) if (!phaseIds.has(t.phase)) err(`${t.id}: unknown phase ${t.phase}`);
for (const m of MODULES) { if (!phaseIds.has(m.phase)) err(`module ${m.id}: unknown phase`); if (m.branch && !m.phase.startsWith("e")) err(`module ${m.id}: branches are only for embedded phases`); }
for (const id of MAIN_ROAD) if (TOPIC_MAP[id]?.phase.startsWith("e")) err(`main road contains embedded topic ${id}`);
const embPos = new Map(EMBEDDED_ROAD.map((id, i) => [id, i]));
for (const id of EMBEDDED_ROAD) { const t = TOPIC_MAP[id]; if (!t) { err(`embedded road: ${id} missing`); continue; } for (const p of t.prereqs) if (embPos.has(p) && embPos.get(p)! > embPos.get(id)!) err(`order (embedded): ${id} comes before its prereq ${p}`); }
const dup = (label: string, list: string[]) => { const seen = new Set<string>(); for (const x of list) { if (seen.has(x)) err(`duplicate ${label} ${x}`); seen.add(x); } };
dup("phase", ALL_PHASES.map((p) => p.id)); dup("module", MODULES.map((m) => m.id)); dup("resource", RESOURCES.map((r) => r.id));
dup("project", [...LEARNING_PROJECTS.map((p) => p.id), ...FLAGSHIPS.map((f) => f.id)]); dup("bank question", BANK.map((b) => b.id));
dup("practice item", PRACTICE.map((p) => p.id)); dup("career", CAREERS.map((c) => c.id)); dup("open-source entry", OPEN_SOURCE.map((o) => o.id)); dup("glossary term", GLOSSARY.map((g) => g.term));
for (const m of MASTERY) dup(`mastery ${m.phase} question`, m.questions.map((q) => q.id));
for (const lp of LEARNING_PROJECTS) { if (!phaseIds.has(lp.phase)) err(`${lp.id}: unknown phase ${lp.phase}`); if (lp.phase.startsWith("e") && !lp.hardware) err(`${lp.id}: embedded project must state hardware or emulator option`); }
for (const f of FLAGSHIPS) { if (!phaseIds.has(f.phase)) err(`${f.id}: unknown phase ${f.phase}`); f.openSource.length || err(`${f.id}: no open-source references`); }
for (const o of OPEN_SOURCE) o.prereqs.forEach((t) => !TOPIC_MAP[t] && err(`open-source ${o.id}: topic ${t} missing`));
[...LEVELS.flatMap((l) => l.topics), ...ROLE_PATHS.flatMap((r) => r.steps), ...SHARED_FOUNDATIONS, ...VLSI_TO_EMBEDDED.map((x) => x.topic), ...EMBEDDED_TO_VLSI.map((x) => x.topic)]
  .forEach((id) => !TOPIC_MAP[id] && err(`embedded page: topic ${id} missing`));
LEVELS.forEach((l) => l.phases.forEach((p) => !phaseIds.has(p) && err(`level ${l.id}: phase ${p} missing`)));
ROLE_PATHS.forEach((r) => r.career && !CAREER_MAP[r.career] && err(`role path ${r.id}: career ${r.career} missing`));
[...READ_REAL_CODE.map((x) => x.res), ...VIDEO_NOTES.map((v) => v.res)].forEach((id) => !RESOURCE_MAP[id] && err(`embedded page: resource ${id} missing`));
const onLevelMap = new Set(LEVELS.flatMap((l) => l.topics));
for (const t of TOPICS) if (t.phase.startsWith("e") && !onLevelMap.has(t.id)) err(`embedded topic ${t.id} is not on the Level map`);
const embTopics = TOPICS.filter((t) => t.phase.startsWith("e"));
const embRoadDays = EMBEDDED_ROAD.reduce((s, id) => s + (TOPIC_MAP[id]?.days || 0), 0);
console.log(`embedded: phases=${EMBEDDED_PHASES.length} topics=${embTopics.length} coreRoad=${EMBEDDED_ROAD.length} coreDays=${embRoadDays} projects=${LEARNING_PROJECTS.filter((p) => p.phase.startsWith("e")).length}+${FLAGSHIPS.filter((f) => f.phase.startsWith("e")).length} flagships`);

const roadDays = MAIN_ROAD.reduce((s, id) => s + TOPIC_MAP[id].days, 0);
console.log(`topics=${TOPICS.length} mainRoad=${MAIN_ROAD.length} roadDays=${roadDays} flagships=${FLAGSHIPS.length} resources=${Object.keys(RESOURCE_MAP).length} papers=${Object.keys(PAPER_MAP).length} certs=${Object.keys(CERT_MAP).length}`);
if (errors.length) { console.error(errors.join("\n")); console.error(`${errors.length} problems`); process.exit(1); }
console.log("content OK");
