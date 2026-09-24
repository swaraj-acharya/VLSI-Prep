import { ALL_PHASES, EMBEDDED_ROAD, MAIN_ROAD, phaseLabel } from "@/content/phases";
import { TOPIC_MAP, UNLOCKS } from "@/content/topics";
import type { Flagship, GlossaryTerm, Topic } from "@/content/schema";
import type { ProjState } from "./store";

const DEPTH_TEXT: Record<string, string> = {
  awareness: "awareness (know what it is and why it exists)",
  basic: "basic (explain it clearly)",
  working: "working (use it correctly in designs)",
  advanced: "advanced (design, debug and make tradeoffs with it)",
  research: "research (extend or investigate it)",
};

/** A topic-aware teaching prompt: uses the learner's position, neighbours and the topic's own data. */
export function topicPrompt(t: Topic, learner = "Swaraj"): string {
  const emb = t.phase.startsWith("e");
  const road = emb ? EMBEDDED_ROAD : MAIN_ROAD;
  const idx = road.indexOf(t.id);
  const prev = idx > 0 ? TOPIC_MAP[road[idx - 1]] : undefined;
  const next = idx >= 0 && idx < road.length - 1 ? TOPIC_MAP[road[idx + 1]] : undefined;
  const phase = ALL_PHASES.find((p) => p.id === t.phase)!;
  const prereqs = t.prereqs.map((p) => TOPIC_MAP[p]?.title).filter(Boolean);
  const unlocks = (UNLOCKS[t.id] || []).map((u) => TOPIC_MAP[u]?.title).filter(Boolean).slice(0, 4);
  const terms = t.terms.map(([k]) => k).join(", ");
  const codeLang = t.code?.lang || (emb ? "C" : t.skills.includes("verification") ? "SystemVerilog" : t.skills.includes("python") ? "Python" : t.skills.includes("tcl") ? "Tcl" : "Verilog/SystemVerilog");
  return `You are teaching an intelligent 12-year-old who has never seen this topic. The learner, ${learner}, is actually an Electrical Engineering graduate with a JavaScript/MERN software background and no formal VLSI training, following a structured ${emb ? "embedded engineering" : "VLSI"} roadmap. Use the child-level intuition first, then build real engineering depth on top of it.

TOPIC: ${t.title}
Roadmap position: ${phaseLabel(phase)} (${phase.title}). ${prev ? `Previous topic: ${prev.title}.` : ""} ${next ? `Next topic: ${next.title}.` : ""}
Target depth: ${DEPTH_TEXT[t.depth]}.
Already covered prerequisites: ${prereqs.length ? prereqs.join(", ") : "none"}.
Why it matters here: ${t.why}
Key terms to define: ${terms}.

Teach in this exact order, using clear headings:
1. Very simple intuition (3-5 sentences, no jargon).
2. A real-world analogy.
3. Where the analogy fails (be specific).
4. A visual representation.
5. ASCII block diagram and, if time matters, an ASCII timing diagram.
6. A terminology table (term | simple meaning | technical meaning) covering: ${terms}.
7. The technical explanation: how it works and how it becomes hardware.
8. The mathematics${t.equations?.length ? ` (include: ${t.equations.join("; ")})` : " (only what is actually needed)"}.
9. A fully worked numerical or design example.
10. A ${codeLang} example where appropriate, with comments on what hardware each part creates.
11. A simulation or debugging example: a realistic bug, its waveform symptom, and how to find it.
12. Where this appears in a real chip and which engineer works on it.
13. Five interview questions from easy to senior-level, with model answers and common traps.
14. One practice problem (do not give the answer until I ask).
15. A 5-question mastery test.
16. How this connects to the previous topic${prev ? ` (${prev.title})` : ""}.
17. How this connects to what comes next${unlocks.length ? ` (${unlocks.join(", ")})` : next ? ` (${next.title})` : ""}.

Rules: be technically accurate; say when something is simplified; mention common mistakes (${t.mistakes.slice(0, 2).join("; ")}); do not invent standards, tools, papers or URLs; if unsure, say so.`;
}

export function termPrompt(g: GlossaryTerm): string {
  return `Explain "${g.term}"${g.full ? ` (${g.full})` : ""} to an intelligent 12-year-old first, then to an electrical engineering graduate learning VLSI.
1. One-sentence simple meaning.
2. An everyday analogy and where it fails.
3. A small ASCII diagram if it helps.
4. The precise technical definition.
5. Where it appears in chip design and which engineer deals with it.
6. One common misunderstanding.
7. One interview question about it with a model answer.
Do not invent facts or sources.`;
}

export function projectPrompt(f: Flagship): string {
  return `Act as a senior hardware engineer mentoring me on this portfolio project: "${f.title}".
Goal: ${f.problem}
Architecture summary: ${f.architecture}
Requirements: ${f.requirements.join("; ")}.
Help me with the next milestone only. Ask me for my current code or results before suggesting changes. Push me on verification, measurements and honest claims. Do not write the whole project for me.`;
}

export interface PostDraft { label: string; text: string }

export function linkedinPosts(f: Flagship, p?: ProjState): PostDraft[] {
  const repo = p?.links.repo || "[GitHub link]";
  const demo = p?.links.demo ? `\nDemo: ${p.links.demo}` : "";
  const metrics = f.metrics.slice(0, 3).map((m) => `- ${m}: [your number]`).join("\n");
  const learned = "[one specific lesson, e.g. a bug and the check that now catches it]";
  const main = `Problem: ${f.problem}

What I built: ${f.title}. ${f.architecture.split(".")[0]}.

Technical challenge: [the hardest part, e.g. ${f.failureInjection[0]?.toLowerCase() || "closing timing"}]

Results:
${metrics}

What I learned: ${learned}

Code, docs and reports: ${repo}${demo}

Scope: this is a personal learning project${f.tier === "open-silicon" ? " taken through an open-source flow" : ""}; numbers come from my own runs and tools listed in the repo.`;
  const deep = `Deep dive: ${f.title}

1) Why: ${f.motivation}
2) Architecture: ${f.architecture}
3) Verification: ${f.verification.slice(0, 3).join("; ")}.
4) Measurements: ${f.metrics.join(", ")}. [add your table]
5) Tradeoff I made: [what you chose and what it cost]
6) What I'd improve next: ${f.extensions[0] || "[next step]"}

Repo: ${repo}`;
  const short = `Finished a project: ${f.title}. Key result: [one number]. Verified with ${f.verification[0]?.toLowerCase() || "a self-checking testbench"}. Write-up and code: ${repo}`;
  const research = `Reproduction notes: ${f.researchBasis[0] || f.title}

Question I tested: [claim or idea]
Method: [setup, designs, metrics, baselines]
What matched: [...]
What didn't / limitations: [...]
Code and data: ${repo}`;
  const out: PostDraft[] = [
    { label: "Project announcement", text: main },
    { label: "Technical deep-dive", text: deep },
    { label: "Short update", text: short },
  ];
  if (f.tier === "research" || f.researchBasis.length) out.push({ label: "Research-style post", text: research });
  return out;
}

export const CLAIMS_TO_AVOID = [
  "'Built a chip' for a simulation or FPGA design (say 'RTL design', 'FPGA prototype' or 'taped out on shuttle X' precisely).",
  "'Revolutionary', 'industry-grade', 'production-ready'.",
  "Tool experience you do not have (commercial tools used only in videos).",
  "Numbers without the conditions they were measured under.",
];
