"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MODULES, PHASES, TRACKS } from "@/content/phases";
import { TOPIC_MAP } from "@/content/topics";
import { MASTERY_MAP, MILESTONES } from "@/content/mastery";
import { actions, useHydrated, useStore } from "@/lib/store";
import { PLAN } from "@/lib/plan";
import { bestMastery, gateStatus, phaseProgress, isDone } from "@/lib/derive";
import { primaryTrack, phaseDayRange } from "@/lib/plan";
import { Bar, Dialog, Loading, PageHead } from "@/components/ui";
import { MasteryRunner, TopicRow } from "@/components/learning";

export default function RoadmapPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [test, setTest] = useState<string | null>(null);
  const [showResearch, setShowResearch] = useState(false);
  useEffect(() => {
    const h = window.location.hash;
    if (h.startsWith("#test-")) setTest(h.slice(6));
    else if (h.startsWith("#p")) setOpen(h.slice(1));
  }, []);
  if (!hydrated) return <Loading />;
  const curPhase = PLAN[Math.min(s.plan.current, PLAN.length) - 1].phase;
  const current = open ?? curPhase;
  const prim = primaryTrack(s);
  const research = showResearch || s.settings.mode === "research";

  return (
    <div className="page">
      <PageHead title="Roadmap">One main road from electricity to job readiness. Specialization comes after the core, and AI is a layer on top of fundamentals, not a shortcut around them.</PageHead>
      <div className="between" style={{ marginBottom: 14 }}>
        <p className="small muted" style={{ margin: 0 }}>Gates are soft: take the previous phase's test (80% target) or continue with a warning.</p>
        {s.settings.mode === "learn" && <label className="row small"><input type="checkbox" checked={showResearch} onChange={(e) => setShowResearch(e.target.checked)} /> Show research-level topics</label>}
      </div>
      <ol className="rail">
        {PHASES.map((p) => {
          const pp = phaseProgress(s, p.id);
          const gate = gateStatus(s, p.id);
          const best = bestMastery(s, p.id);
          const isOpen = current === p.id;
          const [a, b] = phaseDayRange(p.id);
          const cls = pp.pct === 1 ? "done" : p.id === curPhase ? "active" : "";
          return (
            <li key={p.id} id={p.id} className={`anchor ${cls}`}>
              <span className="node" aria-hidden="true" />
              <button className="btn ghost" style={{ padding: "0 0 4px", width: "100%", justifyContent: "space-between", textAlign: "left" }} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? "" : p.id)}>
                <span><span className="tiny muted">Phase {p.num}{a ? `, days ${a}-${b}` : ""}</span><br /><b style={{ fontSize: "1.05rem" }}>{p.title}</b></span>
                <span className="small muted">{pp.done}/{pp.total}</span>
              </button>
              <Bar thin value={pp.pct} label={`${p.title} progress`} />
              <p className="small muted" style={{ margin: "6px 0 0" }}>"{p.stage}"{best !== undefined ? ` Test best: ${Math.round(best * 100)}%.` : ""}{!gate.open ? ` Gate: ${gate.reason}.` : ""}</p>
              {isOpen && (
                <div style={{ marginTop: 10 }}>
                  <p className="small">{p.goal}</p>
                  {!gate.open && (
                    <div className="callout warn small">This phase is gated by the previous test. <button className="btn sm" onClick={() => actions.overrideGate(p.id)}>Continue anyway</button></div>
                  )}
                  {MODULES.filter((m) => m.phase === p.id).map((m) => {
                    const isTrack = !!m.track;
                    const trackRole = m.track === prim ? "Your primary track" : m.track === s.spec.secondary ? "Your secondary track" : "";
                    const topics = m.topics.map((id) => TOPIC_MAP[id]).filter((t) => research || t.priority !== "research");
                    if (!topics.length) return null;
                    return (
                      <details key={m.id} className="disc" open={!isTrack || !!trackRole}>
                        <summary><span>{m.title} {trackRole && <span className="badge ok">{trackRole}</span>}</span><span className="tiny muted">{m.topics.filter((id) => isDone(s, id)).length}/{m.topics.length}</span></summary>
                        <div className="body">
                          <p className="small muted">{m.summary}</p>
                          {topics.map((t) => <TopicRow key={t.id} t={t} s={s} />)}
                        </div>
                      </details>
                    );
                  })}
                  {p.id === "p9" && <p className="small"><Link href="/career-paths#gate">Open the specialization gate</Link> to choose your tracks ({TRACKS.length} available).</p>}
                  <div className="row" style={{ marginTop: 8 }}>
                    <button className="btn sm primary" onClick={() => setTest(p.id)}>Take the Phase {p.num} test</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <section className="panel" aria-labelledby="ms-h">
        <h2 id="ms-h">Monthly milestones</h2>
        <div className="scroll">
          <table className="t">
            <thead><tr><th>Month</th><th>Milestone</th><th>Practical task</th><th>Skills unlocked</th><th>Test</th></tr></thead>
            <tbody>
              {MILESTONES.map((m) => {
                const best = bestMastery(s, m.test);
                return (
                  <tr key={m.month}>
                    <td>{m.month}</td><td>{m.title}</td><td className="small">{m.practical}</td><td className="small">{m.skillsUnlocked.join(", ")}</td>
                    <td><button className="btn sm" onClick={() => setTest(m.test)}>{best !== undefined ? `${Math.round(best * 100)}%` : "Take"}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={!!test} onClose={() => { setTest(null); history.replaceState(null, "", "/roadmap"); }} title={test && MASTERY_MAP[test] ? MASTERY_MAP[test].title : "Mastery test"}>
        {test && MASTERY_MAP[test] && <MasteryRunner test={MASTERY_MAP[test]} />}
      </Dialog>
    </div>
  );
}
