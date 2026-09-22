"use client";
import Link from "next/link";
import { useState } from "react";
import { PHASES } from "@/content/phases";
import { actions, useHydrated, useStore } from "@/lib/store";
import { PLAN, PLAN_LENGTH, dayTopic, DAY_KIND_LABEL } from "@/lib/plan";
import { buildProgressMarkdown, getToken, syncProgress } from "@/lib/github";
import { streaks } from "@/lib/derive";
import { CopyButton, Loading, PageHead, Seg } from "@/components/ui";

export default function ProgressPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [filter, setFilter] = useState<"upto" | "all" | "done">("upto");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(false);
  if (!hydrated) return <Loading />;

  const cur = Math.min(s.plan.current, PLAN_LENGTH);
  const st = streaks(s);
  const finishedCount = Object.keys(s.plan.done).length;
  const rows = PLAN.filter((d) => (filter === "all" ? true : filter === "done" ? !!s.plan.done[d.day] : d.day <= cur || s.plan.done[d.day]));
  const configured = !!(s.github.owner && s.github.repo);

  const sync = async () => {
    setBusy(true); setMsg("Pushing to GitHub...");
    const r = await syncProgress(s, s.github, getToken());
    actions.setGitHub({ lastSync: r.ok ? new Date().toISOString() : s.github.lastSync, lastStatus: r.message });
    setMsg(r.message); setBusy(false);
  };

  const download = () => {
    const blob = new Blob([buildProgressMarkdown(s)], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "progress.md"; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div className="page">
      <PageHead title="Day log">Every day of the plan and what happened on it. The same record can be pushed to a GitHub repository as <code>progress/README.md</code> and <code>progress/progress.json</code>, so your learning history lives in public alongside your projects.</PageHead>

      <div className="stats panel">
        <div className="stat"><b>{cur}</b><span>current day of {PLAN_LENGTH}</span></div>
        <div className="stat"><b>{finishedCount}</b><span>days finished</span></div>
        <div className="stat"><b>{st.current}</b><span>day streak</span></div>
        <div className="stat"><b>{Object.values(s.topics).filter((t) => t.status === "done").length}</b><span>topics done</span></div>
      </div>

      <section className="panel" aria-labelledby="sync-h">
        <div className="panel-head"><h2 id="sync-h">GitHub sync</h2>{s.github.lastSync && <span className="tiny muted">Last push {new Date(s.github.lastSync).toLocaleString()}</span>}</div>
        {configured ? (
          <>
            <p className="small">Target: <code>{s.github.owner}/{s.github.repo}</code>, branch <code>{s.github.branch}</code>, folder <code>{s.github.path}/</code>. Auto-push when you finish a day is {s.github.autoSync ? "on" : "off"}.</p>
            <div className="row">
              <button className="btn primary" disabled={busy} onClick={sync}>{busy ? "Pushing..." : "Push progress now"}</button>
              <button className="btn" onClick={download}>Download progress.md</button>
              <button className="btn ghost" onClick={() => setPreview(!preview)} aria-expanded={preview}>{preview ? "Hide" : "Preview"} the file</button>
              <Link className="btn ghost" href="/settings#github">Change settings</Link>
            </div>
          </>
        ) : (
          <>
            <p className="small">Not set up yet. Add a repository and a personal access token in Settings, and every finished day can be committed automatically.</p>
            <div className="row"><Link className="btn primary" href="/settings#github">Set up GitHub sync</Link><button className="btn" onClick={download}>Download progress.md</button></div>
          </>
        )}
        {msg && <p className="small callout" aria-live="polite" style={{ marginTop: 10 }}>{msg}</p>}
        {preview && (
          <div style={{ marginTop: 10 }}>
            <CopyButton text={buildProgressMarkdown(s)} label="Copy markdown" />
            <pre style={{ maxHeight: 360, overflow: "auto", marginTop: 8 }}>{buildProgressMarkdown(s)}</pre>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="days-h">
        <div className="panel-head"><h2 id="days-h">Days</h2>
          <Seg label="Which days to show" value={filter} onChange={setFilter} options={[{ id: "upto", label: "Up to today" }, { id: "done", label: "Finished only" }, { id: "all", label: "All days" }]} />
        </div>
        <div className="scroll">
          <table className="t">
            <thead><tr><th>Day</th><th>Week</th><th>Kind</th><th>Topic or focus</th><th>Phase</th><th>Tasks</th><th>Status</th></tr></thead>
            <tbody>
              {rows.slice(0, 400).map((d) => {
                const done = s.plan.done[d.day];
                const { topic } = dayTopic(d, s);
                const tasks = Object.values(s.plan.tasks[d.day] || {}).filter(Boolean).length;
                const phase = PHASES.find((p) => p.id === d.phase)!;
                return (
                  <tr key={d.day}>
                    <td>{d.day}</td><td>{d.week}</td><td className="small">{DAY_KIND_LABEL[d.kind]}</td>
                    <td>{topic ? <Link href={`/topics/${topic.id}`}>{topic.title}</Link> : <span className="muted">{DAY_KIND_LABEL[d.kind]}</span>}</td>
                    <td className="tiny">{phase.num}. {phase.short}</td>
                    <td className="tiny">{tasks || "-"}</td>
                    <td>{done ? <span className="badge ok">finished {done}</span> : d.day === cur ? <span className="badge warn">in progress</span> : d.day < cur ? <span className="badge plain">skipped ahead</span> : <span className="tiny muted">upcoming</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {rows.length > 400 && <p className="tiny muted">Showing the first 400 rows.</p>}
      </section>
    </div>
  );
}
