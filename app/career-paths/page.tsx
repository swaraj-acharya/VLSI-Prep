"use client";
import Link from "next/link";
import { CAREERS } from "@/content/careers";
import { TRACKS } from "@/content/phases";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { LEARNING_MAP } from "@/content/projects";
import type { TrackId } from "@/content/schema";
import { actions, useHydrated, useStore, type State } from "@/lib/store";
import { interviewStats, skillReport } from "@/lib/derive";
import { today } from "@/lib/dates";
import { Loading, PageHead } from "@/components/ui";

type Opt = { label: string; w: Partial<Record<TrackId, number>> };
const QUESTIONS: { id: string; q: string; opts: Opt[] }[] = [
  { id: "enjoy", q: "Which work have you enjoyed most so far?", opts: [
    { label: "Designing blocks and making them fast or small", w: { rtl: 3, arch: 1 } },
    { label: "Finding bugs and proving things work", w: { dv: 3, validation: 1 } },
    { label: "Timing numbers, layout and physical effects", w: { pd: 3, ams: 1 } },
    { label: "Seeing designs run on real hardware", w: { fpga: 3, validation: 2 } },
    { label: "Writing tools, scripts and algorithms", w: { eda: 3, dv: 1 } },
    { label: "Performance analysis and modelling", w: { arch: 3, rtl: 1 } },
  ]},
  { id: "mode", q: "Debugging or designing?", opts: [
    { label: "Designing from a blank page", w: { rtl: 2, arch: 1 } },
    { label: "Debugging something that almost works", w: { dv: 2, validation: 2, pd: 1 } },
    { label: "Both equally", w: { fpga: 1, rtl: 1, dv: 1 } },
  ]},
  { id: "software", q: "How much do you want your software background to be part of the job?", opts: [
    { label: "A lot: it's a strength I want to use", w: { eda: 3, dv: 2, validation: 1 } },
    { label: "Some", w: { fpga: 1, dv: 1, arch: 1 } },
    { label: "Little: I want to focus on hardware", w: { rtl: 1, pd: 2, ams: 1 } },
  ]},
  { id: "physics", q: "How do you feel about device physics, circuits and analog?", opts: [
    { label: "I enjoy it", w: { ams: 3, pd: 2, dft: 1 } },
    { label: "Neutral", w: { pd: 1, dft: 1 } },
    { label: "I prefer abstraction", w: { dv: 1, eda: 1, rtl: 1, arch: 1 } },
  ]},
  { id: "projects", q: "Which project type do you want to be known for?", opts: [
    { label: "A CPU or accelerator", w: { rtl: 2, arch: 2 } },
    { label: "A verification environment", w: { dv: 3 } },
    { label: "A taped-out or GDS-clean chip", w: { pd: 2, dft: 1, rtl: 1 } },
    { label: "An FPGA demo", w: { fpga: 3 } },
    { label: "A design tool or ML-for-EDA model", w: { eda: 3 } },
  ]},
];

const TRACK_SKILLS: Record<TrackId, Parameters<typeof skillReport>[1][]> = {
  rtl: ["rtl", "digital"], dv: ["verification", "python"], pd: ["timing", "pd"], dft: ["dft"], fpga: ["rtl", "protocols"], ams: ["digital"], validation: ["python", "cpp"], eda: ["eda", "python"], arch: ["arch"],
};
const TRACK_CATS: Record<TrackId, string[]> = { rtl: ["rtl"], dv: ["verification"], pd: ["timing", "pd"], dft: ["dft"], fpga: ["rtl", "timing"], ams: ["digital"], validation: ["programming"], eda: ["programming", "asic"], arch: ["arch"] };

function recommend(s: State) {
  const score: Record<string, number> = {};
  const why: Record<string, string[]> = {};
  TRACKS.forEach((t) => { score[t.id] = 0; why[t.id] = []; });
  for (const q of QUESTIONS) {
    const a = s.spec.answers[q.id];
    const opt = q.opts.find((o) => o.label === a);
    if (!opt) continue;
    for (const [k, v] of Object.entries(opt.w)) { score[k] += v!; why[k].push(`You chose "${opt.label}"`); }
  }
  for (const t of TRACKS) {
    const lv = Math.max(...TRACK_SKILLS[t.id].map((sk) => skillReport(s, sk).level));
    if (lv >= 1) { score[t.id] += lv; why[t.id].push(`Related skill evidence at level ${lv}`); }
    const iv = interviewStats(s, TRACK_CATS[t.id]);
    if (iv.n >= 5) { const b = Math.round((iv.acc - 0.5) * 4); score[t.id] += b; why[t.id].push(`Interview accuracy ${Math.round(iv.acc * 100)}% in related questions`); }
  }
  return TRACKS.map((t) => ({ t, score: score[t.id], why: why[t.id] })).sort((a, b) => b.score - a.score);
}

