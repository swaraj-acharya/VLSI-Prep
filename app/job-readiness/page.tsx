"use client";
import Link from "next/link";
import { ENTRY_ROLES, MARKET_PATTERNS, MARKET_POSTINGS, MARKET_RESEARCHED, MARKET_SOURCES, READINESS_CHECKLIST, type ReqItem } from "@/content/jobs";
import { actions, useHydrated, useStore } from "@/lib/store";
import { evaluate } from "@/lib/derive";
import { Bar, ExtLink, Loading, PageHead, Tabs, TabPanel } from "@/components/ui";
import { useState } from "react";

function Req({ r }: { r: ReqItem }) {
  const s = useStore();
  const e = evaluate(r.check, s);
  const manual = r.check.kind === "manual";
  return (
    <li className={`check${e.met ? " done" : ""}`}>
      {manual ? <input type="checkbox" id={`chk-${r.label}`} checked={e.met} onChange={() => actions.toggleCheck((r.check as { key: string }).key)} /> : <span className={`tick${e.met ? " on" : ""}`} aria-hidden="true">{e.met ? "✓" : ""}</span>}
      <label htmlFor={manual ? `chk-${r.label}` : undefined}><span className="t" style={{ textDecoration: "none" }}>{r.label}</span> {!r.required && <span className="badge optional">optional</span>}<div className="d">{e.met ? "Met" : "Not yet"}: {e.detail}</div></label>
    </li>
  );
}

export default function JobReadinessPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [tab, setTab] = useState("roles");
  if (!hydrated) return <Loading />;
  const roles = [...ENTRY_ROLES].sort((a, b) => Number(b.targets.includes(s.settings.target)) - Number(a.targets.includes(s.settings.target)));
  return (
    <div className="page">
      <PageHead title="Job readiness">Ready means evidence, not days completed. Automatic checks read your topics, confidence, projects and interview results; manual checks are for things only you can confirm.</PageHead>
      <Tabs label="Job readiness sections" active={tab} onChange={setTab} tabs={[{ id: "roles", label: "Entry-level roles" }, { id: "checklist", label: "Readiness checklist" }, { id: "market", label: "Market snapshot" }]} />
      <TabPanel id={tab}>
      {tab === "roles" && roles.map((r) => {
        const req = r.reqs.filter((x) => x.required);
        const met = req.filter((x) => evaluate(x.check, s).met).length;
        return (
          <section key={r.id} className="panel">
            <div className="panel-head"><h2>{r.title}</h2>{r.targets.includes(s.settings.target) && <span className="badge ok">Your target</span>}</div>
            <p className="small">{r.summary}</p>
            <p className="small muted">{r.note}</p>
            <Bar value={req.length ? met / req.length : 0} label={`${r.title} readiness`} />
            <p className="tiny muted">{met}/{req.length} required checks met{met === req.length ? ": ready to apply with confidence." : ""}</p>
            <ul className="clean">{r.reqs.map((x) => <Req key={x.label} r={x} />)}</ul>
          </section>
        );
      })}
      {tab === "checklist" && (
        <div className="grid2">
          {READINESS_CHECKLIST.map((g) => (
            <section key={g.group} className="panel"><h2>{g.group}</h2><ul className="clean">{g.items.map((x) => <Req key={x.label} r={x} />)}</ul></section>
          ))}
        </div>
      )}
      {tab === "market" && (
        <div>
          <div className="callout info small">Snapshot researched on {MARKET_RESEARCHED} from public postings found through web search. It is a small sample for spotting patterns, not a statistic. Several postings are expired and kept as historical examples. Salaries are not summarised; one listing showing a range is noted as a single data point.</div>
          <section className="panel"><h2>Patterns</h2><div className="grid3">{MARKET_PATTERNS.map((p) => <div key={p.title}><h3>{p.title}</h3><ul className="list small">{p.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div></section>
          <section className="panel"><h2>Postings sampled</h2>
            <div className="scroll"><table className="t">
              <thead><tr><th>Role</th><th>Company, location</th><th>Education</th><th>Experience</th><th>Required</th><th>Status</th></tr></thead>
              <tbody>{MARKET_POSTINGS.map((p) => <tr key={p.link}><td><ExtLink href={p.link}>{p.role}</ExtLink></td><td>{p.company}<div className="tiny muted">{p.location}</div></td><td className="small">{p.education}</td><td className="small">{p.experience}</td><td className="small">{p.required.join("; ")}</td><td className="tiny">{p.status}<div className="muted">checked {p.lastVerified}</div></td></tr>)}</tbody>
            </table></div>
          </section>
          <section className="panel"><h2>Sources</h2><ul className="list small">{MARKET_SOURCES.map((x) => <li key={x.url}><ExtLink href={x.url}>{x.label}</ExtLink></li>)}</ul><p className="small muted">Re-check these patterns every few months. <Link href="/certifications#degree-gap">Degree gap strategy</Link></p></section>
        </div>
      )}
      </TabPanel>
    </div>
  );
}
