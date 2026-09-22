import type { SkillId } from "./schema.ts";

export type Check =
  | { kind: "topics"; ids: string[]; minConf: number }
  | { kind: "skill"; skill: SkillId; level: number }
  | { kind: "projects"; ids?: string[]; tier?: "flagship" | "any"; count: number }
  | { kind: "interview"; cats?: string[]; accuracy: number; attempts: number }
  | { kind: "manual"; key: string };

export interface ReqItem { label: string; check: Check; required: boolean }
export interface EntryRole { id: string; title: string; targets: string[]; summary: string; note: string; reqs: ReqItem[] }

const T = (label: string, ids: string[], minConf = 2, required = true): ReqItem => ({ label, check: { kind: "topics", ids, minConf }, required });
const S = (label: string, skill: SkillId, level: number, required = true): ReqItem => ({ label, check: { kind: "skill", skill, level }, required });
const P = (label: string, count: number, ids?: string[], tier: "flagship" | "any" = "any", required = true): ReqItem => ({ label, check: { kind: "projects", ids, tier, count }, required });
const I = (label: string, cats: string[] | undefined, accuracy: number, attempts: number, required = true): ReqItem => ({ label, check: { kind: "interview", cats, accuracy, attempts }, required });
const M = (label: string, key: string, required = true): ReqItem => ({ label, check: { kind: "manual", key }, required });

export const ENTRY_ROLES: EntryRole[] = [
  {
    id: "dv-trainee", title: "Design verification trainee / new-graduate DV engineer", targets: ["dv"],
    summary: "Build and run testbenches, write tests and assertions, debug failures, support regressions.",
    note: "Sampled 2026 new-graduate DV postings asked for a relevant bachelor's degree, coursework or projects in design/verification, and Verilog/SystemVerilog familiarity, with UVM learned under guidance.",
    reqs: [T("Digital logic and timing fundamentals", ["fsm", "setup-hold", "cdc"]), T("SystemVerilog OOP and randomization", ["sv-oop", "sv-random"]), T("Assertions and coverage", ["sva", "coverage"]), T("UVM basics", ["uvm-architecture", "uvm-sequences", "uvm-env"]), S("Verification skill at Working level", "verification", 2), P("At least one verification-heavy flagship", 1, ["fp-uvm-env", "fp-async-fifo", "fp-rv-pipeline"], "flagship"), I("Interview accuracy 70% in verification and HDL", ["verification", "hdl"], 0.7, 15), M("Resume and GitHub ready", "resume-ready")],
  },
  {
    id: "rtl-trainee", title: "RTL design trainee / ASIC graduate engineer", targets: ["rtl", "aihw"],
    summary: "Implement and integrate RTL blocks, run lint/CDC/synthesis, fix issues with verification and timing teams.",
    note: "Many RTL openings in sampled postings required years of experience; entry often comes through campus programmes, services companies and trainee roles. Strong projects with synthesis and timing results matter.",
    reqs: [T("RTL principles and handshakes", ["rtl-guidelines", "valid-ready", "pipelined-rtl"]), T("FIFOs, arbiters, protocols", ["sync-fifo", "arbiters", "apb", "axi"]), T("CDC and resets", ["cdc", "async-fifo", "reset-architecture"]), T("Synthesis and STA", ["synthesis", "sdc", "sta"]), S("RTL skill at Working level", "rtl", 2), P("Two RTL flagships", 2, ["fp-rv-pipeline", "fp-async-fifo", "fp-axi-apb", "fp-cache", "fp-ppa-arith"], "flagship"), I("Interview accuracy 70% in RTL, digital and timing", ["rtl", "digital", "timing"], 0.7, 15), M("Resume and GitHub ready", "resume-ready")],
  },
  {
    id: "fpga-engineer", title: "Entry FPGA engineer", targets: ["fpga"],
    summary: "Design, close timing and debug FPGA implementations; often with board bring-up.",
    note: "FPGA roles commonly value working hardware demos.",
    reqs: [T("RTL and CDC", ["rtl-guidelines", "cdc", "uart"]), T("FPGA architecture and timing", ["fpga-architecture", "fpga-timing"], 2, false), S("RTL skill at Working level", "rtl", 2), P("FPGA-based flagship", 1, ["fp-fpga-accel", "fp-capstone"], "flagship"), I("Interview accuracy 70% in RTL and timing", ["rtl", "timing"], 0.7, 10), M("Hardware demo video", "fpga-demo")],
  },
  {
    id: "pd-junior", title: "Junior physical design engineer", targets: ["pd"],
    summary: "Run implementation flows, fix timing and DRC issues, automate with Tcl.",
    note: "PD roles often prefer commercial tool experience; structured programmes with licences can help (see Certifications).",
    reqs: [T("ASIC flow and STA", ["asic-flow", "sta", "clock-effects", "timing-closure"]), T("Physical design steps", ["floorplan", "placement-cts", "routing-signoff"]), T("Tcl automation", ["tcl-eda"]), S("Timing skill at Working level", "timing", 2), P("RTL-to-GDS project", 1, ["fp-open-silicon", "fp-ppa-arith"], "flagship"), I("Interview accuracy 70% in timing and PD", ["timing", "pd", "asic"], 0.7, 10)],
  },
  {
    id: "eda-software", title: "EDA / CAD software engineer (entry)", targets: ["eda"],
    summary: "Develop and maintain design tools, flows and algorithms.",
    note: "Software engineering strength plus hardware understanding is the core requirement; a strong fit for your background.",
    reqs: [T("Graph algorithms in EDA", ["graphs-in-eda"]), T("ASIC flow and STA", ["asic-flow", "sta"]), T("EDA algorithms", ["eda-algorithms"], 2, false), S("EDA skill at Working level", "eda", 2), P("Algorithmic flagship", 1, ["fp-dft-atpg", "fp-macro-placement", "fp-ppa-arith", "fp-ml-eda"], "flagship"), M("DSA interview practice done separately", "dsa-ready")],
  },
  {
    id: "validation-entry", title: "Silicon validation engineer (entry)", targets: ["dv", "fpga"],
    summary: "Bring up boards and chips, automate lab tests, debug with design teams.",
    note: "EE lab skills plus Python/C are valued; validation is a realistic entry point for EE + software profiles.",
    reqs: [T("C and interfaces", ["c-for-hw", "io-interrupts", "uart"]), T("Validation basics", ["silicon-validation"], 2, false), S("Python at Working level", "python", 2), P("Hardware-software project", 1, ["fp-capstone", "fp-fpga-accel", "fp-axi-apb"], "flagship")],
  },
];

