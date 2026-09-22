"use client";
import Link from "next/link";
import { useState } from "react";
import { PAPERS } from "@/content/papers";
import { TOPIC_MAP } from "@/content/topics";
import { FLAGSHIPS } from "@/content/flagship";
import type { Paper } from "@/content/schema";
import { actions, useHydrated, useStore, type PaperStatus } from "@/lib/store";
import { ExtLink, Loading, NotesBox, PageHead } from "@/components/ui";

const AREAS: Record<Paper["area"], string> = { arch: "Computer architecture", aihw: "AI hardware", eda: "EDA and AI for EDA", verification: "Verification", pd: "Physical design", riscv: "RISC-V", circuits: "Circuits" };
const STATUSES: PaperStatus[] = ["queued", "reading", "read", "reproduced", "extended"];

export default function ResearchPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [area, setArea] = useState<"all" | Paper["area"]>("all");
  if (!hydrated) return <Loading />;
  const list = PAPERS.filter((p) => area === "all" || p.area === area).sort((a, b) => a.difficulty - b.difficulty);
  const ideas = FLAGSHIPS.flatMap((f) => f.researchOps.map((r) => ({ f, r }))).slice(0, 14);
  return (
    <div className="page">
      <PageHead title="Research lab">Research / optional. Research is a layer on top of employability, never a replacement for fundamentals. Start with papers whose prerequisites you have completed; move from reading to reproducing to extending.</PageHead>
      {s.settings.mode === "learn" && <div className="callout info small">You are in Learning mode, so research topics are hidden on the roadmap. Switch to Research mode in Settings to surface paper links throughout the app.</div>}
      <section className="panel">
        <h2>How to go from reading to research</h2>
        <ol className="small">
          <li>Read: problem, intuition, contribution. Write a one-paragraph summary in your own words.</li>
          <li>Reproduce a small result: the smallest experiment that tests the main claim.</li>
          <li>Measure honestly: same metrics, baselines and conditions; record where you differ.</li>
          <li>Extend: change one variable (dataset, architecture, constraint) and report.</li>
          <li>Publish evidence: repo, write-up and a research-style post. Never claim more than you measured.</li>
        </ol>
      </section>
      <div className="chips" style={{ marginBottom: 14 }}><button className="chip" aria-pressed={area === "all"} onClick={() => setArea("all")}>All areas</button>{Object.entries(AREAS).map(([k, v]) => <button key={k} className="chip" aria-pressed={area === k} onClick={() => setArea(k as Paper["area"])}>{v}</button>)}</div>
      {list.map((p) => {
        const ready = p.prereqs.every((t) => s.topics[t]?.status === "done");
        return (
          <details key={p.id} id={p.id} className="disc anchor">
            <summary><span>{p.title} <span className="tiny muted">{p.authors}, {p.venue} {p.year}</span></span><span className="row">{s.papers[p.id] && <span className="badge ok">{s.papers[p.id]}</span>}<span className="badge plain">Difficulty {p.difficulty}/5</span>{ready ? <span className="badge ok">Ready</span> : <span className="badge plain">Prereqs pending</span>}</span></summary>
            <div className="body">
              <div className="row small" style={{ marginBottom: 8 }}>{p.url ? <ExtLink href={p.url}>Paper link</ExtLink> : <span className="muted">No link stored; search the title.</span>}{p.url && !p.verified && <span className="badge warn">Unverified link</span>}<span className="badge plain">{AREAS[p.area]}</span></div>
              <dl className="qa">
                <dt>Problem</dt><dd>{p.problem}</dd><dt>Intuition</dt><dd>{p.intuition}</dd><dt>Contribution</dt><dd>{p.contribution}</dd>
                <dt>Prerequisites</dt><dd>{p.prereqs.map((t, i) => <span key={t}>{i ? ", " : ""}<Link href={`/topics/${t}`}>{TOPIC_MAP[t]?.title}</Link>{s.topics[t]?.status === "done" ? " ✓" : ""}</span>)}</dd>
                <dt>Reproduce</dt><dd>{p.reproduction}</dd><dt>Implementation</dt><dd>{p.implementation}</dd><dt>Dataset</dt><dd>{p.dataset}</dd>
                <dt>Tools</dt><dd>{p.tools.join(", ")}</dd><dt>Possible extension</dt><dd>{p.extension}</dd><dt>Portfolio value</dt><dd>{p.portfolio}</dd>
              </dl>
              <div className="row" style={{ margin: "10px 0" }}><span className="label">Status</span>{STATUSES.map((x) => <button key={x} className="chip" aria-pressed={s.papers[p.id] === x} onClick={() => actions.setPaper(p.id, x, p.title)}>{x}</button>)}</div>
              <NotesBox noteKey={`paper:${p.id}`} label="Reading notes" />
            </div>
          </details>
        );
      })}
      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Research ideas from your flagships</h2>
        <ul className="list small">{ideas.map(({ f, r }) => <li key={f.id + r}>{r} <Link className="tiny" href={`/projects/${f.id}`}>({f.title})</Link></li>)}</ul>
      </section>
    </div>
  );
}
