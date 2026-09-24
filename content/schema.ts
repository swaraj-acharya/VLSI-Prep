// Content schema. Every curriculum file is typed against these interfaces.
// Learner progress never lives here; see lib/store.ts.

export type Priority = "must" | "should" | "optional" | "specialization" | "research";
export type Depth = "awareness" | "basic" | "working" | "advanced" | "research";
export type Kind = "theory" | "coding" | "tool" | "project" | "career";
export type SkillId =
  | "digital" | "hdl" | "rtl" | "verification" | "timing" | "asic" | "pd" | "dft" | "arch"
  | "linux" | "python" | "tcl" | "cpp" | "protocols" | "riscv" | "aihw" | "eda" | "interview"
  | "firmware" | "rtos" | "emblinux";
export type TrackId = "rtl" | "dv" | "pd" | "dft" | "fpga" | "ams" | "validation" | "eda" | "arch";
export type RoleTarget = "rtl" | "dv" | "pd" | "dft" | "fpga" | "aihw" | "eda";

export interface Phase {
  id: string;
  num: number;
  title: string;
  short: string;
  /** What the learner should be able to say at the end, e.g. "I can read and write Verilog." */
  stage: string;
  goal: string;
  modules: string[];
  /** Mastery gate shown before entering the phase (soft lock). */
  gate?: string;
  /** Which curriculum the phase belongs to. Omitted means the VLSI road; embedded phases are self-paced. */
  program?: "vlsi" | "embedded";
}

export interface Module {
  id: string;
  phase: string;
  title: string;
  summary: string;
  topics: string[];
  track?: TrackId;
  /** Optional specialization branch of the Embedded road (not part of the core embedded path). */
  branch?: string;
}

export interface InterviewQ {
  q: string;
  a: string;
  trap?: string;
  level?: 1 | 2 | 3 | 4;
}

export interface Visual {
  title: string;
  art: string;
  note?: string;
}

export interface CodeSample {
  lang: "verilog" | "systemverilog" | "python" | "tcl" | "c" | "cpp" | "asm" | "dts" | "bash" | "text";
  src: string;
  note?: string;
}

export interface Ladder {
  beginner: string;
  junior: string;
  mid: string;
  senior: string;
  research?: string;
}

export interface Topic {
  id: string;
  title: string;
  phase: string;
  module: string;
  priority: Priority;
  depth: Depth;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Plan days this topic occupies (one primary topic per day). */
  days: number;
  /** Estimated focused hours at standard intensity. */
  hours: number;
  kind: Kind;
  skills: SkillId[];
  /** Why this matters: the job, the chip, the decision it supports. */
  why: string;
  /** What problem it solves, what existed before, and why that was not enough. */
  problem: string;
  /** Explain it to a curious 12-year-old. */
  eli12: string;
  /** Where the analogy stops being true. */
  analogyLimit?: string;
  /** Technical explanation: how it actually works and becomes hardware. */
  tech: string;
  /** Where it lives in a real chip and who works on it. */
  inChip: string;
  /** What breaks when it is done wrong. */
  breaks: string;
  /** How it is tested or verified. */
  tested: string;
  prereqs: string[];
  objectives: string[];
  terms: [string, string][];
  visuals?: Visual[];
  equations?: string[];
  example?: string;
  code?: CodeSample;
  mistakes: string[];
  debug?: string[];
  senior?: string[];
  ladder?: Ladder;
  practice: string[];
  interview: InterviewQ[];
  resources: string[];
  projects?: string[];
  certs?: string[];
  papers?: string[];
  roles?: string[];
}

export type ResourceType = "reading" | "video" | "docs" | "practice" | "textbook" | "paper" | "tool" | "course";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  source: string;
  free: boolean;
  /** true only when the URL was checked on lastChecked. Books without URLs are never "verified". */
  verified: boolean;
  lastChecked: string;
  note?: string;
}

export interface Milestone {
  id: string;
  title: string;
  detail: string;
  evidence?: string;
}

export type ProjectTier = "micro" | "mini" | "weekend" | "flagship" | "research" | "open-silicon";

export interface LearningProject {
  id: string;
  title: string;
  /** micro: 30 min-6 h; weekend: 6-16 h; mini: phase consolidation (15-30 h). */
  tier: "micro" | "mini" | "weekend";
  phase: string;
  afterTopic: string;
  summary: string;
  spec: string[];
  milestones: Milestone[];
  topics: string[];
  skills: SkillId[];
  tools: string[];
  hours: number;
  stretch?: string;
  level?: "beginner" | "intermediate" | "advanced";
  /** Board, instruments and the emulator-only option, if any. */
  hardware?: string;
  /** How to prove the result is correct. */
  verify?: string;
  expected?: string;
  /** Interview concepts the project lets you talk about. */
  concepts?: string[];
}

