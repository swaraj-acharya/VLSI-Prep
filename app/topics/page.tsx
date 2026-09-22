"use client";
import { useState } from "react";
import { PHASES } from "@/content/phases";
import { TOPICS } from "@/content/topics";
import type { Priority } from "@/content/schema";
import { useHydrated, useStore } from "@/lib/store";
import { Loading, PageHead, PRIORITY_LABEL } from "@/components/ui";
import { TopicRow } from "@/components/learning";

export default function TopicsPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState("all");
  const [prio, setPrio] = useState<"all" | Priority>("all");
  const [status, setStatus] = useState("all");
  if (!hydrated) return <Loading />;
  const list = TOPICS.filter((t) =>
    (phase === "all" || t.phase === phase) && (prio === "all" || t.priority === prio) &&
    (status === "all" || (status === "done" ? s.topics[t.id]?.status === "done" : status === "flag" ? s.topics[t.id]?.flag : s.topics[t.id]?.status !== "done")) &&
    (!q || (t.title + " " + t.terms.map((x) => x[0]).join(" ")).toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="page">
      <PageHead title="Topics">{TOPICS.length} topics. Each explains why it exists, gives a simple and a technical explanation, and links to practice, interview questions, projects and resources.</PageHead>
      <div className="panel">
        <div className="grid3">
          <div className="field"><label htmlFor="tq">Filter</label><input id="tq" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="fifo, timing, uvm..." /></div>
          <div className="field"><label htmlFor="tp">Phase</label><select id="tp" value={phase} onChange={(e) => setPhase(e.target.value)}><option value="all">All phases</option>{PHASES.map((p) => <option key={p.id} value={p.id}>Phase {p.num}: {p.short}</option>)}</select></div>
          <div className="field"><label htmlFor="tpr">Priority</label><select id="tpr" value={prio} onChange={(e) => setPrio(e.target.value as "all" | Priority)}><option value="all">All</option>{Object.entries(PRIORITY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          <div className="field"><label htmlFor="ts">Status</label><select id="ts" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option><option value="open">Not completed</option><option value="done">Completed</option><option value="flag">Needs review</option></select></div>
        </div>
      </div>
      <section className="panel" aria-label="Topic list">
        <p className="small muted">{list.length} shown</p>
        {list.map((t) => <TopicRow key={t.id} t={t} s={s} showPhase />)}
      </section>
    </div>
  );
}
