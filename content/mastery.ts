import type { MasteryTest, MonthMilestone } from "./schema.ts";

type Q = MasteryTest["questions"][number];
const mc = (id: string, type: Q["type"], q: string, options: string[], answer: number, explain: string): Q => ({ id, type, q, options, answer, explain });
const op = (id: string, type: Q["type"], q: string, answer: string, explain = ""): Q => ({ id, type, q, answer, explain });

export const MASTERY: MasteryTest[] = [
  { phase: "p0", title: "Diagnostic: where do you stand?", questions: [
    mc("d1", "concept", "Which step turns RTL into a gate-level netlist?", ["Place and route", "Synthesis", "Tapeout", "LVS"], 1, "Synthesis maps RTL to standard cells."),
    mc("d2", "numerical", "What is 0x2F in decimal?", ["47", "32", "63", "45"], 0, "2x16 + 15 = 47."),
    mc("d3", "concept", "A D flip-flop captures its input...", ["whenever the input changes", "at the active clock edge", "while the clock is high", "only at reset"], 1, "Edge-triggered."),
    mc("d4", "concept", "In a CMOS inverter, which transistor pulls the output high?", ["NMOS", "PMOS", "Both", "Neither"], 1, "PMOS connects to VDD."),
    op("d5", "design", "Sketch (in words) a circuit that outputs 1 when exactly one of two inputs is 1.", "XOR gate: Y = A ^ B."),
    op("d6", "interview", "In one paragraph: what do you already know about chip design, and what is completely new?", "Self-assessment; there is no wrong answer. Use it to set expectations."),
  ]},
  { phase: "p1", title: "Electronics foundations", questions: [
    mc("e1", "numerical", "R = 1 kOhm, C = 20 fF. Approximate 50% delay?", ["20 ps", "14 ps", "2 ps", "140 ps"], 1, "0.69 x RC = 0.69 x 20 ps."),
    mc("e2", "concept", "Reducing VDD by 10% changes dynamic power by roughly...", ["-10%", "-19%", "-1%", "+10%"], 1, "P ~ V^2: 0.9^2 = 0.81."),
    mc("e3", "concept", "Why is a PMOS usually wider than an NMOS in a balanced inverter?", ["PMOS has higher mobility", "Holes have lower mobility than electrons", "To reduce leakage", "Design rules require it"], 1, "Lower hole mobility needs a wider device for equal drive."),
    mc("e4", "concept", "Which corner is typically worst for hold checks?", ["Slow process, low voltage, high temperature", "Fast process, high voltage, low temperature", "Typical", "All equal"], 1, "Fast corners make data arrive early."),
    op("e5", "design", "A gate drives a 64x larger load. How would you minimize delay?", "Insert a buffer chain with roughly geometric sizing (about 4x per stage, about 3 stages)."),
    op("e6", "interview", "Explain IR drop and why it matters for timing.", "Resistive supply wires drop voltage under current; lower effective VDD slows gates and can cause timing failures."),
  ]},
  { phase: "p2", title: "Digital logic", questions: [
    mc("g1", "numerical", "8-bit two's complement of -13?", ["0xF3", "0x8D", "0xF2", "0x13"], 0, "256 - 13 = 243 = 0xF3."),
    mc("g2", "concept", "Which violation cannot be fixed by lowering the clock frequency?", ["Setup", "Hold", "Both", "Neither"], 1, "Period is absent from the hold equation."),
    mc("g3", "numerical", "Tcq 0.1, logic 1.7, Tsu 0.1, uncertainty 0.1 (ns). Fmax?", ["500 MHz", "625 MHz", "455 MHz", "1 GHz"], 0, "Period 2.0 ns."),
    mc("g4", "concept", "Why can't a multi-bit counter cross clock domains through per-bit synchronizers?", ["Too slow", "Bits may resolve in different cycles producing invalid values", "Synchronizers only work for resets", "It violates hold"], 1, "Incoherent sampling; use Gray code."),
    op("g5", "design", "Design (states and transitions) an overlapping 101 detector, Moore style.", "S0 -1-> S1 -0-> S2 -1-> S3(out=1); S3 -1-> S1, S3 -0-> S2; S1 -1-> S1; S2 -0-> S0; S0 -0-> S0."),
    op("g6", "debug", "A combinational always block assigns y only inside if (en). What hardware appears and how do you fix it?", "A latch; assign a default before the if or add an else."),
    op("g7", "interview", "Explain setup and hold time with an analogy and the inequality.", "Camera analogy; Tcq + Tlogic_max + Tsu <= Tclk + skew; Tcq + Tlogic_min >= Th + skew."),
  ]},
  { phase: "p3", title: "Computer architecture", questions: [
    mc("a1", "numerical", "16 KB, 4-way, 64 B lines, 32-bit addresses: index bits?", ["6", "8", "7", "10"],0, "Sets = 16K/(64x4) = 64 -> 6 bits."),
    mc("a2", "concept", "Load followed immediately by a dependent add in a classic 5-stage pipeline with forwarding needs...", ["0 stalls", "1 stall", "2 stalls", "a flush"], 1, "Load-use hazard."),
    mc("a3", "numerical", "90% of runtime sped up 10x. Overall speedup?", ["10x", "5.3x", "9x", "2x"], 1, "1 / (0.1 + 0.09) ~ 5.26."),
    mc("a4", "concept", "What does a TLB cache?", ["Instructions", "Branch targets", "Address translations", "Dirty lines"], 2, "Virtual-to-physical translations."),
    op("a5", "design", "List the forwarding conditions for ALU operand A in a 5-stage pipeline.", "EX/MEM.regwrite && rd != 0 && rd == rs1 (priority), else MEM/WB.regwrite && rd != 0 && rd == rs1."),
    op("a6", "interview", "Explain the three Cs of cache misses and a fix for each.", "Compulsory (prefetch, larger lines), capacity (larger cache), conflict (associativity, victim cache)."),
  ]},
  { phase: "p4", title: "Verilog and SystemVerilog", questions: [
    mc("h1", "debug", "A shift register written with blocking assignments in a clocked block synthesizes to...", ["the intended shift register", "a single flop fanned out", "latches", "a combinational loop"], 1, "Each stage sees the new value immediately."),
    mc("h2", "concept", "reg in Verilog always creates a flip-flop.", ["True", "False"], 1, "reg is a variable type; hardware depends on the block."),
    mc("h3", "concept", "What does randc guarantee?", ["Weighted values", "All values appear once before repeating", "Constant value", "Signed values"], 1, "Random-cyclic."),
    mc("h4", "concept", "fork...join_any resumes when...", ["all children finish", "any child finishes", "no child finishes", "at time 0"], 1, "Others keep running unless disabled."),
    op("h5", "coding", "Write an always_comb block for a 4:1 mux with a default.", "always_comb begin y = '0; unique case (sel) 2'd0: y=a; 2'd1: y=b; 2'd2: y=c; 2'd3: y=d; endcase end"),
    op("h6", "debug", "Why might a testbench pass in one simulator and fail in another?", "Race between TB and DUT (blocking drives at the sampling edge), X handling, two-state vs four-state differences."),
  ]},
  { phase: "p5", title: "RTL design", questions: [
    mc("r1", "concept", "In a valid/ready interface, a transfer happens when...", ["valid rises", "ready rises", "valid and ready are both high at a clock edge", "data changes"], 2, "Both high at the edge."),
    mc("r2", "concept", "Async FIFO pointers are Gray-coded because...", ["Gray is smaller", "Only one bit changes per increment", "Gray is faster to add", "Synthesis requires it"], 1, "Safe synchronization."),
    mc("r3", "numerical", "Minimum accumulator width to sum 64 products of 8-bit signed values?", ["16", "22", "24", "32"], 1, "16 + log2(64) = 22."),
    mc("r4", "concept", "An AXI burst may cross a 4 KB boundary.", ["True", "False"], 1, "Not allowed."),
    op("r5", "design", "Size a FIFO: 100-word bursts written at 1 word/cycle, read at 1 word every 3 cycles, same clock.", "During 100 cycles about 33 words read; depth >= 67 (plus margin)."),
    op("r6", "interview", "How do you pass a single-cycle pulse from a fast to a slow clock domain?", "Toggle synchronizer or handshake/pulse stretching; plain two-flop sync can miss it."),
  ]},
  { phase: "p6", title: "Verification", questions: [
    mc("v1", "concept", "a |=> b is equivalent to...", ["a |-> b", "a |-> ##1 b", "a ##1 b", "b |-> a"], 1, "Non-overlapping implication."),
    mc("v2", "concept", "100% code coverage guarantees the design is correct.", ["True", "False"], 1, "It only measures exercised code."),
    mc("v3", "concept", "In UVM, why create components with type_id::create?", ["Faster simulation", "Enables factory overrides", "Required by SystemVerilog", "Avoids randomization"], 1, "Factory overrides."),
    mc("v4", "concept", "An assertion never fails because its antecedent never occurs. This is...", ["full coverage", "a vacuous pass", "a formal proof", "a false path"], 1, "Add cover properties."),
    op("v5", "design", "List four features of a verification plan for a synchronous FIFO.", "Write/read ordering, full/empty flags, simultaneous read/write at boundaries, overflow/underflow protection, reset behaviour, parameter variants."),
    op("v6", "debug", "A regression shows 300 failures overnight. What do you do first?", "Bucket by failure signature, reproduce the largest bucket with its seed, find the first failure, check recent commits."),
  ]},
  { phase: "p7", title: "ASIC flow and timing", questions: [
    mc("t1", "concept", "Positive clock skew (capture later) is good for...", ["hold", "setup", "both", "neither"], 1, "Helps setup, hurts hold."),
    mc("t2", "concept", "SPEF files contain...", ["timing constraints", "parasitic RC", "layout geometry", "test patterns"], 1, "Extracted parasitics."),
    mc("t3", "concept", "For a 3-cycle multicycle path you typically set...", ["-setup 3 only", "-setup 3 and -hold 2", "-hold 3 only", "set_false_path"], 1, "Move hold back."),
    mc("t4", "concept", "LVS checks...", ["timing", "layout connectivity matches the netlist", "power", "coverage"], 1, "Layout versus schematic."),
    op("t5", "numerical", "Period 2 ns, Tcq 0.2, logic 1.5, Tsu 0.1, skew +0.3 (capture later), uncertainty 0. Setup slack?", "Required 2.2 - 0.1 = 2.1; arrival 1.7; slack +0.4 ns."),
    op("t6", "interview", "Walk through the ASIC flow with the file produced at each step.", "RTL+SDC -> netlist -> floorplan/place/CTS/route (DEF) -> SPEF -> signoff STA, DRC/LVS -> GDS."),
  ]},
  { phase: "p8", title: "End-to-end project review", questions: [
    op("e2e1", "interview", "Explain your end-to-end project in 2 minutes.", "Problem, architecture, verification, results with numbers, one bug, one tradeoff, next steps."),
    op("e2e2", "design", "What limited your maximum frequency and how would you improve it?", "Name the critical path from STA and a concrete architectural or physical fix."),
    op("e2e3", "debug", "Which signoff check failed first and how did you fix it?", "Specific DRC, LVS or timing issue with root cause."),
    mc("e2e4", "concept", "Your README must let a stranger...", ["see screenshots", "reproduce results with documented commands", "read the RTL only", "contact you"], 1, "Reproducibility."),
  ]},
  { phase: "p9", title: "Specialization readiness", questions: [
    op("s1", "interview", "Why did you choose your primary track, with evidence?", "Enjoyment, performance data, projects and job fit."),
    op("s2", "design", "Describe one advanced technique from your track and when you'd use it.", "Track-specific answer."),
    op("s3", "debug", "Describe a failure scenario typical of your track and your debug approach.", "Track-specific answer."),
  ]},
  { phase: "p10", title: "Advanced engineering", questions: [
    mc("x1", "concept", "Out-of-order cores commit in order mainly to...", ["save power", "maintain precise exceptions", "reduce area", "simplify caches"], 1, "Precise state."),
    mc("x2", "concept", "Coherence concerns...", ["ordering across addresses", "a single address across caches", "clock domains", "power"], 1, "Consistency covers ordering across addresses."),
    op("x3", "design", "Your accelerator is 10x faster on the kernel but 1.3x end to end. What do you investigate?", "Data movement, driver overhead, synchronization, unaccelerated fraction (Amdahl)."),
    op("x4", "interview", "Choose between a deep pipeline and parallel lanes for a throughput target.", "Discuss frequency limits, area, power (voltage scaling), verification cost."),
  ]},
  { phase: "p11", title: "AI hardware and AI for EDA", questions: [
    mc("ai1", "numerical", "4 TOPS peak, 100 GB/s, kernel intensity 10 ops/byte. Attainable performance?", ["4 TOPS", "1 TOPS", "0.4 TOPS", "10 TOPS"], 1, "min(peak, bandwidth x intensity) = min(4 TOPS, 100 GB/s x 10 ops/B = 1 TOPS) = 1 TOPS, so the kernel is memory-bound."),
    mc("ai2", "concept", "LLM decode is usually limited by...", ["compute", "memory bandwidth", "clock skew", "leakage"], 1, "Low arithmetic intensity."),
    mc("ai3", "concept", "Evaluating an ML-for-EDA model on the same designs used for training causes...", ["better generalization", "data leakage and optimistic results", "lower accuracy", "nothing"], 1, "Use design-level splits."),
    op("ai4", "design", "Describe a weight-stationary systolic dataflow.", "Weights preloaded in PEs; activations stream; partial sums move; maximal weight reuse."),
  ]},
  { phase: "p12", title: "Job readiness", questions: [
    op("j1", "interview", "Tell me about yourself (60 seconds).", "EE + software, why hardware, evidence, target role."),
    op("j2", "interview", "What are your technical gaps and how are you addressing them?", "Honest gaps with active plans and evidence."),
    op("j3", "interview", "Deep-dive: your best flagship, including a tradeoff you made.", "Architecture, verification, results, tradeoff reasoning."),
  ]},
];

