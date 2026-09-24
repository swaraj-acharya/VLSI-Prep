"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ALL_PHASES, MODULES, phaseHref, phaseLabel } from "@/content/phases";
import { TOPIC_MAP, UNLOCKS } from "@/content/topics";
import { RESOURCE_MAP } from "@/content/resources";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { LEARNING_MAP } from "@/content/projects";
import { PAPER_MAP } from "@/content/papers";
import { CERT_MAP, CERT_CLASSES } from "@/content/certifications";
import { CAREER_MAP } from "@/content/careers";
import { GLOSSARY } from "@/content/glossary";
import { PRACTICE } from "@/content/practice";
import type { Resource, ResourceType } from "@/content/schema";
import { actions, useStore } from "@/lib/store";
import { topicPrompt, termPrompt } from "@/lib/prompts";
import { relative } from "@/lib/dates";
import { DEPTH_LABEL, ExtLink, NotesBox, PriorityBadge, PromptButton, Tabs } from "@/components/ui";
import { ConfidencePicker, EvidencePicker } from "@/components/learning";

const TABS = [
  { id: "learn", label: "Learn" }, { id: "deepen", label: "Deepen" }, { id: "practice", label: "Practice" }, { id: "interview", label: "Interview" },
  { id: "resources", label: "Resources" }, { id: "connections", label: "Connections" }, { id: "notes", label: "Notes" },
];

const RES_GROUPS: [string, ResourceType[]][] = [
  ["Best free reading", ["reading"]], ["Video and courses", ["video", "course"]], ["Documentation", ["docs"]], ["Practice", ["practice"]], ["Tools", ["tool"]], ["Textbook (optional)", ["textbook"]], ["Papers", ["paper"]],
];

function ResourceLine({ r }: { r: Resource }) {
  return (
    <li style={{ marginBottom: 6 }}>
      {r.url ? <ExtLink href={r.url}>{r.title}</ExtLink> : <span>{r.title}</span>}
      <span className="tiny muted"> {r.source}{r.free ? ", free" : ""}</span>{" "}
      {r.url && !r.verified && <span className="badge warn" title="Link not checked in the last research pass">Unverified</span>}
      {r.verified && <span className="badge ok" title={`Checked ${r.lastChecked}`}>Checked {r.lastChecked}</span>}
      {r.note && <div className="tiny muted">{r.note}</div>}
    </li>
  );
}

function Reveal({ q, a, trap }: { q: string; a: string; trap?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="check" style={{ display: "block" }}>
      <p className="t" style={{ margin: 0 }}>{q}</p>
      {open ? (
        <div className="small" style={{ marginTop: 6 }}>
          <p style={{ margin: "0 0 4px" }}><span className="muted">Model answer: </span>{a}</p>
          {trap && <p style={{ margin: 0 }}><span className="muted">Common trap: </span>{trap}</p>}
        </div>
      ) : <button className="btn sm" style={{ marginTop: 6 }} onClick={() => setOpen(true)}>Answer it yourself first, then reveal</button>}
    </div>
  );
}

