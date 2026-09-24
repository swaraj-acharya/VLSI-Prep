// Structured data for the /embedded page. Topic and project IDs are validated by scripts/validate.ts.
export const EMBEDDED_RESEARCHED = "2026-09-24";

export const EMBEDDED_LOOP = ["Learn", "Program", "Flash", "Measure", "Debug", "Test", "Optimize", "Deploy"];
export const CROSSOVER_LOOP = ["Hardware", "RTL", "SoC", "Driver", "Firmware", "Debug", "Validate"];

/** VLSI-road topics that the Embedded road reuses instead of duplicating. */
export const SHARED_FOUNDATIONS = ["electricity-basics", "circuit-reading", "logic-levels", "number-systems", "boolean-algebra", "fsm", "isa", "c-for-hw", "memory-hierarchy", "io-interrupts", "soc-buses", "linux-shell", "python-hw"];

export interface Level { id: string; title: string; phases: string[]; topics: string[]; note: string }
export const LEVELS: Level[] = [
  { id: "L0", title: "Electronics and computing foundations", phases: ["e0"], topics: ["emb-orientation", "emb-lab", "emb-electronics"], note: "Plus the shared VLSI foundations below." },
  { id: "L1", title: "C for embedded", phases: ["e1"], topics: ["emb-c-build", "emb-c-memory", "emb-c-bits", "emb-c-ub", "emb-c-patterns", "emb-cpp"], note: "Bit manipulation, volatile and memory layout are interview staples." },
  { id: "L2", title: "Computer architecture and MCU fundamentals", phases: ["e2"], topics: ["emb-mcu-arch", "emb-exceptions", "emb-asm"], note: "Cortex-M as the primary model; RISC-V MCUs compared." },
  { id: "L3", title: "Bare-metal firmware", phases: ["e2", "e3"], topics: ["emb-toolchain", "emb-linker-startup", "emb-cmsis-hal", "emb-gpio"], note: "Registers first, then CMSIS/HAL, and compare." },
  { id: "L4", title: "Peripherals, interrupts and DMA", phases: ["e3", "e4"], topics: ["emb-timers", "emb-uart", "emb-spi-i2c", "emb-adc", "emb-wdt-flash", "emb-interrupts", "emb-dma", "emb-drivers", "emb-power"], note: "The core of MCU firmware jobs." },
  { id: "L5", title: "Debugging, measurement and toolchain mastery", phases: ["e5"], topics: ["emb-gdb-openocd", "emb-faults", "emb-instruments", "emb-testing", "emb-emulation-hil", "emb-ci-static"], note: "GDB + OpenOCD + SWD/JTAG, and measure instead of guessing." },
  { id: "L6", title: "Real-time systems and RTOS", phases: ["e6"], topics: ["emb-realtime", "emb-rtos-kernel", "emb-freertos", "emb-rtos-sync", "emb-zephyr"], note: "Primary RTOS: FreeRTOS. Modern alternative: Zephyr. Reference: NuttX, ThreadX, RIOT." },
  { id: "L7", title: "Communication and networking", phases: ["e7"], topics: ["emb-can", "emb-usb", "emb-tcpip", "emb-iot-proto", "emb-wireless"], note: "Pick wireless depth by career direction." },
  { id: "L8", title: "Advanced firmware engineering", phases: ["e8"], topics: ["emb-storage", "emb-performance", "emb-production"], note: "Storage, performance and production discipline." },
  { id: "L9", title: "Bootloaders, OTA and security", phases: ["e8"], topics: ["emb-bootloader", "emb-ota", "emb-security"], note: "Placed before Linux on this road: MCU update and security build directly on L3-L8." },
  { id: "L10", title: "Embedded Linux and BSP", phases: ["e9"], topics: ["emb-linux-sys", "emb-linux-boot", "emb-uboot", "emb-devicetree", "emb-linux-drivers", "emb-buildroot", "emb-yocto"], note: "Buildroot before Yocto; simple char/platform drivers before anything complex." },
  { id: "L11", title: "Advanced systems and the VLSI crossover", phases: ["e10"], topics: ["emb-hwsw-crossover", "emb-bringup"], note: "Hardware/software co-design, bring-up, pre-silicon firmware." },
  { id: "L12", title: "Specialization and job readiness", phases: ["e10"], topics: ["emb-automotive", "emb-control", "emb-dsp", "emb-tinyml", "emb-interview", "emb-portfolio"], note: "Choose one branch; keep the core strong." },
];