export const READINESS_CHECKLIST: { group: string; items: ReqItem[] }[] = [
  { group: "Foundation", items: [T("Digital logic", ["boolean-algebra", "fsm", "latches-flipflops"]), T("Timing fundamentals", ["setup-hold", "critical-path", "metastability"]), T("Computer architecture", ["pipelining", "hazards", "caches"])] },
  { group: "HDL", items: [T("Verilog", ["verilog-basics", "blocking-nonblocking", "latch-inference"]), T("SystemVerilog", ["sv-design", "sv-oop", "sv-random"])] },
  { group: "Engineering", items: [T("RTL", ["rtl-guidelines", "valid-ready", "sync-fifo"]), T("Simulation and debugging", ["testbench-basics", "waveform-debug", "debug-method"]), T("Verification", ["self-checking-tb", "sva", "coverage", "uvm-architecture"]), T("Git and Linux", ["linux-shell"])] },
  { group: "Industry", items: [T("ASIC flow", ["asic-flow", "open-flow"]), T("Timing analysis", ["sta", "sdc"]), T("CDC", ["cdc", "async-fifo"]), T("AMBA", ["apb", "axi"]), T("Synthesis", ["synthesis"])] },
  { group: "Evidence", items: [P("3 meaningful projects", 3), P("1 advanced flagship project", 1, undefined, "flagship"), P("1 end-to-end flow", 1, ["fp-open-silicon"], "flagship"), M("1 standout flagship with full showcase", "standout"), M("GitHub portfolio", "github"), M("Resume", "resume-ready"), M("LinkedIn portfolio", "linkedin"), M("Technical posts (3+)", "posts"), I("Mock interviews (40+ answers, 70%+)", undefined, 0.7, 40), M("Can explain every project in 2 and 10 minutes", "explain")] },
  { group: "Professional development", items: [M("Relevant certification(s), if valuable", "cert", false), M("Research project", "research", false), M("Open-source contribution", "oss", false), M("Internship or industry experience", "internship", false)] },
];

