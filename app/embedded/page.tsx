"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EMBEDDED_PHASES, EMBEDDED_ROAD, MODULES } from "@/content/phases";
import { TOPIC_MAP } from "@/content/topics";
import { MASTERY_MAP } from "@/content/mastery";
import { LEARNING_PROJECTS } from "@/content/projects";
import { FLAGSHIPS } from "@/content/flagship";
import { RESOURCE_MAP } from "@/content/resources";
import { CAREER_MAP } from "@/content/careers";
import {
  BOARD_STRATEGY, CROSSOVER_IDEAS, CROSSOVER_LOOP, CROSSOVER_TEMPLATE, DEBUG_METHOD, EMBEDDED_LOOP, EMBEDDED_RESEARCHED, EMBEDDED_TO_VLSI,
  HARDWARE_TIERS, JOB_PATTERNS, JOB_SOURCES, LEVELS, PROJECT_TEMPLATE, READ_REAL_CODE, ROLE_PATHS, SHARED_FOUNDATIONS, TOOLCHAIN_MATRIX,
  TRAINING, VIDEO_NOTES, VLSI_TO_EMBEDDED,
} from "@/content/embedded";
import { useHydrated, useStore } from "@/lib/store";
import { bestMastery, isDone, phaseProgress, projectDone, projectPct } from "@/lib/derive";
import { Bar, Dialog, ExtLink, Loading, PageHead } from "@/components/ui";
import { MasteryRunner, TopicRow } from "@/components/learning";

const topicLink = (id: string) => <Link key={id} href={`/topics/${id}`}>{TOPIC_MAP[id]?.title || id}</Link>;

