"use client";
import Link from "next/link";
import { useState } from "react";
import { GLOSSARY } from "@/content/glossary";
import { TOPIC_MAP } from "@/content/topics";
import { termPrompt } from "@/lib/prompts";
import { PageHead, PromptButton } from "@/components/ui";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const list = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)).filter((g) => !q || (g.term + " " + (g.full || "") + " " + g.simple).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page narrow">
      <PageHead title="Glossary">Every term with a simple meaning first, then the technical one. Use "Explain simply" for a deeper, 12-year-old-first explanation from any AI assistant.</PageHead>
      <input type="search" aria-label="Search glossary" placeholder="Search terms, e.g. slack, CDC, netlist" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 14 }} />
      {list.map((g) => (
        <section key={g.term} id={encodeURIComponent(g.term)} className="panel anchor">
          <div className="between"><h2 style={{ margin: 0, fontSize: "1.1rem" }}>{g.term}{g.full && <span className="small muted" style={{ fontWeight: 400 }}> {g.full}</span>}</h2><PromptButton label="Explain simply" title={g.term} prompt={termPrompt(g)} /></div>
          <p style={{ margin: "8px 0 4px" }}><span className="muted small">Simply: </span>{g.simple}</p>
          <p className="small" style={{ margin: 0 }}><span className="muted">Technically: </span>{g.technical}</p>
          {g.art && <pre style={{ marginTop: 8 }}>{g.art}</pre>}
          {g.topic && TOPIC_MAP[g.topic] && <p className="tiny" style={{ margin: "6px 0 0" }}>Learn it in: <Link href={`/topics/${g.topic}`}>{TOPIC_MAP[g.topic].title}</Link></p>}
        </section>
      ))}
      {!list.length && <p className="muted">No terms match. The search (Ctrl K) also covers topics.</p>}
    </div>
  );
}
