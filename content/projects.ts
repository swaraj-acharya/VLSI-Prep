import type { LearningProject } from "./schema.ts";
import { EMBEDDED_PROJECTS, VLSI_EXTRA_PROJECTS } from "./projects-extra.ts";

const ms = (id: string, title: string, detail: string, evidence?: string) => ({ id, title, detail, evidence });

const BASE_LEARNING_PROJECTS: LearningProject[] = [
  {
    id: "m-counter", title: "Hello hardware: counter, testbench and waveform", tier: "micro", phase: "p0", afterTopic: "lab-setup",
    summary: "Prove your lab works end to end with the smallest real design.", hours: 3,
    spec: ["4-bit counter with synchronous reset and enable", "Self-checking testbench", "Makefile with sim, waves, clean"],
    milestones: [ms("a", "Write the counter", "RTL with reset and enable."), ms("b", "Testbench", "Clock, reset, and a PASS/FAIL check."), ms("c", "Waveform and Makefile", "Open the VCD; commit to Git.", "Screenshot of the waveform in the repo")],
    topics: ["lab-setup", "registers-counters"], skills: ["hdl", "linux"], tools: ["Icarus Verilog", "GTKWave or Surfer", "Git"],
  },
  {
    id: "m-alu", title: "RV32I ALU with a Python reference model", tier: "micro", phase: "p2", afterTopic: "alu",
    summary: "The datapath heart of your future CPU, verified against a bit-accurate model.", hours: 8,
    spec: ["ADD, SUB, AND, OR, XOR, SLL, SRL, SRA, SLT, SLTU", "Zero flag", "Random + corner-value tests against Python"],
    milestones: [ms("a", "RTL", "Combinational ALU with opcode decode."), ms("b", "Model", "Python model with masking and signed helpers."), ms("c", "Tests", "10,000 random vectors plus corner cases."), ms("d", "Synthesis", "Yosys cell count; note the biggest block.", "Results table in README")],
    topics: ["alu", "python-hw", "testbench-basics"], skills: ["digital", "hdl", "python"], tools: ["Icarus Verilog", "Python", "Yosys"],
    stretch: "Compare area of three adder styles inside the ALU.",
  },
  {
    id: "m-traffic-fsm", title: "Traffic light and sequence detector FSMs", tier: "micro", phase: "p2", afterTopic: "fsm",
    summary: "Two classic FSMs with state and transition coverage.", hours: 5,
    spec: ["Traffic light with pedestrian request and timers", "Overlapping 1011 detector, Moore and Mealy"],
    milestones: [ms("a", "Diagrams", "Draw both state diagrams."), ms("b", "RTL", "Two-process style with enums."), ms("c", "Coverage", "Test every state and transition.", "Transition table marked covered")],
    topics: ["fsm", "fsm-encoding"], skills: ["digital", "rtl"], tools: ["Icarus Verilog"],
  },
  {
    id: "m-lfsr", title: "LFSR / PRBS generator and checker", tier: "micro", phase: "p4", afterTopic: "hierarchy-generate",
    summary: "Parameterized LFSR used later for test patterns and scramblers.", hours: 4,
    spec: ["Parameterized width and taps", "Checker that detects injected bit errors"],
    milestones: [ms("a", "RTL", "Generate-based parameterized LFSR."), ms("b", "Checker", "Self-synchronizing checker counting errors."), ms("c", "Verify period", "Confirm maximal-length period for PRBS7.")],
    topics: ["registers-counters", "hierarchy-generate"], skills: ["rtl"], tools: ["Verilator"],
  },
  {
    id: "m-rv-single", title: "Single-cycle RV32I core", tier: "mini", phase: "p3", afterTopic: "single-cycle",
    summary: "Your first complete CPU. It becomes the base of the pipelined flagship.", hours: 25,
    spec: ["RV32I base (no CSRs yet)", "Instruction and data memories loaded from hex", "Runs a small C program compiled with GCC"],
    milestones: [ms("a", "Decode and immediates", "All formats, tested against a disassembler."), ms("b", "Datapath and control", "Control-signal table implemented."), ms("c", "riscv-tests", "Pass the rv32ui tests."), ms("d", "C program", "Run a C program; print via a memory-mapped port.", "Log of passing tests")],
    topics: ["riscv-isa", "single-cycle", "c-for-hw"], skills: ["riscv", "arch", "rtl"], tools: ["Verilator", "riscv-gnu-toolchain", "Spike"],
  },
  {
    id: "m-cache-sim", title: "Cache simulator in Python", tier: "micro", phase: "p3", afterTopic: "caches",
    summary: "Model before you build: associativity, replacement and write policies on real traces.", hours: 8,
    spec: ["Configurable size, line size, ways, LRU/random, write-back/through", "Reads address traces", "Reports hit rate and AMAT"],
    milestones: [ms("a", "Core model", "Tag/index/offset logic with tests."), ms("b", "Policies", "LRU, random, write policies."), ms("c", "Experiments", "Plot hit rate vs ways for two traces.", "Plot in README")],
    topics: ["caches", "python-hw"], skills: ["arch", "python"], tools: ["Python", "matplotlib"],
  },
  {
    id: "m-sync-fifo", title: "Parameterized synchronous FIFO with assertions", tier: "micro", phase: "p5", afterTopic: "sync-fifo",
    summary: "The most-asked RTL design, done properly: model, assertions, coverage.", hours: 8,
    spec: ["Parameterized width/depth", "Full/empty/almost flags", "Assertions and covergroups"],
    milestones: [ms("a", "RTL", "Pointer-based design."), ms("b", "Scoreboard", "Random producer/consumer vs queue model."), ms("c", "Assertions", "No overflow/underflow; bind file."), ms("d", "Coverage", "Full/empty transitions and simultaneous ops.", "Coverage summary")],
    topics: ["sync-fifo", "sva", "coverage"], skills: ["rtl", "verification"], tools: ["Verilator or Icarus", "cocotb"],
  },
  {
    id: "m-uart", title: "UART TX/RX with loopback", tier: "mini", phase: "p5", afterTopic: "uart",
    summary: "A real protocol with oversampling, synchronizers and error handling.", hours: 12,
    spec: ["8N1, configurable baud", "16x oversampled RX with synchronizer", "Framing error detection"],
    milestones: [ms("a", "TX", "Baud generator and shifter."), ms("b", "RX", "Start detection and mid-bit sampling."), ms("c", "Loopback test", "1,000 random bytes, baud mismatch test."), ms("d", "Optional FPGA", "Talk to your PC over USB-UART.")],
    topics: ["uart", "metastability"], skills: ["rtl", "protocols"], tools: ["Icarus Verilog", "cocotb", "optional FPGA"],
  },
  {
    id: "m-apb-timer", title: "APB timer peripheral with register map", tier: "mini", phase: "p5", afterTopic: "apb",
    summary: "Your first memory-mapped IP: registers, interrupt, driver.", hours: 12,
    spec: ["APB4 slave with control, count, compare, status (W1C)", "Interrupt output", "C header generated or hand-written"],
    milestones: [ms("a", "Register map", "Document fields and reset values."), ms("b", "RTL", "APB decode and timer logic."), ms("c", "Tests", "Reset values, access types, interrupt."), ms("d", "Driver", "C functions using the header.")],
    topics: ["apb", "io-interrupts"], skills: ["protocols", "rtl", "cpp"], tools: ["Verilator", "cocotb"],
  },
  {
    id: "m-uvm-apb", title: "Minimal UVM environment for the APB timer", tier: "mini", phase: "p6", afterTopic: "uvm-env",
    summary: "Learn UVM on a small DUT you already understand.", hours: 20,
    spec: ["APB agent (driver, monitor, sequencer)", "Scoreboard with register model", "Coverage and two tests"],
    milestones: [ms("a", "Agent", "Sequence item, driver, monitor."), ms("b", "Environment", "Scoreboard and coverage subscriber."), ms("c", "Tests", "Directed and random tests."), ms("d", "Run", "Verilator (UVM 2017 support) or EDA Playground.", "Log with UVM report summary")],
    topics: ["uvm-architecture", "uvm-sequences", "uvm-env"], skills: ["verification"], tools: ["Verilator", "EDA Playground"],
  },
  {
    id: "m-yosys-sta", title: "Synthesis and STA on your own blocks", tier: "micro", phase: "p7", afterTopic: "sta",
    summary: "Turn RTL into a netlist and read real timing reports.", hours: 8,
    spec: ["Synthesize ALU and FIFO to SKY130", "SDC with clock and IO delays", "OpenSTA reports at three clock targets"],
    milestones: [ms("a", "Synthesis", "Yosys + ABC with a Liberty file."), ms("b", "Constraints", "SDC and unconstrained-path check."), ms("c", "STA sweep", "WNS/TNS table and one annotated path.", "Annotated report in repo")],
    topics: ["synthesis", "sdc", "sta"], skills: ["asic", "timing", "tcl"], tools: ["Yosys", "OpenSTA"],
  },
  {
    id: "m-openroad", title: "First RTL-to-GDS run", tier: "mini", phase: "p7", afterTopic: "open-flow",
    summary: "Run the example design, then your FIFO, through a full open flow.", hours: 12,
    spec: ["LibreLane or ORFS on SKY130 (or IHP/GF180)", "Record metrics", "Inspect GDS"],
    milestones: [ms("a", "Install", "Nix/containers; run the example."), ms("b", "Your design", "FIFO to GDS."), ms("c", "Report", "Metrics table and GDS screenshot.", "GDS screenshot")],
    topics: ["open-flow"], skills: ["asic", "pd"], tools: ["LibreLane or ORFS", "KLayout"],
  },
  {
    id: "m-systolic-py", title: "Systolic array simulator in Python", tier: "micro", phase: "p11", afterTopic: "systolic",
    summary: "Cycle-level model before RTL: skew, fill/drain, utilization.", hours: 8,
    spec: ["NxN weight-stationary array", "Skewed inputs", "Utilization statistics"],
    milestones: [ms("a", "Model", "Cycle loop with PE registers."), ms("b", "Check", "Matches NumPy matmul."), ms("c", "Analyze", "Utilization vs matrix size plot.")],
    topics: ["systolic", "matmul-mac"], skills: ["aihw", "python"], tools: ["Python", "NumPy"],
  },
];
export const LEARNING_PROJECTS: LearningProject[] = [...BASE_LEARNING_PROJECTS, ...[...VLSI_EXTRA_PROJECTS, ...EMBEDDED_PROJECTS]];

export const LEARNING_MAP: Record<string, LearningProject> = Object.fromEntries(LEARNING_PROJECTS.map((p) => [p.id, p]));

/** Recommended projects for weekly project days, per phase, in order. */
export const PHASE_PROJECTS: Record<string, string[]> = {
  p0: ["m-counter"],
  p1: ["m-counter"],
  p2: ["m-alu", "m-traffic-fsm"],
  p3: ["m-rv-single", "m-cache-sim"],
  p4: ["m-lfsr", "m-rv-single"],
  p5: ["m-sync-fifo", "m-uart", "m-apb-timer", "fp-async-fifo"],
  p6: ["m-uvm-apb", "fp-rv-pipeline", "fp-axi-apb"],
  p7: ["m-yosys-sta", "m-openroad", "fp-ppa-arith"],
  p8: ["fp-open-silicon"],
  p9: ["fp-uvm-env", "fp-cache", "fp-dft-atpg", "fp-fpga-accel"],
  p10: ["fp-branch-pred", "fp-capstone"],
  p11: ["m-systolic-py", "fp-fpga-accel", "fp-attention", "fp-ml-eda"],
  p12: ["fp-capstone"],
};
