"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { INTERVIEW_CATS } from "@/content/interview";
import { TOPIC_MAP } from "@/content/topics";
import type { InterviewCat } from "@/content/schema";
import { actions, useHydrated, useStore } from "@/lib/store";
import { POOL, POOL_MAP, type PoolQ } from "@/lib/questions";
import { interviewStats } from "@/lib/derive";
import { Loading, PageHead, Tabs, TabPanel } from "@/components/ui";

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function QCard({ q, mock }: { q: PoolQ; mock?: boolean }) {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const r = s.interview[q.id];
  return (
    <div className="panel">
      <div className="row tiny muted" style={{ marginBottom: 6 }}><span className="badge plain">{INTERVIEW_CATS[q.cat]}</span><span className="badge plain">Level {q.level}</span>{!mock && <span>{q.concept}</span>}{r && <span>{r.n} attempt{r.n > 1 ? "s" : ""}, last: {r.last}</span>}{r?.flag && <span className="badge warn">Revisit</span>}</div>
      <p style={{ fontWeight: 500 }}>{q.q}</p>
      {mock && !open && (
        <div className="field"><label htmlFor={`ans-${q.id}`}>Your answer (optional; speaking aloud works too)</label><textarea id={`ans-${q.id}`} value={draft} onChange={(e) => setDraft(e.target.value)} style={{ minHeight: 70 }} /></div>
      )}
      {!open ? <button className="btn sm" onClick={() => setOpen(true)}>{mock ? "I've answered: reveal" : "Reveal answer"}</button> : (
        <div className="small">
          <p><span className="muted">Model answer: </span>{q.a}</p>
          {q.reasoning && <p><span className="muted">Reasoning: </span>{q.reasoning}</p>}
          {q.trap && <p><span className="muted">Common trap: </span>{q.trap}</p>}
          <p className="tiny">Related: {q.topics.map((t, i) => <span key={t}>{i ? ", " : ""}<Link href={`/topics/${t}`}>{TOPIC_MAP[t]?.title}</Link></span>)}</p>
          <div className="row">
            <button className="btn sm good" onClick={() => actions.answer(q.id, "ok", q.q)}>Correct</button>
            <button className="btn sm" onClick={() => actions.answer(q.id, "partial", q.q)}>Partly</button>
            <button className="btn sm bad" onClick={() => actions.answer(q.id, "miss", q.q)}>Missed</button>
            <button className="btn sm ghost" onClick={() => actions.flagQuestion(q.id)}>{r?.flag ? "Unmark revisit" : "Mark to revisit"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [tab, setTab] = useState("mock");
  const [cats, setCats] = useState<InterviewCat[]>([]);
  const [onlyDone, setOnlyDone] = useState(true);
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [bankCat, setBankCat] = useState<InterviewCat | "all">("all");
  const [focus, setFocus] = useState<string[] | null>(null);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("topics"); const q = sp.get("q");
    if (t) { setFocus(t.split(",").filter(Boolean)); setOnlyDone(false); }
    if (q && POOL_MAP[q]) { setTab("bank"); setSession(null); setFocus(POOL_MAP[q].topics); }
  }, []);
  const pool = useMemo(() => POOL.filter((q) =>
    (!cats.length || cats.includes(q.cat)) &&
    (!focus || q.topics.some((t) => focus.includes(t))) &&
    (!onlyDone || focus || q.topics.some((t) => s.topics[t]?.status === "done"))), [cats, onlyDone, focus, s.topics]);
  if (!hydrated) return <Loading />;
  const catKeys = Object.keys(INTERVIEW_CATS) as InterviewCat[];
  const weak = catKeys.map((c) => ({ c, ...interviewStats(s, [c]) })).filter((x) => x.n > 0).sort((a, b) => a.acc - b.acc);
  const flagged = Object.entries(s.interview).filter(([, r]) => r.flag).map(([id]) => POOL_MAP[id]).filter(Boolean);
  const all = interviewStats(s);
  return (
    <div className="page">
      <PageHead title="Interview">Questions from every topic plus a senior-style bank. Mock mode hides teaching material, asks one question at a time and waits for your answer before revealing.</PageHead>
      <div className="stats panel"><div className="stat"><b>{all.n}</b><span>answers</span></div><div className="stat"><b>{Math.round(all.acc * 100)}%</b><span>accuracy</span></div><div className="stat"><b>{flagged.length}</b><span>to revisit</span></div><div className="stat"><b>{POOL.length}</b><span>questions available</span></div></div>
      <Tabs label="Interview sections" active={tab} onChange={setTab} tabs={[{ id: "mock", label: "Mock interview" }, { id: "bank", label: "Question bank" }, { id: "weak", label: "Weak areas" }]} />
      <TabPanel id={tab}>
      {tab === "mock" && (
        session ? (
          <div className="narrow">
            <div className="between" style={{ marginBottom: 10 }}><span className="small muted">Question {idx + 1} of {session.length}</span><button className="btn sm" onClick={() => setSession(null)}>End session</button></div>
            <QCard key={session[idx]} q={POOL_MAP[session[idx]]} mock />
            <div className="row">
              <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Previous</button>
              {idx < session.length - 1 ? <button className="btn primary" onClick={() => setIdx(idx + 1)}>Next question</button> : <button className="btn primary" onClick={() => setSession(null)}>Finish session</button>}
            </div>
          </div>
        ) : (
          <section className="panel narrow">
            <h2>Set up a session</h2>
            {focus && <p className="small callout">Focused on {focus.length} topic(s) from your link. <button className="btn sm" onClick={() => setFocus(null)}>Clear focus</button></p>}
            <div className="label">Categories (none selected means all)</div>
            <div className="chips" style={{ marginBottom: 12 }}>{catKeys.map((c) => <button key={c} className="chip" aria-pressed={cats.includes(c)} onClick={() => setCats(cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c])}>{INTERVIEW_CATS[c]}</button>)}</div>
            <label className="row small" style={{ marginBottom: 10 }}><input type="checkbox" checked={onlyDone} onChange={(e) => setOnlyDone(e.target.checked)} /> Only topics I have completed</label>
            <div className="field" style={{ maxWidth: 200 }}><label htmlFor="cnt">Questions</label><input id="cnt" type="number" min={1} max={40} value={count} onChange={(e) => setCount(Math.max(1, Math.min(40, Number(e.target.value) || 10)))} /></div>
            <p className="small muted">{pool.length} questions match.</p>
            <button className="btn primary" disabled={!pool.length} onClick={() => { setSession(shuffle(pool).slice(0, count).map((q) => q.id)); setIdx(0); }}>Start mock interview</button>
            {!pool.length && onlyDone && <p className="tiny muted" style={{ marginTop: 8 }}>Complete some topics first, or untick the filter.</p>}
          </section>
        )
      )}
      {tab === "bank" && (
        <div>
          <div className="chips" style={{ marginBottom: 14 }}>
            <button className="chip" aria-pressed={bankCat === "all"} onClick={() => setBankCat("all")}>All</button>
            {catKeys.map((c) => <button key={c} className="chip" aria-pressed={bankCat === c} onClick={() => setBankCat(c)}>{INTERVIEW_CATS[c]}</button>)}
          </div>
          {(focus ? POOL.filter((q) => q.topics.some((t) => focus.includes(t))) : POOL.filter((q) => bankCat === "all" || q.cat === bankCat)).slice(0, 60).map((q) => <QCard key={q.id} q={q} />)}
          <p className="tiny muted">Showing up to 60. Use categories or mock mode to go through the rest.</p>
        </div>
      )}
      {tab === "weak" && (
        <div className="grid2">
          <section className="panel"><h2>Accuracy by category</h2>
            {weak.length ? <table className="t"><thead><tr><th>Category</th><th>Answers</th><th>Accuracy</th></tr></thead><tbody>{weak.map((w) => <tr key={w.c}><td>{INTERVIEW_CATS[w.c]}</td><td>{w.n}</td><td className={w.acc < 0.7 ? "" : ""}>{Math.round(w.acc * 100)}% {w.acc < 0.7 && <span className="badge warn">weak</span>}</td></tr>)}</tbody></table> : <p className="small muted">No answers yet. Start a mock interview.</p>}
          </section>
          <section className="panel"><h2>Marked to revisit</h2>{flagged.length ? flagged.slice(0, 20).map((q) => <QCard key={q.id} q={q} />) : <p className="small muted">Questions you miss or mark appear here.</p>}</section>
        </div>
      )}
      </TabPanel>
    </div>
  );
}