export interface RolePath { id: string; title: string; career?: string; steps: string[]; note: string }
export const ROLE_PATHS: RolePath[] = [
  { id: "fw", title: "Firmware engineer", career: "emb-firmware", steps: ["emb-c-bits", "emb-mcu-arch", "emb-linker-startup", "emb-drivers", "emb-uart", "emb-spi-i2c", "emb-freertos", "emb-testing", "emb-performance"], note: "C, MCU, bare metal, drivers, peripherals, RTOS, testing, optimisation." },
  { id: "rtos", title: "RTOS engineer", career: "emb-firmware", steps: ["emb-c-patterns", "emb-mcu-arch", "emb-interrupts", "emb-realtime", "emb-rtos-kernel", "emb-rtos-sync", "emb-zephyr", "emb-drivers", "emb-faults"], note: "Interrupts, scheduling, synchronisation, timing, drivers, debugging." },
  { id: "bsp", title: "Embedded Linux / BSP engineer", career: "emb-linux", steps: ["emb-c-memory", "emb-linux-sys", "emb-linux-boot", "emb-uboot", "emb-devicetree", "emb-linux-drivers", "emb-buildroot", "emb-yocto"], note: "C, Linux, cross-compilation, boot, U-Boot, kernel, device tree, drivers, Buildroot, Yocto." },
  { id: "auto", title: "Automotive embedded", career: "emb-automotive", steps: ["emb-c-ub", "emb-mcu-arch", "emb-freertos", "emb-can", "emb-bootloader", "emb-automotive", "emb-ci-static", "emb-security"], note: "C (MISRA), MCU, RTOS, CAN, diagnostics, bootloader, AUTOSAR, ISO 26262, cybersecurity." },
  { id: "iot", title: "IoT / edge", career: "emb-iot", steps: ["emb-mcu-arch", "emb-power", "emb-tcpip", "emb-wireless", "emb-iot-proto", "emb-ota", "emb-security", "emb-production"], note: "MCU, networking, Wi-Fi/BLE, MQTT, TLS, OTA, security, fleet operations." },
  { id: "ai", title: "Embedded AI", career: "emb-edge-ai", steps: ["emb-mcu-arch", "emb-adc", "emb-dsp", "emb-performance", "emb-tinyml"], note: "MCU, DSP, optimisation, quantisation, TinyML, CMSIS-DSP/CMSIS-NN, deployment." },
];

export const BOARD_STRATEGY = [
  { stage: "Start (week 1)", pick: "Emulator: Renode or QEMU; Wokwi for quick circuits", why: "Zero cost, and startup code, C and RTOS basics work without hardware.", alt: "Any board you already own, including an Arduino, for orientation only." },
  { stage: "Primary board (from E2)", pick: "STM32 Nucleo (for example an F4 or G4 Nucleo-64)", why: "On-board ST-LINK probe for SWD debugging, huge documentation, CMSIS + HAL + LL, the STM32CubeF4-style official ecosystem.", alt: "Raspberry Pi Pico 2 (RP2350, Arm or RISC-V cores, excellent C SDK) plus a Debug Probe." },
  { stage: "Connectivity (E7)", pick: "ESP32 dev board with ESP-IDF", why: "Inexpensive Wi-Fi/BLE with a professional SDK, OTA and secure boot.", alt: "Nordic nRF52/nRF54 DK for BLE with Zephyr/nRF Connect SDK (on-board debugger)." },
  { stage: "RTOS depth (E6)", pick: "Same Nucleo for FreeRTOS; a Nordic DK or Nucleo for Zephyr", why: "Reuse known hardware so you learn the RTOS, not a new board.", alt: "RP2350 or any Zephyr-supported board." },
  { stage: "Embedded Linux (E9)", pick: "QEMU aarch64 virt first, then a Raspberry Pi or BeagleBone", why: "Kernel and driver work is safest to learn in QEMU.", alt: "Any board with good mainline U-Boot and kernel support." },
  { stage: "Crossover", pick: "An iCE40 or ECP5 FPGA board supported by Yosys/nextpnr", why: "Open toolchain for the SoC peripheral flagship.", alt: "A vendor FPGA board with free tools." },
];

