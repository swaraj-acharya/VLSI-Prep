"use client";
import Link from "next/link";
import { useState } from "react";
import { PHASES } from "@/content/phases";
import { FLAGSHIP_MAP } from "@/content/flagship";
import { LEARNING_MAP } from "@/content/projects";
import { MILESTONES } from "@/content/mastery";
import { actions, getState, useHydrated, useStore, type Reflection } from "@/lib/store";
import { PLAN, PLAN_LENGTH, buildTasks, dayTopic, DAY_KIND_LABEL, REVISION_CAP } from "@/lib/plan";
import { dueRevisions, gateStatus, projectPct } from "@/lib/derive";
import { diffDays, today } from "@/lib/dates";
import { Bar, Icon, Loading, PageHead, PromptButton } from "@/components/ui";
import { getToken, syncProgress } from "@/lib/github";
import { RevisionCard } from "@/components/learning";
import { topicPrompt } from "@/lib/prompts";

function ReflectionBox() {
  const s = useStore();
  const d = today();
  const r = s.reflections[d] || {};
  const [draft, setDraft] = useState<Reflection>(r);
  const fields: [keyof Reflection, string][] = [["understood", "What did I understand?"], ["confused", "What confused me?"], ["built", "What did I build?"], ["revisit", "What should I revisit?"]];
  return (
    <section className="panel anchor" id="reflection" aria-labelledby="refl-h">
      <h2 id="refl-h">Daily reflection <span className="tiny muted">optional, two minutes</span></h2>
      <div className="grid2">
        {fields.map(([k, label]) => (
          <div className="field" key={k}>
            <label htmlFor={`r-${k}`}>{label}</label>
            <textarea id={`r-${k}`} style={{ minHeight: 64 }} value={draft[k] || ""} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} onBlur={() => actions.setReflection(d, draft)} />
          </div>
        ))}
      </div>
      <p className="tiny muted">Saves when you leave a box. Past reflections appear in History.</p>
    </section>
  );
}

