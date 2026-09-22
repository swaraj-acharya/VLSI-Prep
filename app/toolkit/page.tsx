import { DSA_FOR_HW, LANGUAGES, MATH_FOR_VLSI } from "@/content/skills";
import { PageHead } from "@/components/ui";

export const metadata = { title: "Toolkit" };

export default function ToolkitPage() {
  return (
    <div className="page">
      <PageHead title="Toolkit">Programming, DSA and mathematics taught only as far as they serve hardware work. Your software background covers a lot of this; the notes say what to skip.</PageHead>
      <h2>Languages</h2>
      <div className="grid2">{LANGUAGES.map((l) => (
        <section key={l.name} className="panel"><h3>{l.name}</h3><p className="small">{l.why}</p><p className="small"><span className="muted">Depth: </span>{l.depth}</p>
          <div className="grid2" style={{ gap: 8 }}><div><div className="label">Learn</div><ul className="list small">{l.learn.map((x) => <li key={x}>{x}</li>)}</ul></div><div><div className="label">Skip for now</div><ul className="list small muted">{l.skip.map((x) => <li key={x}>{x}</li>)}</ul></div></div>
        </section>))}
      </div>
      <section className="panel anchor" id="dsa"><h2>DSA for hardware</h2><p className="small muted">Consolidation days rotate through these. They matter most for EDA and verification-tooling roles and in software-style interview rounds.</p>
        <div className="scroll"><table className="t"><thead><tr><th>Topic</th><th>Where it appears in hardware</th><th>Practice</th></tr></thead><tbody>{DSA_FOR_HW.map((d) => <tr key={d.topic}><td>{d.topic}</td><td className="small">{d.hardware}</td><td className="small">{d.practice}</td></tr>)}</tbody></table></div>
      </section>
      <section className="panel anchor" id="math"><h2>Mathematics for VLSI</h2>
        <div className="scroll"><table className="t"><thead><tr><th>Topic</th><th>Why it matters</th><th>When</th><th>Depth</th></tr></thead><tbody>{MATH_FOR_VLSI.map((m) => <tr key={m.topic}><td>{m.topic}</td><td className="small">{m.why}</td><td className="small">{m.when}</td><td className="small">{m.depth}</td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