export const HARDWARE_TIERS = [
  { tier: "No hardware", items: "C, UB, ring buffers, CLI parser, CRC, calculators, host unit tests, CI, QEMU/Renode firmware, Linux drivers on QEMU, SocketCAN/UDS on vcan." },
  { tier: "Recommended board", items: "STM32 Nucleo with on-board probe (or Pico 2 + Debug Probe)." },
  { tier: "Small parts kit", items: "Breadboard, jumpers, LEDs and resistors, push buttons, potentiometer, a 3.3 V I2C sensor, an SPI NOR flash module, USB-UART adapter." },
  { tier: "Instruments", items: "8-channel logic analyzer with PulseView and a multimeter first; an oscilloscope and a current-measuring supply or power profiler later." },
  { tier: "Branch-specific", items: "CAN transceivers or a USB-CAN adapter (automotive), ESP32 or Nordic DK (wireless), DC motor with encoder and driver (robotics), IMU (TinyML), FPGA board (crossover)." },
];

export const TOOLCHAIN_MATRIX: [string, string, string][] = [
  ["Compiler", "GCC (arm-none-eabi)", "GCC, Clang/LLVM, vendor and safety-qualified toolchains"],
  ["Build", "Make", "CMake + Ninja; west (Zephyr); idf.py (ESP-IDF)"],
  ["Debug", "GDB", "GDB + OpenOCD over SWD/JTAG; trace (SWO/ITM, ETM)"],
  ["Simulation", "Host unit tests", "QEMU, Renode, hardware-in-the-loop rigs"],
  ["RTOS", "FreeRTOS", "Zephyr; NuttX and ThreadX as references"],
  ["MCU", "STM32 Nucleo or Pico 2", "STM32, Nordic nRF, ESP32, NXP, RISC-V MCUs"],
  ["Linux", "Buildroot", "Yocto 6.0 (bitbake-setup, layers)"],
  ["Boot", "Simple UART bootloader", "MCUboot (MCU), U-Boot + FIT (Linux)"],
  ["Analysis", "printf/logging", "Logic analyzer, oscilloscope, profiling, trace"],
  ["Static analysis", "Compiler warnings (-Wall -Wextra)", "cppcheck, clang-tidy, MISRA/CERT checkers"],
  ["CI", "GitHub Actions build + tests", "Cross-build matrix, emulator tests, HIL stage"],
];

export const PROJECT_TEMPLATE = [
  "Product requirement", "Hardware assumptions", "Firmware architecture", "State machine", "Interfaces", "Timing requirements", "Resource budget (flash, RAM, CPU, power)", "Implementation plan", "Driver layer", "Application layer", "Testing", "Debugging notes", "Performance", "Power", "Security", "CI", "Documentation", "Release",
];

export const CROSSOVER_TEMPLATE = [
  "Hardware specification", "Register map (SystemRDL)", "RTL", "Synthesis and timing", "SoC integration", "Generated C header", "C driver", "Firmware", "Testbench (cocotb/SV)", "Hardware validation", "Debug", "Performance", "Documentation",
];

export const VLSI_TO_EMBEDDED = [
  { topic: "isa", why: "The ISA you studied is what the compiler targets and what you read in disassembly." },
  { topic: "riscv-isa", why: "RISC-V MCUs and soft cores run your firmware; CSRs and traps map to the exception model." },
  { topic: "soc-buses", why: "AHB/APB/AXI are the buses firmware reads and writes through." },
  { topic: "io-interrupts", why: "Interrupt controllers in RTL become NVIC/PLIC programming in firmware." },
  { topic: "fpga-architecture", why: "FPGA soft SoCs are where you run firmware on your own hardware." },
  { topic: "hw-sw-codesign", why: "Decide what goes in hardware versus firmware with evidence." },
  { topic: "silicon-validation", why: "Validation engineers write bring-up and test firmware for new silicon." },
];

