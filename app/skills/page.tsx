"use client";
import Link from "next/link";
import { LEVELS, LEVEL_RULES, SKILLS, TARGETS } from "@/content/skills";
import { TARGET_LABELS } from "@/content/phases";
import { TOPICS } from "@/content/topics";
import { actions, useHydrated, useStore } from "@/lib/store";
import { allSkills } from "@/lib/derive";
import { Loading, PageHead } from "@/components/ui";

export default function SkillsPage() {
  const hydrated = useHydrated();
  const s = useStore();
  if (!hydrated) return <Loading />;
  const target = TARGETS[s.settings.target];
  const reports = allSkills(s);
  const gaps = reports.filter((r) => r.level < target[r.id]).sort((a, b) => (target[b.id] - b.level) - (target[a.id] - a.level));
  const mismatch = TOPICS.filter((t) => { const st = s.topics[t.id]; return st?.status === "done" && (st.conf ?? 0) >= 3 && !st.ev.some((e) => ["coded", "practiced", "built", "debugged", "verified"].includes(e)); }).slice(0, 8);
  return (
    <div className="page">
      <PageHead title="My skills">Levels are computed from evidence (completed topics, confidence, projects, interview accuracy, research), never from time spent. Each level explains why you have it.</PageHead>
      <div className="panel between">
        <div className="field" style={{ margin: 0, minWidth: 260 }}><label htmlFor="tgt">Compare against target role</label>
          <select id="tgt" value={s.settings.target} onChange={(e) => actions.settings({ target: e.target.value as typeof s.settings.target })}>{Object.entries(TARGET_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </div>
        <p className="small muted" style={{ margin: 0, maxWidth: 460 }}>Targets are a sensible entry-level profile for the role, not an official standard.</p>
      </div>
      <section className="panel" aria-labelledby="mx-h">
        <h2 id="mx-h">Skill matrix</h2>
        <div className="scroll">
          <table className="t">
            <thead><tr><th>Skill</th><th>Current</th><th>Target</th><th style={{ minWidth: 180 }}>Level</th><th>Why</th></tr></thead>
            <tbody>
              {reports.map((r) => {
                const k = SKILLS.find((x) => x.id === r.id)!;
                const tgt = target[r.id];
                return (
                  <tr key={r.id}>
                    <td><b>{k.name}</b><div className="tiny muted">{k.what}</div></td>
                    <td>{r.level < 0 ? <span className="muted">Not started</span> : LEVELS[r.level]}</td>
                    <td>{LEVELS[tgt]}</td>
                    <td>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 3 }} role="img" aria-label={`Level ${r.level + 1} of 5, target ${tgt + 1}`}>
                        {LEVELS.map((_, i) => <span key={i} style={{ height: 8, borderRadius: 2, background: i <= r.level ? "var(--signal)" : i <= tgt ? "var(--line-2)" : "var(--sunk)" }} />)}
                      </div>
                      <div className="tiny muted">{r.completed}/{r.total} topics, {r.projects.length} projects</div>
                    </td>
                    <td className="tiny">{r.reasons.length ? r.reasons.join("; ") : "No evidence yet"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <div className="grid2">
        <section className="panel"><h2>Biggest gaps for {TARGET_LABELS[s.settings.target]}</h2>
          {gaps.length ? <ol>{gaps.slice(0, 6).map((g) => <li key={g.id}>{SKILLS.find((x) => x.id === g.id)!.name}: {g.level < 0 ? "not started" : LEVELS[g.level]} → {LEVELS[target[g.id]]}</li>)}</ol> : <p className="small">You meet every target level. Aim higher in your specialization.</p>}
          <p className="small muted">The fastest way to raise a level is usually a project with hands-on evidence, not more reading.</p>
        </section>
        <section className="panel"><h2>Confidence without evidence</h2>
          <p className="small muted">Topics you rated Strong or higher but have not practised, coded, built, debugged or verified. Confidence is easy to overestimate; evidence fixes that.</p>
          {mismatch.length ? <ul className="list">{mismatch.map((t) => <li key={t.id}><Link href={`/topics/${t.id}#practice`}>{t.title}</Link></li>)}</ul> : <p className="small">None. Good calibration.</p>}
        </section>
      </div>
      <section className="panel"><h2>How levels are computed</h2><ol className="small">{LEVEL_RULES.map((r) => <li key={r}>{r}</li>)}</ol></section>
    </div>
  );
}
