"use client";
import Link from "next/link";
import { useState } from "react";
import { FLAGSHIPS } from "@/content/flagship";
import { LEARNING_PROJECTS } from "@/content/projects";
import { EVIDENCE_KINDS, PROOF_STAGES, SHOWCASE_ITEMS } from "@/content/careerkit";
import { actions, useHydrated, useStore } from "@/lib/store";
import { projectDone } from "@/lib/derive";
import { ExtLink, Loading, PageHead } from "@/components/ui";

export default function PortfolioPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [kind, setKind] = useState(EVIDENCE_KINDS[2].id);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  if (!hydrated) return <Loading />;
  const started = FLAGSHIPS.filter((f) => s.projects[f.id]);
  const finished = FLAGSHIPS.filter((f) => s.projects[f.id]?.finished);
  const supporting = LEARNING_PROJECTS.filter((p) => p.tier === "mini" && projectDone(s, p.id));
  const count = (k: string) => s.evidence.filter((e) => e.kind === k).length + (k === "project" ? finished.length + supporting.length : 0) + (k === "research" ? Object.values(s.papers).filter((x) => x === "reproduced" || x === "extended").length : 0);
  return (
    <div className="page">
      <PageHead title="Portfolio">Your proof-of-work dashboard. Target: 8-12 polished items (3-5 supporting projects, 3-5 flagships, 1-3 research or open-source pieces). A portfolio is only as strong as what someone can open, run and read.</PageHead>
      <div className="stats panel">
        <div className="stat"><b>{finished.length}</b><span>flagships finished</span></div><div className="stat"><b>{started.length - finished.length}</b><span>flagships in progress</span></div>
        <div className="stat"><b>{supporting.length}</b><span>supporting projects</span></div><div className="stat"><b>{s.evidence.length}</b><span>other evidence items</span></div>
      </div>
      <section className="panel"><h2>Flagship evidence</h2>
        {started.length ? (
          <div className="scroll"><table className="t">
            <thead><tr><th>Project</th>{PROOF_STAGES.map((p) => <th key={p.id} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: ".72rem" }}>{p.label}</th>)}<th>Showcase</th><th>Links</th></tr></thead>
            <tbody>{started.map((f) => { const ps = s.projects[f.id]; return (
              <tr key={f.id}><td><Link href={`/projects/${f.id}#proof`}>{f.title}</Link>{ps.finished && <div><span className="badge ok">Finished</span></div>}</td>
                {PROOF_STAGES.map((p) => <td key={p.id} aria-label={`${p.label}: ${ps.proof[p.id] ? "done" : "not done"}`}>{ps.proof[p.id] ? "✓" : ""}</td>)}
                <td className="small">{SHOWCASE_ITEMS.filter((x) => ps.show[x.id]).length}/{SHOWCASE_ITEMS.length}</td>
                <td className="small">{ps.links.repo ? <ExtLink href={ps.links.repo}>Repo</ExtLink> : <span className="muted">no repo</span>}</td></tr>); })}
            </tbody>
          </table></div>
        ) : <p className="small muted">Start a flagship on the <Link href="/projects">Projects</Link> page; its proof-of-work stages appear here.</p>}
      </section>
      <div className="grid2">
        <section className="panel"><h2>Evidence map</h2><p className="small muted">Employers weigh several kinds of evidence. Aim for strength in projects, GitHub, interviews and at least one of research, open source or silicon.</p>
          <table className="t"><tbody>{EVIDENCE_KINDS.map((k) => <tr key={k.id}><td>{k.label}</td><td>{count(k.id) ? <span className="badge ok">{count(k.id)}</span> : <span className="muted small">none yet</span>}</td></tr>)}</tbody></table>
        </section>
        <section className="panel"><h2>Add evidence</h2>
          <div className="field"><label htmlFor="ek">Kind</label><select id="ek" value={kind} onChange={(e) => setKind(e.target.value)}>{EVIDENCE_KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></div>
          <div className="field"><label htmlFor="et">Title</label><input id="et" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Merged cocotb docs PR" /></div>
          <div className="field"><label htmlFor="eu">Link (optional)</label><input id="eu" type="url" value={url} onChange={(e) => setUrl(e.target.value)} /></div>
          <button className="btn primary" disabled={!title.trim()} onClick={() => { actions.addEvidence({ kind, title: title.trim(), url: url.trim() || undefined }); setTitle(""); setUrl(""); }}>Add</button>
          {s.evidence.length > 0 && <ul className="clean" style={{ marginTop: 12 }}>{s.evidence.slice().reverse().map((e) => <li key={e.id} className="check"><div style={{ flex: 1 }}><span className="t">{e.url ? <ExtLink href={e.url}>{e.title}</ExtLink> : e.title}</span><div className="d">{EVIDENCE_KINDS.find((k) => k.id === e.kind)?.label}, {e.d}</div></div><button className="btn sm ghost" onClick={() => actions.removeEvidence(e.id)} aria-label={`Remove ${e.title}`}>Remove</button></li>)}</ul>}
        </section>
      </div>
    </div>
  );
}