export const EMBEDDED_TO_VLSI = [
  { topic: "rtl-hw-mapping", why: "See how the peripherals you program are built from RTL." },
  { topic: "uart", why: "Design the UART you have been driving." },
  { topic: "apb", why: "The register bus behind every peripheral register you wrote." },
  { topic: "axi", why: "DMA engines and high-performance peripherals use AXI." },
  { topic: "cdc", why: "The same metastability that affects asynchronous inputs to an MCU." },
  { topic: "sva", why: "Assertions check the hardware/software contract from the RTL side." },
  { topic: "fpga-architecture", why: "Prototype SoCs and accelerators for your firmware." },
];

export const CROSSOVER_IDEAS = [
  "Custom UART RTL + C driver", "SPI peripheral + firmware", "APB timer + RISC-V/Cortex-M software model", "Hardware CRC or crypto accelerator + firmware API", "DMA engine + driver", "RISC-V custom instruction experiment", "Sensor-interface RTL + FPGA firmware", "SoC boot flow: boot ROM -> loader -> application",
];

export const READ_REAL_CODE = [
  { project: "Zephyr", res: "gh-zephyr", read: "One GPIO or I2C driver under drivers/", identify: ["initialisation", "device struct and config", "API table", "interrupt handling", "callbacks"] },
  { project: "Linux kernel", res: "gh-linux", read: "One small platform or I2C driver and its devicetree binding", identify: ["probe and remove", "platform device", "of_match_table", "devm_* resources", "sysfs"] },
  { project: "FreeRTOS", res: "gh-freertos", read: "tasks.c, queue.c and the Cortex-M port", identify: ["ready lists", "context switch (PendSV)", "blocking and waking", "critical sections"] },
  { project: "Pico SDK", res: "gh-pico-sdk", read: "hardware_gpio, hardware_pio, hardware_dma", identify: ["register access layer", "PIO program loading", "DMA channel configuration"] },
  { project: "libopencm3", res: "gh-libopencm3", read: "STM32 register definitions and the USART driver", identify: ["register macros", "peripheral base addresses", "driver API shape"] },
  { project: "MCUboot", res: "gh-mcuboot", read: "boot/bootutil/src", identify: ["image header and TLV parsing", "signature validation", "boot decision and swap state"] },
];

export const DEBUG_METHOD = ["Reproduce", "Inspect", "Instrument", "Diagnose", "Fix", "Verify"];

export const TRAINING = [
  { name: "Nordic Developer Academy (nRF Connect SDK Fundamentals, Intermediate, BLE)", provider: "Nordic Semiconductor", cost: "Free", verified: true, verdict: "Worth doing for Zephyr and BLE; hands-on and current." },
  { name: "Bootlin training materials (embedded Linux, kernel drivers, Yocto, Buildroot)", provider: "Bootlin", cost: "Free slides and labs; paid instructor-led courses", verified: true, verdict: "Best free embedded Linux path; Yocto course updated for Wrynose." },
  { name: "Linux Foundation embedded Linux and driver courses", provider: "The Linux Foundation", cost: "Paid", verified: false, verdict: "Useful if an employer pays; not required when you have driver projects." },
  { name: "STM32 education and MOOCs", provider: "STMicroelectronics", cost: "Free", verified: false, verdict: "Good for vendor-tool fluency on your primary board." },
  { name: "Functional safety (ISO 26262) and AUTOSAR training", provider: "Various commercial providers", cost: "Paid, often expensive", verified: false, verdict: "Only once you are targeting or working in automotive; concepts first, certificate later." },
];