export default function TodayPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [viewDay, setViewDay] = useState<number | null>(null);
  const [syncMsg, setSyncMsg] = useState("");
  if (!hydrated) return <Loading />;
  if (!s.settings.startDate) {
    return <div className="page narrow"><PageHead title="Today">Start your plan from the Home page first.</PageHead><Link className="btn primary" href="/">Go to Home</Link></div>;
  }
  const current = Math.min(s.plan.current, PLAN_LENGTH);
  const dayNum = viewDay ?? current;
  const d = PLAN[dayNum - 1];
  const phase = PHASES.find((p) => p.id === d.phase)!;
  const { topic, part, parts, note } = dayTopic(d, s);
  const due = dueRevisions(s);
  const tasks = buildTasks(d, s, due.length);
  const required = tasks.filter((t) => !t.optional);
  const doneReq = required.filter((t) => s.plan.tasks[d.day]?.[t.key]).length;
  const doneAll = tasks.filter((t) => s.plan.tasks[d.day]?.[t.key]).length;
  const finished = !!s.plan.done[d.day];
  const calendarDay = diffDays(today(), s.settings.startDate) + 1;
  const behind = calendarDay - current;
  const gate = gateStatus(s, d.phase);
  const projId = s.active || d.projectId;
  const proj = projId ? FLAGSHIP_MAP[projId] || LEARNING_MAP[projId] : undefined;
  const nextMs = proj ? proj.milestones.find((m) => !s.projects[projId!]?.ms[m.id]) : undefined;
  const cap = REVISION_CAP[s.settings.intensity];

  return (
    <div className="page">
      <PageHead title={`Day ${d.day}: ${topic ? topic.title : DAY_KIND_LABEL[d.kind]}`} crumbs={<>Week {d.week}, Phase {phase.num} ({phase.short}), {DAY_KIND_LABEL[d.kind].toLowerCase()}{parts > 1 ? `, part ${part} of ${parts}` : ""}</>}>
        {topic ? topic.why : note || (d.kind === "consolidate" ? "Consolidation: revise, test yourself, practise an engineering problem, and catch up." : d.kind === "milestone" ? `Monthly milestone: ${MILESTONES[(d.month || 1) - 1].title}.` : "Build day: move a project forward and document it.")}
      </PageHead>

      <div className="between" style={{ marginBottom: 14 }}>
        <div className="row">
          <button className="btn sm" disabled={dayNum <= 1} onClick={() => setViewDay(dayNum - 1)} aria-label="Previous day">Previous</button>
          <button className="btn sm" disabled={dayNum >= PLAN_LENGTH} onClick={() => setViewDay(dayNum + 1)} aria-label="Next day">Next</button>
          {dayNum !== current && <button className="btn sm" onClick={() => setViewDay(null)}>Back to current day ({current})</button>}
        </div>
        {topic && <PromptButton prompt={topicPrompt(topic, s.settings.name)} title={`Ask AI: ${topic.title}`} />}
      </div>

      {dayNum === current && behind > 2 && (
        <div className="callout info small">
          You are on plan day {current}; it has been {calendarDay} calendar days since you started. That is fine: the plan waits for you and nothing shifts. Options: continue normally, switch to Light intensity for a while in Settings, or use the next consolidation day to catch up.
        </div>
      )}
      {!gate.open && (
        <div className="callout warn small">
          <b>Gate before Phase {phase.num}.</b> {gate.reason}. Take the test on the <Link href={`/roadmap#test-${PHASES[PHASES.findIndex((p) => p.id === d.phase) - 1]?.id}`}>Roadmap</Link>, or <button className="btn sm" onClick={() => actions.overrideGate(d.phase)}>continue anyway</button> (you can always go back to review prerequisites).
        </div>
      )}

      <div className="layout-main">
        <div>
          <section className="panel" aria-labelledby="tasks-h">
            <div className="panel-head"><h2 id="tasks-h">Tasks</h2><span className="small muted">{doneAll}/{tasks.length} done, {doneReq}/{required.length} required</span></div>
            <Bar value={required.length ? doneReq / required.length : 0} label="Required tasks complete" />
            <ul className="clean" style={{ marginTop: 10 }}>
              {tasks.map((t) => {
                const on = !!s.plan.tasks[d.day]?.[t.key];
                return (
                  <li key={t.key} className={`check${on ? " done" : ""}`}>
                    <input type="checkbox" id={`t-${t.key}`} checked={on} onChange={() => actions.toggleTask(d.day, t.key, t.label)} />
                    <div style={{ flex: 1 }}>
                      <label htmlFor={`t-${t.key}`}><span className="t">{t.label}</span> <span className="tiny muted">{t.minutes} min{t.optional ? ", optional" : ""}</span></label>
                      <div className="d">{t.detail}</div>
                      {t.href && (t.external ? <a className="tiny" href={t.href} target="_blank" rel="noreferrer">Open resource <Icon name="ext" size={12} /></a> : <Link className="tiny" href={t.href}>Open</Link>)}
                    </div>
                  </li>
                );
              })}
            </ul>
            {syncMsg && <p className="small callout" aria-live="polite">{syncMsg} <Link href="/progress">Day log</Link></p>}
            <hr />
            {finished ? (
              <p className="small">Finished on {s.plan.done[d.day]}. {dayNum === current - 1 || dayNum < current ? <button className="btn sm" onClick={() => setViewDay(null)}>Go to the current day</button> : null}</p>
            ) : (
              <div className="row">
                <button className="btn primary" disabled={doneReq === 0} onClick={async () => {
                  actions.finishDay(d.day, PLAN_LENGTH);
                  setViewDay(null);
                  const cfg = getState().github;
                  if (cfg.autoSync && cfg.owner && cfg.repo && getToken()) {
                    setSyncMsg("Pushing progress to GitHub...");
                    const r = await syncProgress(getState(), cfg, getToken());
                    actions.setGitHub({ lastSync: r.ok ? new Date().toISOString() : cfg.lastSync, lastStatus: r.message });
                    setSyncMsg(r.ok ? `Progress pushed to ${cfg.owner}/${cfg.repo}.` : `GitHub sync failed: ${r.message}`);
                  }
                }}>
                  {doneReq === required.length ? "Finish day" : "Finish day with what I did"}
                </button>
                {doneReq < required.length && doneReq > 0 && <span className="tiny muted">Unfinished tasks are fine. Revisit them on the consolidation day.</span>}
                {dayNum > current && <span className="tiny muted">This is a future day. Finishing it moves you ahead.</span>}
              </div>
            )}
          </section>

          <section className="panel anchor" id="revision" aria-labelledby="rv-h">
            <div className="panel-head"><h2 id="rv-h">Revision</h2><span className="small muted">{due.length} due</span></div>
            {due.length === 0 ? <p className="small muted">Nothing due. Revisions appear after you complete topics.</p> : <ul className="clean">{due.slice(0, cap).map((id) => <li key={id}><RevisionCard id={id} /></li>)}</ul>}
          </section>

          <ReflectionBox />
        </div>

        <aside>
          {topic && (
            <section className="panel">
              <h3>Today's topic</h3>
              <p className="small">{topic.eli12}</p>
              <p className="small"><span className="muted">In a real chip: </span>{topic.inChip}</p>
              <Link className="btn sm primary" href={`/topics/${topic.id}`}>Open topic</Link>
            </section>
          )}
          <section className="panel">
            <h3>Project</h3>
            {proj ? (
              <>
                <Link href={`/projects/${projId}`}>{proj.title}</Link>
                <div style={{ margin: "8px 0" }}><Bar value={projectPct(s, projId!)} label="Project progress" /></div>
                {nextMs && <p className="small"><span className="muted">Next milestone: </span>{nextMs.title}. {nextMs.detail}</p>}
              </>
            ) : <p className="small muted">Choose a project on the Projects page.</p>}
          </section>
          <section className="panel small">
            <h3>How days work</h3>
            <p>Day numbers are units of study, not calendar dates. Finish two in one day to go faster; take two days for one to go slower. Each week has five learning days, one consolidation day and one project or milestone day.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
