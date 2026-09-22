"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TARGET_LABELS } from "@/content/phases";
import { ROLE_GUIDE, PAY_REALITY, DEMAND_REALITY, SOURCES_NOTE, RESEARCHED } from "@/content/roles-guide";
import { APPLY_PLAYBOOK, CERTS_FOR_GLOBAL, CRORE_REALITY, GLOBAL_RESEARCHED, HUBS, VISA_NOTES, VISA_WARNING } from "@/content/global";
import type { RoleTarget } from "@/content/schema";
import { actions, useHydrated, useStore } from "@/lib/store";
import { ExtLink, Loading, PageHead, Tabs, TabPanel } from "@/components/ui";

export default function RolesPage() {
  const hydrated = useHydrated();
  const s = useStore();
  const [tab, setTab] = useState("roles");
  useEffect(() => { const h = window.location.hash.slice(1); if (h) setTab(h); }, []);
  if (!hydrated) return <Loading />;
  const setTabHash = (x: string) => { setTab(x); history.replaceState(null, "", `#${x}`); };

  return (
    <div className="page">
      <PageHead title="Which role, and what does it pay?">Plain-language answers to the questions the target picker assumes you already know: what each role actually is, who needs it, what the money really looks like, and what it takes to reach the top of the range, in India or abroad.</PageHead>
      <Tabs label="Role guidance sections" active={tab} onChange={setTabHash} tabs={[
        { id: "roles", label: "What each role is" }, { id: "pay", label: "Pay and demand" },
        { id: "crore", label: "The crore question" }, { id: "abroad", label: "Working abroad" }, { id: "apply", label: "How to apply" },
      ]} />
      <TabPanel id={tab}>

      {tab === "roles" && (
        <div>
          <p className="small muted">Your current target is <b>{TARGET_LABELS[s.settings.target]}</b>. Changing it here changes the skill targets on My skills and the readiness checks on Job readiness. It does not change what you learn first: everyone does the same core.</p>
          {ROLE_GUIDE.map((r) => (
            <section key={r.target} id={r.target} className="panel anchor">
              <div className="between">
                <h2 style={{ margin: 0 }}>{r.title}</h2>
                {s.settings.target === r.target ? <span className="badge ok">Your target</span> : <button className="btn sm" onClick={() => actions.settings({ target: r.target as RoleTarget })}>Make this my target</button>}
              </div>
              <p className="lead" style={{ margin: "8px 0" }}>{r.oneLine}</p>
              <dl className="qa">
                <dt>What it actually is</dt><dd>{r.whatItIs}</dd>
                <dt>A typical day</dt><dd>{r.day}</dd>
                <dt>Who needs this</dt><dd>{r.whoNeeds}</dd>
                <dt>Realistic for you?</dt><dd>{r.entryRealism}</dd>
                <dt>Choose it if</dt><dd><ul className="list" style={{ margin: 0 }}>{r.goodIf.map((x) => <li key={x}>{x}</li>)}</ul></dd>
                <dt>Think twice if</dt><dd><ul className="list" style={{ margin: 0 }}>{r.badIf.map((x) => <li key={x}>{x}</li>)}</ul></dd>
                <dt>Where it sits on pay</dt><dd>{r.payPosition}</dd>
                <dt>Search these terms on job sites</dt><dd className="mono small">{r.searchTerms.join("  |  ")}</dd>
              </dl>
              <p className="tiny"><Link href={`/career-paths#${r.target}`}>Full career-path detail, including companies and interview topics</Link></p>
            </section>
          ))}
        </div>
      )}

      {tab === "pay" && (
        <div>
          <section className="panel"><h2>What the money actually looks like</h2>
            <p>{PAY_REALITY.summary}</p>
            <div className="scroll"><table className="t">
              <thead><tr><th>Reported figure</th><th>Who published it</th></tr></thead>
              <tbody>{PAY_REALITY.points.map((p) => <tr key={p.url}><td>{p.claim}</td><td className="small"><ExtLink href={p.url}>{p.source}</ExtLink></td></tr>)}</tbody>
            </table></div>
            <p className="small callout warn" style={{ marginTop: 10 }}>Notice the spread: the same year, figures from under INR 2 LPA to INR 30 LPA for a fresher. Several of these sites sell VLSI training, which gives them a reason to publish high numbers. The only figure here with a stated sample size is the Glassdoor one, and it is small and self-reported.</p>
            <p className="small">{PAY_REALITY.sampled}</p>
          </section>
          <div className="grid2">
            <section className="panel"><h3>What actually moves your number</h3><ul className="list">{PAY_REALITY.drivers.map((d) => <li key={d}>{d}</li>)}</ul></section>
            <section className="panel"><h3>How to check it yourself</h3><ul className="list">{PAY_REALITY.howToCheck.map((d) => <li key={d}>{d}</li>)}</ul></section>
          </div>
          <section className="panel"><h2>How many jobs are there?</h2>
            <p>{DEMAND_REALITY.summary}</p>
            <ul className="list">{DEMAND_REALITY.points.map((p) => <li key={p.url}>{p.claim} <span className="tiny"><ExtLink href={p.url}>{p.source}</ExtLink></span></li>)}</ul>
            <h3>What that means for you</h3><ul className="list">{DEMAND_REALITY.whatItMeans.map((d) => <li key={d}>{d}</li>)}</ul>
            <h3>Check the real number yourself, monthly</h3><ol>{DEMAND_REALITY.checkYourself.map((d) => <li key={d}>{d}</li>)}</ol>
          </section>
          <p className="tiny muted">{SOURCES_NOTE}</p>
        </div>
      )}

      {tab === "crore" && (
        <div>
          <section className="panel" style={{ borderLeft: "3px solid var(--signal)" }}>
            <h2 style={{ fontSize: "1.05rem" }}>{CRORE_REALITY.headline}</h2>
            <ul className="list">{CRORE_REALITY.facts.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
          <section className="panel"><h2>The six levers that decide the number</h2>
            <div className="grid2">{CRORE_REALITY.levers.map((l) => <div key={l.title}><h3 style={{ fontSize: ".98rem" }}>{l.title}</h3><p className="small">{l.detail}</p></div>)}</div>
          </section>
          <section className="panel"><h2>The realistic ladder</h2>
            <ol className="rail" style={{ paddingLeft: 0 }}>
              {CRORE_REALITY.stages.map((st) => (
                <li key={st.window}><span className="node" aria-hidden="true" />
                  <b>{st.window}</b>
                  <p className="small" style={{ margin: "4px 0" }}>{st.focus}</p>
                  <p className="tiny muted" style={{ margin: 0 }}>You know you are there when: {st.signal}</p>
                </li>
              ))}
            </ol>
            <p className="small muted">This roadmap covers year zero to one. Everything after that is real work on real chips, which no app can give you.</p>
          </section>
          <section className="panel"><h2>Things that will cost you years</h2><ul className="list">{CRORE_REALITY.cautions.map((c) => <li key={c}>{c}</li>)}</ul></section>
        </div>
      )}

      {tab === "abroad" && (
        <div>
          <div className="callout small">{VISA_WARNING}</div>
          <section className="panel"><h2>Where the work is</h2>
            <div className="scroll"><table className="t">
              <thead><tr><th>Region</th><th>What is there</th><th>Usual route in</th><th>Watch out for</th></tr></thead>
              <tbody>{HUBS.map((h) => <tr key={h.region}><td><b>{h.region}</b></td><td className="small">{h.whatIsThere}</td><td className="small">{h.route}</td><td className="small">{h.caution}</td></tr>)}</tbody>
            </table></div>
          </section>
          <section className="panel"><h2>The permits that actually matter</h2>
            {VISA_NOTES.map((v) => (
              <details key={v.name} className="disc">
                <summary><span>{v.name}</span><span className="tiny muted">checked {GLOBAL_RESEARCHED}</span></summary>
                <div className="body">
                  <p className="small"><b>What it is: </b>{v.what}</p>
                  <p className="small"><b>Current position: </b>{v.status}</p>
                  <p className="tiny"><ExtLink href={v.url}>Official source</ExtLink></p>
                </div>
              </details>
            ))}
          </section>
          <section className="panel"><h2>Certifications for an international career</h2>
            <p>{CERTS_FOR_GLOBAL.summary}</p>
            <div className="scroll"><table className="t">
              <thead><tr><th>Worth having</th><th>Why</th><th>When</th></tr></thead>
              <tbody>{CERTS_FOR_GLOBAL.worth.map((c) => <tr key={c.item}><td><b>{c.item}</b></td><td className="small">{c.why}</td><td className="small">{c.when}</td></tr>)}</tbody>
            </table></div>
            <h3>What to build instead</h3>
            <ul className="list">{CERTS_FOR_GLOBAL.insteadInvest.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="small"><Link href="/certifications">Full certification assessments</Link>, including cost, eligibility and whether a degree is required.</p>
          </section>
        </div>
      )}

      {tab === "apply" && (
        <div>
          <section className="panel"><h2>The application playbook</h2>
            <ol>{APPLY_PLAYBOOK.map((p) => <li key={p.step} style={{ marginBottom: 10 }}><b>{p.step}.</b> {p.detail}</li>)}</ol>
          </section>
          <div className="grid2">
            <section className="panel"><h3>Where the app helps</h3>
              <ul className="list small">
                <li><Link href="/job-readiness">Job readiness</Link> checks your evidence against real entry-level requirements.</li>
                <li><Link href="/portfolio">Portfolio</Link> tracks whether each flagship is actually presentable.</li>
                <li><Link href="/build-in-public">Build in public</Link> has the resume formula and the outreach templates.</li>
                <li><Link href="/interview">Interview</Link> gives you mock rounds and tracks your weak categories.</li>
              </ul>
            </section>
            <section className="panel"><h3>Warning signs when applying abroad</h3>
              <ul className="list small">
                <li>Anyone charging you for a job offer, a visa, or a "sponsorship slot".</li>
                <li>Agents guaranteeing outcomes that depend on a lottery or a government decision.</li>
                <li>Offers below the published salary threshold for the permit you need: the permit will fail.</li>
                <li>Courses promising placement at a fixed package. Ask for verifiable outcomes, and speak to past students yourself.</li>
              </ul>
            </section>
          </div>
          <p className="tiny muted">Role, pay and hiring information collected on {RESEARCHED}. Immigration details collected on {GLOBAL_RESEARCHED}. Both change: re-check before acting.</p>
        </div>
      )}
      </TabPanel>
    </div>
  );
}
