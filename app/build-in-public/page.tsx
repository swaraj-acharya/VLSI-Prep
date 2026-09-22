"use client";
import Link from "next/link";
import { useState } from "react";
import { LINKEDIN_OPTIMIZATION, NETWORK_TEMPLATES, NO_SPAM_RULES, POST_TYPES, RESUME_GUIDE } from "@/content/careerkit";
import { FLAGSHIPS } from "@/content/flagship";
import { useHydrated, useStore } from "@/lib/store";
import { CLAIMS_TO_AVOID } from "@/lib/prompts";
import { CopyButton, Loading, PageHead, Tabs, TabPanel } from "@/components/ui";

export default function BuildInPublicPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [tab, setTab] = useState("posts");
  if (!hydrated) return <Loading />;
  const ready = FLAGSHIPS.filter((f) => s.projects[f.id]?.finished);
  return (
    <div className="page">
      <PageHead title="Build in public">Share evidence, not hype. One thoughtful post every two or three weeks beats daily noise. Each finished flagship has ready-made post drafts in its LinkedIn tab.</PageHead>
      <Tabs label="Build in public sections" active={tab} onChange={setTab} tabs={[{ id: "posts", label: "Post types" }, { id: "network", label: "Networking" }, { id: "linkedin", label: "LinkedIn profile" }, { id: "resume", label: "Resume" }]} />
      <TabPanel id={tab}>
      {tab === "posts" && (
        <div>
          <div className="callout small">{ready.length ? <>Ready to post about: {ready.map((f, i) => <span key={f.id}>{i ? ", " : ""}<Link href={`/projects/${f.id}#share`}>{f.title}</Link></span>)}</> : "Finish and document a flagship to unlock generated drafts. Learning posts are fine at any time."}</div>
          <div className="grid2">{POST_TYPES.map((p) => (
            <section key={p.id} className="panel"><h2>{p.title}</h2><p className="small muted">e.g. "{p.example}"</p>
              <h3>Structure</h3><ol className="small">{p.structure.map((x) => <li key={x}>{x}</li>)}</ol>
              <dl className="qa small"><dt>Depth</dt><dd>{p.depth}</dd><dt>Evidence</dt><dd>{p.evidence}</dd><dt>Diagram</dt><dd>{p.diagram}</dd><dt>Screenshot</dt><dd>{p.screenshot}</dd><dt>Hashtags</dt><dd>{p.hashtags.join(" ")}</dd><dt>Avoid</dt><dd>{p.avoid.join("; ")}</dd></dl>
            </section>))}
          </div>
          <section className="panel"><h2>Claims to avoid</h2><ul className="list">{CLAIMS_TO_AVOID.map((c) => <li key={c}>{c}</li>)}</ul></section>
        </div>
      )}
      {tab === "network" && (
        <div>
          <section className="panel"><h2>Rules</h2><ul className="list">{NO_SPAM_RULES.map((r) => <li key={r}>{r}</li>)}</ul></section>
          <div className="grid2">{NETWORK_TEMPLATES.map((t) => (
            <section key={t.id} className="panel"><div className="panel-head"><h3>{t.title}</h3><CopyButton text={t.text} /></div><p className="tiny muted">When: {t.when}</p><pre style={{ whiteSpace: "pre-wrap" }}>{t.text}</pre></section>))}
          </div>
        </div>
      )}
      {tab === "linkedin" && <section className="panel"><h2>Profile checklist</h2><ul className="list">{LINKEDIN_OPTIMIZATION.map((x) => <li key={x}>{x}</li>)}</ul></section>}
      {tab === "resume" && (
        <div>
          <section className="panel"><h2>Structure for an EE + software profile</h2><ol>{RESUME_GUIDE.structure.map((x) => <li key={x}>{x}</li>)}</ol><h3>Framing</h3><ul className="list">{RESUME_GUIDE.framing.map((x) => <li key={x}>{x}</li>)}</ul></section>
          <section className="panel"><h2>Weak vs strong bullets</h2>
            <div className="scroll"><table className="t"><thead><tr><th>Weak</th><th>Strong</th></tr></thead><tbody>{RESUME_GUIDE.bullets.map((b) => <tr key={b.weak}><td className="muted">{b.weak}</td><td>{b.strong}</td></tr>)}</tbody></table></div>
            <p className="small muted">Formula: action verb + what you built + how you verified it + a measured result. Use only numbers you actually measured.</p>
          </section>
        </div>
      )}
      </TabPanel>
    </div>
  );
}
