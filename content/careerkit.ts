import type { ProofStage } from "./schema.ts";

export const PROOF_STAGES: { id: ProofStage; label: string; embedded?: boolean }[] = [
  { id: "spec", label: "Specification" }, { id: "architecture", label: "Architecture" }, { id: "rtl", label: "RTL" },
  { id: "verification", label: "Verification" }, { id: "assertions", label: "Assertions" }, { id: "coverage", label: "Coverage" },
  { id: "simulation", label: "Simulation" }, { id: "synthesis", label: "Synthesis" }, { id: "timing", label: "Timing" },
  { id: "ppa", label: "PPA" }, { id: "documentation", label: "Documentation" }, { id: "github", label: "GitHub" },
  { id: "demo", label: "Demo" }, { id: "linkedin", label: "LinkedIn post" }, { id: "interview", label: "Interview ready" },
  { id: "firmware", label: "Firmware implemented and reviewed", embedded: true },
  { id: "measurement", label: "Measured on hardware (captures, timing, power)", embedded: true },
  { id: "ci", label: "CI: build, tests and static analysis", embedded: true },
  { id: "release", label: "Versioned release with artifacts", embedded: true },
];
/** Default proof stages for flagships without an explicit list (the original VLSI set). */
export const DEFAULT_PROOF: ProofStage[] = PROOF_STAGES.filter((x) => !x.embedded).map((x) => x.id);

export const SHOWCASE_ITEMS = [
  { id: "readme", label: "GitHub README (summary, how to run, results)" },
  { id: "diagram", label: "Architecture diagram" },
  { id: "writeup", label: "Technical write-up" },
  { id: "demo", label: "Demo (video, GIF or terminal recording)" },
  { id: "waves", label: "Simulation waveforms" },
  { id: "perf", label: "Performance results" },
  { id: "timing", label: "Timing report summary" },
  { id: "synth", label: "Synthesis report summary" },
  { id: "ppa", label: "PPA analysis" },
  { id: "lessons", label: "Lessons learned" },
  { id: "next", label: "What I'd improve next" },
];

export const PORTFOLIO_CHECKS = ["README", "Architecture diagram", "Source code", "Tests", "Waveform", "Results", "Timing", "Synthesis", "Explanation", "Lessons learned"];

export const EVIDENCE_KINDS = [
  { id: "education", label: "Formal education" }, { id: "certification", label: "Certifications" }, { id: "project", label: "Projects" },
  { id: "research", label: "Research" }, { id: "oss", label: "Open source" }, { id: "article", label: "Publications and technical articles" },
  { id: "github", label: "GitHub" }, { id: "talk", label: "Technical presentations" }, { id: "fpga", label: "FPGA demonstrations" },
  { id: "asic", label: "ASIC-flow demonstrations" }, { id: "interview", label: "Interview performance" }, { id: "community", label: "Community participation" },
];

export const POST_TYPES = [
  { id: "learning", title: "Learning post", example: "What I learned about setup and hold time today", structure: ["Hook: one surprising fact", "Simple explanation with an analogy", "One diagram", "Where it shows up in real chips", "One question you still have"], depth: "Beginner-friendly but precise", evidence: "A diagram you drew; a link to your notes", diagram: "Timing diagram of the setup/hold window", screenshot: "Waveform showing a violation in simulation", hashtags: ["#VLSI", "#DigitalDesign", "#LearningInPublic"], avoid: ["Claiming mastery after one day", "Copying textbook text"] },
  { id: "build", title: "Build post", example: "I implemented an asynchronous FIFO in SystemVerilog", structure: ["Problem it solves", "What you built (block diagram)", "How you verified it (numbers)", "One challenge and how you solved it", "Repo link"], depth: "Intermediate, with numbers", evidence: "Repo, test results, coverage", diagram: "Block diagram with clock domains", screenshot: "Passing regression summary", hashtags: ["#RTL", "#SystemVerilog", "#CDC"], avoid: ["'Production-ready'", "Vague 'fully verified'"] },
  { id: "debug", title: "Debugging post", example: "I found a CDC bug caused by synchronizing a binary counter", structure: ["Symptom", "How you narrowed it down", "Root cause", "Fix", "Check you added so it never returns"], depth: "Intermediate to advanced", evidence: "Before/after waveform, failing seed", diagram: "Bit-transition sketch", screenshot: "First-divergence waveform", hashtags: ["#Debugging", "#Verification", "#VLSI"], avoid: ["Blaming tools without evidence"] },
  { id: "benchmark", title: "Benchmark post", example: "I compared two cache architectures from RTL to timing", structure: ["Question", "Method (same constraints)", "Results table or chart", "Explanation of why", "Limitations"], depth: "Advanced", evidence: "Scripts to reproduce, CSV", diagram: "Pareto chart", screenshot: "Timing report excerpt", hashtags: ["#ComputerArchitecture", "#PPA"], avoid: ["Unfair comparisons", "Hiding methodology"] },
  { id: "research", title: "Research post", example: "I reproduced part of a published AI-for-EDA paper", structure: ["Paper and claim", "What you reproduced", "What matched and what did not", "Lessons", "Code link"], depth: "Advanced", evidence: "Repo, metrics, paper citation", diagram: "Pipeline diagram", screenshot: "Result plots", hashtags: ["#AIforEDA", "#Research"], avoid: ["Claiming to refute a paper from a partial reproduction"] },
  { id: "launch", title: "Project launch", example: "Built a RISC-V SoC with an INT8 accelerator", structure: ["One-line summary", "Architecture image", "Three key results", "What you learned", "Links"], depth: "Summary with depth available", evidence: "Repo, demo video, report", diagram: "SoC block diagram", screenshot: "Demo frame", hashtags: ["#RISCV", "#AIHardware", "#FPGA"], avoid: ["'Revolutionary chip'", "Implying silicon if it is simulation or FPGA"] },
];

