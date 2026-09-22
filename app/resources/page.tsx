"use client";
import { useState } from "react";
import { RESOURCES } from "@/content/resources";
import type { ResourceType } from "@/content/schema";
import { ExtLink, PageHead } from "@/components/ui";

const TYPES: Record<ResourceType, string> = { reading: "Reading", video: "Video", course: "Course", docs: "Documentation", practice: "Practice", tool: "Tool", textbook: "Textbook", paper: "Paper" };

export default function ResourcesPage() {
  const [type, setType] = useState<"all" | ResourceType>("all");
  const [free, setFree] = useState(false);
  const [q, setQ] = useState("");
  const list = RESOURCES.filter((r) => (type === "all" || r.type === type) && (!free || r.free) && (!q || (r.title + r.source).toLowerCase().includes(q.toLowerCase())));
  const unverified = RESOURCES.filter((r) => r.url && !r.verified).length;
  return (
    <div className="page">
      <PageHead title="Resources">Free and high-quality first. The app's own explanations stand alone; these are for going deeper. Links show when they were last checked; {unverified} link{unverified === 1 ? " is" : "s are"} marked unverified. Books are listed without links on purpose.</PageHead>
      <div className="panel row">
        <input type="search" aria-label="Filter resources" placeholder="Filter by title or source" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
        <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as "all" | ResourceType)} style={{ width: "auto" }}><option value="all">All types</option>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <label className="row small"><input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} /> Free only</label>
      </div>
      <section className="panel">
        <div className="scroll"><table className="t">
          <thead><tr><th>Resource</th><th>Type</th><th>Source</th><th>Status</th></tr></thead>
          <tbody>{list.map((r) => (
            <tr key={r.id}>
              <td>{r.url ? <ExtLink href={r.url}>{r.title}</ExtLink> : r.title}{r.note && <div className="tiny muted">{r.note}</div>}</td>
              <td>{TYPES[r.type]}{r.free ? "" : <span className="tiny muted"> (paid)</span>}</td>
              <td className="small">{r.source}</td>
              <td>{r.verified ? <span className="badge ok">Checked {r.lastChecked}</span> : r.url ? <span className="badge warn">Unverified</span> : <span className="badge plain">No link</span>}</td>
            </tr>))}
          </tbody>
        </table></div>
        {!list.length && <p className="muted">Nothing matches.</p>}
      </section>
      <p className="small muted">To re-check links yourself, run <code>npm run check-links</code> locally (see README).</p>
    </div>
  );
}
