import type { Resource, ResourceType } from "./schema.ts";
import { EXTRA_RESOURCES } from "./embedded-extra.ts";

const CHECKED = "2026-09-22";

// gh(): GitHub repositories verified live with `git ls-remote` on CHECKED.
const gh = (id: string, repo: string, title: string, type: ResourceType, note?: string): Resource => ({
  id, title, type, url: `https://github.com/${repo}`, source: "GitHub", free: true, verified: true, lastChecked: CHECKED, note,
});
// web(): URL seen in search results on CHECKED (verified) or known from memory (unverified).
const web = (id: string, title: string, type: ResourceType, url: string, source: string, verified: boolean, note?: string, free = true): Resource => ({
  id, title, type, url, source, free, verified, lastChecked: verified ? CHECKED : "never", note,
});
// book(): textbooks have no URL; find them through your library or publisher.
const book = (id: string, title: string, source: string, note?: string): Resource => ({
  id, title, type: "textbook", source, free: false, verified: false, lastChecked: "n/a", note,
});

const BASE_RESOURCES: Resource[] = [
  // Courses, lectures and practice sites
  web("hdlbits", "HDLBits: Verilog practice problems with instant feedback", "practice", "https://hdlbits.01xz.net/wiki/Main_Page", "HDLBits (Henry Wong)", true, "Do the problem set alongside Phases 2 and 4."),
  web("chipverify", "ChipVerify: Verilog, SystemVerilog and UVM tutorials and examples", "reading", "https://www.chipverify.com/verilog/verilog-examples", "ChipVerify", true),
  web("mutlu-yt", "Onur Mutlu Lectures (digital design and computer architecture)", "video", "https://www.youtube.com/OnurMutluLectures", "ETH Zurich / YouTube", true, "Full semester courses; start with Digital Design and Computer Architecture."),
  web("eth-ddca", "ETH Zurich Digital Design and Computer Architecture course site", "course", "https://safari.ethz.ch/digitaltechnik/spring2020/", "ETH Zurich SAFARI", true, "Slides, labs (Basys 3, Vivado) and readings."),
  web("nptel-verilog", "NPTEL: Hardware Modeling using Verilog (Prof. Indranil Sengupta, IIT Kharagpur)", "video", "https://onlinecourses.nptel.ac.in/noc22_cs94/preview", "NPTEL", true, "Free videos; optional proctored exam for a certificate."),
  web("va-courses", "Verification Academy courses and tracks", "course", "https://verificationacademy.com/courses", "Siemens EDA", true, "Free registration; includes an NCSU-developed functional verification course and industry verification studies."),
  web("va-sv-oop", "Verification Academy: SystemVerilog OOP for UVM Verification", "video", "https://verificationacademy.com/topics/systemverilog/systemverilog-oop-for-uvm-verification", "Siemens EDA", true),
  web("va-formal", "Verification Academy: What is formal and how it works", "video", "https://verificationacademy.com/topics/formal-verification/what-is-formal-and-how-it-works-under-the-hood", "Siemens EDA", true),
  web("coursera-fpga", "FPGA Design for Embedded Systems Specialization (CU Boulder)", "course", "https://coursera.org/specializations/fpga-design", "Coursera", true, "Paid (Coursera Plus); audit options vary.", false),
  web("fossi-open", "OpenLake FOSSi roadmap: open-source digital design phases", "reading", "https://github.com/OpenLake/FOSSI", "GitHub (community)", true, "Community-maintained learning roadmap; good tool links."),
  web("zipcpu", "ZipCPU blog: formal verification, AXI and FPGA design articles", "reading", "https://zipcpu.com/", "Dan Gisselquist", false),
  web("nandland", "Nandland: FPGA and Verilog tutorials", "reading", "https://nandland.com/", "Nandland", false),
  web("sunburst", "Sunburst Design papers (Cliff Cummings): nonblocking, FIFOs, CDC, resets, FSMs", "paper", "http://www.sunburst-design.com/papers/", "Sunburst Design", false, "Classic SNUG papers every RTL engineer reads."),
  web("missing-semester", "The Missing Semester of Your CS Education (shell, Git, tooling)", "course", "https://missing.csail.mit.edu/", "MIT", false),
  web("falstad", "Falstad circuit simulator (in-browser)", "tool", "https://www.falstad.com/circuit/", "Paul Falstad", false, "Great for RC, MOSFET and CMOS intuition."),
  web("python-docs", "The Python Tutorial", "docs", "https://docs.python.org/3/tutorial/", "Python Software Foundation", false),
  web("tcl-tutorial", "Tcl tutorial", "docs", "https://www.tcl.tk/man/tcl/tutorial/tcltutorial.html", "Tcl Developer Xchange", false),
  web("amba", "Arm AMBA specifications (APB, AXI, AXI-Stream)", "docs", "https://developer.arm.com/Architectures/AMBA", "Arm", false, "Free registration may be required to download specifications."),
  web("edaplayground", "EDA Playground: browser-based simulation", "tool", "https://www.edaplayground.com/", "EDA Playground", false, "Listed in the FOSSi community roadmap; zero-install practice."),
  web("surfer", "Surfer waveform viewer", "tool", "https://surfer-project.org/", "Surfer project", false, "Modern alternative to GTKWave."),
  web("verilator-docs", "Verilator documentation and articles", "docs", "https://veripool.org/verilator/documentation", "Veripool", true),
  web("verilator-uvm", "Support for upstream UVM 2017 in Verilator (Antmicro, Oct 2025)", "reading", "https://antmicro.com/blog/2025/10/support-for-upstream-uvm-2017-in-verilator", "Antmicro / CHIPS Alliance", true, "Includes a tutorial for running UVM with Verilator."),
  web("librelane-blog", "Announcing the release of LibreLane (FOSSi Foundation)", "reading", "https://fossi-foundation.org/blog/2025-08-18-ecl88", "FOSSi Foundation", true),
  web("tinytapeout", "Tiny Tapeout: get small designs manufactured on shared shuttles", "tool", "https://tinytapeout.com/", "Tiny Tapeout", true, "Pricing through the official calculator; check open shuttles."),
  web("rvfa", "RISC-V Foundational Associate (RVFA) certification", "course", "https://training.linuxfoundation.org/certification/linux-foundation-risc-v-foundational-associate/", "Linux Foundation", true, "Paid exam.", false),
  web("cdac-pg", "C-DAC ACTS post graduate programmes (including VLSI)", "course", "https://cdac.in/?id=DVLSI", "C-DAC", true, "Admission through C-CAT; see official brochure for fees.", false),
  web("c2s-pib", "Chips to Start-up (C2S) Programme factsheet, Jan 2026 (PIB)", "reading", "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jan/doc2026118760301.pdf", "Press Information Bureau, Govt. of India", true),

  // Tools and repositories (verified on GitHub)
  gh("oss-cad-suite", "YosysHQ/oss-cad-suite-build", "OSS CAD Suite: one download for Yosys, Icarus, Verilator, GTKWave, SymbiYosys and more", "tool"),
  gh("iverilog", "steveicarus/iverilog", "Icarus Verilog simulator", "tool"),
  gh("gtkwave", "gtkwave/gtkwave", "GTKWave waveform viewer", "tool"),
  gh("verilator", "verilator/verilator", "Verilator: fast open-source (System)Verilog simulator and linter", "tool"),
  gh("yosys", "YosysHQ/yosys", "Yosys open synthesis suite", "tool"),
  gh("sby", "YosysHQ/sby", "SymbiYosys: formal verification front-end", "tool"),
  gh("sv2v", "zachjs/sv2v", "sv2v: SystemVerilog to Verilog converter", "tool"),
  gh("cocotb", "cocotb/cocotb", "cocotb: Python-based verification framework", "tool"),
  gh("cocotbext-axi", "alexforencich/cocotbext-axi", "cocotbext-axi: AXI, AXI-Lite and AXI-Stream models for cocotb", "tool"),
  gh("verilog-axi", "alexforencich/verilog-axi", "verilog-axi: open AXI components (crossbar, adapters, FIFOs)", "reading"),
  gh("pulp-axi", "pulp-platform/axi", "PULP AXI: high-quality SystemVerilog AXI IP", "reading"),
  gh("lowrisc-style", "lowRISC/style-guides", "lowRISC Verilog/SystemVerilog coding style guide", "reading"),
  gh("peakrdl", "SystemRDL/PeakRDL-regblock", "PeakRDL-regblock: generate SystemVerilog register blocks from SystemRDL", "tool"),
  gh("orfs", "The-OpenROAD-Project/OpenROAD-flow-scripts", "OpenROAD flow scripts (RTL to GDS)", "tool"),
  gh("openroad", "The-OpenROAD-Project/OpenROAD", "OpenROAD: open physical design tool", "tool"),
  gh("opensta", "parallaxsw/OpenSTA", "OpenSTA static timing analyzer", "tool"),
  gh("librelane", "librelane/librelane", "LibreLane: FOSSi Foundation successor to OpenLane 2", "tool", "Nix install recommended; Colab demo available."),
  gh("klayout", "KLayout/klayout", "KLayout layout viewer and editor", "tool"),
  gh("magic", "RTimothyEdwards/magic", "Magic VLSI layout tool", "tool"),
  gh("iic-osic-tools", "iic-jku/IIC-OSIC-TOOLS", "IIC-OSIC-TOOLS: container with open analog and digital IC tools", "tool"),
  gh("sky130-pdk", "google/skywater-pdk", "SkyWater SKY130 open PDK", "docs"),
  gh("ihp-pdk", "IHP-GmbH/IHP-Open-PDK", "IHP SG13G2 open PDK (130 nm BiCMOS)", "docs"),
  gh("gf180-pdk", "google/gf180mcu-pdk", "GlobalFoundries GF180MCU open PDK", "docs"),
  gh("wafer-space-template", "wafer-space/gf180mcu-project-template", "wafer.space GF180MCU project template (LibreLane)", "tool"),
  gh("fault", "AUCOHL/Fault", "Fault: open-source DFT toolchain (scan, ATPG)", "tool", "Check activity before relying on it."),
  gh("dreamplace", "limbo018/DREAMPlace", "DREAMPlace: GPU-accelerated analytical placement", "tool"),
  gh("riscv-isa-manual", "riscv/riscv-isa-manual", "RISC-V ISA specification (source)", "docs"),
  gh("spike", "riscv-software-src/riscv-isa-sim", "Spike: RISC-V ISA simulator (golden model)", "tool"),
  gh("riscv-tests", "riscv-software-src/riscv-tests", "riscv-tests: ISA unit tests", "practice"),
  gh("riscof", "riscv-software-src/riscof", "RISCOF: RISC-V architectural test framework", "tool"),
  gh("riscv-dv", "chipsalliance/riscv-dv", "riscv-dv: random instruction generator", "tool"),
  gh("riscv-gnu-toolchain", "riscv-collab/riscv-gnu-toolchain", "RISC-V GNU toolchain", "tool"),
  gh("ripes", "mortbopet/Ripes", "Ripes: visual RISC-V pipeline simulator", "tool", "Excellent for seeing hazards and forwarding."),
  gh("digital-sim", "hneemann/Digital", "Digital: educational logic simulator", "tool"),
  gh("coremark", "eembc/coremark", "CoreMark CPU benchmark", "practice"),
  gh("champsim", "ChampSim/ChampSim", "ChampSim: trace-based microarchitecture simulator", "tool"),
  gh("gem5", "gem5/gem5", "gem5 architecture simulator", "tool"),
  gh("ibex", "lowRISC/ibex", "Ibex: small RISC-V core (with DV environment)", "reading"),
  gh("cva6", "openhwgroup/cva6", "CVA6: application-class RISC-V core", "reading"),
  gh("core-v-verif", "openhwgroup/core-v-verif", "CORE-V-VERIF: industrial-style UVM verification of open RISC-V cores", "reading"),
  gh("opentitan", "lowRISC/opentitan", "OpenTitan: open silicon root of trust", "reading"),
  gh("chipyard", "ucb-bar/chipyard", "Chipyard: SoC generator framework", "tool"),
  gh("litex", "enjoy-digital/litex", "LiteX: build FPGA SoCs quickly", "tool"),
  gh("vexriscv", "SpinalHDL/VexRiscv", "VexRiscv: configurable RISC-V soft core", "reading"),
  gh("picorv32", "YosysHQ/picorv32", "PicoRV32: small RISC-V core (archived)", "reading", "Archived upstream (checked 2026-09-24): still a compact, readable reference core; for maintained study code prefer Ibex or VeeR EL2."),
  gh("nextpnr", "YosysHQ/nextpnr", "nextpnr: open FPGA place and route", "tool"),
  gh("apicula", "YosysHQ/apicula", "Project Apicula: open tools for Gowin FPGAs", "tool"),
  gh("gemmini", "ucb-bar/gemmini", "Gemmini: systolic-array accelerator generator", "reading"),
  gh("nvdla", "nvdla/hw", "NVDLA: open deep-learning accelerator RTL", "reading"),
  gh("hls4ml", "fastmachinelearning/hls4ml", "hls4ml: ML inference on FPGAs via HLS", "tool"),
  gh("finn", "Xilinx/finn", "FINN: quantized neural networks on FPGAs", "tool"),
  gh("circuitnet", "circuitnet/CircuitNet", "CircuitNet: open dataset for ML in EDA", "tool"),
  gh("timingpredict", "TimingPredict/TimingPredict", "TimingPredict: GNN pre-routing slack prediction code", "tool"),
  gh("circuit-training", "google-research/circuit_training", "Circuit Training: RL macro placement (Google)", "tool"),
  gh("macroplacement", "TILOS-AI-Institute/MacroPlacement", "MacroPlacement: open evaluation of macro placement methods", "tool"),
  gh("verilog-eval", "NVlabs/verilog-eval", "VerilogEval benchmark", "tool"),
  gh("rtllm", "hkust-zhiyao/RTLLM", "RTLLM benchmark", "tool"),

  // Textbooks (no URL)
  book("harris-harris", "Digital Design and Computer Architecture, RISC-V Edition (Harris and Harris)", "Morgan Kaufmann", "Best single book for Phases 2 to 4."),
  book("patterson-hennessy", "Computer Organization and Design, RISC-V Edition (Patterson and Hennessy)", "Morgan Kaufmann"),
  book("hennessy-patterson", "Computer Architecture: A Quantitative Approach (Hennessy and Patterson)", "Morgan Kaufmann"),
  book("weste-harris", "CMOS VLSI Design: A Circuits and Systems Perspective (Weste and Harris)", "Pearson"),
  book("rabaey", "Digital Integrated Circuits: A Design Perspective (Rabaey, Chandrakasan, Nikolic)", "Pearson"),
  book("bhasker-sta", "Static Timing Analysis for Nanometer Designs (Bhasker and Chadha)", "Springer"),
  book("spear-sv", "SystemVerilog for Verification (Spear and Tumbush)", "Springer"),
  book("salemi-uvm", "The UVM Primer (Ray Salemi)", "Boston Light Press"),
  book("kahng-pd", "VLSI Physical Design: From Graph Partitioning to Timing Closure (Kahng, Lienig, Markov, Hu)", "Springer"),
  book("bushnell-agrawal", "Essentials of Electronic Testing (Bushnell and Agrawal)", "Springer"),
  book("razavi-analog", "Design of Analog CMOS Integrated Circuits (Razavi)", "McGraw-Hill"),
  book("sze-book", "Efficient Processing of Deep Neural Networks (Sze, Chen, Yang, Emer)", "Morgan & Claypool"),
];
export const RESOURCES: Resource[] = [...BASE_RESOURCES, ...EXTRA_RESOURCES];

export const RESOURCE_MAP: Record<string, Resource> = Object.fromEntries(RESOURCES.map((r) => [r.id, r]));
