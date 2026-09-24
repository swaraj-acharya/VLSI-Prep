import type { Module, Phase, Track } from "./schema.ts";

export const PHASES: Phase[] = [
  { id: "p0", num: 0, title: "Orientation and lab setup", short: "Orientation", stage: "I know how a chip gets made and my lab works.", goal: "See the whole journey from idea to silicon, understand the roles, and get a working simulation lab on your machine.", modules: ["m0a", "m0b"] },
  { id: "p1", num: 1, title: "Electrical and electronics foundations", short: "Electronics", stage: "I understand electricity, transistors and why nothing is instant.", goal: "Start from zero: charge, voltage and current, then RC delay, the MOSFET switch, CMOS gates, power and variation. No prior electronics assumed.", modules: ["m1z", "m1a", "m1b", "m1c", "m1d"] },
  { id: "p2", num: 2, title: "Digital logic foundations", short: "Digital logic", stage: "I understand logic gates, sequential logic and timing.", goal: "Binary, Boolean logic, combinational blocks, flip-flops, FSMs and the timing rules every design obeys.", modules: ["m2a", "m2b", "m2c", "m2d", "m2e"], gate: "Complete the Phase 1 mastery test (80%) or continue with a warning." },
  { id: "p3", num: 3, title: "Computer architecture foundations", short: "Architecture", stage: "I understand how a CPU runs a program.", goal: "ISA, RISC-V, datapaths, pipelines, hazards, caches, I/O and SoC structure.", modules: ["m3a", "m3b", "m3c", "m3d"], gate: "Digital logic mastery test (80%): FSMs, setup/hold and critical paths must be solid." },
  { id: "p4", num: 4, title: "Verilog and SystemVerilog", short: "HDL", stage: "I can read and write Verilog and SystemVerilog.", goal: "Describe hardware (not software), simulate it, read waveforms, and learn the SystemVerilog used by design and verification teams.", modules: ["m4a", "m4b", "m4c", "m4d"], gate: "Architecture basics test (80%) or continue with a warning." },
  { id: "p5", num: 5, title: "RTL design", short: "RTL", stage: "I can design RTL.", goal: "Synthesizable coding, datapath/control, handshakes, FIFOs, arbiters, standard protocols, CDC and low-power basics.", modules: ["m5a", "m5b", "m5c", "m5d"], gate: "HDL mastery test (80%): blocking vs non-blocking, latch inference and testbenches." },
  { id: "p6", num: 6, title: "Verification", short: "Verification", stage: "I can verify RTL.", goal: "Plans, self-checking testbenches, constrained random, SVA, coverage, UVM, formal and a real debugging method.", modules: ["m6a", "m6b", "m6c", "m6d", "m6e"], gate: "RTL mastery test (80%): handshakes, FIFOs and CDC basics." },
  { id: "p7", num: 7, title: "ASIC design flow and timing", short: "ASIC flow", stage: "I understand timing and the ASIC flow.", goal: "Synthesis, SDC, static timing analysis, physical design, DFT, tapeout, and running an open-source RTL-to-GDS flow.", modules: ["m7a", "m7b", "m7c", "m7d", "m7e"], gate: "Verification mastery test (80%)." },
  { id: "p8", num: 8, title: "First end-to-end silicon project", short: "End-to-end", stage: "I can take a design from spec to GDS and explain every step.", goal: "One realistic project through spec, microarchitecture, RTL, verification, synthesis, timing, place-and-route and a written report.", modules: ["m8a", "m8b", "m8c"], gate: "ASIC flow and STA mastery test (80%)." },
  { id: "p9", num: 9, title: "Specialization", short: "Specialize", stage: "I understand my specialization and why I chose it.", goal: "Pass the specialization gate, choose one primary and optionally one secondary track, and go deeper.", modules: ["m9a", "m9-rtl", "m9-dv", "m9-pd", "m9-dft", "m9-fpga", "m9-ams", "m9-val", "m9-eda", "m9-arch"], gate: "End-to-end project documented, plus core mastery tests. This is where you choose a direction." },
  { id: "p10", num: 10, title: "Advanced engineering", short: "Advanced", stage: "I can discuss architecture, timing, verification and tradeoffs in depth.", goal: "Out-of-order cores, coherence, NoCs, high-speed I/O, low-power architecture, security, reliability, co-design and judgment.", modules: ["m10a", "m10b"] },
  { id: "p11", num: 11, title: "AI hardware and AI for EDA", short: "AI x hardware", stage: "I understand how AI runs on hardware and where ML helps chip design.", goal: "MAC arrays, systolic arrays, dataflows, roofline, quantization, accelerators, transformers, then ML and LLMs in the EDA flow.", modules: ["m11a", "m11b"] },
  { id: "p12", num: 12, title: "Portfolio, certification, interviews and job search", short: "Job ready", stage: "I can prove what I can do and I am ready to apply.", goal: "Signature portfolio, showcase, resume, LinkedIn, networking, interview system and an honest job-search plan.", modules: ["m12a", "m12b", "m12c"] },
];