export const JOB_PATTERNS = [
  "C and C++ with RTOS experience (FreeRTOS, Zephyr, sometimes ThreadX or QNX) appear together in most MCU firmware postings.",
  "Peripherals and buses (I2C, SPI, UART, GPIO, ADC, CAN, USB) plus debugging with JTAG, logic analyzers and oscilloscopes are listed as core skills.",
  "Embedded Linux postings cluster around kernel and device drivers, device tree, cross-compilation, Yocto or Buildroot, U-Boot and board bring-up, with Git and CMake expected.",
  "IoT and wearable roles add BLE, low-power design (sleep modes, duty cycling), OTA/firmware update and unit, integration and manufacturing tests.",
  "Recruiters distinguish two profiles: bare-metal/RTOS on Cortex-M and embedded Linux on Cortex-A; applying with the wrong one fails, so the road lets you choose after E8.",
];
export const JOB_SOURCES = [
  { label: "KORE1: How to hire firmware engineers in 2026", url: "https://www.kore1.com/hire-firmware-engineers-2026/" },
  { label: "LinuxCareers: Embedded Linux engineer jobs", url: "https://www.linuxcareers.com/embedded-linux-engineer-jobs" },
  { label: "Internshala: Embedded systems jobs (India)", url: "https://internshala.com/jobs/embedded-systems-jobs/" },
  { label: "ZipRecruiter: Embedded firmware jobs", url: "https://www.ziprecruiter.com/Jobs/Embedded-Firmware" },
  { label: "Toptal: Hiring embedded engineers", url: "https://www.toptal.com/developers/embedded" },
];

export const VIDEO_NOTES = [
  {
    title: "The Ultimate Roadmap for Embedded Systems (ChipCamp, Jan 2025)", res: "chipcamp-embedded",
    took: ["C first, taught hands-on from day one: data types, pointers, bit manipulation (called the most important interview topic), memory layout, dynamic memory, linked lists", "RTOS concepts: threads, scheduling, context switching, ISRs; FreeRTOS beginner's guide pages from the description", "Digital electronics and computer architecture as prerequisites (shared with the VLSI road)", "Microcontroller progression Arduino -> MSP430 -> Arm Cortex-M; GPIO, interrupts, timers, ADC/DAC, UART/I2C/SPI", "Embedded work in semiconductor companies: pre-silicon firmware, bootloaders and low-level drivers, assembly for bootloaders", "Projects: blink without libraries first, QEMU + GDB for hardware-free work, then FreeRTOS", "Description tools: FreeRTOS guides, a QEMU blinky video, Cheddar scheduling analysis, GeeksforGeeks bit-manipulation tactics"],
    notVerified: "The 'digital practice' and 'level-wise projects' PDFs are on Google Drive and the Discord community was not inspected, so they are not listed.",
    extended: "The roadmap here adds what the video only touches: toolchain and linker scripts, DMA, SWD/OpenOCD debugging, testing and CI, security and OTA, embedded Linux/BSP and production engineering.",
  },
  {
    title: "The ULTIMATE VLSI ROADMAP (Sanchit Kulkarni, Nov 2024)", res: "chipcamp-vlsi",
    took: ["Hiring is now domain-specific: master common foundations, then one domain (front end or back end)", "Ten foundations: digital, Verilog, CMOS, architecture, STA, C, flows, low power, scripting (Python, Perl, Tcl), aptitude and puzzles", "Keep a Verilog-construct-to-hardware table (case -> mux, if/else -> priority logic): now the RTL-to-hardware mapping topic and micro project", "Resources named: Neso Academy, Morris Mano, Prof. Indranil Sengupta's NPTEL Verilog and low-power lectures, Palnitkar, Rabaey, Bhasker/Chadha STA, IndiaBIX and GeeksforGeeks for aptitude and puzzles", "One project covering the complete flow, RTL to layout"],
    notVerified: "Content was read from the published description and a third-party summary because YouTube blocked direct access; PDFs and Discord lists were not inspected.",
    extended: "Aptitude/puzzle practice and Perl awareness were added; everything else already existed in the VLSI road, so it was not duplicated.",
  },
];