export default function TopicView({ id }: { id: string }) {
  const s = useStore();
  const t = TOPIC_MAP[id];
  const [tab, setTab] = useState("learn");
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (TABS.some((x) => x.id === h)) setTab(h);
  }, []);
  const phase = ALL_PHASES.find((p) => p.id === t.phase)!;
  const mod = MODULES.find((m) => m.id === t.module)!;
  const st = s.topics[id];
  const done = st?.status === "done";
  const research = s.settings.mode === "research";
  const glossary = GLOSSARY.filter((g) => g.topic === id);
  const practice = PRACTICE.filter((p) => p.topics.includes(id));
  const unlocks = (UNLOCKS[id] || []).map((u) => TOPIC_MAP[u]).filter(Boolean);
  const resources = t.resources.map((r) => RESOURCE_MAP[r]).filter(Boolean);
  const projects = (t.projects || []).map((p) => FLAGSHIP_MAP[p] || LEARNING_MAP[p]).filter(Boolean);

  return (
    <div className="page">
      <div className="crumbs"><Link href={phase.program === "embedded" ? "/embedded" : "/roadmap"}>{phase.program === "embedded" ? "Embedded road" : "Roadmap"}</Link> / <Link href={phaseHref(phase)}>{phaseLabel(phase)}: {phase.short}</Link> / {mod.title}{mod.branch ? " (optional branch)" : ""}</div>
      <div className="between" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 460px" }}>
          <h1>{t.title}</h1>
          <div className="row small" style={{ marginBottom: 10 }}>
            <PriorityBadge p={t.priority} />
            <span className="badge plain">Depth: {DEPTH_LABEL[t.depth]}</span>
            <span className="badge plain">Difficulty {t.difficulty}/5</span>
            <span className="badge plain">About {t.hours} h over {t.days} day{t.days > 1 ? "s" : ""}</span>
            {done && st?.rev && <span className="badge ok">Next revision {relative(st.rev.due)}</span>}
            {st?.flag && <span className="badge warn">Marked for review</span>}
          </div>
        </div>
        <div className="row">
          <PromptButton prompt={topicPrompt(t, s.settings.name)} title={`Ask AI: ${t.title}`} />
          {done ? <button className="btn sm" onClick={() => actions.reopenTopic(id)}>Mark not complete</button> : <button className="btn sm primary" onClick={() => actions.completeTopic(id, t.title)}>Mark complete</button>}
        </div>
      </div>

      <section className="panel" aria-labelledby="why-h" style={{ borderLeft: "3px solid var(--signal)" }}>
        <h2 id="why-h" style={{ fontSize: "1rem" }}>Why this matters</h2>
        <p style={{ margin: 0 }}>{t.why}</p>
      </section>

      <Tabs tabs={TABS} active={tab} onChange={(x) => { setTab(x); history.replaceState(null, "", `#${x}`); }} label="Topic sections" />

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "learn" && (
          <div className="stack">
            <section className="panel">
              <h2>Explain it like I'm 12</h2>
              <p className="eli">{t.eli12}</p>
              {t.analogyLimit && <p className="small"><span className="muted">Where the analogy fails: </span>{t.analogyLimit}</p>}
            </section>
            {t.visuals?.map((v) => (
              <section className="panel" key={v.title}>
                <h3>{v.title}</h3>
                <pre aria-label={v.title}>{v.art}</pre>
                {v.note && <p className="small muted" style={{ margin: 0 }}>{v.note}</p>}
              </section>
            ))}
            <section className="panel">
              <h2>How it actually works</h2>
              <p className="prose">{t.tech}</p>
              <dl className="qa">
                <dt>Problem it solves, and what came before</dt><dd>{t.problem}</dd>
                <dt>Where it appears in a real chip</dt><dd>{t.inChip}</dd>
                <dt>What breaks when it is wrong</dt><dd>{t.breaks}</dd>
                <dt>How it is tested</dt><dd>{t.tested}</dd>
              </dl>
            </section>
            <section className="panel">
              <h3>Learning objectives</h3>
              <ul className="list">{t.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
              <h3>Key terms</h3>
              <div className="scroll"><table className="t"><tbody>{t.terms.map(([k, v]) => <tr key={k}><th style={{ width: "30%" }}>{k}</th><td>{v}</td></tr>)}</tbody></table></div>
              {glossary.length > 0 && <div className="row" style={{ marginTop: 10 }}>{glossary.map((g) => <PromptButton key={g.term} label={`Explain "${g.term}" simply`} title={g.term} prompt={termPrompt(g)} />)}</div>}
            </section>
            {(t.equations?.length || t.example) && (
              <section className="panel">
                {t.equations?.length ? <><h3>Equations</h3><pre>{t.equations.join("\n")}</pre></> : null}
                {t.example && <><h3>Worked example</h3><p className="prose">{t.example}</p></>}
              </section>
            )}
            {t.code && (
              <section className="panel">
                <h3>Code example ({t.code.lang})</h3>
                {t.code.note && <p className="small muted">{t.code.note}</p>}
                <pre>{t.code.src}</pre>
              </section>
            )}
            <section className="panel">
              <h3>Track your understanding</h3>
              <div className="stack">
                <ConfidencePicker t={t} />
                <EvidencePicker t={t} />
                {!done ? <button className="btn primary" onClick={() => actions.completeTopic(id, t.title)}>Mark complete and schedule revision</button> : <p className="small">Completed {st?.doneAt}. Revisions are scheduled automatically.</p>}
              </div>
            </section>
          </div>
        )}

        {tab === "deepen" && (
          <div className="stack">
            <section className="panel"><h2>Common mistakes</h2><ul className="list">{t.mistakes.map((m) => <li key={m}>{m}</li>)}</ul>
              {t.debug?.length ? <><h3>Debugging notes</h3><ul className="list">{t.debug.map((m) => <li key={m}>{m}</li>)}</ul></> : null}
            </section>
            {t.senior?.length ? <section className="panel"><h2>How a senior engineer thinks about this</h2><ul className="list">{t.senior.map((m) => <li key={m}>{m}</li>)}</ul><p className="small muted">Try answering these in your notes before asking AI.</p></section> : null}
            {t.ladder && (
              <section className="panel"><h2>From beginner to senior</h2>
                <dl className="qa">
                  <dt>Beginner: what it is</dt><dd>{t.ladder.beginner}</dd>
                  <dt>Junior: implement it</dt><dd>{t.ladder.junior}</dd>
                  <dt>Mid-level: debug it</dt><dd>{t.ladder.mid}</dd>
                  <dt>Senior: make tradeoffs</dt><dd>{t.ladder.senior}</dd>
                  {t.ladder.research && <><dt>Research: improve it</dt><dd>{t.ladder.research}</dd></>}
                </dl>
              </section>
            )}
            {!t.senior?.length && !t.ladder && <p className="small muted">Use Ask AI (steps 11-17) for a deeper pass on this topic.</p>}
          </div>
        )}

        {tab === "practice" && (
          <div className="stack anchor" id="practice">
            <section className="panel"><h2>Practice</h2><ol>{t.practice.map((p) => <li key={p} style={{ marginBottom: 6 }}>{p}</li>)}</ol></section>
            {practice.length > 0 && (
              <section className="panel"><h2>Related exercises</h2>
                {practice.map((p) => <div key={p.id} className="check"><Link href={`/practice#${p.id}`} className="t">{p.title}</Link> <span className="badge plain">{p.level}</span> <span className="badge plain">{p.type}</span></div>)}
              </section>
            )}
          </div>
        )}

        {tab === "interview" && (
          <section className="panel anchor" id="interview">
            <h2>Interview questions</h2>
            {t.interview.map((q) => <Reveal key={q.q} q={q.q} a={q.a} trap={q.trap} />)}
            <p className="small" style={{ marginTop: 10 }}><Link href={`/interview?topics=${id}`}>Practise these in mock interview mode</Link> to track accuracy.</p>
          </section>
        )}

        {tab === "resources" && (
          <section className="panel">
            <h2>Resources</h2>
            <p className="small muted">The explanations above stand on their own; resources are for going further. Links marked unverified were not checked in the last research pass.</p>
            {RES_GROUPS.map(([label, types]) => {
              const list = resources.filter((r) => types.includes(r.type));
              return list.length ? <div key={label}><h3>{label}</h3><ul className="clean">{list.map((r) => <ResourceLine key={r.id} r={r} />)}</ul></div> : null;
            })}
            {!resources.length && <p className="small muted">No external resources needed; use Ask AI and the Resources library.</p>}
            {t.papers?.length ? <><h3>Research connections</h3><ul className="list">{t.papers.map((p) => <li key={p}><Link href={`/research#${p}`}>{PAPER_MAP[p]?.title}</Link></li>)}</ul></> : null}
          </section>
        )}

        {tab === "connections" && (
          <div className="grid2">
            <section className="panel"><h3>Why am I learning this? (prerequisites)</h3>
              {t.prereqs.length ? <ul className="list">{t.prereqs.map((p) => <li key={p}>{TOPIC_MAP[p] ? <Link href={`/topics/${p}`}>{TOPIC_MAP[p].title}</Link> : p}{s.topics[p]?.status === "done" ? " ✓" : ""}</li>)}</ul> : <p className="small muted">No prerequisites: a starting point.</p>}
            </section>
            <section className="panel"><h3>What does this unlock?</h3>
              {unlocks.length ? <ul className="list">{unlocks.map((u) => <li key={u.id}><Link href={`/topics/${u.id}`}>{u.title}</Link></li>)}</ul> : <p className="small muted">Leads into projects and specialization.</p>}
            </section>
            <section className="panel"><h3>Projects that use it</h3>
              {projects.length ? <ul className="list">{projects.map((p) => <li key={p.id}><Link href={`/projects/${p.id}`}>{p.title}</Link></li>)}</ul> : <p className="small muted">Applied in later projects.</p>}
            </section>
            <section className="panel"><h3>Job roles and skills</h3>
              <p className="small">{t.skills.join(", ")}</p>
              {t.roles?.length ? <ul className="list">{t.roles.map((r) => <li key={r}><Link href={`/career-paths#${r}`}>{CAREER_MAP[r]?.title}</Link></li>)}</ul> : null}
              {t.certs?.length ? <><h3>Certifications</h3><ul className="list">{t.certs.map((c) => <li key={c}><Link href={`/certifications#${c}`}>{CERT_MAP[c]?.name}</Link> <span className="tiny muted">{CERT_CLASSES[CERT_MAP[c]?.classification]?.label}</span></li>)}</ul></> : null}
              {research && t.papers?.length ? <p className="small"><Link href="/research">Research lab</Link> has related papers.</p> : null}
            </section>
          </div>
        )}

        {tab === "notes" && <section className="panel anchor" id="notes"><NotesBox noteKey={`topic:${id}`} label="Your notes" placeholder="Explain the topic in your own words. What confused you? What would you tell a friend?" /></section>}
      </div>
    </div>
  );
}