export const MODULES: Module[] = [
  { id: "m0a", phase: "p0", title: "Orientation", summary: "The chip-making journey, the roles, and what you already bring.", topics: ["chip-journey", "vlsi-roles", "starting-point"] },
  { id: "m0b", phase: "p0", title: "Lab setup", summary: "A working simulation lab and a diagnostic of where you stand.", topics: ["lab-setup"] },
  { id: "m1z", phase: "p1", title: "Electronics from zero", summary: "No prior electronics assumed: what charge, voltage and current are, how to read a circuit, capacitors, logic levels, and your first simulation.", topics: ["electricity-basics", "circuit-reading", "capacitor-basics", "logic-levels", "first-simulation"] },
  { id: "m1a", phase: "p1", title: "Circuits with a chip lens", summary: "The same quantities seen the way a chip designer uses them, then the RC delay idea behind all timing.", topics: ["circuit-laws", "rc-delay"] },
  { id: "m1b", phase: "p1", title: "Transistors and CMOS", summary: "From doped silicon to the MOSFET switch to CMOS gates.", topics: ["semiconductors", "mosfet", "cmos-inverter", "cmos-gates"] },
  { id: "m1c", phase: "p1", title: "Delay, power and variation", summary: "Why gates are slow, where power goes, and why every chip is slightly different.", topics: ["gate-delay", "power", "wires-variation", "fabrication"] },
  { id: "m1d", phase: "p1", title: "Engineer's toolkit I", summary: "The Linux workflow hardware engineers live in.", topics: ["linux-shell"] },
  { id: "m2a", phase: "p2", title: "Numbers and Boolean logic", summary: "How hardware represents numbers and truth.", topics: ["number-systems", "boolean-algebra", "logic-minimization"] },
  { id: "m2b", phase: "p2", title: "Combinational building blocks", summary: "Muxes, decoders, adders and the ALU.", topics: ["mux-decoder", "adders", "alu"] },
  { id: "m2c", phase: "p2", title: "Sequential logic", summary: "Memory, clocks, timing rules, metastability and resets.", topics: ["latches-flipflops", "clocking", "registers-counters", "setup-hold", "metastability", "resets"] },
  { id: "m2d", phase: "p2", title: "State machines and timing paths", summary: "FSMs, encodings, critical paths and memories.", topics: ["fsm", "fsm-encoding", "critical-path", "memory-basics"] },
  { id: "m2e", phase: "p2", title: "Engineer's toolkit II", summary: "Python for automation, analysis and verification.", topics: ["python-hw"] },
  { id: "m3a", phase: "p3", title: "How a computer runs a program", summary: "ISA, RISC-V, C on hardware, and a single-cycle CPU.", topics: ["isa", "riscv-isa", "c-for-hw", "single-cycle"] },
  { id: "m3b", phase: "p3", title: "Performance and pipelining", summary: "Measuring performance, pipelines, hazards, prediction.", topics: ["performance", "pipelining", "hazards", "branch-prediction"] },
  { id: "m3c", phase: "p3", title: "Memory hierarchy", summary: "Locality, virtual memory and caches.", topics: ["memory-hierarchy", "caches"] },
  { id: "m3d", phase: "p3", title: "Systems", summary: "I/O, interrupts, buses and SoCs.", topics: ["io-interrupts", "soc-buses"] },
  { id: "m4a", phase: "p4", title: "Thinking in hardware", summary: "Verilog as a description of circuits.", topics: ["hdl-mindset", "verilog-basics", "verilog-operators", "comb-modeling", "seq-modeling", "blocking-nonblocking", "latch-inference", "hierarchy-generate", "rtl-hw-mapping"] },
  { id: "m4b", phase: "p4", title: "Simulation", summary: "Testbenches, waveforms, simulator semantics, Verilator.", topics: ["testbench-basics", "waveform-debug", "sim-semantics", "verilator-lint"] },
  { id: "m4c", phase: "p4", title: "SystemVerilog for design", summary: "Types, procedural blocks, interfaces and packages.", topics: ["sv-design", "sv-interfaces-packages"] },
  { id: "m4d", phase: "p4", title: "SystemVerilog for verification", summary: "OOP, randomization and concurrency.", topics: ["sv-oop", "sv-random", "sv-concurrency"] },
  { id: "m5a", phase: "p5", title: "RTL design principles", summary: "Synthesizable code, partitioning, FSMs, handshakes, pipelines.", topics: ["rtl-guidelines", "datapath-control", "fsm-rtl", "valid-ready", "pipelined-rtl"] },
  { id: "m5b", phase: "p5", title: "Building blocks", summary: "FIFOs, arbiters, memories, fixed point.", topics: ["memories-rtl", "sync-fifo", "arbiters", "fixed-point"] },
  { id: "m5c", phase: "p5", title: "Protocols", summary: "UART, SPI, I2C and AMBA APB, AXI and AXI-Stream.", topics: ["uart", "spi-i2c", "apb", "axi", "axi-stream"] },
  { id: "m5d", phase: "p5", title: "Clocks, resets and power", summary: "CDC, async FIFOs, reset architecture and low-power RTL.", topics: ["cdc", "async-fifo", "reset-architecture", "low-power-rtl"] },
  { id: "m6a", phase: "p6", title: "Verification fundamentals", summary: "Why, what to check, and how to check it automatically.", topics: ["why-verification", "verification-plan", "self-checking-tb", "constrained-random"] },
  { id: "m6b", phase: "p6", title: "Testbench architecture", summary: "Layered testbenches and Python-based cocotb.", topics: ["layered-tb", "cocotb"] },
  { id: "m6c", phase: "p6", title: "Assertions and coverage", summary: "Properties that watch the design and metrics that measure completeness.", topics: ["sva", "coverage"] },
  { id: "m6d", phase: "p6", title: "UVM", summary: "The industry-standard verification methodology.", topics: ["uvm-architecture", "uvm-sequences", "uvm-env"] },
  { id: "m6e", phase: "p6", title: "Beyond simulation", summary: "Formal, CDC checks, debugging, regressions and gate-level checks.", topics: ["formal", "cdc-verification", "debug-method", "regression-ci", "gls-lec"] },
  { id: "m7a", phase: "p7", title: "Front-end flow", summary: "The flow, libraries, synthesis and constraints.", topics: ["asic-flow", "std-cells", "synthesis", "sdc"] },
  { id: "m7b", phase: "p7", title: "Static timing analysis", summary: "Slack, clocks, closure, corners and the graph algorithms underneath.", topics: ["sta", "clock-effects", "timing-closure", "corners-ocv", "graphs-in-eda"] },
  { id: "m7c", phase: "p7", title: "Physical design", summary: "Floorplan, placement, CTS, routing, signoff, and Tcl.", topics: ["floorplan", "placement-cts", "routing-signoff", "tcl-eda"] },
  { id: "m7d", phase: "p7", title: "Test and tapeout", summary: "DFT and what happens after GDS leaves your hands.", topics: ["dft", "tapeout"] },
  { id: "m7e", phase: "p7", title: "Hands-on flow and PPA", summary: "Run RTL to GDS yourself and learn to reason in PPA.", topics: ["open-flow", "ppa"] },
  { id: "m8a", phase: "p8", title: "Specify", summary: "Spec and microarchitecture before code.", topics: ["spec-writing", "microarchitecture"] },
  { id: "m8b", phase: "p8", title: "Build and verify", summary: "RTL and verification sprint.", topics: ["e2e-build"] },
  { id: "m8c", phase: "p8", title: "Implement and report", summary: "Synthesis, timing, place-and-route, reports.", topics: ["e2e-implement", "e2e-report"] },
  { id: "m9a", phase: "p9", title: "Specialization gate", summary: "Choose with evidence, not hype.", topics: ["specialization-gate"] },
  { id: "m9-rtl", phase: "p9", title: "Track: RTL design", summary: "Microarchitecture for PPA, interconnects, power intent.", topics: ["rtl-microarch-ppa", "rtl-interconnect", "rtl-power-intent"], track: "rtl" },
  { id: "m9-dv", phase: "p9", title: "Track: Design verification", summary: "Advanced UVM, coverage closure, formal in practice.", topics: ["uvm-advanced", "coverage-closure", "formal-advanced"], track: "dv" },
  { id: "m9-pd", phase: "p9", title: "Track: Physical design and STA", summary: "Closure and ECOs, signoff, flow automation.", topics: ["pd-closure-eco", "pd-signoff", "pd-scripting"], track: "pd" },
  { id: "m9-dft", phase: "p9", title: "Track: DFT", summary: "Scan and compression, ATPG, MBIST and JTAG.", topics: ["dft-scan-compression", "dft-atpg", "dft-mbist-jtag"], track: "dft" },
  { id: "m9-fpga", phase: "p9", title: "Track: FPGA", summary: "Architecture, timing closure, HLS and prototyping.", topics: ["fpga-architecture", "fpga-timing", "fpga-hls-prototype"], track: "fpga" },
  { id: "m9-ams", phase: "p9", title: "Track: Analog and mixed-signal (intro)", summary: "Analog building blocks and data converters.", topics: ["analog-blocks", "data-converters"], track: "ams" },
  { id: "m9-val", phase: "p9", title: "Track: Silicon validation", summary: "Bring-up and lab automation.", topics: ["silicon-validation", "validation-automation"], track: "validation" },
  { id: "m9-eda", phase: "p9", title: "Track: EDA engineering", summary: "Algorithms and tools built on open-source EDA.", topics: ["eda-algorithms", "eda-tooling"], track: "eda" },
  { id: "m9-arch", phase: "p9", title: "Track: Computer architecture", summary: "Performance modeling and advanced memory systems.", topics: ["perf-modeling", "arch-memory-systems"], track: "arch" },
  { id: "m10a", phase: "p10", title: "Advanced architecture", summary: "Superscalar cores, coherence, NoCs.", topics: ["superscalar-ooo", "coherence", "noc"] },
  { id: "m10b", phase: "p10", title: "System-level engineering", summary: "I/O, power, security, reliability, co-design, judgment.", topics: ["high-speed-io", "low-power-arch", "hw-security", "reliability", "hw-sw-codesign", "design-tradeoffs"] },
  { id: "m11a", phase: "p11", title: "AI hardware", summary: "How neural networks become MACs, memory traffic and silicon.", topics: ["nn-compute", "matmul-mac", "systolic", "roofline", "quantization-sparsity", "accelerators", "transformer-hw"] },
  { id: "m11b", phase: "p11", title: "AI for EDA", summary: "ML and LLMs inside the chip design flow. Mostly research-level.", topics: ["ml-for-eda", "ml-prediction", "rl-placement", "llm-hardware"] },
  { id: "m12a", phase: "p12", title: "Proof of work", summary: "Portfolio strategy, showcase and certification decisions.", topics: ["portfolio-strategy", "github-showcase", "certifications-eval"] },
  { id: "m12b", phase: "p12", title: "Visibility", summary: "Resume, LinkedIn, networking and building in public.", topics: ["resume", "linkedin-networking", "build-in-public"] },
  { id: "m12c", phase: "p12", title: "Interviews and applications", summary: "Interview system, job search, growth plan.", topics: ["interview-system", "job-search", "growth-plan"] },
];