export type ProofStage =
  | "spec" | "architecture" | "rtl" | "verification" | "assertions" | "coverage" | "simulation"
  | "synthesis" | "timing" | "ppa" | "documentation" | "github" | "demo" | "linkedin" | "interview"
  | "firmware" | "measurement" | "ci" | "release";

export interface FlagshipQuestion {
  q: string;
  followups: string[];
}

export interface Flagship {
  id: string;
  title: string;
  tier: "flagship" | "research" | "open-silicon";
  capstone?: boolean;
  categories: string[];
  difficulty: 3 | 4 | 5;
  duration: string;
  /** Phase after which the project should start. */
  phase: string;
  roles: string[];
  exceptional: string;
  problem: string;
  motivation: string;
  researchBasis: string[];
  prereqs: string[];
  skills: string[];
  architecture: string;
  diagram: string;
  requirements: string[];
  milestones: Milestone[];
  implementation: string[];
  verification: string[];
  failureInjection: string[];
  metrics: string[];
  ppa: string;
  timing: string;
  benchmark: string;
  expected: string;
  tools: string[];
  openSource: string[];
  dataset?: string;
  repo: string;
  docs: string[];
  demo: string[];
  linkedinAngle: string;
  resume: string[];
  interview: FlagshipQuestion[];
  extensions: string[];
  researchOps: string[];
  contribOps: string[];
  certs: string[];
  proof?: ProofStage[];
  resources?: string[];
}

export interface Paper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  area: "arch" | "aihw" | "eda" | "verification" | "pd" | "riscv" | "circuits";
  difficulty: 1 | 2 | 3 | 4 | 5;
  url?: string;
  verified: boolean;
  problem: string;
  intuition: string;
  contribution: string;
  prereqs: string[];
  reproduction: string;
  implementation: string;
  dataset: string;
  tools: string[];
  extension: string;
  portfolio: string;
  researchOnly?: boolean;
}

export type CertClass = "high" | "useful" | "optional" | "low" | "not-recommended";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  url?: string;
  verified: boolean;
  lastVerified: string;
  status: string;
  cost: string;
  pricing: "free" | "paid" | "free-to-audit";
  format: string;
  prerequisites: string;
  eligibility: string;
  degreeRequired: string;
  mtechRequired: string;
  depth: string;
  recognition: string;
  roles: string[];
  employerMentions: string;
  toolExposure: string;
  labs: string;
  time: string;
  difficulty: string;
  renewal: string;
  geography: string;
  classification: CertClass;
  rationale: string;
  chain?: { skill: string; project: string; evidence: string; role: string };
}

export interface CareerPath {
  id: string;
  title: string;
  does: string;
  builds: string;
  skills: string[];
  tools: string[];
  programming: string[];
  interviewTopics: string[];
  eeFit: string;
  mtech: string;
  entryPath: string;
  advanced: string[];
  projects: string[];
  companies: string[];
  track?: TrackId;
  roleTarget?: RoleTarget;
}

export interface Track {
  id: TrackId;
  title: string;
  summary: string;
  topics: string[];
  careers: string[];
}

export interface GlossaryTerm {
  term: string;
  full?: string;
  simple: string;
  technical: string;
  art?: string;
  topic?: string;
}

export type InterviewCat =
  | "digital" | "hdl" | "rtl" | "verification" | "timing" | "asic" | "pd" | "dft"
  | "arch" | "riscv" | "protocols" | "linux" | "programming" | "aihw" | "career"
  | "firmware" | "rtos" | "emblinux";

export interface BankQuestion {
  id: string;
  cat: InterviewCat;
  q: string;
  level: 1 | 2 | 3 | 4;
  concept: string;
  a: string;
  reasoning: string;
  trap: string;
  topics: string[];
}

export interface PracticeItem {
  id: string;
  title: string;
  type: "rtl" | "sv" | "debug" | "waveform" | "timing" | "architecture" | "thinking";
  level: "beginner" | "intermediate" | "advanced" | "senior";
  phase: string;
  prompt: string;
  code?: string;
  hints: string[];
  solution: string;
  topics: string[];
}

export interface OpenSourceProject {
  id: string;
  name: string;
  url: string;
  what: string;
  why: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  prereqs: string[];
  beginnerUse: string;
  contribute: string;
  portfolio: string;
  license?: string;
  /** Exact files or directories worth reading. */
  study?: string;
  /** Concrete exercise to do with the code. */
  exercise?: string;
}

export interface MasteryQuestion {
  id: string;
  type: "concept" | "numerical" | "design" | "debug" | "coding" | "interview";
  q: string;
  options?: string[];
  /** Index of the correct option for multiple choice; otherwise a model answer. */
  answer: number | string;
  explain: string;
}

export interface MasteryTest {
  phase: string;
  title: string;
  questions: MasteryQuestion[];
}

export interface MonthMilestone {
  month: number;
  title: string;
  test: string;
  practical: string;
  miniProject: string;
  skillsUnlocked: string[];
}