export const MASTERY_MAP: Record<string, MasteryTest> = Object.fromEntries(MASTERY.map((m) => [m.phase, m]));

export const MILESTONES: MonthMilestone[] = [
  { month: 1, title: "Lab ready, electronics refreshed", test: "p1", practical: "Simulate a counter and explain RC delay with a Falstad demo", miniProject: "m-counter", skillsUnlocked: ["Linux workflow", "Simulation basics", "Delay and power intuition"] },
  { month: 2, title: "Digital logic core", test: "p2", practical: "Design and test an ALU against a Python model", miniProject: "m-alu", skillsUnlocked: ["Combinational design", "Number systems", "Python models"] },
  { month: 3, title: "Sequential logic and timing", test: "p2", practical: "FSMs with full transition coverage; compute setup/hold slack", miniProject: "m-traffic-fsm", skillsUnlocked: ["FSM design", "Timing reasoning"] },
  { month: 4, title: "How a CPU works", test: "p3", practical: "Single-cycle RV32I passes riscv-tests", miniProject: "m-rv-single", skillsUnlocked: ["RISC-V", "Datapath and control"] },
  { month: 5, title: "HDL fluency", test: "p4", practical: "Lint-clean Verilog/SV with a self-checking testbench", miniProject: "m-lfsr", skillsUnlocked: ["Verilog", "SystemVerilog", "Waveform debug"] },
  { month: 6, title: "RTL building blocks", test: "p5", practical: "FIFO with assertions and coverage", miniProject: "m-sync-fifo", skillsUnlocked: ["Handshakes", "FIFOs", "Protocols"] },
  { month: 7, title: "Multi-clock RTL", test: "p5", practical: "Async FIFO verified across clock ratios", miniProject: "m-uart", skillsUnlocked: ["CDC", "Protocols"] },
  { month: 8, title: "Verification methodology", test: "p6", practical: "UVM environment for the APB timer", miniProject: "m-uvm-apb", skillsUnlocked: ["UVM", "SVA", "Coverage"] },
  { month: 9, title: "ASIC flow and STA", test: "p7", practical: "Synthesis + STA sweep with annotated report", miniProject: "m-yosys-sta", skillsUnlocked: ["Synthesis", "STA", "SDC"] },
  { month: 10, title: "First silicon-ready design", test: "p8", practical: "End-to-end project to GDS with reports", miniProject: "m-openroad", skillsUnlocked: ["RTL-to-GDS", "Signoff reading"] },
  { month: 11, title: "Specialized depth", test: "p9", practical: "Primary-track flagship milestone", miniProject: "m-openroad", skillsUnlocked: ["Specialization"] },
  { month: 12, title: "Advanced and AI hardware", test: "p11", practical: "Systolic model and roofline analysis", miniProject: "m-systolic-py", skillsUnlocked: ["AI hardware", "Tradeoff reasoning"] },
  { month: 13, title: "Job ready", test: "p12", practical: "Mock interview at 70%+, portfolio complete", miniProject: "m-systolic-py", skillsUnlocked: ["Interviewing", "Proof of work"] },
];

/** Career micro-tasks attached to project days by week number. */
export const CAREER_TASKS: Record<number, string> = {
  2: "Create a GitHub profile README describing your hardware learning journey honestly.",
  4: "Set up one repository per project with a consistent layout (rtl/, tb/, docs/, results/).",
  6: "Draft (do not publish yet) a 'what I learned about RC delay' post.",
  8: "Update your LinkedIn headline to show your transition and current focus, without overclaiming.",
  10: "Follow 10 engineers or teams in your target area; read their posts for a week.",
  13: "Publish your first learning post with a diagram.",
  16: "Write a debugging post from your bug log.",
  20: "Send two thoughtful technical questions to engineers (use templates).",
  24: "Draft your VLSI resume v1 using the strong-bullet formula.",
  28: "Publish a build post about your FIFO or UART with waveforms.",
  32: "Ask someone to clone and run one of your repos from scratch; fix what breaks.",
  36: "Publish your STA or PPA results post.",
  40: "Do a full mock interview and record weak categories.",
  44: "Update resume v2 with end-to-end project results.",
  48: "Start targeted applications; track them.",
  51: "Write your two-year growth plan.",
};
