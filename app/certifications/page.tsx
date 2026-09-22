"use client";
import Link from "next/link";
import { useState } from "react";
import { CERTIFICATIONS, CERT_CLASSES, DEGREE_GAP } from "@/content/certifications";
import { CAREER_MAP } from "@/content/careers";
import type { CertClass } from "@/content/schema";
import { actions, useHydrated, useStore, type CertStatus } from "@/lib/store";
import { ExtLink, Loading, PageHead } from "@/components/ui";

const CLS_BADGE: Record<CertClass, string> = { high: "ok", useful: "should", optional: "plain", low: "warn", "not-recommended": "bad" };
const STATUSES: CertStatus[] = ["interested", "planned", "studying", "done", "skipped"];

export default function CertificationsPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [cls, setCls] = useState<"all" | CertClass>("all");
  if (!hydrated) return <Loading />;
  const order: CertClass[] = ["high", "useful", "optional", "low", "not-recommended"];
  const list = CERTIFICATIONS.filter((c) => cls === "all" || c.classification === cls).sort((a, b) => order.indexOf(a.classification) - order.indexOf(b.classification));
  return (
    <div className="page">
      <PageHead title="Certifications">Evaluated by evidence, not popularity. Details were researched on 2026-09-22; prices and programmes change, so confirm on the official page before paying. None of the job postings sampled for this app named a certification as a requirement.</PageHead>
      <section className="panel">
        <h2>How to read the ratings</h2>
        <div className="grid3">{order.map((k) => <div key={k}><span className={`badge ${CLS_BADGE[k]}`}>{CERT_CLASSES[k].label}</span><p className="small" style={{ marginTop: 4 }}>{CERT_CLASSES[k].meaning}</p></div>)}</div>
        <p className="small muted" style={{ marginBottom: 0 }}>A certificate is worth it only if it adds verifiable proof you cannot show otherwise. The chain that matters: certification → skill → project → evidence → role.</p>
      </section>
      <div className="chips" style={{ marginBottom: 14 }}><button className="chip" aria-pressed={cls === "all"} onClick={() => setCls("all")}>All</button>{order.map((k) => <button key={k} className="chip" aria-pressed={cls === k} onClick={() => setCls(k)}>{CERT_CLASSES[k].label}</button>)}</div>
      {list.map((c) => (
        <details key={c.id} id={c.id} className="disc anchor">
          <summary><span>{c.name} <span className="tiny muted">{c.issuer}</span></span><span className="row"><span className={`badge ${CLS_BADGE[c.classification]}`}>{CERT_CLASSES[c.classification].label}</span>{s.certs[c.id] && <span className="badge plain">{s.certs[c.id]}</span>}</span></summary>
          <div className="body">
            <div className="row small" style={{ marginBottom: 8 }}>{c.url ? <ExtLink href={c.url}>Official page</ExtLink> : <span className="muted">No official URL stored</span>}{c.verified ? <span className="badge ok">Checked {c.lastVerified}</span> : <span className="badge warn">Unverified</span>}<span className="badge plain">{c.pricing}</span></div>
            <p><b>Why this rating:</b> {c.rationale}</p>
            <dl className="qa">
              <dt>Status</dt><dd>{c.status}</dd><dt>Cost</dt><dd>{c.cost}</dd><dt>Format</dt><dd>{c.format}</dd><dt>Time</dt><dd>{c.time}</dd><dt>Difficulty</dt><dd>{c.difficulty}</dd>
              <dt>Prerequisites</dt><dd>{c.prerequisites}</dd><dt>Eligibility</dt><dd>{c.eligibility}</dd><dt>Degree required?</dt><dd>{c.degreeRequired}</dd><dt>M.Tech required?</dt><dd>{c.mtechRequired}</dd>
              <dt>Technical depth</dt><dd>{c.depth}</dd><dt>Recognition</dt><dd>{c.recognition}</dd><dt>Employer mentions</dt><dd>{c.employerMentions}</dd><dt>Tool exposure</dt><dd>{c.toolExposure}</dd><dt>Labs</dt><dd>{c.labs}</dd>
              <dt>Relevant roles</dt><dd>{c.roles.map((r) => CAREER_MAP[r]?.title || r).join(", ")}</dd><dt>Renewal</dt><dd>{c.renewal}</dd><dt>Geography</dt><dd>{c.geography}</dd>
            </dl>
            {c.chain && <p className="small callout" style={{ marginTop: 10 }}><b>Evidence chain:</b> {c.chain.skill} → {c.chain.project} → {c.chain.evidence} → {c.chain.role}</p>}
            <div className="row" style={{ marginTop: 10 }}><span className="label">My status</span>{STATUSES.map((x) => <button key={x} className="chip" aria-pressed={s.certs[c.id] === x} onClick={() => actions.setCert(c.id, s.certs[c.id] === x ? undefined : x, c.name)}>{x}</button>)}</div>
          </div>
        </details>
      ))}
      <section className="panel anchor" id="degree-gap" style={{ marginTop: 18 }}>
        <h2>{DEGREE_GAP.title}</h2>
        <h3>The honest picture</h3><ul className="list">{DEGREE_GAP.honest.map((x) => <li key={x}>{x}</li>)}</ul>
        <h3>Build evidence on these pillars</h3><ul className="list">{DEGREE_GAP.pillars.map((x) => <li key={x}>{x}</li>)}</ul>
        <h3>Recommended path</h3><ol>{DEGREE_GAP.path.map((x) => <li key={x}>{x}</li>)}</ol>
        <p className="small"><Link href="/job-readiness">Job readiness</Link> tracks this evidence against real requirements.</p>
      </section>
    </div>
  );
}
