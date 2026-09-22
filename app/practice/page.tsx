"use client";
import Link from "next/link";
import { useState } from "react";
import { PRACTICE } from "@/content/practice";
import { TOPIC_MAP } from "@/content/topics";
import type { PracticeItem } from "@/content/schema";
import { actions, useHydrated, useStore } from "@/lib/store";
import { Loading, NotesBox, PageHead } from "@/components/ui";

const TYPES: Record<PracticeItem["type"], string> = { rtl: "RTL design", sv: "SystemVerilog", debug: "Debug", waveform: "Waveform", timing: "Timing", architecture: "Architecture", thinking: "Engineer thinking" };

function Card({ p }: { p: PracticeItem }) {
  const s = useStore();
  const [hints, setHints] = useState(0);
  const [sol, setSol] = useState(false);
  const st = s.practice[p.id];
  return (
    <section className="panel anchor" id={p.id}>
      <div className="between"><h3 style={{ margin: 0 }}>{p.title}</h3><div className="row"><span className="badge plain">{TYPES[p.type]}</span><span className="badge plain">{p.level}</span>{st && <span className={`badge ${st === "solved" ? "ok" : st === "revisit" ? "warn" : "plain"}`}>{st}</span>}</div></div>
      <p style={{ marginTop: 8 }}>{p.prompt}</p>
      {p.code && <pre>{p.code}</pre>}
      {p.hints.slice(0, hints).map((h, i) => <p key={i} className="small callout"><b>Hint {i + 1}.</b> {h}</p>)}
      <div className="row">
        {hints < p.hints.length && <button className="btn sm" onClick={() => setHints(hints + 1)}>Show hint {hints + 1} of {p.hints.length}</button>}
        {!sol && <button className="btn sm" onClick={() => { setSol(true); if (!st) actions.setPractice(p.id, "tried", p.title); }}>Reveal solution</button>}
      </div>
      {sol && <div className="callout" style={{ marginTop: 10 }}><b>Solution.</b> {p.solution}</div>}
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn sm good" onClick={() => actions.setPractice(p.id, "solved", p.title)}>I solved it</button>
        <button className="btn sm" onClick={() => actions.setPractice(p.id, "revisit", p.title)}>Revisit later</button>
        <span className="tiny muted">Topics: {p.topics.map((t, i) => <span key={t}>{i ? ", " : ""}<Link href={`/topics/${t}`}>{TOPIC_MAP[t]?.title}</Link></span>)}</span>
      </div>
      <details style={{ marginTop: 8 }}><summary className="small">My working</summary><NotesBox noteKey={`practice:${p.id}`} label="Reasoning" placeholder="Write the reasoning, not just the answer." /></details>
    </section>
  );
}

export default function PracticePage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [type, setType] = useState<"all" | PracticeItem["type"]>("all");
  const [level, setLevel] = useState("all");
  if (!hydrated) return <Loading />;
  const list = PRACTICE.filter((p) => (type === "all" || p.type === type) && (level === "all" || p.level === level));
  const solved = Object.values(s.practice).filter((x) => x === "solved").length;
  return (
    <div className="page narrow">
      <PageHead title="Practice">Design, debugging, waveform, timing and engineer-thinking exercises. Try each one before opening hints; hints come one at a time. {solved} solved so far.</PageHead>
      <div className="row" style={{ marginBottom: 14 }}>
        <div className="chips"><button className="chip" aria-pressed={type === "all"} onClick={() => setType("all")}>All types</button>{Object.entries(TYPES).map(([k, v]) => <button key={k} className="chip" aria-pressed={type === k} onClick={() => setType(k as PracticeItem["type"])}>{v}</button>)}</div>
        <select aria-label="Level" value={level} onChange={(e) => setLevel(e.target.value)} style={{ width: "auto" }}><option value="all">All levels</option><option>beginner</option><option>intermediate</option><option>advanced</option><option>senior</option></select>
      </div>
      {list.map((p) => <Card key={p.id} p={p} />)}
      {!list.length && <p className="muted">No exercises match these filters.</p>}
      <p className="small muted">Every topic page also has its own practice list, and the Ask AI prompt generates a fresh practice problem for any topic.</p>
    </div>
  );
}
