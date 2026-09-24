"use client";
import Link from "next/link";
import { useState } from "react";
import { LEARNING_PROJECTS } from "@/content/projects";
import { FLAGSHIPS } from "@/content/flagship";
import { ALL_PHASES } from "@/content/phases";
import { actions, useHydrated, useStore } from "@/lib/store";
import { projectDone, projectPct } from "@/lib/derive";
import { Bar, Loading, PageHead } from "@/components/ui";

const TIERS = [
  { id: "micro", title: "Micro projects (30 min to 6 h)", why: "Used to learn. Small, one concept each, including the embedded debugging labs. Keep them in GitHub, but do not feature them on LinkedIn." },
  { id: "weekend", title: "Weekend projects (6 to 16 h)", why: "Integrate several skills and produce evidence: captures, tests, reports. Embedded projects state the hardware needed and any emulator-only option." },
  { id: "mini", title: "Mini projects", why: "Used to consolidate a phase. Complete and documented, they become supporting portfolio pieces." },
  { id: "flagship", title: "Flagship projects", why: "Your professional portfolio. Each demonstrates architecture, verification, measurement and documentation." },
  { id: "research", title: "Research projects", why: "Reproduce or extend published work. Research / optional; demonstrates advanced thinking." },
  { id: "open-silicon", title: "Open-silicon projects", why: "End-to-end hardware capability on open PDKs, optionally fabricated." },
];

export default function ProjectsPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [cat, setCat] = useState("all");
  const [prog, setProg] = useState("all");
  const show = (phase: string, cats: string[]) => { const emb = phase.startsWith("e"); const x = cats.includes("Crossover"); return prog === "all" || x || (prog === "embedded" ? emb : !emb); };
  if (!hydrated) return <Loading />;
  const cats = [...new Set(FLAGSHIPS.flatMap((f) => f.categories))].sort();
  const phaseName = (id: string) => { const ph = ALL_PHASES.find((p) => p.id === id); return ph ? (ph.program === "embedded" ? `Embedded E${ph.num} ${ph.short}` : ph.short) : id; };
  const card = (id: string, title: string, sub: string, meta: string, flagship: boolean) => {
    const pct = projectPct(s, id);
    const done = projectDone(s, id);
    return (
      <div key={id} className="panel" style={{ marginBottom: 0 }}>
        <div className="between"><Link href={`/projects/${id}`} className="t"><b>{title}</b></Link>{s.active === id && <span className="badge ok">Active</span>}{done && <span className="badge ok">Done</span>}</div>
        <p className="small muted" style={{ margin: "6px 0" }}>{sub}</p>
        <p className="tiny muted">{meta}</p>
        <Bar thin value={pct} label={`${title} progress`} />
        <div className="row" style={{ marginTop: 10 }}>
          <Link className="btn sm" href={`/projects/${id}`}>{flagship ? "Open build mode" : "Open"}</Link>
          {s.active !== id && <button className="btn sm ghost" onClick={() => actions.setActive(id)}>Set as active</button>}
        </div>
      </div>
    );
  };
  return (
    <div className="page">
      <PageHead title="Projects">Many small learning exercises, but only a few excellent pieces of evidence. Aim for a signature portfolio of 8-12 polished items: 3-5 supporting projects, 3-5 flagships, 1-3 research or open-source pieces.</PageHead>
      <div className="field" style={{ maxWidth: 360 }}><label htmlFor="prog">Program</label><select id="prog" value={prog} onChange={(e) => setProg(e.target.value)}><option value="all">VLSI and Embedded</option><option value="vlsi">VLSI (plus crossover)</option><option value="embedded">Embedded (plus crossover)</option></select></div>
      {TIERS.map((tier) => {
        const learning = LEARNING_PROJECTS.filter((p) => p.tier === tier.id && show(p.phase, []));
        const flags = FLAGSHIPS.filter((f) => f.tier === tier.id && (cat === "all" || f.categories.includes(cat)) && show(f.phase, f.categories));
        if (!learning.length && !flags.length && tier.id !== "flagship") return null;
        return (
          <section key={tier.id} className="anchor" id={tier.id} style={{ marginBottom: 26 }}>
            <h2>{tier.title}</h2>
            <p className="small muted prose">{tier.why}</p>
            {tier.id === "flagship" && (
              <div className="field" style={{ maxWidth: 360 }}><label htmlFor="cat">Category</label>
                <select id="cat" value={cat} onChange={(e) => setCat(e.target.value)}><option value="all">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
              </div>
            )}
            <div className="grid2">
              {learning.map((p) => card(p.id, p.title, p.summary, `After: ${phaseName(p.phase)}. About ${p.hours} h. Tools: ${p.tools.join(", ")}`, false))}
              {flags.map((f) => card(f.id, f.title + (f.capstone ? " (capstone)" : ""), f.exceptional, `Start after: ${phaseName(f.phase)}. ${f.duration}. Difficulty ${f.difficulty}/5. ${f.categories.join("; ")}`, true))}
            </div>
          </section>
        );
      })}
      <section className="panel">
        <h2>How projects connect to the curriculum</h2>
        <p className="small">Digital logic leads to the ALU; FSMs to UART; timing to constrained RTL; SystemVerilog to verification environments; architecture to the RISC-V core; caches to the cache subsystem; CDC to the async FIFO; AI hardware to the accelerator; the ASIC flow to RTL-to-GDS. Each topic page lists the projects that use it, and weekly project days suggest the right project for your current phase.</p>
      </section>
    </div>
  );
}
