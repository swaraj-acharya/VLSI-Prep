"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TARGET_LABELS } from "@/content/phases";
import { actions, STORAGE_KEY, SCHEMA_VERSION, useHydrated, useStore, type Intensity } from "@/lib/store";
import { PLAN_LENGTH } from "@/lib/plan";
import { RULES } from "@/lib/revision";
import { Loading, PageHead, Seg } from "@/components/ui";
import { SignOut } from "@/components/AppShell";
import { getToken, setToken, syncProgress, testConnection, TOKEN_KEY } from "@/lib/github";

export default function SettingsPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [msg, setMsg] = useState("");
  const [confirm, setConfirm] = useState("");
  const [jump, setJump] = useState("");
  const [token, setTok] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { setTok(getToken()); }, []);
  const fileRef = useRef<HTMLInputElement>(null);
  if (!hydrated) return <Loading />;

  const doExport = () => {
    const blob = new Blob([actions.exportJSON()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `signoff-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg("Exported. Keep the file somewhere safe.");
  };
  const doImport = async (f: File) => {
    const r = actions.importJSON(await f.text());
    setMsg(r.message);
  };

  return (
    <div className="page narrow">
      <PageHead title="Settings">Everything is stored in this browser under the key <code>{STORAGE_KEY}</code> (schema v{SCHEMA_VERSION}). Access is protected by the sign-in page; your progress itself never leaves this browser unless you use GitHub sync.</PageHead>
      <p className="sr-only" aria-live="polite">{msg}</p>
      {msg && <div className="callout small">{msg}</div>}

      <section className="panel"><h2>Profile and plan</h2>
        <div className="field"><label htmlFor="nm">Name</label><input id="nm" type="text" value={s.settings.name} onChange={(e) => actions.settings({ name: e.target.value })} /></div>
        <div className="field"><span className="label">Daily intensity</span>
          <Seg<Intensity> label="Intensity" value={s.settings.intensity} onChange={(v) => actions.settings({ intensity: v })} options={[{ id: "light", label: "Light" }, { id: "standard", label: "Standard" }, { id: "intensive", label: "Intensive" }]} />
          <span className="tiny muted">Light: core learning, one practice, revision. Standard: adds explanation, interview and debugging. Intensive: adds stretch work, project time and deeper practice. The curriculum order never changes.</span>
        </div>
        <div className="field"><label htmlFor="tg">Target role</label><select id="tg" value={s.settings.target} onChange={(e) => actions.settings({ target: e.target.value as typeof s.settings.target })}>{Object.entries(TARGET_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><span className="tiny muted">Unsure? <Link href="/roles">Compare the roles</Link>: what each one is, who hires for it, what it pays, and the route to senior and international work.</span></div>
        <div className="field"><span className="label">Mode</span>
          <Seg label="Mode" value={s.settings.mode} onChange={(v) => actions.settings({ mode: v })} options={[{ id: "learn", label: "Learning mode" }, { id: "research", label: "Research mode" }]} />
          <span className="tiny muted">Research mode shows research-level topics on the roadmap and paper links on topic pages.</span>
        </div>
        <div className="field"><label htmlFor="jd">Plan position (currently day {s.plan.current} of {PLAN_LENGTH})</label>
          <div className="row"><input id="jd" type="number" min={1} max={PLAN_LENGTH} value={jump} onChange={(e) => setJump(e.target.value)} style={{ maxWidth: 140 }} placeholder="Day" />
            <button className="btn sm" disabled={!jump} onClick={() => { const n = Math.max(1, Math.min(PLAN_LENGTH, Number(jump))); actions.goToDay(n); setMsg(`Moved to plan day ${n}.`); setJump(""); }}>Go to day</button></div>
          <span className="tiny muted">Useful if you already know early material. Completed topics and history are kept.</span>
        </div>
      </section>

      <section className="panel"><h2>Appearance</h2>
        <Seg label="Theme" value={s.settings.theme} onChange={(v) => actions.settings({ theme: v })} options={[{ id: "system", label: "System" }, { id: "light", label: "Light" }, { id: "dark", label: "Dark" }]} />
      </section>


      <section className="panel anchor" id="github"><h2>GitHub sync (optional)</h2>
        <p className="small muted">Pushes your day log to a repository as <code>{s.github.path}/README.md</code> and <code>{s.github.path}/progress.json</code>, so your learning record sits next to your projects. Everything still works without this.</p>
        <div className="grid2">
          <div className="field"><label htmlFor="gho">Repository owner (your GitHub username)</label><input id="gho" type="text" value={s.github.owner} placeholder="swaraj-acharya" onChange={(e) => actions.setGitHub({ owner: e.target.value.trim() })} /></div>
          <div className="field"><label htmlFor="ghr">Repository name</label><input id="ghr" type="text" value={s.github.repo} placeholder="signoff-vlsi" onChange={(e) => actions.setGitHub({ repo: e.target.value.trim() })} /></div>
          <div className="field"><label htmlFor="ghb">Branch</label><input id="ghb" type="text" value={s.github.branch} onChange={(e) => actions.setGitHub({ branch: e.target.value.trim() || "main" })} /></div>
          <div className="field"><label htmlFor="ghp">Folder in the repository</label><input id="ghp" type="text" value={s.github.path} onChange={(e) => actions.setGitHub({ path: e.target.value.trim() || "progress" })} /></div>
        </div>
        <div className="field"><label htmlFor="ght">Personal access token</label>
          <input id="ght" type="password" value={token} placeholder="github_pat_..." autoComplete="off" onChange={(e) => { setTok(e.target.value.trim()); setToken(e.target.value.trim()); }} />
          <span className="tiny muted">Create a <b>fine-grained</b> token at github.com/settings/personal-access-tokens, give it access to only this one repository, and set Repository permissions &rarr; Contents to <b>Read and write</b>. Nothing else is needed.</span>
        </div>
        <div className="callout warn small">
          The token is stored in this browser only, under its own key (<code>{TOKEN_KEY}</code>), and is never included in a progress export. Anything running in this browser, including extensions, can read it, so use a fine-grained token limited to one repository, give it an expiry date, and revoke it on GitHub if you stop using this app. If the repository is public, everything pushed is public too.
        </div>
        <label className="row small"><input type="checkbox" checked={s.github.autoSync} onChange={(e) => actions.setGitHub({ autoSync: e.target.checked })} /> Push automatically when I finish a day</label>
        <label className="row small" style={{ marginTop: 6 }}><input type="checkbox" checked={s.github.includeNotes} onChange={(e) => actions.setGitHub({ includeNotes: e.target.checked })} /> Include my private notes and daily reflections in progress.json</label>
        {s.github.includeNotes && <p className="tiny callout warn">Your notes and reflections will be committed to the repository. Leave this off if the repository is public.</p>}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" disabled={busy} onClick={async () => { setBusy(true); setMsg("Checking..."); const r = await testConnection(s.github, getToken()); setMsg(r.message); setBusy(false); }}>Test connection</button>
          <button className="btn primary" disabled={busy} onClick={async () => { setBusy(true); setMsg("Pushing..."); const r = await syncProgress(s, s.github, getToken()); actions.setGitHub({ lastSync: r.ok ? new Date().toISOString() : s.github.lastSync, lastStatus: r.message }); setMsg(r.message); setBusy(false); }}>Push progress now</button>
          <button className="btn danger" onClick={() => { setToken(""); setTok(""); setMsg("Token removed from this browser."); }}>Remove token</button>
        </div>
        {s.github.lastStatus && <p className="tiny muted" style={{ marginTop: 8 }}>Last result: {s.github.lastStatus}</p>}
      </section>

      <section className="panel"><h2>Sign-in</h2>
        <p className="small muted">This site is protected by an id and password set on the host (<code>AUTH_ID</code>, <code>AUTH_PASSWORD</code>). A sign-in lasts 7 days on each browser. Changing the password on the host signs every browser out.</p>
        <SignOut className="btn" />
      </section>

      <section className="panel"><h2>Revision rules</h2><ul className="list small">{RULES.map((r) => <li key={r}>{r}</li>)}</ul></section>

      <section className="panel"><h2>Backup and move devices</h2>
        <p className="small muted">Export regularly: clearing browser data deletes local progress. Import replaces the current progress on this device.</p>
        <div className="row">
          <button className="btn primary" onClick={doExport}>Export progress (JSON)</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import progress</button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" aria-label="Choose progress file" onChange={(e) => { const f = e.target.files?.[0]; if (f) doImport(f); e.target.value = ""; }} />
        </div>
      </section>

      <section className="panel" style={{ borderColor: "var(--red)" }}><h2>Reset</h2>
        <p className="small">Deletes all progress on this device. Export first if you might want it back.</p>
        <div className="field" style={{ maxWidth: 320 }}><label htmlFor="cf">Type RESET to confirm</label><input id="cf" type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
        <button className="btn danger" disabled={confirm !== "RESET"} onClick={() => { actions.reset(); setConfirm(""); setMsg("All progress was reset."); }}>Reset all progress</button>
      </section>
    </div>
  );
}