export interface MarketPosting { role: string; company: string; location: string; education: string; experience: string; required: string[]; preferred: string[]; tools: string[]; protocols: string[]; programming: string[]; link: string; lastVerified: string; status: string }

export const MARKET_RESEARCHED = "2026-09-22";

export const MARKET_POSTINGS: MarketPosting[] = [
  { role: "Design Verification Engineer (New College Graduate)", company: "Renesas (via university job board)", location: "United States (onsite)", education: "BS (up to 2 years experience) or MS (no experience) in EE/CE or related", experience: "Entry level", required: ["Coursework or projects in digital design and verification", "Familiarity with Verilog or SystemVerilog"], preferred: ["Learn UVM under guidance", "Regression support", "Clear documentation"], tools: [], protocols: [], programming: ["Verilog", "SystemVerilog"], link: "https://hireaniner.charlotte.edu/jobs/2af6bd6b18d03384af8c0f3615ffbecd", lastVerified: MARKET_RESEARCHED, status: "Closed 17 July 2026 (historical example)" },
  { role: "Design Engineer Verification (2026 New College Graduate)", company: "MIPS / GlobalFoundries", location: "Richardson, Texas, USA", education: "Bachelor's or Master's in EE/ECE/CE with computer architecture and VLSI as a primary part of the curriculum; GPA 3.0+", experience: "New graduate", required: ["HDL knowledge", "RISC-V processor DV tasks: test plans, testbenches, coverage closure"], preferred: [], tools: [], protocols: [], programming: ["Verilog/SystemVerilog"], link: "https://www.ihireengineering.com/jobs/view/522282400", lastVerified: MARKET_RESEARCHED, status: "Seen in search results; status unknown" },
  { role: "Design Verification Engineer (fresh graduates)", company: "Realtek (Vietnam)", location: "Vietnam", education: "Final-year or fresh Bachelor's/Master's in CS/EE", experience: "Fresh graduate", required: ["Basic RTL and testbench coding", "Analytical and problem-solving skills"], preferred: ["C/C++, SystemVerilog, SVA, UVM", "FPGA/ASIC/SoC", "OOP", "Formal verification", "Ethernet, PCIe, USB or AMBA"], tools: [], protocols: ["AMBA", "PCIe", "USB", "Ethernet"], programming: ["C/C++", "SystemVerilog"], link: "https://fce.uit.edu.vn/?p=12640", lastVerified: MARKET_RESEARCHED, status: "Seen in search results; status unknown" },
  { role: "Design Verification Engineer III", company: "Google", location: "Bengaluru, India", education: "Bachelor's in EE/CE/CS or equivalent practical experience; Master's/PhD preferred", experience: "4 years SV/UVM", required: ["SystemVerilog and UVM", "Processor microarchitecture (pipelines, caches, memory consistency)", "AHB/AXI/APB"], preferred: ["Formal verification"], tools: [], protocols: ["AXI", "AHB", "APB"], programming: ["SystemVerilog"], link: "https://embedded.jobs/job/Design-Verification-Engineer-III-with-Google-6c8bcb", lastVerified: MARKET_RESEARCHED, status: "Expired (historical example)" },
  { role: "Design Verification Engineer", company: "NXP Semiconductors", location: "Pune, India", education: "Not stated in excerpt", experience: "Mid-level", required: ["SystemVerilog and UVM", "Coverage-driven and assertion-based verification", "Digital design principles"], preferred: ["Scripting in Python, Perl or Tcl"], tools: ["Questa", "VCS", "Xcelium"], protocols: [], programming: ["SystemVerilog", "Python", "Perl", "Tcl"], link: "https://embedded.jobs/job/Design-Verification-Engineer-with-NXP-Semiconductors-eaed4d", lastVerified: MARKET_RESEARCHED, status: "Expired (historical example)" },
  { role: "Design Verification Engineer", company: "Broadcom", location: "Bengaluru, India", education: "B.Tech with 8 years or M.Tech with 6 years", experience: "Senior", required: ["SystemVerilog/UVM environments", "IP/subsystem/SoC verification"], preferred: ["Environments from scratch"], tools: [], protocols: ["AMBA", "PCIe", "DDR", "USB", "Ethernet"], programming: ["SystemVerilog"], link: "https://embedded.jobs/job/Design-Verification-Engineer-with-Broadcom-b15e92", lastVerified: MARKET_RESEARCHED, status: "Expired (historical example; shows degree-experience tradeoff)" },
  { role: "Sr. RTL Design Engineer", company: "Synopsys", location: "Bhubaneswar, India", education: "Not stated in excerpt", experience: "2-5 years", required: ["RTL design, microarchitecture and IP integration in Verilog", "Lint and CDC (SpyGlass, Questa, Real Intent)", "Synthesis and STA (DC/Genus, PrimeTime/Tempus)", "LEC (Formality/Conformal)"], preferred: [], tools: ["SpyGlass", "DC/Genus", "PrimeTime/Tempus", "Formality/Conformal"], protocols: [], programming: ["Verilog"], link: "https://careers.synopsys.com/job/bhubaneswar/sr-rtl-design-engineer/44408/92040418400", lastVerified: MARKET_RESEARCHED, status: "Seen in search results; check listing" },
  { role: "Lead RTL Design Engineer", company: "Synopsys", location: "Bengaluru, India", education: "B.E./M.E. in EE/CE or equivalent", experience: "8+ years", required: ["Verilog/SystemVerilog RTL, synthesis, CDC and DFT concepts", "STA and EDA flows", "Python, Tcl or Perl"], preferred: ["AMBA, PCIe/UCIe, DDR", "AI/ML knowledge"], tools: [], protocols: ["AMBA", "PCIe", "UCIe", "DDR"], programming: ["SystemVerilog", "Python", "Tcl", "Perl"], link: "https://careers.synopsys.com/job/bengaluru/lead-rtl-design-engineer/44408/93647959712", lastVerified: MARKET_RESEARCHED, status: "Posted 04/05/2026; check listing" },
  { role: "Design Verification Engineer (IP DV)", company: "Weekday AI client", location: "Bengaluru, India", education: "Not stated", experience: "2+ years", required: ["SoC/IP verification", "SystemVerilog", "UVM"], preferred: [], tools: [], protocols: [], programming: ["SystemVerilog"], link: "https://apply.workable.com/weekday-1/jobs/view/28AD740FD4.md", lastVerified: MARKET_RESEARCHED, status: "Posted 16 July 2026; listed INR 8-20 LPA (single posting, not a salary benchmark)" },
];