export const TRACKS: Track[] = [
  { id: "rtl", title: "RTL design", summary: "Turn specs into efficient, synthesizable microarchitecture.", topics: ["rtl-microarch-ppa", "rtl-interconnect", "rtl-power-intent"], careers: ["rtl", "arch", "aihw"] },
  { id: "dv", title: "Design verification", summary: "Prove designs work before silicon, at scale.", topics: ["uvm-advanced", "coverage-closure", "formal-advanced"], careers: ["dv"] },
  { id: "pd", title: "Physical design and STA", summary: "Take netlists to clean, timing-closed layout.", topics: ["pd-closure-eco", "pd-signoff", "pd-scripting"], careers: ["pd", "sta"] },
  { id: "dft", title: "Design for test", summary: "Make silicon testable and measure test quality.", topics: ["dft-scan-compression", "dft-atpg", "dft-mbist-jtag"], careers: ["dft"] },
  { id: "fpga", title: "FPGA", summary: "Build and close timing on real programmable hardware.", topics: ["fpga-architecture", "fpga-timing", "fpga-hls-prototype"], careers: ["fpga"] },
  { id: "ams", title: "Analog and mixed-signal (intro)", summary: "A starting point; deep analog usually needs formal study.", topics: ["analog-blocks", "data-converters"], careers: ["analog", "mixed"] },
  { id: "validation", title: "Silicon validation", summary: "Bring up real chips and automate the lab.", topics: ["silicon-validation", "validation-automation"], careers: ["validation"] },
  { id: "eda", title: "EDA engineering", summary: "Write the software that designs chips. Strong fit for software backgrounds.", topics: ["eda-algorithms", "eda-tooling"], careers: ["eda", "aieda"] },
  { id: "arch", title: "Computer architecture", summary: "Model and evaluate processors and memory systems.", topics: ["perf-modeling", "arch-memory-systems"], careers: ["arch", "aihw"] },
];