export default function EmbeddedPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [test, setTest] = useState<string | null>(null);
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h.startsWith("test-")) setTest(h.slice(5));
    else if (/^e\d+$/.test(h)) setOpen(h);
  }, []);
  if (!hydrated) return <Loading />;

  const coreDone = EMBEDDED_ROAD.filter((id) => isDone(s, id)).length;
  const coreDays = EMBEDDED_ROAD.reduce((n, id) => n + (TOPIC_MAP[id]?.days || 0), 0);
  const nextId = EMBEDDED_ROAD.find((id) => !isDone(s, id));
  const current = open ?? (nextId ? TOPIC_MAP[nextId].phase : "e0");
  const embProjects = LEARNING_PROJECTS.filter((p) => p.phase.startsWith("e"));
  const embFlagships = FLAGSHIPS.filter((f) => f.phase.startsWith("e"));
  const debugLabs = embProjects.filter((p) => p.id.startsWith("d-"));

  return (
    <div className="page">
      <PageHead title="Embedded engineering road">
        A self-paced track from C and electronics to production firmware, embedded Linux and one specialization. It shares its foundations with the VLSI road instead of duplicating them, tracks its own progress, and never changes your VLSI day plan.
      </PageHead>

      <section className="panel" aria-label="Embedded progress">
        <div className="row" style={{ gap: 24, flexWrap: "wrap" }}>
          <div className="stat"><b>{coreDone}/{EMBEDDED_ROAD.length}</b><span>core topics done</span></div>
          <div className="stat"><b>{coreDays}</b><span>study days on the core road</span></div>
          <div className="stat"><b>~{Math.ceil(coreDays / 5)}</b><span>weeks at 5 study days/week</span></div>
          <div className="stat"><b>{embProjects.filter((p) => projectDone(s, p.id)).length}/{embProjects.length}</b><span>micro and weekend projects</span></div>
        </div>
        <Bar value={coreDone / EMBEDDED_ROAD.length} label="Embedded core road progress" />
        {nextId && <p className="small" style={{ marginBottom: 0 }}>Next up: {topicLink(nextId)}. Completed topics join your normal revision queue on the Today page.</p>}
      </section>

      <div className="callout small" style={{ marginBottom: 14 }}>
        <b>The loop for every topic:</b> {EMBEDDED_LOOP.join(" → ")}. <b>Rule:</b> do each peripheral once with registers, then with CMSIS/HAL, and compare. <b>No board yet?</b> Start in Renode or QEMU; every project states its hardware and any emulator-only option.
      </div>

      <h2>Core road</h2>
      <p className="small muted">Default path: C → MCU → bare metal → peripherals → interrupts/DMA → debugging → RTOS → networking → boot/OTA/security → Linux/BSP → specialization. Branch modules in E10 are optional; pick one.</p>
      <ol className="rail">
        {EMBEDDED_PHASES.map((p) => {
          const pp = phaseProgress(s, p.id);
          const best = bestMastery(s, p.id);
          const isOpen = current === p.id;
          return (
            <li key={p.id} id={p.id} className={`anchor ${pp.pct === 1 ? "done" : isOpen ? "active" : ""}`}>
              <span className="node" aria-hidden="true" />
              <button className="btn ghost" style={{ padding: "0 0 4px", width: "100%", justifyContent: "space-between", textAlign: "left" }} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? "" : p.id)}>
                <span><span className="tiny muted">Embedded E{p.num}</span><br /><b style={{ fontSize: "1.05rem" }}>{p.title}</b></span>
                <span className="small muted">{pp.done}/{pp.total}</span>
              </button>
              <Bar thin value={pp.pct} label={`${p.title} progress`} />
              <p className="small muted" style={{ margin: "6px 0 0" }}>&ldquo;{p.stage}&rdquo;{best !== undefined ? ` Test best: ${Math.round(best * 100)}%.` : ""}</p>
              {isOpen && (
                <div style={{ marginTop: 10 }}>
                  <p className="small">{p.goal}</p>
                  {MODULES.filter((m) => m.phase === p.id).map((m) => (
                    <details key={m.id} className="disc" open={!m.branch}>
                      <summary><span>{m.title} {m.branch && <span className="badge plain">Optional branch</span>}</span><span className="tiny muted">{m.topics.filter((id) => isDone(s, id)).length}/{m.topics.length}</span></summary>
                      <div className="body">
                        <p className="small muted">{m.summary}</p>
                        {m.topics.map((id) => <TopicRow key={id} t={TOPIC_MAP[id]} s={s} />)}
                      </div>
                    </details>
                  ))}
                  {MASTERY_MAP[p.id] && <button className="btn sm primary" style={{ marginTop: 8 }} onClick={() => setTest(p.id)}>Take the E{p.num} test</button>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <section className="panel" id="shared">
        <h2>Shared foundations from the VLSI road</h2>
        <p className="small muted">Electronics, number systems, digital logic, ISA and Linux basics are taught once, on the VLSI road. Completing them counts for both tracks.</p>
        {SHARED_FOUNDATIONS.map((id) => <TopicRow key={id} t={TOPIC_MAP[id]} s={s} showPhase />)}
      </section>

      <section className="panel" id="levels">
        <h2>Level map (Level 0 to 12)</h2>
        <div className="scroll"><table className="t">
          <thead><tr><th>Level</th><th>Focus</th><th>Topics</th><th>Note</th></tr></thead>
          <tbody>{LEVELS.map((l) => (
            <tr key={l.id}><td>{l.id}</td><td>{l.title}</td><td className="small">{l.topics.map((id, i) => <span key={id}>{i ? ", " : ""}{topicLink(id)}{isDone(s, id) ? " ✓" : ""}</span>)}</td><td className="small">{l.note}</td></tr>
          ))}</tbody>
        </table></div>
      </section>

      <section className="panel" id="roles">
        <h2>Role paths</h2>
        <div className="grid2">{ROLE_PATHS.map((r) => (
          <div key={r.id} className="panel" style={{ marginBottom: 0 }}>
            <b>{r.title}</b>{r.career && CAREER_MAP[r.career] && <> · <Link className="small" href={`/career-paths#${r.career}`}>career details</Link></>}
            <p className="small muted" style={{ margin: "6px 0" }}>{r.note}</p>
            <ol className="small" style={{ margin: 0, paddingLeft: 18 }}>{r.steps.map((id) => <li key={id}>{topicLink(id)}{isDone(s, id) ? " ✓" : ""}</li>)}</ol>
          </div>
        ))}</div>
      </section>

      <section className="panel" id="projects">
        <h2>Project ladder: micro → weekend → flagship</h2>
        <p className="small muted">Quality bar: not &ldquo;built a temperature sensor&rdquo;, but interrupt/DMA acquisition, ring buffers, RTOS processing, telemetry, a diagnostics CLI, watchdog recovery, tests, CI and documented architecture, scaled to the project level.</p>
        {(["micro", "weekend"] as const).map((tier) => (
          <div key={tier}>
            <h3>{tier === "micro" ? "Micro projects and debugging labs (30 min to 6 h)" : "Weekend projects (6 to 16 h)"}</h3>
            <ul className="list small">{embProjects.filter((p) => p.tier === tier).map((p) => (
              <li key={p.id}><Link href={`/projects/${p.id}`}>{p.title}</Link> <span className="muted">· E{p.phase.slice(1)} · {p.hours} h{p.hardware?.startsWith("None") ? " · no hardware" : ""}</span>{projectPct(s, p.id) > 0 && <span className="badge plain">{Math.round(projectPct(s, p.id) * 100)}%</span>}</li>
            ))}</ul>
          </div>
        ))}
        <h3>Flagships</h3>
        <ul className="list small">{embFlagships.map((f) => <li key={f.id}><Link href={`/projects/${f.id}`}>{f.title}</Link> <span className="muted">· {f.duration} · {f.categories.join(", ")}</span></li>)}</ul>
        <h3>Embedded project template</h3>
        <ol className="small" style={{ columns: 2, paddingLeft: 18 }}>{PROJECT_TEMPLATE.map((x) => <li key={x}>{x}</li>)}</ol>
      </section>

      <section className="panel" id="debugging">
        <h2>Debugging labs</h2>
        <p className="small">Method: <b>{DEBUG_METHOD.join(" → ")}</b>. Core tools: GDB + OpenOCD over SWD/JTAG, a logic analyzer and the fault registers. Do not guess what the hardware is doing: measure it.</p>
        <ul className="list small">{debugLabs.map((p) => <li key={p.id}><Link href={`/projects/${p.id}`}>{p.title}</Link></li>)}</ul>
      </section>

      <section className="panel" id="boards">
        <h2>Boards, emulators and what to buy</h2>
        <div className="scroll"><table className="t">
          <thead><tr><th>When</th><th>Pick</th><th>Why</th><th>Alternative</th></tr></thead>
          <tbody>{BOARD_STRATEGY.map((b) => <tr key={b.stage}><td>{b.stage}</td><td>{b.pick}</td><td className="small">{b.why}</td><td className="small">{b.alt}</td></tr>)}</tbody>
        </table></div>
        <h3>Hardware tiers</h3>
        <dl className="qa small">{HARDWARE_TIERS.map((h) => <div key={h.tier}><dt>{h.tier}</dt><dd>{h.items}</dd></div>)}</dl>
        <p className="tiny muted">Arduino is fine for orientation, but the road moves to registers, CMSIS/HAL, GCC, linker scripts, GDB and OpenOCD so you know what the abstractions hide.</p>
      </section>

      <section className="panel" id="toolchain">
        <h2>Toolchain matrix</h2>
        <div className="scroll"><table className="t">
          <thead><tr><th>Area</th><th>Beginner</th><th>Professional / advanced</th></tr></thead>
          <tbody>{TOOLCHAIN_MATRIX.map(([a, b, c]) => <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}</tbody>
        </table></div>
        <p className="tiny muted">Versions checked {EMBEDDED_RESEARCHED}: Zephyr v4.4.2, ESP-IDF v6.1, FreeRTOS kernel V11.3.1, MCUboot v2.4.0, U-Boot v2026.07, Buildroot 2026.08, Yocto 6.0 &ldquo;Wrynose&rdquo; LTS. Always read the documentation that matches the version you build.</p>
      </section>

      <section className="panel" id="crossover">
        <h2>VLSI + Embedded crossover</h2>
        <p className="small">The workflow this repository is built around: <b>{CROSSOVER_LOOP.join(" → ")}</b>. Start with {topicLink("emb-hwsw-crossover")}, then the flagship <Link href="/projects/fx-soc-peripheral">custom peripheral from SystemRDL and RTL to driver</Link>.</p>
        <div className="grid2">
          <div><h3>From the VLSI road into embedded</h3><ul className="list small">{VLSI_TO_EMBEDDED.map((x) => <li key={x.topic}>{topicLink(x.topic)}: {x.why}</li>)}</ul></div>
          <div><h3>From the Embedded road into VLSI</h3><ul className="list small">{EMBEDDED_TO_VLSI.map((x) => <li key={x.topic}>{topicLink(x.topic)}: {x.why}</li>)}</ul></div>
        </div>
        <h3>Crossover project template</h3>
        <p className="small">{CROSSOVER_TEMPLATE.join(" → ")}</p>
        <h3>Further crossover ideas</h3>
        <p className="small">{CROSSOVER_IDEAS.join(" · ")}</p>
      </section>

      <section className="panel" id="read-code">
        <h2>Read real code</h2>
        <div className="scroll"><table className="t">
          <thead><tr><th>Project</th><th>Read</th><th>Identify</th></tr></thead>
          <tbody>{READ_REAL_CODE.map((r) => { const res = RESOURCE_MAP[r.res]; return <tr key={r.project}><td>{res?.url ? <ExtLink href={res.url}>{r.project}</ExtLink> : r.project}</td><td className="small">{r.read}</td><td className="small">{r.identify.join(", ")}</td></tr>; })}</tbody>
        </table></div>
        <p className="small"><Link href="/open-source">Open source</Link> lists the exact files, licences and an exercise for each repository.</p>
      </section>

      <section className="panel" id="training">
        <h2>Training and certifications</h2>
        <p className="small muted">No certificate replaces projects with measurements and tests. Items marked unverified were not confirmed in this research pass.</p>
        <div className="scroll"><table className="t">
          <thead><tr><th>Option</th><th>Provider</th><th>Cost</th><th>Verdict</th></tr></thead>
          <tbody>{TRAINING.map((t) => <tr key={t.name}><td>{t.name} {!t.verified && <span className="badge warn">Unverified</span>}</td><td>{t.provider}</td><td className="small">{t.cost}</td><td className="small">{t.verdict}</td></tr>)}</tbody>
        </table></div>
      </section>

      <section className="panel" id="jobs">
        <h2>What postings ask for ({EMBEDDED_RESEARCHED})</h2>
        <ul className="list small">{JOB_PATTERNS.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="tiny muted">Sources: {JOB_SOURCES.map((j, i) => <span key={j.url}>{i ? " · " : ""}<ExtLink href={j.url}>{j.label}</ExtLink></span>)}. Numericals and question banks: <Link href="/interview">Interview</Link> (Embedded firmware, RTOS, Embedded Linux) and <Link href="/practice">Practice</Link>.</p>
      </section>

      <section className="panel" id="sources">
        <h2>Source videos: what was taken from them</h2>
        {VIDEO_NOTES.map((v) => { const res = RESOURCE_MAP[v.res]; return (
          <div key={v.res} style={{ marginBottom: 12 }}>
            <h3 style={{ marginBottom: 4 }}>{res?.url ? <ExtLink href={res.url}>{v.title}</ExtLink> : v.title}</h3>
            <ul className="list small">{v.took.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="small"><span className="muted">Not verified: </span>{v.notVerified}</p>
            <p className="small"><span className="muted">How this road goes further: </span>{v.extended}</p>
          </div>
        ); })}
      </section>

      <section className="panel">
        <h2>How to use resources and keep what you learn</h2>
        <p className="small">Each topic lists at most a few resources: one primary, one practical, one reference, and optionally one advanced. Completed topics come back for revision after 1, 3, 7, 21, 45 and 90 days like every VLSI topic, and each phase has a mastery test (above) plus interview questions on the topic page.</p>
      </section>

      <Dialog open={!!test} onClose={() => { setTest(null); history.replaceState(null, "", "/embedded"); }} title={test && MASTERY_MAP[test] ? MASTERY_MAP[test].title : "Mastery test"}>
        {test && MASTERY_MAP[test] && <MasteryRunner test={MASTERY_MAP[test]} />}
      </Dialog>
    </div>
  );
}
