"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LEARNING_MAP } from "@/content/projects";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { TOPIC_MAP } from "@/content/topics";
import { CERT_MAP } from "@/content/certifications";
import { CAREER_MAP } from "@/content/careers";
import { RESOURCE_MAP } from "@/content/resources";
import { DEFAULT_PROOF, PROOF_STAGES, SHOWCASE_ITEMS } from "@/content/careerkit";
import type { Flagship, LearningProject } from "@/content/schema";
import { actions, useHydrated, useStore } from "@/lib/store";
import { projectPct } from "@/lib/derive";
import { CLAIMS_TO_AVOID, linkedinPosts, projectPrompt } from "@/lib/prompts";
import { Bar, CopyButton, ExtLink, Loading, NotesBox, PromptButton, Tabs } from "@/components/ui";

function Milestones({ id, list }: { id: string; list: LearningProject["milestones"] }) {
  const s = useStore();
  return (
    <ul className="clean">
      {list.map((m, i) => {
        const on = !!s.projects[id]?.ms[m.id];
        return (
          <li key={m.id} className={`check${on ? " done" : ""}`}>
            <input type="checkbox" id={`ms-${m.id}`} checked={on} onChange={() => actions.toggleMilestone(id, m.id, m.title)} />
            <label htmlFor={`ms-${m.id}`}><span className="t">{i + 1}. {m.title}</span><div className="d">{m.detail}{m.evidence ? ` Evidence: ${m.evidence}.` : ""}</div></label>
          </li>
        );
      })}
    </ul>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return <><h3>{title}</h3><ul className="list">{items.map((x) => <li key={x}>{x}</li>)}</ul></>;
}

function LearningView({ p }: { p: LearningProject }) {
  const s = useStore();
  return (
    <div className="page narrow">
      <div className="crumbs"><Link href="/projects">Projects</Link> / {p.tier} project</div>
      <h1>{p.title}</h1>
      <p className="lead">{p.summary}</p>
      <div className="row" style={{ marginBottom: 14 }}>
        {s.active === p.id ? <span className="badge ok">Active project</span> : <button className="btn sm primary" onClick={() => actions.setActive(p.id)}>Set as active project</button>}
        <span className="badge plain">About {p.hours} h</span>
      </div>
      <section className="panel"><h2>Specification</h2><ul className="list">{p.spec.map((x) => <li key={x}>{x}</li>)}</ul><p className="small"><span className="muted">Tools: </span>{p.tools.join(", ")}</p>{p.stretch && <p className="small"><span className="muted">Stretch: </span>{p.stretch}</p>}</section>
      {(p.hardware || p.verify || p.expected || p.concepts?.length) && <section className="panel"><h2>Hardware, validation and interview value</h2><dl className="qa small">{p.level && <><dt>Level</dt><dd>{p.level}</dd></>}{p.hardware && <><dt>Hardware or emulator</dt><dd>{p.hardware}</dd></>}{p.verify && <><dt>How to verify</dt><dd>{p.verify}</dd></>}{p.expected && <><dt>Expected result</dt><dd>{p.expected}</dd></>}{p.concepts?.length ? <><dt>Interview concepts</dt><dd>{p.concepts.join(", ")}</dd></> : null}</dl></section>}
      <section className="panel"><div className="panel-head"><h2>Milestones</h2><span className="small muted">{Math.round(projectPct(s, p.id) * 100)}%</span></div><Bar value={projectPct(s, p.id)} label="Milestones complete" /><div style={{ marginTop: 8 }}><Milestones id={p.id} list={p.milestones} /></div></section>
      <section className="panel"><h2>Topics it builds on</h2><ul className="list">{p.topics.map((t) => <li key={t}><Link href={`/topics/${t}`}>{TOPIC_MAP[t]?.title}</Link></li>)}</ul></section>
      <section className="panel"><NotesBox noteKey={`project:${p.id}`} label="Project log" placeholder="What you did, what broke, what you learned." /></section>
    </div>
  );
}

function FlagshipView({ f }: { f: Flagship }) {
  const s = useStore();
  const [tab, setTab] = useState("overview");
  useEffect(() => { const h = window.location.hash.slice(1); if (h) setTab(h); }, []);
  const ps = s.projects[f.id];
  const stages = f.proof || DEFAULT_PROOF;
  const proofDone = stages.filter((x) => ps?.proof[x]).length;
  const showDone = SHOWCASE_ITEMS.filter((x) => ps?.show[x.id]).length;
  const docReady = !!ps?.proof.documentation && showDone >= SHOWCASE_ITEMS.length - 3;
  const posts = linkedinPosts(f, ps);
  const [links, setLinks] = useState(ps?.links || {});
  const tabs = [{ id: "overview", label: "Overview" }, { id: "build", label: "Build mode" }, { id: "verify", label: "Verify and measure" }, { id: "proof", label: "Proof and showcase" }, { id: "share", label: "LinkedIn" }, { id: "interview", label: "Interview and resume" }];
  return (
    <div className="page">
      <div className="crumbs"><Link href="/projects">Projects</Link> / {f.capstone ? "Capstone" : f.tier === "research" ? "Research project (optional)" : f.tier === "open-silicon" ? "Open-silicon project" : "Flagship project"}</div>
      <div className="between" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: "1 1 480px" }}>
          <h1>{f.title}</h1>
          <div className="row small" style={{ marginBottom: 10 }}>
            <span className="badge plain">Difficulty {f.difficulty}/5</span><span className="badge plain">{f.duration}</span>
            {f.categories.map((c) => <span key={c} className="badge plain">{c}</span>)}
            {ps?.finished && <span className="badge ok">Finished {ps.finished}</span>}
          </div>
        </div>
        <div className="row">
          <PromptButton label="Mentor prompt" title="Project mentor prompt" prompt={projectPrompt(f)} />
          {s.active === f.id ? <span className="badge ok">Active</span> : <button className="btn sm primary" onClick={() => actions.setActive(f.id)}>Set as active</button>}
        </div>
      </div>
      <section className="panel" style={{ borderLeft: "3px solid var(--signal)" }}><h2 style={{ fontSize: "1rem" }}>What makes it exceptional</h2><p style={{ margin: 0 }}>{f.exceptional}</p></section>
      <div className="grid3" style={{ marginBottom: 14 }}>
        <div className="panel" style={{ marginBottom: 0 }}><div className="small muted">Milestones</div><Bar value={projectPct(s, f.id)} label="Milestones" /><div className="tiny muted">{Math.round(projectPct(s, f.id) * 100)}%</div></div>
        <div className="panel" style={{ marginBottom: 0 }}><div className="small muted">Proof of work</div><Bar value={proofDone / stages.length} label="Proof stages" /><div className="tiny muted">{proofDone}/{stages.length} stages</div></div>
        <div className="panel" style={{ marginBottom: 0 }}><div className="small muted">Showcase</div><Bar value={showDone / SHOWCASE_ITEMS.length} label="Showcase items" /><div className="tiny muted">{showDone}/{SHOWCASE_ITEMS.length} items</div></div>
      </div>
      <Tabs tabs={tabs} active={tab} onChange={(x) => { setTab(x); history.replaceState(null, "", `#${x}`); }} label="Project sections" />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "overview" && (
          <div className="grid2">
            <section className="panel"><h2>Problem</h2><p>{f.problem}</p><h3>Real-world motivation</h3><p>{f.motivation}</p><List title="Research basis" items={f.researchBasis} /></section>
            <section className="panel"><h2>Career relevance</h2><ul className="list">{f.roles.map((r) => <li key={r}><Link href={`/career-paths#${r}`}>{CAREER_MAP[r]?.title}</Link></li>)}</ul>
              <h3>Prerequisites</h3><ul className="list">{f.prereqs.map((p) => <li key={p}>{TOPIC_MAP[p] ? <Link href={`/topics/${p}`}>{TOPIC_MAP[p].title}</Link> : <Link href={`/projects/${p}`}>{FLAGSHIP_MAP[p]?.title || LEARNING_MAP[p]?.title}</Link>}</li>)}</ul>
              <List title="Skills demonstrated" items={f.skills} />
            </section>
            <section className="panel"><h2>Architecture</h2><p>{f.architecture}</p><pre>{f.diagram}</pre></section>
            <section className="panel"><List title="Requirements" items={f.requirements} /><List title="Tools" items={f.tools} /><List title="Open-source references" items={f.openSource} />{f.dataset && <p className="small"><span className="muted">Dataset: </span>{f.dataset}</p>}
              {f.resources?.length ? <><h3>Resources</h3><ul className="list">{f.resources.map((r) => RESOURCE_MAP[r]).filter(Boolean).map((r) => <li key={r.id}>{r.url ? <ExtLink href={r.url}>{r.title}</ExtLink> : r.title}</li>)}</ul></> : null}
            </section>
          </div>
        )}
        {tab === "build" && (
          <div className="layout-main">
            <section className="panel"><h2>Milestones</h2><Milestones id={f.id} list={f.milestones} /><List title="Implementation plan" items={f.implementation} /></section>
            <aside>
              <section className="panel"><h3>Repository structure</h3><pre>{f.repo}</pre><List title="Documentation" items={f.docs} /><List title="Demo requirements" items={f.demo} /></section>
              <section className="panel"><NotesBox noteKey={`project:${f.id}`} label="Build log" placeholder="Date, what changed, results, open issues." /></section>
            </aside>
          </div>
        )}
        {tab === "verify" && (
          <div className="grid2">
            <section className="panel"><List title="Verification plan" items={f.verification} /><List title="Failure injection and debugging" items={f.failureInjection} /></section>
            <section className="panel"><List title="Metrics" items={f.metrics} /><h3>PPA</h3><p>{f.ppa}</p><h3>Timing</h3><p>{f.timing}</p><h3>Benchmark</h3><p>{f.benchmark}</p><h3>Expected results</h3><p>{f.expected}</p></section>
          </div>
        )}
        {tab === "proof" && (
          <div className="grid2">
            <section className="panel"><h2>Proof of work</h2><p className="small muted">Evidence, not a score. Tick a stage only when the artifact exists in your repo.</p>
              <ul className="clean">{PROOF_STAGES.filter((x) => stages.includes(x.id)).map((x) => { const on = !!ps?.proof[x.id]; return <li key={x.id} className={`check${on ? " done" : ""}`}><input type="checkbox" id={`pf-${x.id}`} checked={on} onChange={() => actions.toggleProof(f.id, x.id)} /><label htmlFor={`pf-${x.id}`} className="t">{x.label}</label></li>; })}</ul>
            </section>
            <section className="panel"><h2>Showcase</h2>
              <ul className="clean">{SHOWCASE_ITEMS.map((x) => { const on = !!ps?.show[x.id]; return <li key={x.id} className={`check${on ? " done" : ""}`}><input type="checkbox" id={`sc-${x.id}`} checked={on} onChange={() => actions.toggleShowcase(f.id, x.id)} /><label htmlFor={`sc-${x.id}`} className="t">{x.label}</label></li>; })}</ul>
              <hr />
              <div className="field"><label htmlFor="repo">Repository URL</label><input id="repo" type="url" value={links.repo || ""} onChange={(e) => setLinks({ ...links, repo: e.target.value })} onBlur={() => actions.setLinks(f.id, links)} /></div>
              <div className="field"><label htmlFor="demo">Demo URL</label><input id="demo" type="url" value={links.demo || ""} onChange={(e) => setLinks({ ...links, demo: e.target.value })} onBlur={() => actions.setLinks(f.id, links)} /></div>
              {ps?.finished ? <button className="btn sm" onClick={() => actions.finishProject(f.id, f.title, false)}>Reopen project</button> : (
                <>
                  <button className="btn primary" disabled={!docReady} onClick={() => actions.finishProject(f.id, f.title, true)}>Mark flagship finished</button>
                  {!docReady && <p className="tiny muted" style={{ marginTop: 6 }}>Locked until the Documentation stage is ticked and at least {SHOWCASE_ITEMS.length - 3} showcase items are done. A flagship without documentation is not evidence yet.</p>}
                </>
              )}
            </section>
          </div>
        )}
        {tab === "share" && (
          <div>
            {!ps?.finished && <div className="callout info small">Drafts are available now for planning; publish after the project is finished and documented. Replace every [bracket] with your real numbers.</div>}
            <div className="grid2">
              {posts.map((p) => (
                <section key={p.label} className="panel"><div className="panel-head"><h3>{p.label}</h3><CopyButton text={p.text} /></div><pre style={{ whiteSpace: "pre-wrap" }}>{p.text}</pre></section>
              ))}
            </div>
            <section className="panel"><h3>Angle for this project</h3><p>{f.linkedinAngle}</p><h3>What not to claim</h3><ul className="list">{CLAIMS_TO_AVOID.map((c) => <li key={c}>{c}</li>)}</ul></section>
          </div>
        )}
        {tab === "interview" && (
          <div className="grid2">
            <section className="panel"><h2>Resume bullets (fill in your real numbers)</h2><ul className="list">{f.resume.map((r) => <li key={r}>{r} <CopyButton text={r} className="btn ghost sm" /></li>)}</ul></section>
            <section className="panel"><h2>Interview questions</h2>{f.interview.map((q) => <div key={q.q} className="check" style={{ display: "block" }}><p className="t" style={{ margin: 0 }}>{q.q}</p><p className="small muted" style={{ margin: "4px 0 0" }}>Likely follow-ups: {q.followups.join(" ")}</p></div>)}</section>
            <section className="panel"><List title="Extensions" items={f.extensions} /><List title="Research opportunities" items={f.researchOps} /><List title="Open-source contribution opportunities" items={f.contribOps} />
              {f.certs.length ? <><h3>Certification connections</h3><ul className="list">{f.certs.map((c) => <li key={c}><Link href={`/certifications#${c}`}>{CERT_MAP[c]?.name}</Link></li>)}</ul></> : null}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectView({ id }: { id: string }) {
  const hydrated = useHydrated();
  if (!hydrated) return <Loading />;
  const f = FLAGSHIP_MAP[id];
  return f ? <FlagshipView f={f} /> : <LearningView p={LEARNING_MAP[id]} />;
}