/** Default track for each primary target role (Settings). */
export const TARGET_TO_TRACK: Record<string, Track["id"]> = {
  rtl: "rtl", dv: "dv", pd: "pd", dft: "dft", fpga: "fpga", aihw: "rtl", eda: "eda",
};

export const TARGET_LABELS: Record<string, string> = {
  rtl: "RTL design", dv: "Design verification", pd: "Physical design", dft: "DFT", fpga: "FPGA", aihw: "AI hardware", eda: "EDA",
};

/** The single main (VLSI) road. Track topics are resolved at runtime from the specialization choice. Embedded modules are excluded. */
export const MAIN_ROAD: string[] = MODULES.filter((m) => !m.track && !m.phase.startsWith("e")).flatMap((m) => m.topics);

/** Days reserved for specialization after the gate: primary track, then a compressed secondary track. */
export const PRIMARY_SLOT_DAYS = 7;
export const SECONDARY_SLOT_DAYS = 4;

// ---------------------------------------------------------------------------------------------
// Embedded Engineering road (added 2026-09-24). Self-paced: it does not change the VLSI day plan.
// Default path: C -> MCU -> bare metal -> peripherals -> interrupts/DMA -> debugging -> RTOS ->
// networking -> boot/OTA/security -> Linux/BSP -> specialization. Branch modules are optional.
// ---------------------------------------------------------------------------------------------
export const EMBEDDED_PHASES: Phase[] = [
  { id: "e0", num: 0, program: "embedded", title: "Orientation, lab and electronics for firmware", short: "Orientation", stage: "I know what embedded engineers do, and my board or emulator works.", goal: "Choose a role direction, set up one board plus an emulator and a minimal instrument kit, and learn the electronics firmware depends on.", modules: ["e0a", "e0b"] },
  { id: "e1", num: 1, program: "embedded", title: "C for embedded engineers", short: "C", stage: "I write C that is safe next to hardware.", goal: "Build model, memory layout, bit manipulation and volatile, undefined behaviour, core firmware patterns and a disciplined C++ subset.", modules: ["e1a", "e1b"] },
  { id: "e2", num: 2, program: "embedded", title: "MCU architecture and the toolchain", short: "MCU + toolchain", stage: "I can explain reset to main() from my own startup code.", goal: "Cortex-M core, memory map, exceptions and NVIC, assembly reading, cross toolchain, linker scripts, startup code and the CMSIS/HAL ladder.", modules: ["e2a", "e2b"] },
  { id: "e3", num: 3, program: "embedded", title: "Bare-metal peripherals", short: "Peripherals", stage: "I drive peripherals from registers, then from the HAL, and know the difference.", goal: "GPIO, timers and PWM, UART, SPI and I2C, ADC, watchdog, RTC and internal flash.", modules: ["e3a"] },
  { id: "e4", num: 4, program: "embedded", title: "Interrupts, DMA, drivers and power", short: "IRQ, DMA, drivers", stage: "I write interrupt-safe, DMA-driven, testable drivers.", goal: "Concurrency with interrupts, DMA as a first-class skill, driver design and low-power firmware.", modules: ["e4a"] },
  { id: "e5", num: 5, program: "embedded", title: "Debugging, measurement and testing", short: "Debug + test", stage: "I measure instead of guessing and test without hardware.", goal: "GDB + OpenOCD + SWD/JTAG, fault forensics, instruments, host unit tests, emulators and HIL, CI and static analysis.", modules: ["e5a", "e5b"] },
  { id: "e6", num: 6, program: "embedded", title: "Real-time systems and RTOS", short: "RTOS", stage: "I design RTOS applications that meet their deadlines.", goal: "Real-time analysis, kernel internals, FreeRTOS in practice, synchronisation and priority inversion, then Zephyr.", modules: ["e6a", "e6b"] },
  { id: "e7", num: 7, program: "embedded", title: "Communication and networking", short: "Comms", stage: "My devices talk reliably and securely.", goal: "CAN, USB concepts, TCP/IP with lwIP, MQTT and TLS, Wi-Fi/BLE with ESP-IDF or Zephyr.", modules: ["e7a"] },
  { id: "e8", num: 8, program: "embedded", title: "Production firmware: boot, update, security and reliability", short: "Production", stage: "My firmware can be updated safely, is secure by design and is diagnosable in the field.", goal: "Bootloaders, MCUboot secure boot and OTA, security engineering, power-loss-safe storage, performance and release engineering.", modules: ["e8a", "e8b"] },
  { id: "e9", num: 9, program: "embedded", title: "Embedded Linux and BSP", short: "Linux/BSP", stage: "I can bring up Linux on a board and write its drivers.", goal: "Linux systems programming, boot chain, U-Boot, device tree, kernel drivers, Buildroot, then Yocto 6.0.", modules: ["e9a", "e9b"] },
  { id: "e10", num: 10, program: "embedded", title: "Crossover, specialization and job readiness", short: "Specialize", stage: "I can work across hardware and firmware, have one specialization, and can prove it.", goal: "The VLSI + Embedded crossover, one optional branch (automotive, robotics, DSP, TinyML, bring-up), interviews and portfolio.", modules: ["e10x", "e10-auto", "e10-robot", "e10-dsp", "e10-ml", "e10-bringup", "e10c"] },
];