export const NETWORK_TEMPLATES = [
  { id: "question", title: "Technical question to an engineer", when: "After reading their post or talk", text: "Hi {name}, I read your post on {topic} and it helped me understand {specific point}. I'm an EE graduate building hardware skills (currently {project}). One question: {specific question}? Thanks for sharing your work." },
  { id: "alumni", title: "Alumni connection", when: "Someone from your college works in your target role", text: "Hi {name}, I'm a {college} EE graduate moving into {role}. I've built {project with one result}. Could I ask you two quick questions about how your team evaluates freshers? Happy to keep it to 10 minutes." },
  { id: "recruiter", title: "Recruiter introduction", when: "A recruiter hires for semiconductor roles", text: "Hi {name}, I'm looking for entry-level {role} roles. Evidence of my work: {repo link} ({one-line result}). If there are openings that fit, I'd appreciate being considered. Thank you." },
  { id: "referral", title: "Referral request (after a conversation)", when: "Only after you have interacted", text: "Hi {name}, thanks again for the advice on {topic}. I've applied for {job id / title}. If you feel comfortable, would you consider referring me? I've attached my resume and a one-page summary of {project}. No worries if not." },
  { id: "followup", title: "Polite follow-up", when: "About a week without reply", text: "Hi {name}, following up on my earlier note in case it got buried. Since then I've {new progress}. Totally understand if you're busy." },
  { id: "share", title: "Sharing a project with someone who helped", when: "You used their advice", text: "Hi {name}, your suggestion about {topic} made a real difference. I applied it in {project}: {result}. Thanks again." },
];

export const LINKEDIN_OPTIMIZATION = [
  "Headline: target role plus evidence, for example 'EE graduate | RTL and verification projects (RISC-V, async FIFO, UVM) | Software engineer'.",
  "About: three short paragraphs: background, what you build and measure, what role you want.",
  "Featured: your three best flagship repos or write-ups with images.",
  "Experience: frame software work in terms of automation, testing and debugging.",
  "Skills: only skills you can demonstrate in a project.",
  "Activity: post evidence regularly (every 2-3 weeks), comment thoughtfully on engineers' posts.",
];

export const NO_SPAM_RULES = [
  "Never send the same message to many people.",
  "Do not ask for a referral in the first message.",
  "Always include something specific you read or built.",
  "Keep messages under 80 words.",
  "Follow up once; then let it go.",
];

export const RESUME_GUIDE = {
  structure: ["Name, links (GitHub, LinkedIn, portfolio)", "Summary: 2 lines positioning EE + software + hardware projects", "Skills grouped: HDL, verification, flow tools, scripting, protocols", "Projects (the main section for you): 3-5 with metrics", "Experience: software roles framed for hardware relevance", "Education", "Certifications (only meaningful ones)"],
  bullets: [
    { weak: "Worked on UART project using Verilog.", strong: "Designed a UART (8N1, 16x oversampled RX) with synchronizer and framing-error detection; verified 1,000 random bytes with ±2% baud mismatch in cocotb." },
    { weak: "Did a RISC-V CPU.", strong: "Built a 5-stage RV32I pipeline with full forwarding; passed riscv-tests and RISCOF; zero mismatches vs Spike over 10M random instructions; CPI 1.3 on CoreMark." },
    { weak: "Knowledge of UVM.", strong: "Developed a UVM environment with RAL and virtual sequences for an AXI-APB subsystem; reached plan coverage goals and detected 9/10 injected bugs." },
    { weak: "Used OpenLane.", strong: "Took a MAC unit from spec to DRC/LVS-clean GDS on SKY130 using LibreLane; closed timing at 50 MHz with 22% slack after two floorplan iterations." },
    { weak: "Software developer at X.", strong: "Built automated test pipelines and debugging tools for a JavaScript platform; now apply the same practices to hardware regressions and reference models." },
  ],
  framing: ["Present the EE degree plus software experience as 'hardware + software' strength, not a gap.", "Name tools honestly: open-source tools are fine; do not imply commercial-tool experience you lack.", "Every project bullet needs a measurable result or verification evidence."],
};
