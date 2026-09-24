"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TOPIC_MAP } from "@/content/topics";
import type { MasteryTest, Topic } from "@/content/schema";
import { actions, CONF_LABELS, EVIDENCE, useStore, type Conf, type State } from "@/lib/store";
import { PLAN } from "@/lib/plan";
import { today, relative } from "@/lib/dates";
import { DEPTH_LABEL, PriorityBadge } from "./ui";

/** Signature element: the study week drawn as a clock and a DONE signal, like a waveform viewer. */
export function WeekWave({ s, current }: { s: State; current: number }) {
  const cur = PLAN[Math.min(current, PLAN.length) - 1];
  const week = PLAN.filter((d) => d.week === cur.week);
  const W = 420, H = 74, x0 = 46, cw = (W - x0 - 6) / 7;
  const kinds = ["L", "L", "L", "L", "L", "C", "P"];
  let clk = "", done = `M ${x0} 58`;
  week.forEach((d, i) => {
    const x = x0 + i * cw;
    clk += `M ${x} 30 V 14 H ${x + cw / 2} V 30 H ${x + cw} `;
    const hi = !!s.plan.done[d.day];
    done += ` L ${x} ${hi ? 44 : 58} L ${x + cw} ${hi ? 44 : 58}`;
  });
  const idx = week.findIndex((d) => d.day === current);
  return (
    <svg className="wave" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Week ${cur.week}: ${week.filter((d) => s.plan.done[d.day]).length} of ${week.length} plan days finished`}>
      <text x="0" y="26">clk</text>
      <text x="0" y="56">done</text>
      <path className="lane" d={`M ${x0} 30 H ${W}`} />
      <path className="lane" d={`M ${x0} 58 H ${W}`} />
      <path className="clk" d={clk} />
      <path className="sig" d={done} />
      {week.map((d, i) => <text key={d.day} x={x0 + i * cw + cw / 2 - 3} y={72}>{d.kind === "milestone" ? "M" : kinds[i] || ""}</text>)}
      {idx >= 0 && <path className="now" d={`M ${x0 + idx * cw + cw / 2} 6 V 62`} />}
    </svg>
  );
}

export function Heatmap({ counts, weeks = 26 }: { counts: Record<string, number>; weeks?: number }) {
  const cells = useMemo(() => {
    const t = new Date(today() + "T00:00:00");
    const end = new Date(t); end.setDate(t.getDate() + (6 - t.getDay()));
    const out: { d: string; n: number; future: boolean }[] = [];
    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const d = new Date(end); d.setDate(end.getDate() - i);
      const key = d.toLocaleDateString("en-CA");
      out.push({ d: key, n: counts[key] || 0, future: d > t });
    }
    return out;
  }, [counts, weeks]);
  const total = cells.reduce((a, c) => a + c.n, 0);
  return (
    <div>
      <div className="heat" role="img" aria-label={`${total} activities in the last ${weeks} weeks`}>
        {cells.map((c) => {
          const lvl = c.future ? "future" : c.n === 0 ? "" : c.n < 3 ? "h1" : c.n < 6 ? "h2" : c.n < 10 ? "h3" : "h4";
          return <span key={c.d} className={lvl} title={`${c.d}: ${c.n}`} />;
        })}
      </div>
      <p className="tiny muted" style={{ margin: "6px 0 0" }}>Less <span className="kbd" style={{ background: "var(--heat1)" }}>&nbsp;</span> <span className="kbd" style={{ background: "var(--heat3)" }}>&nbsp;</span> more</p>
    </div>
  );
}

export function TopicRow({ t, s, showPhase }: { t: Topic; s: State; showPhase?: boolean }) {
  const st = s.topics[t.id];
  const done = st?.status === "done";
  return (
    <Link href={`/topics/${t.id}`} className="trow">
      <span className={`tick${done ? " on" : ""}`} aria-hidden="true">{done ? "✓" : ""}</span>
      <span><span className="tt">{t.title}</span>{showPhase && <span className="tiny muted">{t.phase.startsWith("e") ? ` Embedded E${t.phase.slice(1)}` : ` Phase ${t.phase.slice(1)}`}</span>}<span className="sr-only">{done ? " (completed)" : ""}</span></span>
      <span className="meta">
        <PriorityBadge p={t.priority} />
        <span className="badge plain">{DEPTH_LABEL[t.depth]}</span>
        {st?.conf !== undefined && <span className="badge plain">{CONF_LABELS[st.conf]}</span>}
        {st?.flag && <span className="badge warn">Review</span>}
      </span>
    </Link>
  );
}

export function ConfidencePicker({ t }: { t: Topic }) {
  const s = useStore();
  const cur = s.topics[t.id]?.conf;
  return (
    <div>
      <div className="label" id={`conf-${t.id}`}>How well do you understand it?</div>
      <div className="chips" role="group" aria-labelledby={`conf-${t.id}`}>
        {CONF_LABELS.map((l, i) => <button key={l} type="button" className="chip" aria-pressed={cur === i} onClick={() => actions.setConf(t.id, i as Conf, t.title)}>{l}</button>)}
      </div>
    </div>
  );
}

export function EvidencePicker({ t }: { t: Topic }) {
  const s = useStore();
  const ev = s.topics[t.id]?.ev || [];
  return (
    <div>
      <div className="label" id={`ev-${t.id}`}>Evidence so far</div>
      <div className="chips" role="group" aria-labelledby={`ev-${t.id}`}>
        {EVIDENCE.map((e) => <button key={e} type="button" className="chip" aria-pressed={ev.includes(e)} onClick={() => actions.toggleEvidence(t.id, e)}>{e}</button>)}
      </div>
    </div>
  );
}

export function RevisionCard({ id }: { id: string }) {
  const s = useStore();
  const t = TOPIC_MAP[id];
  const [show, setShow] = useState(false);
  const [forgot, setForgot] = useState(false);
  if (!t) return null;
  const st = s.topics[id];
  const iq = t.interview[(st?.rev?.hist.length || 0) % t.interview.length];
  return (
    <div className="check" style={{ display: "block" }}>
      <div className="between">
        <Link href={`/topics/${id}`} className="t">{t.title}</Link>
        <span className="tiny muted">due {st?.rev ? relative(st.rev.due) : "now"}, stage {(st?.rev?.stage || 0) + 1}</span>
      </div>
      {forgot ? (
        <div className="callout warn small" style={{ marginTop: 8 }}>
          It comes back tomorrow. Review these first: {t.prereqs.length ? t.prereqs.map((p, i) => <span key={p}>{i > 0 && ", "}<Link href={`/topics/${p}`}>{TOPIC_MAP[p]?.title}</Link></span>) : "re-read the simple explanation and the visual"}.
        </div>
      ) : (
        <>
          <p className="small" style={{ margin: "6px 0" }}><span className="muted">Recall: </span>{iq.q}</p>
          {show && <p className="small" style={{ margin: "0 0 8px" }}><span className="muted">Answer: </span>{iq.a}</p>}
          <div className="row">
            {!show && <button className="btn sm" onClick={() => setShow(true)}>Reveal answer</button>}
            <button className="btn sm good" onClick={() => actions.review(id, true, t.title)}>Remembered</button>
            <button className="btn sm bad" onClick={() => { actions.review(id, false, t.title); setForgot(true); }}>Forgot</button>
          </div>
        </>
      )}
    </div>
  );
}

export function MasteryRunner({ test, onDone }: { test: MasteryTest; onDone?: (score: number) => void }) {
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [self, setSelf] = useState<Record<string, boolean | undefined>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const total = test.questions.length;
  const score = test.questions.reduce((a, q) => a + (typeof q.answer === "number" ? (picked[q.id] === q.answer ? 1 : 0) : self[q.id] ? 1 : 0), 0) / total;
  const ready = test.questions.every((q) => (typeof q.answer === "number" ? picked[q.id] !== undefined : self[q.id] !== undefined));
  return (
    <div>
      <ol style={{ paddingLeft: 18 }}>
        {test.questions.map((q) => (
          <li key={q.id} style={{ marginBottom: 16 }}>
            <div className="row" style={{ gap: 6 }}><span className="badge plain">{q.type}</span></div>
            <p style={{ margin: "6px 0" }}>{q.q}</p>
            {q.options ? (
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="sr-only">{q.q}</legend>
                {q.options.map((o, i) => (
                  <label key={o} className="row small" style={{ gap: 8, padding: "3px 0" }}>
                    <input type="radio" name={q.id} checked={picked[q.id] === i} disabled={submitted} onChange={() => setPicked({ ...picked, [q.id]: i })} /> {o}
                    {submitted && i === q.answer && <span className="badge ok">correct</span>}
                  </label>
                ))}
                {submitted && <p className="small muted">{q.explain}</p>}
              </fieldset>
            ) : (
              <div>
                <p className="tiny muted" style={{ margin: 0 }}>Answer aloud or in notes first, then compare and grade yourself honestly.</p>
                {revealed[q.id] ? <p className="small callout" style={{ margin: "6px 0" }}>{String(q.answer)}</p> : <button className="btn sm" onClick={() => setRevealed({ ...revealed, [q.id]: true })}>Show model answer</button>}
                {revealed[q.id] && (
                  <div className="row">
                    <button className="btn sm good" aria-pressed={self[q.id] === true} disabled={submitted} onClick={() => setSelf({ ...self, [q.id]: true })}>I got it</button>
                    <button className="btn sm bad" aria-pressed={self[q.id] === false} disabled={submitted} onClick={() => setSelf({ ...self, [q.id]: false })}>I missed it</button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
      {!submitted ? (
        <button className="btn primary" disabled={!ready} onClick={() => { setSubmitted(true); actions.saveMastery(test.phase, score, test.title); onDone?.(score); }}>Submit test</button>
      ) : (
        <div className={`callout ${score >= 0.8 ? "" : "warn"}`} aria-live="polite">
          <b>Score: {Math.round(score * 100)}%.</b> {score >= 0.8 ? "Strong: this phase is marked as mastered." : "Below 80%: review the topics you missed, then retake it. There is no penalty for retrying."}
          <div style={{ marginTop: 8 }}><button className="btn sm" onClick={() => { setPicked({}); setSelf({}); setRevealed({}); setSubmitted(false); }}>Retake</button></div>
        </div>
      )}
    </div>
  );
}