export default function CareerPathsPage() {
  const hydrated = useHydrated();
  const s = useStore();
  if (!hydrated) return <Loading />;
  const answered = QUESTIONS.filter((q) => s.spec.answers[q.id]).length;
  const rec = recommend(s);
  return (
    <div className="page">
      <PageHead title="Career paths">Thirteen roles in chip design. Every entry says how realistic it is for an EE graduate without an M.Tech, so you can choose with open eyes.</PageHead>

      <section className="panel anchor" id="gate" aria-labelledby="gate-h">
        <h2 id="gate-h">Specialization gate</h2>
        <p className="small muted">Arrives after the core phases, when you have enough experience to judge. The recommendation combines your answers with your real performance; you make the final choice and can change it later.</p>
        {QUESTIONS.map((q) => (
          <fieldset key={q.id} style={{ border: 0, padding: 0, margin: "0 0 12px" }}>
            <legend className="label" style={{ marginBottom: 4 }}>{q.q}</legend>
            <div className="chips">{q.opts.map((o) => <button key={o.label} type="button" className="chip" aria-pressed={s.spec.answers[q.id] === o.label} onClick={() => actions.setSpec({ answers: { ...s.spec.answers, [q.id]: o.label } })}>{o.label}</button>)}</div>
          </fieldset>
        ))}
        {answered >= 3 ? (
          <div className="callout">
            <b>Suggested order:</b>
            <ol style={{ margin: "6px 0" }}>{rec.slice(0, 3).map((r) => <li key={r.t.id}><b>{r.t.title}</b> <span className="small muted">{r.why.slice(0, 3).join("; ") || "No strong signal yet"}</span></li>)}</ol>
          </div>
        ) : <p className="small muted">Answer at least three questions to see a recommendation.</p>}
        <div className="grid2" style={{ marginTop: 12 }}>
          <div className="field"><label htmlFor="pri">Primary track</label>
            <select id="pri" value={s.spec.primary || ""} onChange={(e) => actions.setSpec({ primary: (e.target.value || undefined) as TrackId | undefined, decidedAt: today() })}>
              <option value="">Not chosen (uses your target role)</option>{TRACKS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div className="field"><label htmlFor="sec">Secondary track (compressed, optional)</label>
            <select id="sec" value={s.spec.secondary || ""} onChange={(e) => actions.setSpec({ secondary: (e.target.value || undefined) as TrackId | undefined })}>
              <option value="">None</option>{TRACKS.filter((t) => t.id !== s.spec.primary).map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
        </div>
        {s.spec.decidedAt && <p className="tiny muted">Decided {s.spec.decidedAt}. Your plan's specialization days now follow these tracks.</p>}
      </section>

      {CAREERS.map((c) => (
        <details key={c.id} id={c.id} className="disc anchor">
          <summary><span>{c.title} <span className="tiny muted">{c.does.slice(0, 90)}{c.does.length > 90 ? "..." : ""}</span></span></summary>
          <div className="body">
            <dl className="qa">
              <dt>What they do</dt><dd>{c.does}</dd><dt>What they build</dt><dd>{c.builds}</dd>
              <dt>Core skills</dt><dd>{c.skills.join(", ")}</dd><dt>Tools</dt><dd>{c.tools.join(", ")}</dd><dt>Programming</dt><dd>{c.programming.join(", ")}</dd>
              <dt>Interview topics</dt><dd>{c.interviewTopics.join(", ")}</dd>
              <dt>Fit for an EE graduate</dt><dd>{c.eeFit}</dd><dt>Is an M.Tech important?</dt><dd>{c.mtech}</dd><dt>Entry-level path</dt><dd>{c.entryPath}</dd>
              <dt>Advanced topics</dt><dd>{c.advanced.join(", ")}</dd>
              <dt>Recommended projects</dt><dd>{c.projects.map((p, i) => <span key={p}>{i ? ", " : ""}<Link href={`/projects/${p}`}>{FLAGSHIP_MAP[p]?.title || LEARNING_MAP[p]?.title}</Link></span>)}</dd>
              <dt>Example companies</dt><dd>{c.companies.join(", ")}</dd>
            </dl>
          </div>
        </details>
      ))}
    </div>
  );
}