MODULES.push(
  { id: "e0a", phase: "e0", title: "Orientation and lab", summary: "Role families, levels, board and emulator setup.", topics: ["emb-orientation", "emb-lab"] },
  { id: "e0b", phase: "e0", title: "Electronics for firmware", summary: "Pins, pull-ups, bounce, supplies and measurement basics.", topics: ["emb-electronics"] },
  { id: "e1a", phase: "e1", title: "C core", summary: "Build model, memory layout, bits and volatile, undefined behaviour.", topics: ["emb-c-build", "emb-c-memory", "emb-c-bits", "emb-c-ub"] },
  { id: "e1b", phase: "e1", title: "Firmware patterns and C++", summary: "Ring buffers, state machines, event queues, pools; C++ decisions.", topics: ["emb-c-patterns", "emb-cpp"] },
  { id: "e2a", phase: "e2", title: "Inside the MCU", summary: "Core, memory map, clocks, exceptions, assembly.", topics: ["emb-mcu-arch", "emb-exceptions", "emb-asm"] },
  { id: "e2b", phase: "e2", title: "Toolchain and startup", summary: "Cross toolchain, linker scripts, startup code, CMSIS and HALs.", topics: ["emb-toolchain", "emb-linker-startup", "emb-cmsis-hal"] },
  { id: "e3a", phase: "e3", title: "Peripherals from registers up", summary: "Do it with registers, then with the HAL, and compare.", topics: ["emb-gpio", "emb-timers", "emb-uart", "emb-spi-i2c", "emb-adc", "emb-wdt-flash"] },
  { id: "e4a", phase: "e4", title: "Interrupts, DMA, drivers, power", summary: "Concurrency, data movement, driver design, energy.", topics: ["emb-interrupts", "emb-dma", "emb-drivers", "emb-power"] },
  { id: "e5a", phase: "e5", title: "Debugging and measurement", summary: "GDB/OpenOCD, fault forensics, instruments.", topics: ["emb-gdb-openocd", "emb-faults", "emb-instruments"] },
  { id: "e5b", phase: "e5", title: "Testing and CI", summary: "Host tests, emulators and HIL, CI and static analysis.", topics: ["emb-testing", "emb-emulation-hil", "emb-ci-static"] },
  { id: "e6a", phase: "e6", title: "Real-time and FreeRTOS", summary: "Analysis, kernel internals, FreeRTOS, synchronisation.", topics: ["emb-realtime", "emb-rtos-kernel", "emb-freertos", "emb-rtos-sync"] },
  { id: "e6b", phase: "e6", title: "Zephyr", summary: "The modern alternative, after FreeRTOS.", topics: ["emb-zephyr"] },
  { id: "e7a", phase: "e7", title: "Buses, networks and radios", summary: "CAN, USB, TCP/IP, MQTT/TLS, wireless.", topics: ["emb-can", "emb-usb", "emb-tcpip", "emb-iot-proto", "emb-wireless"] },
  { id: "e8a", phase: "e8", title: "Boot and update", summary: "Bootloaders, secure boot and OTA.", topics: ["emb-bootloader", "emb-ota"] },
  { id: "e8b", phase: "e8", title: "Security and reliability", summary: "Security, storage, performance, production.", topics: ["emb-security", "emb-storage", "emb-performance", "emb-production"] },
  { id: "e9a", phase: "e9", title: "Linux foundations", summary: "Systems programming, cross-compilation, boot chain.", topics: ["emb-linux-sys", "emb-linux-boot"] },
  { id: "e9b", phase: "e9", title: "BSP", summary: "U-Boot, device tree, drivers, Buildroot, Yocto.", topics: ["emb-uboot", "emb-devicetree", "emb-linux-drivers", "emb-buildroot", "emb-yocto"] },
  { id: "e10x", phase: "e10", title: "VLSI + Embedded crossover", summary: "From register map and RTL to driver and validation.", topics: ["emb-hwsw-crossover"] },
  { id: "e10-auto", phase: "e10", title: "Branch: automotive", summary: "Diagnostics, AUTOSAR, functional safety.", topics: ["emb-automotive"], branch: "automotive" },
  { id: "e10-robot", phase: "e10", title: "Branch: robotics and control", summary: "Motors, encoders, IMUs, PID.", topics: ["emb-control"], branch: "robotics" },
  { id: "e10-dsp", phase: "e10", title: "Branch: embedded DSP", summary: "Filters, FFT, fixed point, CMSIS-DSP.", topics: ["emb-dsp"], branch: "dsp" },
  { id: "e10-ml", phase: "e10", title: "Branch: TinyML", summary: "Quantised inference on MCUs.", topics: ["emb-tinyml"], branch: "tinyml" },
  { id: "e10-bringup", phase: "e10", title: "Branch: board bring-up", summary: "New hardware, first firmware, stable platform.", topics: ["emb-bringup"], branch: "bringup" },
  { id: "e10c", phase: "e10", title: "Job readiness", summary: "Interviews, numericals, portfolio.", topics: ["emb-interview", "emb-portfolio"] },
);

/** The core Embedded road in teaching order (branch modules excluded). */
export const EMBEDDED_ROAD: string[] = EMBEDDED_PHASES.flatMap((p) => p.modules)
  .map((id) => MODULES.find((m) => m.id === id)!)
  .filter((m) => !m.branch)
  .flatMap((m) => m.topics);

/** Every phase of both programs, for lookups by id. PHASES stays VLSI-only because the day plan and gates depend on its order. */
export const ALL_PHASES: Phase[] = [...PHASES, ...EMBEDDED_PHASES];
export const isEmbeddedPhase = (id: string) => id.startsWith("e");
export const phaseLabel = (p: Phase) => (p.program === "embedded" ? `Embedded E${p.num}` : `Phase ${p.num}`);
export const phaseHref = (p: Phase) => (p.program === "embedded" ? `/embedded#${p.id}` : `/roadmap#${p.id}`);
