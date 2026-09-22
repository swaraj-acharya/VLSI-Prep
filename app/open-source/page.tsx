import { CONTRIB_LADDER, OPEN_SOURCE } from "@/content/open-source";
import { ExtLink, PageHead } from "@/components/ui";

export const metadata = { title: "Open source" };

export default function OpenSourcePage() {
  return (
    <div className="page">
      <PageHead title="Open source">Open-source hardware lets you learn from industrial code and build public evidence. Start by using the tools, then contribute in small, careful steps.</PageHead>
      <section className="panel"><h2>Contribution ladder</h2><ol>{CONTRIB_LADDER.map((x) => <li key={x}>{x}</li>)}</ol><p className="small muted">Read each project's CONTRIBUTING guide first. Maintainers are volunteers or busy engineers: small, reproducible, well-described contributions are welcome; drive-by cosmetic changes are not.</p></section>
      <div className="grid2">{OPEN_SOURCE.map((o) => (
        <section key={o.id} id={o.id} className="panel anchor">
          <div className="between"><h2 style={{ margin: 0 }}><ExtLink href={o.url}>{o.name}</ExtLink></h2><span className="badge plain">{o.difficulty}</span></div>
          <p className="small" style={{ marginTop: 8 }}>{o.what}</p>
          <dl className="qa small"><dt>Why it matters</dt><dd>{o.why}</dd><dt>Use it as a beginner</dt><dd>{o.beginnerUse}</dd><dt>How to contribute</dt><dd>{o.contribute}</dd><dt>Portfolio value</dt><dd>{o.portfolio}</dd></dl>
        </section>))}
      </div>
      <p className="small muted">Repository links were confirmed to exist on 2026-09-22. Note: YosysHQ/picorv32 is archived; study it, but do not expect contributions to be merged.</p>
    </div>
  );
}
