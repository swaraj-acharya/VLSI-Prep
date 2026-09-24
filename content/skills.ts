import type { SkillId } from "./schema.ts";

export const LEVELS = ["Awareness", "Basic", "Working", "Advanced", "Research"] as const;

export const SKILLS: { id: SkillId; name: string; what: string }[] = [
  { id: "digital", name: "Digital design", what: "Logic, sequential circuits, FSMs, arithmetic." },
  { id: "hdl", name: "HDL", what: "Verilog and SystemVerilog fluency, simulation." },
  { id: "rtl", name: "RTL", what: "Synthesizable microarchitecture and building blocks." },
  { id: "verification", name: "Verification", what: "Testbenches, SVA, coverage, UVM, formal, debug." },
  { id: "timing", name: "Timing", what: "Setup/hold, STA, constraints, closure." },
  { id: "asic", name: "ASIC flow", what: "Synthesis to GDS, signoff, tapeout." },
  { id: "pd", name: "Physical design", what: "Floorplan, placement, CTS, routing, signoff." },
  { id: "dft", name: "DFT", what: "Scan, ATPG, BIST, JTAG." },
  { id: "arch", name: "Computer architecture", what: "ISA, pipelines, caches, memory systems." },
  { id: "linux", name: "Linux", what: "Shell, Make, Git, tool workflows." },
  { id: "python", name: "Python", what: "Models, automation, cocotb, analysis." },
  { id: "tcl", name: "Tcl", what: "EDA tool scripting and constraints." },
  { id: "cpp", name: "C/C++", what: "Drivers, models, DPI, simulators." },
  { id: "protocols", name: "Protocols", what: "AMBA, UART/SPI/I2C, high-speed interfaces." },
  { id: "riscv", name: "RISC-V", what: "ISA, toolchain, cores, compliance." },
  { id: "aihw", name: "AI hardware", what: "MAC arrays, dataflows, quantization, accelerators." },
  { id: "eda", name: "EDA", what: "Algorithms and tools that design chips." },
  { id: "interview", name: "Interview skills", what: "Explaining, whiteboarding, project stories." },
  { id: "firmware", name: "Embedded firmware", what: "MCU architecture, bare metal, peripherals, interrupts, DMA, drivers, debugging." },
  { id: "rtos", name: "RTOS", what: "Real-time analysis, FreeRTOS, Zephyr, synchronisation." },
  { id: "emblinux", name: "Embedded Linux", what: "Boot chain, device tree, kernel drivers, Buildroot, Yocto." },
];

/** Target level per skill for each primary target (0 Awareness .. 4 Research). */
const base: Record<SkillId, number> = { digital: 3, hdl: 3, rtl: 2, verification: 2, timing: 2, asic: 1, pd: 1, dft: 1, arch: 2, linux: 2, python: 2, tcl: 1, cpp: 1, protocols: 2, riscv: 1, aihw: 0, eda: 0, interview: 3, firmware: 0, rtos: 0, emblinux: 0 };
export const TARGETS: Record<string, Record<SkillId, number>> = {
  rtl: { ...base, rtl: 3, timing: 3, asic: 2, protocols: 3, riscv: 2 },
  dv: { ...base, verification: 3, python: 3, cpp: 2, protocols: 3 },
  pd: { ...base, timing: 3, asic: 3, pd: 3, tcl: 3, rtl: 1 },
  dft: { ...base, dft: 3, asic: 2, tcl: 2, eda: 1 },
  fpga: { ...base, rtl: 3, timing: 3, protocols: 3, cpp: 2 },
  aihw: { ...base, rtl: 3, arch: 3, aihw: 3, python: 3 },
  eda: { ...base, eda: 3, python: 3, cpp: 3, asic: 2, timing: 2, rtl: 1 },
};

export const LEVEL_RULES = [
  "Awareness: at least one topic in this skill completed.",
  "Basic: at least half of this skill's must-know topics completed with confidence Okay or better.",
  "Working: Basic, plus at least one completed learning or flagship project that uses the skill, and 'coded' or 'practiced' evidence on at least half of its completed topics.",
  "Advanced: Working, plus a completed flagship project using the skill, confidence Strong on at least 70% of its completed topics, and interview accuracy of 70% or more in related categories (10+ attempts).",
  "Research: Advanced, plus a paper in this area marked reproduced or extended.",
];