export const MARKET_PATTERNS = [
  { title: "Recurring skills", items: ["SystemVerilog", "UVM", "SVA and coverage-driven verification", "Digital design fundamentals", "CDC and resets", "Synthesis and STA concepts", "Lint", "Debugging"] },
  { title: "Recurring protocols", items: ["AMBA (APB, AHB, AXI)", "PCIe", "DDR", "USB", "Ethernet", "UCIe (chiplets)"] },
  { title: "Recurring programming", items: ["SystemVerilog", "Python", "Tcl", "Perl/shell", "C/C++ (verification and validation)"] },
  { title: "Recurring tools (commercial)", items: ["VCS, Xcelium, Questa", "SpyGlass / Questa CDC", "DC/Genus", "PrimeTime/Tempus", "Formality/Conformal"] },
  { title: "Education patterns", items: ["Entry DV postings: bachelor's plus coursework or projects in verification", "Some new-graduate programmes require VLSI/architecture coursework or GPA cut-offs", "Some postings accept equivalent practical experience", "Experienced roles often trade M.Tech for fewer years of experience"] },
  { title: "Certifications in postings", items: ["None of the sampled postings named a certification requirement"] },
];

export const MARKET_SOURCES = [
  { label: "Renesas NCG DV posting (university job board)", url: "https://hireaniner.charlotte.edu/jobs/2af6bd6b18d03384af8c0f3615ffbecd" },
  { label: "Synopsys careers (RTL roles in India)", url: "https://careers.synopsys.com/job/bhubaneswar/sr-rtl-design-engineer/44408/92040418400" },
  { label: "embedded.jobs aggregated DV postings (historical)", url: "https://embedded.jobs/job/Design-Verification-Engineer-with-NXP-Semiconductors-eaed4d" },
  { label: "Weekday/Workable postings, Bengaluru (July 2026)", url: "https://apply.workable.com/weekday-1/jobs/view/28AD740FD4.md" },
];
