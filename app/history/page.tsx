"use client";
import Link from "next/link";
import { useState } from "react";
import { TOPIC_MAP } from "@/content/topics";
import { MASTERY_MAP } from "@/content/mastery";
import { useHydrated, useStore, type ActivityKind } from "@/lib/store";
import { activityByDay, streaks } from "@/lib/derive";
import { prettyDate } from "@/lib/dates";
import { Loading, PageHead } from "@/components/ui";
import { Heatmap } from "@/components/learning";

const KINDS: [ActivityKind, string][] = [["learning", "Learning"], ["revision", "Revision"], ["project", "Projects"], ["interview", "Interview"], ["practice", "Practice"], ["research", "Research"], ["certification", "Certifications"], ["reflection", "Reflections"], ["confidence", "Confidence changes"], ["plan", "Plan tasks"]];

export default function HistoryPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [kinds, setKinds] = useState<ActivityKind[]>([]);
  const [limit, setLimit] = useState(120);
  if (!hydrated) return <Loading />;
  const st = streaks(s);
  const filtered = s.log.filter((e) => !kinds.length || kinds.includes(e.k)).slice().reverse();
  const byDay: Record<string, typeof filtered> = {};
  for (const e of filtered.slice(0, limit)) (byDay[e.d] ||= []).push(e);
  const reflections = Object.entries(s.reflections).filter(([, r]) => Object.values(r).some(Boolean)).sort((a, b) => b[0].localeCompare(a[0]));
  const tests = Object.entries(s.mastery).flatMap(([p, list]) => list.map((x) => ({ p, ...x }))).sort((a, b) => b.d.localeCompare(a.d));
  return (
    <div className="page">
      <PageHead title="History">Everything you have done, day by day. Missed days are not failures; the record is here to show progress, not to judge.</PageHead>
      <div className="panel">
        <div className="stats" style={{ marginBottom: 14 }}>
          <div className="stat"><b>{st.current}</b><span>current streak</span></div><div className="stat"><b>{st.longest}</b><span>longest streak</span></div>
          <div className="stat"><b>{st.activeDays}</b><span>active days</span></div><div className="stat"><b>{Object.values(s.topics).filter((t) => t.status === "done").length}</b><span>topics completed</span></div>
        </div>
        <div className="chips" style={{ marginBottom: 12 }}>{KINDS.map(([k, l]) => <button key={k} className="chip" aria-pressed={kinds.includes(k)} onClick={() => setKinds(kinds.includes(k) ? kinds.filter((x) => x !== k) : [...kinds, k])}>{l}</button>)}</div>
        <Heatmap counts={activityByDay(s, kinds.length ? kinds : undefined)} weeks={52} />
      </div>
      <div className="layout-main">
        <section className="panel" aria-labelledby="tl-h">
          <h2 id="tl-h">Timeline</h2>
          {!filtered.length && <p className="muted small">Nothing recorded yet{kinds.length ? " for these filters" : ""}.</p>}
          {Object.entries(byDay).map(([d, list]) => (
            <div key={d} style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: ".9rem" }}>{prettyDate(d)}</h3>
              <ul className="clean">{list.map((e) => (
                <li key={e.t + e.label} className="small" style={{ padding: "3px 0" }}>
                  <span className="badge plain" style={{ marginRight: 6 }}>{e.k}</span>
                  {e.ref && TOPIC_MAP[e.ref] ? <Link href={`/topics/${e.ref}`}>{e.label}</Link> : e.label}
                </li>))}
              </ul>
            </div>
          ))}
          {filtered.length > limit && <button className="btn sm" onClick={() => setLimit(limit + 200)}>Show more</button>}
        </section>
        <aside>
          <section className="panel"><h3>Mastery tests</h3>{tests.length ? <ul className="clean small">{tests.slice(0, 20).map((t, i) => <li key={i} style={{ padding: "3px 0" }}>{t.d}: {MASTERY_MAP[t.p]?.title}, <b>{Math.round(t.score * 100)}%</b></li>)}</ul> : <p className="small muted">No tests taken yet.</p>}</section>
          <section className="panel"><h3>Reflections</h3>{reflections.length ? reflections.slice(0, 15).map(([d, r]) => (
            <details key={d} className="small" style={{ marginBottom: 6 }}><summary>{prettyDate(d)}</summary>
              {r.understood && <p><span className="muted">Understood: </span>{r.understood}</p>}{r.confused && <p><span className="muted">Confused: </span>{r.confused}</p>}
              {r.built && <p><span className="muted">Built: </span>{r.built}</p>}{r.revisit && <p><span className="muted">Revisit: </span>{r.revisit}</p>}
            </details>)) : <p className="small muted">Daily reflections appear here.</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}
