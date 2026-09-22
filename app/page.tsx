"use client";
import Link from "next/link";
import { PHASES, TARGET_LABELS } from "@/content/phases";
import { ROLE_GUIDE_MAP } from "@/content/roles-guide";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { LEARNING_MAP } from "@/content/projects";
import { CAREER_MAP } from "@/content/careers";
import { actions, useHydrated, useStore, type Intensity } from "@/lib/store";
import { PLAN, PLAN_LENGTH, buildTasks, dayTopic, DAY_KIND_LABEL, REVISION_CAP } from "@/lib/plan";
import { activityByDay, dueRevisions, overallProgress, phaseProgress, projectPct, streaks, evaluate } from "@/lib/derive";
import { ENTRY_ROLES } from "@/content/jobs";
import { greeting } from "@/lib/dates";
import { Bar, Icon, Loading, Seg, DEPTH_LABEL, PRIORITY_LABEL } from "@/components/ui";
import { Heatmap, RevisionCard, WeekWave } from "@/components/learning";

function Onboarding() {
  const s = useStore();
  return (
    <div className="page narrow">
      <h1>Welcome to Signoff</h1>
      <p className="lead">A daily VLSI training system: one mission a day, spaced revision, projects that become evidence, and an honest view of job readiness. In chip design, signoff is the final check that everything is proven before tapeout. This app is built around proving what you can do.</p>
      <div className="panel">
        <div className="field"><label htmlFor="nm">Your name</label><input id="nm" type="text" value={s.settings.name} onChange={(e) => actions.settings({ name: e.target.value })} /></div>
        <div className="field"><span className="label">Daily intensity (changes workload, never the order)</span>
          <Seg<Intensity> label="Intensity" value={s.settings.intensity} onChange={(v) => actions.settings({ intensity: v })} options={[{ id: "light", label: "Light, about 1 h" }, { id: "standard", label: "Standard, 2-3 h" }, { id: "intensive", label: "Intensive, 4 h+" }]} />
        </div>
        <div className="field"><label htmlFor="tg">Primary target (you can change it; the specialization gate comes later)</label>
          <select id="tg" value={s.settings.target} onChange={(e) => actions.settings({ target: e.target.value as typeof s.settings.target })}>
            {Object.entries(TARGET_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          {ROLE_GUIDE_MAP[s.settings.target] && (
            <div className="callout small" style={{ marginTop: 8 }}>
              <b>{ROLE_GUIDE_MAP[s.settings.target].oneLine}</b>
              <p style={{ margin: "6px 0 0" }}>{ROLE_GUIDE_MAP[s.settings.target].whatItIs.split(". ").slice(0, 2).join(". ")}.</p>
              <p style={{ margin: "6px 0 0" }}><span className="muted">Realistic for you? </span>{ROLE_GUIDE_MAP[s.settings.target].entryRealism.split(". ").slice(0, 2).join(". ")}.</p>
            </div>
          )}
          <span className="tiny muted">Not sure what these mean? <Link href="/roles">Read what each role actually is</Link>, who needs it, what it pays and how to reach the top of the range. You do not need to decide well now: everyone learns the same core first.</span>
        </div>
        <button className="btn primary" onClick={() => actions.startPlan()}>Start day 1</button>
        <p className="tiny muted" style={{ marginTop: 10 }}>Progress is stored only in this browser. Export it from Settings to back it up or move devices.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const hydrated = useHydrated();
  const s = useStore();
  if (!hydrated) return <Loading />;
  if (!s.settings.startDate) return <Onboarding />;

  const d = PLAN[Math.min(s.plan.current, PLAN_LENGTH) - 1];
  const phase = PHASES.find((p) => p.id === d.phase)!;
  const { topic, part, parts, note } = dayTopic(d, s);
  const due = dueRevisions(s);
  const tasks = buildTasks(d, s, due.length);
  const doneTasks = tasks.filter((t) => s.plan.tasks[d.day]?.[t.key]).length;
  const finishedToday = !!s.plan.done[d.day];
  const prog = overallProgress(s);
  const pp = phaseProgress(s, phase.id);
  const st = streaks(s);
  const next = PLAN.slice(d.day).find((x) => x.kind === "learn" || x.kind === "slot");
  const nextTopic = next ? dayTopic(next, s).topic : undefined;
  const activeId = s.active || d.projectId;
  const active = activeId ? FLAGSHIP_MAP[activeId] || LEARNING_MAP[activeId] : undefined;
  const flagshipsInProgress = Object.keys(s.projects).filter((id) => FLAGSHIP_MAP[id] && !s.projects[id].finished).slice(0, 2);
  const roles = ENTRY_ROLES.filter((r) => r.targets.includes(s.settings.target));
  const role = roles[0] || ENTRY_ROLES[0];
  const met = role.reqs.filter((r) => evaluate(r.check, s).met).length;
  const career = CAREER_MAP[s.settings.target];
  const missionTitle = topic ? topic.title : d.kind === "consolidate" ? "Consolidate the week" : d.kind === "milestone" ? "Monthly milestone" : d.kind === "project" ? "Build: project milestone" : note || "Specialization project work";
  const minutes = tasks.filter((t) => !t.optional).reduce((a, t) => a + t.minutes, 0);

  return (
    <div className="page">
      <section className="hero" aria-labelledby="mission">
        <div className="hero-top">
          <div style={{ flex: "1 1 380px" }}>
            <div className="dayline">{greeting()}, {s.settings.name || "there"}. Day {d.day} / {PLAN_LENGTH}, week {d.week}, {DAY_KIND_LABEL[d.kind].toLowerCase()}</div>
            <h1 className="mission" id="mission">{missionTitle}{topic && parts > 1 ? ` (part ${part} of ${parts})` : ""}</h1>
            <div className="row small" style={{ marginBottom: 12 }}>
              <span>Phase {phase.num}: {phase.short}</span>
              {topic && <span className={`badge ${topic.priority}`}>{PRIORITY_LABEL[topic.priority]}</span>}
              {topic && <span className="badge plain">Target depth: {DEPTH_LABEL[topic.depth]}</span>}
              <span className="badge plain">About {Math.round(minutes / 15) * 15} min</span>
            </div>
            <div className="row">
              <Link className="btn primary" href="/today">Start today's plan</Link>
              {topic && <Link className="btn" href={`/topics/${topic.id}`}>Open the topic</Link>}
            </div>
          </div>
          <div style={{ flex: "1 1 280px", maxWidth: 380 }}>
            <WeekWave s={s} current={d.day} />
            <div className="stats" style={{ marginTop: 6 }}>
              <div className="stat"><b>{st.current}</b><span>day streak</span></div>
              <div className="stat"><b>{Math.round(prog.pct * 100)}%</b><span>road complete</span></div>
              <div className="stat"><b>{due.length}</b><span>revisions due</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" aria-labelledby="plan-h">
        <div className="panel-head"><h2 id="plan-h">Today's tasks</h2><span className="small muted">{doneTasks}/{tasks.length} done, about {Math.round(minutes / 15) * 15} min</span></div>
        <Bar value={tasks.length ? doneTasks / tasks.length : 0} label="Today's tasks complete" />
        <ul className="clean" style={{ marginTop: 10 }}>
          {tasks.map((t) => {
            const on = !!s.plan.tasks[d.day]?.[t.key];
            return (
              <li key={t.key} className={`check${on ? " done" : ""}`}>
                <input type="checkbox" id={`h-${t.key}`} checked={on} onChange={() => actions.toggleTask(d.day, t.key, t.label)} />
                <div style={{ flex: 1 }}>
                  <label htmlFor={`h-${t.key}`}><span className="t">{t.label}</span> <span className="tiny muted">{t.minutes} min{t.optional ? ", optional" : ""}</span></label>
                  <div className="d">{t.detail}</div>
                  {t.href && (t.external
                    ? <a className="tiny" href={t.href} target="_blank" rel="noreferrer">Open resource</a>
                    : <Link className="tiny" href={t.href}>Open</Link>)}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="row" style={{ marginTop: 10 }}>
          <Link className="btn primary" href="/today">Open the full day</Link>
          {finishedToday
            ? <span className="small muted">Day {d.day} finished on {s.plan.done[d.day]}.</span>
            : <span className="small muted">Finish the day from the Today page when you are done.</span>}
        </div>
      </section>

      <section className="panel" aria-labelledby="answers-h">
        <h2 id="answers-h" style={{ fontSize: "1rem" }}>Why today looks like this</h2>
        <dl className="answers">

          <div><dt>What to learn today</dt><dd>{missionTitle}</dd></div>
          <div><dt>Why</dt><dd>{topic ? topic.why : d.kind === "consolidate" ? "Spaced review and practice turn exposure into memory." : "Building is where understanding becomes evidence."}</dd></div>
          <div><dt>How deep</dt><dd>{topic ? `${DEPTH_LABEL[topic.depth]}. ${topic.priority === "must" ? "Critical path topic." : PRIORITY_LABEL[topic.priority] + "."}` : "Finish the milestone to a documented, reproducible state."}</dd></div>
          <div><dt>Practice</dt><dd>{tasks.find((t) => t.kind === "practice" || t.kind === "code")?.detail || "See today's tasks."}</dd></div>
          <div><dt>Build</dt><dd>{active ? <Link href={`/projects/${activeId}`}>{active.title}</Link> : "Pick a project on the Projects page."}</dd></div>
          <div><dt>Revise</dt><dd>{due.length ? `${due.length} topic${due.length > 1 ? "s" : ""} due` : "Nothing due today."}</dd></div>
          <div><dt>Real job link</dt><dd>{topic ? topic.inChip : career ? career.does : "See Career paths."}</dd></div>
          <div><dt>Job ready?</dt><dd><Link href="/job-readiness">{role.title}: {met}/{role.reqs.length} evidence checks met</Link></dd></div>
        
        </dl>
      </section>

      <div className="layout-main">
        <div>

          <section className="panel anchor" id="revision" aria-labelledby="rev-h">
            <div className="panel-head"><h2 id="rev-h">Revision due</h2><span className="small muted">{due.length}</span></div>
            {due.length === 0 ? <p className="muted small">Nothing to revise. Completed topics return after 1, 3, 7, 21, 45 and 90 days.</p> : (
              <ul className="clean">{due.slice(0, REVISION_CAP[s.settings.intensity]).map((id) => <li key={id}><RevisionCard id={id} /></li>)}</ul>
            )}
            {due.length > REVISION_CAP[s.settings.intensity] && <p className="tiny muted">{due.length - REVISION_CAP[s.settings.intensity]} more will appear as you clear these.</p>}
          </section>
        </div>

        <aside>
          <section className="panel">
            <h3>Current project</h3>
            {active ? (
              <>
                <Link href={`/projects/${activeId}`} className="t">{active.title}</Link>
                <div style={{ margin: "8px 0 4px" }}><Bar value={projectPct(s, activeId!)} label="Project progress" /></div>
                <p className="tiny muted">{Math.round(projectPct(s, activeId!) * 100)}% of milestones</p>
              </>
            ) : <p className="small muted">No active project yet. <Link href="/projects">Choose one</Link>.</p>}
            {flagshipsInProgress.filter((f) => f !== activeId).map((f) => (
              <div key={f} style={{ marginTop: 10 }}><div className="small">{FLAGSHIP_MAP[f].title}</div><Bar thin value={projectPct(s, f)} label="Flagship progress" /></div>
            ))}
          </section>
          <section className="panel">
            <h3>Next up</h3>
            {nextTopic ? <Link href={`/topics/${nextTopic.id}`}>{nextTopic.title}</Link> : <span className="muted small">You are at the end of the road.</span>}
            <hr />
            <div className="small">Phase {phase.num} progress</div>
            <Bar value={pp.pct} label={`Phase ${phase.num} progress`} />
            <p className="tiny muted" style={{ marginTop: 4 }}>{pp.done}/{pp.total} topics. Stage goal: {phase.stage}</p>
          </section>
          <section className="panel">
            <div className="panel-head"><h3>Last 26 weeks</h3><Link href="/history" className="tiny">History</Link></div>
            <Heatmap counts={activityByDay(s)} />
            <p className="tiny muted" style={{ marginTop: 8 }}>Longest streak {st.longest} days, {st.activeDays} active days. Streaks count real work, not clicks: a completed topic, revision, project milestone, interview or practice attempt, research, or at least two plan tasks.</p>
          </section>
          <Link href="/settings" className="small row" style={{ gap: 6 }}><Icon name="gear" size={15} /> Intensity: {s.settings.intensity}, target: {TARGET_LABELS[s.settings.target]}</Link>
        </aside>
      </div>
    </div>
  );
}