export const LANGUAGES = [
  { name: "Verilog", why: "The RTL language of most designs and many interviews.", depth: "Advanced: synthesizable subset, testbenches, pitfalls.", skip: ["Gate-level primitives beyond reading", "UDPs", "Specify blocks"], learn: ["Modules, widths, always blocks", "Blocking vs non-blocking", "Generate and parameters", "Testbench basics"] },
  { name: "SystemVerilog", why: "Modern RTL and nearly all verification.", depth: "Advanced for DV; Working for RTL.", skip: ["Rarely used features (program blocks, some DPI corners) until needed"], learn: ["logic, enums, structs, always_ff/comb", "Interfaces and packages", "Classes, randomization, SVA, coverage", "UVM on top"] },
  { name: "Python", why: "Reference models, cocotb, automation, analysis, ML for EDA.", depth: "Working to Advanced; your software background covers the language.", skip: ["Web frameworks", "Advanced async beyond cocotb", "Anything you already know from JavaScript"], learn: ["Bit manipulation with masks", "Regex and file parsing", "subprocess and argparse", "NumPy, matplotlib, pandas", "pytest"] },
  { name: "C/C++", why: "Drivers, firmware, Verilator testbenches, DPI models, EDA tools.", depth: "Working (C); Basic to Working (C++), Advanced for EDA roles.", skip: ["GUI frameworks", "Template metaprogramming (unless EDA)"], learn: ["Fixed-width types and bit ops", "Pointers and volatile MMIO", "Structs and memory layout", "Compiling for RISC-V", "C++ classes and STL for Verilator/EDA"] },
  { name: "Tcl", why: "Every major EDA tool is scripted in Tcl; SDC is Tcl.", depth: "Working for PD/STA; Basic for others.", skip: ["Tk GUIs", "Deep metaprogramming"], learn: ["Substitution rules (braces vs quotes)", "Lists, loops, procs", "Tool collections and reports"] },
  { name: "Bash/Linux", why: "The daily environment of hardware engineers.", depth: "Working.", skip: ["System administration and certifications"], learn: ["Pipes, grep/sed/awk", "Make", "ssh, tmux", "Git branching"] },
];

export const DSA_FOR_HW = [
  { topic: "Arrays, strings, hash tables", hardware: "Parsing netlists and logs, building lookup tables for cells and nets.", practice: "Parse a Yosys JSON netlist and count cell types." },
  { topic: "Stacks and queues", hardware: "FIFO models, event queues, BFS in routing.", practice: "Model a FIFO scoreboard with a deque." },
  { topic: "Trees and heaps", hardware: "Event-driven simulators use priority queues; clock trees are trees.", practice: "Write a tiny event-driven simulator with heapq." },
  { topic: "Graphs, BFS/DFS", hardware: "Netlists are graphs; maze routing is BFS; connectivity checks.", practice: "Lee's maze router on a grid with obstacles." },
  { topic: "Topological sort", hardware: "Static timing analysis on the combinational DAG; levelization in simulators.", practice: "Compute logic depth per output of a netlist." },
  { topic: "Shortest/longest paths", hardware: "Critical path (longest path in a DAG), routing costs.", practice: "Longest path with weighted edges via DP." },
  { topic: "Union-find", hardware: "Net connectivity, LVS-style grouping.", practice: "Group shorted nets from a list of connections." },
  { topic: "Dynamic programming", hardware: "Optimal buffer insertion (van Ginneken-style), technology mapping.", practice: "Minimum-cost tiling of a small tree." },
  { topic: "Recursion and backtracking", hardware: "ATPG search (PODEM), constraint solving.", practice: "Find an input setting a node to 1 in a small circuit." },
  { topic: "Complexity analysis", hardware: "EDA tools must scale to millions of cells.", practice: "Estimate runtime of your STA script on 1M gates." },
  { topic: "Graph partitioning intuition", hardware: "Min-cut partitioning for placement and FPGAs.", practice: "Implement a greedy FM pass on a small hypergraph." },
  { topic: "Optimization intuition", hardware: "Placement, sizing and DSE are optimization problems.", practice: "Simulated annealing for a 2D placement toy problem." },
];

export const MATH_FOR_VLSI = [
  { topic: "Boolean algebra", why: "Logic design, synthesis, equivalence checking.", when: "Phase 2, used forever.", depth: "Working" },
  { topic: "Discrete math (sets, relations, combinatorics)", why: "State machines, coverage spaces, counting test cases.", when: "Phases 2 and 6.", depth: "Basic" },
  { topic: "Probability", why: "Metastability MTBF, random verification, yield, ML.", when: "Phases 2, 6 and 11.", depth: "Basic" },
  { topic: "Statistics", why: "Variation (OCV/POCV), benchmarking, ML evaluation.", when: "Phases 7 and 11.", depth: "Basic" },
  { topic: "Graph theory", why: "Netlists, timing graphs, routing, partitioning.", when: "Phase 7 and EDA track.", depth: "Working for EDA" },
  { topic: "Linear algebra", why: "Neural networks, systolic arrays, analytical placement.", when: "Phase 11 and EDA track.", depth: "Working for AI hardware" },
  { topic: "Calculus", why: "RC charging, power, optimization gradients.", when: "Phase 1 (refresher) and Phase 11.", depth: "Basic" },
  { topic: "Optimization", why: "Placement, sizing, design-space exploration, ML training.", when: "Phases 7, 9 and 11.", depth: "Basic, deeper for EDA" },
  { topic: "Signals and systems", why: "Filters, DSP datapaths, sampling.", when: "Fixed-point and DSP projects.", depth: "Basic" },
  { topic: "Fourier concepts", why: "Signal integrity, SerDes, clock jitter, analog/mixed-signal.", when: "Only for AMS or high-speed I/O specializations.", depth: "Awareness unless specializing" },
];
