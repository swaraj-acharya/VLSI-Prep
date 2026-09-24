import type { InterviewQ, Topic } from "../schema.ts";

// Embedded Engineering track, levels 0-4: orientation, C, MCU architecture + toolchain, bare-metal peripherals.
// Researched 2026-09-24. Embedded topics are NOT on the VLSI main road (see content/phases.ts).
const q = (question: string, a: string, level: 1 | 2 | 3 | 4 = 2, trap?: string): InterviewQ => ({ q: question, a, level, trap });

export const EMB_A: Topic[] = [
  {
    id: "emb-orientation", title: "What embedded engineers actually do", phase: "e0", module: "e0a",
    priority: "must", depth: "basic", difficulty: 1, days: 1, hours: 2, kind: "career", skills: ["firmware", "interview"],
    why: "Embedded work splits into MCU firmware, RTOS applications, embedded Linux/BSP and pre-silicon platform firmware. Knowing which one you are aiming at decides what you learn first and what you can skip for now.",
    problem: "Many beginner roadmaps equate embedded with Arduino sketches and a list of boards. Employers hire for register-level firmware, RTOS design, debugging with real instruments, drivers and Linux board support.",
    eli12: "A washing machine, a car's brake controller and a smartwatch each hide a tiny computer that must react on time, use very little power and never crash. Embedded engineers write the programs inside them, right next to the hardware.",
    analogyLimit: "The 'tiny computer' can also be a large Linux system in a router or a car dashboard; embedded means dedicated to one product, not necessarily small.",
    tech: "Four job families: (1) MCU firmware on Cortex-M or RISC-V microcontrollers with kilobytes of RAM, bare-metal or RTOS; (2) embedded Linux/BSP on application processors (Cortex-A) with bootloader, kernel, device tree and Yocto/Buildroot images; (3) platform and pre-silicon firmware in semiconductor companies: boot ROM, bring-up and validation firmware run on emulators and FPGA prototypes before silicon exists; (4) domains such as automotive, IoT, robotics and edge AI. The working loop is Learn, Program, Flash, Measure, Debug, Test, Optimize, Deploy.",
    inChip: "In chip companies embedded engineers write boot code, drivers and validation firmware for silicon before and after tapeout. In product companies they own a device's firmware for its whole support life, often five to ten years.",
    breaks: "Choosing boards and frameworks before fundamentals produces skills that do not transfer: the first unfamiliar MCU or a HardFault stops progress.",
    tested: "Can you explain what happens between reset and main(), and name the role family you are preparing for and the evidence it expects?",
    prereqs: [],
    objectives: ["Distinguish MCU firmware, RTOS, embedded Linux/BSP and pre-silicon firmware work", "Place yourself on the Level 0-12 map on the Embedded page", "Choose the default path and one candidate specialization", "Know what evidence employers look for"],
    terms: [["MCU", "Microcontroller: CPU, flash, SRAM and peripherals on one chip"], ["Application processor", "CPU with an MMU and external DRAM that runs a full OS such as Linux"], ["Firmware", "Software tied to specific hardware, stored in non-volatile memory"], ["BSP", "Board support package: bootloader, kernel config, device tree and drivers for one board"], ["Bring-up", "Getting new hardware to run its first code reliably"]],
    mistakes: ["Staying on Arduino libraries without ever learning what they hide", "Buying many boards instead of finishing projects on one", "Treating embedded Linux and MCU firmware as the same job"],
    practice: ["Read three current embedded job postings; highlight recurring skills and compare them with the Level map on the Embedded page", "Write one paragraph: which role family, why, and what you will build first"],
    interview: [
      q("What is the difference between a microcontroller and an application processor?", "An MCU integrates CPU, flash, SRAM and peripherals, has no MMU, and runs bare-metal code or an RTOS with deterministic timing. An application processor has an MMU, external DRAM and storage, and runs a general-purpose OS such as Linux; it trades determinism and power for capability.", 1, "Saying 'MCUs are just slower CPUs'."),
      q("What does an embedded engineer do in a semiconductor company?", "Writes boot ROM and bring-up code, drivers and validation firmware for new silicon, often before silicon exists on emulators or FPGA prototypes, then helps debug first silicon in the lab.", 2),
    ],
    resources: ["chipcamp-embedded", "making-embedded", "gh-emb-roadmap"], roles: ["emb-firmware", "emb-linux"],
  },
  {
    id: "emb-lab", title: "Lab setup: one board, an emulator and a minimal instrument kit", phase: "e0", module: "e0a",
    priority: "must", depth: "working", difficulty: 1, days: 1, hours: 5, kind: "tool", skills: ["firmware", "linux"],
    why: "Firmware skills are built by flashing, measuring and debugging real code. A small, well-chosen setup, with an emulator option, removes cost as an excuse and gives you a debugger from day one.",
    problem: "Beginners either buy ten boards and learn none deeply, or buy a board without a debug probe and are left with printf debugging.",
    eli12: "You need one workbench, not ten. A board you can look inside while it runs, a pretend board on your computer for when the real one is not handy, and a few measuring tools so you can see what the wires are really doing.",
    tech: "Primary path: an STM32 Nucleo board (on-board ST-LINK probe, so SWD debugging works immediately; huge documentation and CMSIS/HAL/LL support). Alternative: Raspberry Pi Pico 2 (RP2350, selectable Arm Cortex-M33 or Hazard3 RISC-V cores, excellent C SDK) plus a Raspberry Pi Debug Probe or a second Pico as the probe. Later: ESP32 for Wi-Fi/BLE with ESP-IDF, a Nordic nRF DK for Zephyr and BLE. Emulator-first: Renode (models STM32, nRF and more, scriptable tests), QEMU (Cortex-M machines with limited peripherals), Wokwi in the browser for Pico/ESP32. Kit: breadboard, LEDs and resistors, push button, a 3.3 V I2C sensor, USB-UART adapter, an inexpensive 8-channel logic analyzer with sigrok/PulseView, a multimeter; an oscilloscope later. Software: Arm GNU Toolchain (arm-none-eabi-gcc), CMake and Ninja, OpenOCD, GDB, an editor.",
    inChip: "Every firmware team has a standard bench: a target board, a debug probe, a logic analyzer and scope, a bench supply with current readout, and increasingly a simulator for CI.",
    breaks: "No debug probe means guesswork; no logic analyzer means you cannot tell a firmware bug from a wiring bug.",
    tested: "Blinky runs in an emulator, then on the board flashed from the command line, then you can halt it in GDB and read a register.",
    prereqs: ["emb-orientation"],
    objectives: ["Install the Arm GNU Toolchain, CMake, OpenOCD and GDB", "Run a Cortex-M program in Renode or QEMU", "Flash a board over SWD from the command line", "Capture a UART or GPIO signal with a logic analyzer"],
    terms: [["SWD", "Serial Wire Debug: Arm's two-wire debug interface"], ["Debug probe", "Adapter between your PC and the chip's debug port (ST-LINK, CMSIS-DAP, J-Link)"], ["Renode", "Open-source system simulator for embedded boards"], ["Logic analyzer", "Captures many digital signals over time and decodes protocols"]],
    mistakes: ["Only ever pressing the IDE's Run button, so you cannot reproduce a build or flash in CI", "Buying a board without a probe", "Skipping the emulator and blocking on hardware delivery"],
    practice: ["Run a Cortex-M hello world in Renode or QEMU before any hardware arrives", "Flash blinky with OpenOCD from the command line and record the exact commands in your repository README"],
    interview: [q("Why prefer a board with an on-board debug probe when learning?", "You get breakpoints, register and memory inspection over SWD from the first day, so you learn to observe the machine instead of guessing with printf.", 1)],
    resources: ["gh-renode", "qemu-arm-docs", "wokwi", "gh-pico-sdk", "gh-stm32cubef4", "sigrok-pulseview", "arm-gnu-toolchain"],
  },
  {
    id: "emb-electronics", title: "Electronics for firmware engineers", phase: "e0", module: "e0b",
    priority: "must", depth: "working", difficulty: 2, days: 2, hours: 5, kind: "theory", skills: ["firmware"],
    why: "Firmware drives pins, reads sensors and shares a supply with motors and radios. Many 'software bugs' are pull-ups, bounce, ground noise or an overloaded pin.",
    problem: "Software-first engineers treat a GPIO as a boolean. Real pins have drive limits, need pull resistors, bounce, pick up noise and can be destroyed by inductive loads.",
    eli12: "A button is not a perfect on/off switch; it wobbles for a few milliseconds like a bouncing ball. A wire nobody drives floats like a flag in the wind. Firmware engineers learn these habits of real electricity so their code is not fooled.",
    tech: "Push-pull versus open-drain outputs; internal pull-ups (tens of kilohms) versus external; I2C pull-up sizing from rise time and sink current; LED resistor R = (Vsupply - Vf) / I; per-pin and total current limits; 5 V tolerance and level shifting; switch bounce (about 1-10 ms) handled by RC + Schmitt trigger or software; decoupling (100 nF per supply pin plus bulk) and ground return paths; ADC front ends (source impedance versus sample time, anti-alias RC); LDO versus buck regulators; flyback diodes for relays and motors; ESD.",
    inChip: "Firmware engineers read schematics during board reviews and bring-up; knowing pull-ups, straps and power sequencing makes those reviews useful.",
    breaks: "Floating inputs cause random interrupts; missing flyback diodes kill pins; weak I2C pull-ups make fast mode fail only on long cables.",
    tested: "Measure with a multimeter and scope, calculate expected values first, compare.",
    prereqs: ["electricity-basics", "logic-levels"],
    objectives: ["Choose pull-ups, LED resistors and I2C pull-ups by calculation", "Explain open-drain versus push-pull", "Debounce a switch in hardware and software", "Read a simple MCU board schematic"],
    terms: [["Open-drain", "Output that only pulls low; a resistor pulls high"], ["Debounce", "Filtering mechanical contact bounce"], ["Decoupling capacitor", "Local charge reservoir next to a chip's supply pin"], ["Flyback diode", "Diode that absorbs the voltage spike from an inductive load"]],
    equations: ["R_LED = (V_supply - V_f) / I_LED", "I2C: R_p(min) = (V_DD - V_OL(max)) / I_OL;  R_p(max) = t_r / (0.8473 * C_bus)", "RC debounce: tau = R * C, chosen several times longer than the bounce"],
    example: "400 kHz I2C, 3.3 V, 100 pF bus, t_r(max) 300 ns, I_OL 3 mA: R_p(max) = 300 ns / (0.8473 x 100 pF) = 3.5 kOhm; R_p(min) = (3.3 - 0.4) / 3 mA = 967 Ohm. A 2.2 kOhm pull-up fits.",
    mistakes: ["Leaving unused inputs floating", "Driving a relay coil directly from a GPIO", "Assuming the internal pull-up is strong enough for fast I2C"],
    practice: ["Compute the LED resistor for 3.3 V, Vf 2.0 V, 5 mA and check it on the bench", "Compute the I2C pull-up range for 100 kHz and 400 kHz on a 200 pF bus"],
    interview: [q("Why does I2C use open-drain outputs with pull-up resistors?", "So any device can pull the line low without a short circuit (wired-AND), which enables ACK, clock stretching and multi-master arbitration. The pull-up value trades rise time against sink current.", 2, "Saying pull-ups are only 'for safety'.")],
    resources: ["making-embedded", "falstad"],
  },
  {
    id: "emb-c-build", title: "How C becomes firmware: preprocessing, compiling and linking", phase: "e1", module: "e1a",
    priority: "must", depth: "working", difficulty: 2, days: 1, hours: 3, kind: "coding", skills: ["cpp", "firmware"],
    why: "Every firmware problem with 'multiple definition', 'undefined reference', a missing ISR or a bloated binary is a build-model problem. You must know what each stage produces.",
    problem: "Treating the compiler as a black box makes link errors and weak-symbol surprises (an ISR silently not installed) impossible to diagnose.",
    eli12: "Writing a program is like writing chapters of a book in separate files. The preprocessor pastes in shared notes, the compiler turns each chapter into machine words, and the linker binds the chapters and fixes page numbers so references point to the right place.",
    tech: "Preprocessor (#include, macros, include guards, conditional compilation) produces a translation unit; the compiler produces an object file with sections and a symbol table; the linker resolves symbols across objects and libraries and places sections by the linker script. Declarations versus definitions; extern and static linkage; storage duration (automatic, static, allocated); header hygiene. Weak symbols: startup files define every ISR as a weak alias of Default_Handler, so a misspelled handler name links fine and never runs. -ffunction-sections -fdata-sections with --gc-sections removes unused code. GCC 10+ defaults to -fno-common, so the same global defined in two files is now a link error.",
    inChip: "Build systems, CI and release engineering in every firmware team depend on engineers who can read link errors and map files.",
    breaks: "Misspelled ISR names never run; duplicated globals across headers; macros with side effects evaluated twice.",
    tested: "Use nm and objdump on object files to predict and confirm which symbols are defined, undefined and weak.",
    prereqs: ["emb-orientation"],
    objectives: ["Explain each build stage and its output", "Use static and extern deliberately", "Diagnose undefined-reference and multiple-definition errors", "Explain weak ISR aliases"],
    terms: [["Translation unit", "One .c file after preprocessing"], ["Linkage", "Whether a name is visible across translation units"], ["Weak symbol", "A definition that another strong definition may override"], ["-fno-common", "GCC default since 10: tentative definitions in several files collide"]],
    mistakes: ["Defining (not declaring) globals in headers", "Macros like #define SQ(x) x*x without parentheses", "Renaming an ISR and not noticing it fell back to the default handler"],
    practice: ["Compile two files with -c, inspect them with nm, then link and inspect again", "Misspell an ISR name on purpose and find the problem from the map file"],
    interview: [
      q("What does static mean at file scope and inside a function?", "At file scope it gives internal linkage (invisible to other files). Inside a function it gives static storage duration: the variable keeps its value between calls and is initialised once.", 1),
      q("Your UART interrupt handler never runs although the interrupt is enabled. What build-level cause would you check first?", "Whether the handler name exactly matches the weak symbol in the vector table; a typo silently leaves Default_Handler installed. Check with nm or the map file.", 3, "Only debugging the peripheral registers."),
    ],
    resources: ["k-r-c", "gh-bare-metal-guide"],
  },
  {
    id: "emb-c-memory", title: "Pointers, structs and memory layout", phase: "e1", module: "e1a",
    priority: "must", depth: "working", difficulty: 3, days: 2, hours: 6, kind: "coding", skills: ["cpp", "firmware"],
    why: "Firmware is the art of placing bytes precisely: register overlays, packet structs, buffers in the right RAM, and no heap surprises. Pointer and layout mistakes are the most common crash causes.",
    problem: "Desktop habits (malloc anywhere, ignoring padding, assuming byte order) produce firmware that fragments memory, corrupts packets and faults on unaligned access.",
    eli12: "Memory is a long street of numbered houses. A pointer is a house number. Structs are families that live in neighbouring houses, and sometimes empty houses are left between them so everyone sits at a tidy address.",
    tech: "Pointer arithmetic scales by type size; arrays decay to pointers; const placement (const uint8_t *p versus uint8_t *const p). Struct padding and natural alignment: struct { uint8_t a; uint32_t b; } is 8 bytes. Packed structs remove padding but create unaligned accesses (a fault on Cortex-M0/M0+, slower elsewhere). Unions for type punning are allowed in C. Bitfield layout is implementation-defined, so avoid it for portable register maps and wire formats. Endianness: Cortex-M is little-endian; network order is big-endian. Memory regions: .text/.rodata in flash, .data and .bss in RAM, stack, heap. In firmware prefer static allocation or fixed-block pools to avoid fragmentation and non-deterministic malloc.",
    inChip: "Driver, protocol and bootloader code all depend on exact layouts; code reviewers check alignment and ownership of every buffer.",
    breaks: "Unaligned access faults, corrupted protocol fields, stack overflows from large local arrays, heap exhaustion days after boot.",
    tested: "static_assert on sizeof and offsetof; host unit tests for serialisation; stack high-water marks on target.",
    prereqs: ["emb-c-build", "number-systems"],
    objectives: ["Predict sizeof and offsetof for structs", "Serialise a struct safely for a wire format", "Explain stack, heap, .data and .bss", "Justify static allocation in firmware"],
    terms: [["Padding", "Unused bytes inserted to align members"], ["Alignment", "Address multiple a type requires"], ["Endianness", "Byte order of multi-byte values in memory"], ["Fragmentation", "Free memory split into pieces too small to use"]],
    code: { lang: "c", src: `#include <stdint.h>
#include <stddef.h>
#include <assert.h>

struct sample {           /* natural layout */
    uint8_t  channel;     /* offset 0 */
    /* 3 bytes padding */
    uint32_t value;       /* offset 4 */
    uint16_t flags;       /* offset 8 */
    /* 2 bytes tail padding so arrays stay aligned */
};
static_assert(sizeof(struct sample) == 12, "layout changed");
static_assert(offsetof(struct sample, value) == 4, "value misaligned");

/* Serialise explicitly (little-endian wire format) instead of memcpy'ing the struct. */
size_t sample_pack(const struct sample *s, uint8_t out[7]) {
    out[0] = s->channel;
    for (int i = 0; i < 4; i++) out[1 + i] = (uint8_t)(s->value >> (8 * i));
    out[5] = (uint8_t)s->flags;
    out[6] = (uint8_t)(s->flags >> 8);
    return 7;
}`, note: "Reorder members from largest to smallest to reduce padding; never send raw structs over a wire." },
    mistakes: ["memcpy of a struct into a packet (padding and endianness leak)", "Returning a pointer to a local variable", "Large arrays on a small task stack"],
    practice: ["Predict sizeof for five structs, then check with static_assert", "Write pack/unpack functions for a sensor packet and test them on the host"],
    interview: [
      q("What is sizeof(struct { char a; int b; char c; }) on a 32-bit ARM, and how do you shrink it?", "12 bytes: a at 0, 3 bytes padding, b at 4, c at 8, 3 bytes tail padding. Reorder to int b; char a; char c; for 8 bytes.", 2),
      q("Why do many firmware coding standards forbid malloc after initialisation?", "Heap allocation can fail at run time, fragments memory over long uptimes and has non-deterministic timing; static allocation or fixed-size pools make memory use provable at build time.", 2),
    ],
    resources: ["k-r-c", "making-embedded"],
  },
  {
    id: "emb-c-bits", title: "Bit manipulation, volatile and memory-mapped registers", phase: "e1", module: "e1a",
    priority: "must", depth: "advanced", difficulty: 3, days: 2, hours: 6, kind: "coding", skills: ["cpp", "firmware"],
    why: "Every peripheral is controlled by setting fields in memory-mapped registers. The ChipCamp embedded roadmap calls bit manipulation the most important embedded interview topic, and volatile is the most misunderstood keyword.",
    problem: "Without volatile the optimizer may delete or merge register accesses; with read-modify-write sequences an interrupt can corrupt other bits in the same register.",
    eli12: "A peripheral register is a row of light switches controlling a machine. You flip only the switches you mean to, leave the others exactly as they were, and tell the compiler 'these are real switches, do not skip flipping them'.",
    tech: "Set x |= (1U << n); clear x &= ~(1U << n); toggle x ^= (1U << n); test (x >> n) & 1U; field insert reg = (reg & ~MASK) | ((val << POS) & MASK). Use unsigned constants (1U << 31) because shifting 1 into the sign bit of int is undefined. Memory-mapped I/O: a peripheral base address cast to a pointer to a volatile struct of registers (CMSIS style). volatile forces every access to happen as written; it does NOT make read-modify-write atomic and does NOT order memory for DMA or other cores (use __DMB/__DSB barriers and critical sections). Set/reset registers such as GPIO BSRR make single-bit updates atomic. const volatile describes read-only status registers.",
    inChip: "Chip teams deliver register maps (often generated from SystemRDL or IP-XACT); firmware engineers turn them into headers and drivers. The same register map is what the VLSI side designs.",
    breaks: "Busy-wait loops optimised into infinite loops, lost bits from interrupted read-modify-write, sign-extension bugs in masks.",
    tested: "Host unit tests for field macros; disassembly check that register accesses were not removed; logic analyzer to confirm the pin behaviour.",
    prereqs: ["emb-c-memory", "c-for-hw"],
    objectives: ["Write set, clear, toggle, test and field-insert expressions correctly", "Define a volatile register overlay struct", "Explain what volatile does and does not guarantee", "Avoid read-modify-write races"],
    terms: [["MMIO", "Memory-mapped I/O: peripheral registers at fixed addresses"], ["volatile", "Qualifier: every access is observable and must be performed"], ["RMW", "Read-modify-write sequence on a register"], ["BSRR", "STM32 bit set/reset register that updates single pins atomically"]],
    code: { lang: "c", src: `#include <stdint.h>
typedef struct {
    volatile uint32_t MODER, OTYPER, OSPEEDR, PUPDR;
    volatile const uint32_t IDR;      /* read-only */
    volatile uint32_t ODR, BSRR;
} gpio_t;
#define GPIOA ((gpio_t *)0x40020000UL) /* example STM32F4 address: check your reference manual */

#define FIELD_SET(reg, mask, pos, val) \\
    ((reg) = ((reg) & ~(mask)) | (((uint32_t)(val) << (pos)) & (mask)))

void led_init(void) {
    FIELD_SET(GPIOA->MODER, 3U << (5 * 2), 5 * 2, 1U); /* PA5 = output */
}
void led_on(void)  { GPIOA->BSRR = 1U << 5; }          /* atomic set   */
void led_off(void) { GPIOA->BSRR = 1U << (5 + 16); }   /* atomic reset */`, note: "The GPIO clock must be enabled in the RCC first; forgetting it is the classic first bare-metal bug." },
    mistakes: ["Using int constants in shifts: 1 << 31 is undefined behaviour", "Believing volatile makes code thread-safe", "Using ODR |= for pins also changed in an ISR"],
    debug: ["A delay loop 'for (i = 0; i < 100000; i++);' vanishes at -O2: the compiler removed a loop with no observable effect."],
    practice: ["Implement and host-test SET/CLEAR/TOGGLE/FIELD macros with 20 cases", "Write a register overlay for one peripheral from your MCU reference manual and blink an LED with it"],
    interview: [
      q("Why is volatile required for memory-mapped registers, and when is it insufficient?", "It forces each read and write to be emitted, so polling and write sequences are not optimised away. It is insufficient for atomicity (an ISR can interrupt a read-modify-write), for ordering with DMA or other cores (needs barriers), and for data shared between tasks (needs critical sections or atomics).", 3, "Saying volatile makes a variable 'thread-safe'."),
      q("Write an expression that sets bits 7..4 of reg to the value v without touching other bits.", "reg = (reg & ~(0xFU << 4)) | ((v & 0xFU) << 4);", 2),
      q("Count set bits in a 32-bit word efficiently.", "Loop x &= x - 1 counting iterations (runs once per set bit), or use the compiler builtin __builtin_popcount, which may map to a single instruction.", 2),
    ],
    resources: ["gfg-bits", "k-r-c", "gh-cmsis6"], projects: ["e-bitfield", "e-crc"],
  },
  {
    id: "emb-c-ub", title: "Undefined behaviour, integer promotion and the optimizer", phase: "e1", module: "e1a",
    priority: "must", depth: "working", difficulty: 3, days: 1, hours: 4, kind: "coding", skills: ["cpp", "firmware"],
    why: "'Works at -O0, breaks at -O2' is almost always undefined behaviour. Safety standards such as MISRA C and CERT C exist largely to remove it.",
    problem: "C lets code compile that has no defined meaning; the optimizer is allowed to assume it never happens and will delete checks or reorder code.",
    eli12: "If the rulebook does not say what happens when you break a rule, the referee may do anything, including pretending you never broke it. Your program then behaves differently each time you change the settings.",
    tech: "Common UB: signed overflow, shifting by the type width or more, left-shifting into the sign bit, reading uninitialised variables, out-of-bounds access, null dereference, strict-aliasing violations, data races. Integer promotion: uint8_t and uint16_t become int in arithmetic, so uint16_t a = 65535; a * a overflows signed int (UB) on 32-bit targets. Usual arithmetic conversions: -1 < 1U is false because -1 converts to unsigned. Implicit truncation when assigning to narrower types. Defences: -Wall -Wextra -Wconversion -Wshadow, sanitizers (UBSan, ASan) on host builds of portable code, static analysis, and coding standards.",
    inChip: "Firmware CI pipelines compile with warnings as errors and run sanitizers on host tests; safety-critical projects run MISRA checkers.",
    breaks: "Bounds checks optimised away, timeouts that never expire, protocol length checks bypassed.",
    tested: "Host builds with -fsanitize=undefined,address; static analyzers; reviewing warnings at high levels.",
    prereqs: ["emb-c-memory"],
    objectives: ["List the common UB categories", "Predict integer promotions and conversions", "Explain why optimisation exposes UB", "Configure warnings and sanitizers"],
    terms: [["Undefined behaviour", "Code whose meaning the C standard does not define"], ["Integer promotion", "Small integer types converted to int before arithmetic"], ["Strict aliasing", "Rule that objects are accessed only through compatible types"], ["UBSan", "Undefined behaviour sanitizer"]],
    mistakes: ["Checking overflow with if (x + 1 < x) for signed x", "Comparing signed and unsigned values", "Casting a byte buffer to uint32_t * (alignment and aliasing)"],
    practice: ["Write ten snippets with suspected UB, predict the result, then run them with -fsanitize=undefined", "Compile one timing-sensitive routine at -O0 and -O2 and diff the disassembly"],
    interview: [
      q("uint8_t a = 200, b = 100; what is the type and value of a + b, and of (uint8_t)(a + b)?", "a + b is int 300 because of integer promotion; (uint8_t)(a + b) is 44 (300 mod 256).", 2),
      q("Why can if (x + 1 < x) disappear when x is int?", "Signed overflow is undefined, so the compiler may assume x + 1 is always greater than x and fold the condition to false.", 3),
    ],
    resources: ["sei-cert-c", "misra", "k-r-c"],
  },
  {
    id: "emb-c-patterns", title: "Embedded C patterns: ring buffers, state machines, event queues and pools", phase: "e1", module: "e1b",
    priority: "must", depth: "advanced", difficulty: 3, days: 2, hours: 7, kind: "coding", skills: ["cpp", "firmware"],
    why: "Almost every firmware module is built from the same few patterns. Having tested versions of them is what makes you productive and makes your code reviewable.",
    problem: "Ad-hoc buffers and nested if-else control flow create lost bytes, race conditions and untestable logic.",
    eli12: "A ring buffer is a circular conveyor belt: one person puts boxes on, another takes them off, and neither has to wait for the other. A state machine is a board game: where you are plus the dice roll decides where you go next.",
    tech: "Single-producer single-consumer ring buffer: power-of-two size, head written only by the producer and tail only by the consumer, one slot kept empty (or a count) to tell full from empty; safe between one ISR and main without locks on single-core Cortex-M if indices are aligned words and accesses are volatile (or C11 atomics). Table-driven FSM: state x event -> action and next state. Event queue decouples ISRs (post an event) from the main loop or a task (handle it). Callbacks via function pointers with a void *context. Fixed-block memory pool: O(1) allocate and free, no fragmentation. Command parser for a UART shell: tokenise with strtok_r, dispatch through a command table.",
    inChip: "Logging, UART shells, protocol stacks and RTOS message passing are all built on these patterns.",
    breaks: "Off-by-one full/empty logic, ISR and main loop both writing the same index, FSMs with unhandled events.",
    tested: "Host unit tests with Unity including wrap-around, full and empty cases; stress tests with a producer ISR on target.",
    prereqs: ["emb-c-bits"],
    objectives: ["Implement and test an SPSC ring buffer", "Write a table-driven state machine", "Decouple ISRs from processing with an event queue", "Build a fixed-block pool and a command table"],
    terms: [["SPSC", "Single producer, single consumer"], ["Event queue", "FIFO of events processed outside interrupt context"], ["Memory pool", "Pre-allocated fixed-size blocks"], ["Context pointer", "void * passed to a callback to carry state"]],
    code: { lang: "c", src: `#include <stdint.h>
#include <stdbool.h>
#define RB_SIZE 64u                       /* power of two */
typedef struct {
    volatile uint32_t head;               /* written by producer only */
    volatile uint32_t tail;               /* written by consumer only */
    uint8_t buf[RB_SIZE];
} ring_t;

bool rb_put(ring_t *r, uint8_t b) {       /* e.g. called from the UART RX ISR */
    uint32_t next = (r->head + 1u) & (RB_SIZE - 1u);
    if (next == r->tail) return false;    /* full: one slot kept empty */
    r->buf[r->head] = b;
    r->head = next;                       /* publish after the data is written */
    return true;
}
bool rb_get(ring_t *r, uint8_t *b) {      /* called from main or a task */
    if (r->tail == r->head) return false; /* empty */
    *b = r->buf[r->tail];
    r->tail = (r->tail + 1u) & (RB_SIZE - 1u);
    return true;
}`, note: "Safe for one ISR producer and one consumer on single-core Cortex-M. On multi-core or with caches, use C11 atomics or barriers." },
    mistakes: ["Two producers sharing one SPSC buffer", "Processing data inside the ISR instead of posting an event", "Using strtok in reentrant code"],
    practice: ["Build the ring buffer with host tests for empty, full and wrap-around", "Write a table-driven FSM for a debounced button with short and long press events"],
    interview: [
      q("How do you tell a full ring buffer from an empty one?", "Either keep one slot empty (full when next(head) == tail, empty when head == tail) or keep a separate count; with free-running indices and a power-of-two size, full is head - tail == size.", 2),
      q("Why post events from an ISR instead of doing the work there?", "ISRs block other interrupts of equal or lower priority and must be short and bounded; moving work to a task or main loop keeps latency low and makes the logic testable.", 2),
    ],
    resources: ["making-embedded", "grenning-tdd"], projects: ["e-ringbuf", "e-cli-parser"],
  },
  {
    id: "emb-cpp", title: "C++ for embedded: what to use and what to avoid", phase: "e1", module: "e1b",
    priority: "should", depth: "basic", difficulty: 3, days: 1, hours: 4, kind: "coding", skills: ["cpp", "firmware"],
    why: "Many firmware teams now use a disciplined subset of C++ for type safety and zero-cost abstraction; others stay with C for tooling or certification. You need to know both sides of the decision.",
    problem: "Generic C++ courses teach features (exceptions, iostreams, heap-heavy containers) that are wrong for small MCUs, so people either avoid C++ entirely or misuse it.",
    eli12: "C++ gives you better tools, like a lock that closes itself when you leave the room. Some of its tools are too heavy to carry on a tiny device, so embedded engineers pack only the light ones.",
    tech: "Useful: classes with RAII (critical-section guard, peripheral enable), constexpr for compile-time tables and register addresses, enum class, references, templates for zero-cost drivers, std::array, std::span (C++20), std::optional, static_assert. Decide deliberately: exceptions (-fno-exceptions common), RTTI (-fno-rtti), dynamic allocation after init, iostream (large), static initialisation order across files. Virtual functions cost a vtable and an indirect call, usually acceptable. Embedded-friendly libraries (for example the Embedded Template Library) replace heap-based containers. Decision guide: prefer C when the vendor SDK, certification toolchain or team is C-only, or the part is tiny; prefer modern C++ when type-safe abstractions remove classes of bugs and the toolchain is mature. Rust (embedded-hal) is a growing third option worth awareness.",
    inChip: "Consumer, robotics and some automotive teams use C++; many MCU vendor SDKs and safety projects remain C.",
    breaks: "Hidden heap use, code-size explosions from templates, constructors running before clocks are configured.",
    tested: "Map-file size comparison, disassembly of abstractions, compile flags checked in CI.",
    prereqs: ["emb-c-patterns"],
    objectives: ["Write an RAII guard for a critical section", "Replace a C macro table with constexpr", "State the flags and trade-offs for exceptions and RTTI", "Apply the C versus C++ decision guide"],
    terms: [["RAII", "Resource acquisition is initialisation: cleanup in the destructor"], ["constexpr", "Evaluated at compile time where possible"], ["Zero-cost abstraction", "Abstraction that compiles to the same code as hand-written C"]],
    code: { lang: "cpp", src: `#include <cstdint>
extern "C" { uint32_t irq_save(void); void irq_restore(uint32_t primask); }

class CriticalSection {             // RAII: interrupts restored on every exit path
public:
    CriticalSection() : saved_(irq_save()) {}
    ~CriticalSection() { irq_restore(saved_); }
    CriticalSection(const CriticalSection&) = delete;
    CriticalSection& operator=(const CriticalSection&) = delete;
private:
    uint32_t saved_;
};

constexpr uint32_t baud_div(uint32_t fclk, uint32_t baud) { return (fclk + baud / 2) / baud; }
static_assert(baud_div(16'000'000, 115'200) == 139, "BRR check at compile time");`, note: "Compare the map file and disassembly with the equivalent C to confirm the abstraction is free." },
    mistakes: ["Using std::vector and std::string freely on a 32 KB part", "Global objects whose constructors touch peripherals before clocks are set", "Leaving exceptions enabled unintentionally"],
    practice: ["Port your ring buffer to a class template and compare code size with the C version", "Write a two-column table: which C++ features you allow in firmware and why"],
    interview: [q("When would you choose C over C++ for a firmware project?", "When the vendor SDK, certification toolchain or coding standard is C-based, when the team is C-only, or when the part is so small that any hidden cost matters. C++ is worth it when RAII and type-safe abstractions remove bug classes at no run-time cost.", 2)],
    resources: ["making-embedded"],
  },
  {
    id: "emb-mcu-arch", title: "Inside a microcontroller: core, memory map, buses and clocks", phase: "e2", module: "e2a",
    priority: "must", depth: "working", difficulty: 3, days: 2, hours: 6, kind: "theory", skills: ["firmware", "arch"],
    why: "Every datasheet and reference manual assumes you know the memory map, the bus matrix and the clock tree. This is where the VLSI view (SoC buses) and the firmware view meet.",
    problem: "Without an architecture model, 'the peripheral does nothing' (clock not enabled) and 'code is slow' (flash wait states) look like mysteries.",
    eli12: "A microcontroller is a tiny town: one worker (the CPU), a library of instructions (flash), a scratchpad (RAM), shops for special jobs (peripherals) and roads between them (buses). The town clock sets how fast everything moves, and each shop has its own clock switch.",
    tech: "Cortex-M variants (M0+, M3, M4 with DSP and optional FPU, M7 with caches, M33 with TrustZone, M55 with Helium). Registers R0-R12, SP (MSP/PSP), LR, PC, xPSR. Fixed Armv7-M/Armv8-M memory map regions: code from 0x00000000, SRAM from 0x20000000, peripherals from 0x40000000, the Private Peripheral Bus from 0xE0000000 (NVIC, SysTick, SCB). Bus matrix connecting instruction and data buses to flash, SRAM and AHB/APB peripheral bridges. Flash wait states rise with clock frequency; prefetch and caches hide them. Clock tree: internal RC or external crystal into a PLL, then SYSCLK and AHB/APB prescalers; each peripheral has a clock-enable bit. RISC-V MCUs are conceptually similar: CSRs (mtvec, mcause), CLINT/PLIC or CLIC instead of NVIC.",
    inChip: "The SoC buses you study on the VLSI road (AHB/APB/AXI) are exactly the fabric firmware reads and writes through.",
    breaks: "Peripheral clock not enabled, wrong flash latency after raising the clock (random crashes), DMA unable to reach a memory region the bus matrix does not connect.",
    tested: "Read the reference manual memory map and clock tree, then verify register addresses and clock frequencies with the debugger and a timer output.",
    prereqs: ["emb-c-bits", "isa"],
    objectives: ["Draw the memory map of your MCU", "Trace a clock from source to a peripheral", "Explain flash wait states", "Compare Arm Cortex-M and RISC-V MCU interrupt and CSR models"],
    terms: [["Memory map", "Assignment of address ranges to memories and peripherals"], ["Bus matrix", "Interconnect letting several masters reach several slaves"], ["PLL", "Phase-locked loop that multiplies a reference clock"], ["Wait state", "Extra cycle inserted because flash is slower than the CPU"]],
    mistakes: ["Raising the clock before increasing flash latency", "Assuming all RAM is equal (some is not reachable by DMA, some is tightly coupled)", "Copying register addresses from a different MCU family"],
    practice: ["Draw your MCU's memory map and clock tree from the reference manual on one page", "Output SYSCLK/4 on an MCO pin (or toggle a pin from a timer) and measure it"],
    interview: [q("A peripheral's registers read back as zero and writes have no effect. What do you check first?", "Whether its clock is enabled in the clock/reset controller (and the peripheral is out of reset). Then the base address and the bus it sits on.", 1, "Suspecting the silicon first.")],
    resources: ["yiu-cortexm", "arm-armv7m", "nand2tetris"],
  },
  {
    id: "emb-exceptions", title: "Exception model, vector table, NVIC and SysTick", phase: "e2", module: "e2a",
    priority: "must", depth: "advanced", difficulty: 3, days: 2, hours: 6, kind: "theory", skills: ["firmware", "arch"],
    why: "Interrupts are how firmware meets the real world on time. Interviewers ask about the vector table, interrupt entry and priorities in almost every embedded loop.",
    problem: "Without knowing what the hardware does on exception entry, priority bugs, stack corruption and HardFaults are impossible to reason about.",
    eli12: "An interrupt is a doorbell. The vector table is the list telling the CPU which room to run to for each bell. Before running, the CPU writes a note of what it was doing so it can come back exactly where it left off.",
    tech: "Vector table: word 0 is the initial main stack pointer, word 1 the reset handler, then NMI, HardFault, MemManage, BusFault, UsageFault, SVCall, PendSV, SysTick, then device IRQs. VTOR relocates it (bootloaders use this). On entry the core pushes R0-R3, R12, LR, PC and xPSR (8 words, more with lazy FPU stacking), loads LR with an EXC_RETURN value and runs the handler in Handler mode on MSP. NVIC: enable, pending and active bits per IRQ; lower numeric priority means more urgent; only the upper implemented bits of each 8-bit priority field count; priority grouping splits preemption and sub-priority. Tail-chaining and late arrival reduce latency. SysTick is a 24-bit down counter for a periodic tick. PendSV is the lowest-priority exception used for RTOS context switches.",
    inChip: "Interrupt controller design (NVIC, PLIC/CLIC) is RTL work; its programming model is firmware work. Both sides must agree on it.",
    breaks: "Wrong priority encoding (writing 1 instead of 1 << (8 - PRIO_BITS)), stale pending bits, handlers that never return, stack overflow in nested interrupts.",
    tested: "Trigger interrupts by setting pending bits from the debugger; measure latency with a GPIO toggle and a logic analyzer.",
    prereqs: ["emb-mcu-arch"],
    objectives: ["Describe the vector table layout and VTOR", "List what is stacked on exception entry", "Configure NVIC priorities correctly", "Configure SysTick for a 1 ms tick"],
    terms: [["NVIC", "Nested Vectored Interrupt Controller"], ["EXC_RETURN", "Special LR value that tells the core how to return from an exception"], ["Tail-chaining", "Starting the next pending handler without unstacking"], ["PendSV", "Deferred, lowest-priority exception used for context switching"]],
    equations: ["SysTick reload = f_core / f_tick - 1  (16 MHz, 1 kHz -> 15999)"],
    code: { lang: "c", src: `#include <stdint.h>
extern uint32_t _estack;
void Reset_Handler(void);
void Default_Handler(void) { for (;;) {} }
void SysTick_Handler(void) __attribute__((weak, alias("Default_Handler")));

__attribute__((section(".isr_vector"), used))
void (* const vectors[])(void) = {
    (void (*)(void))&_estack,   /* 0: initial MSP (loaded by hardware) */
    Reset_Handler,               /* 1: reset */
    Default_Handler,             /* 2: NMI */
    Default_Handler,             /* 3: HardFault */
    /* ... 4-14 system exceptions ... */
    [15] = SysTick_Handler,      /* 15: SysTick; device IRQs start at 16 */
};`, note: "Designated initialisers leave unused entries zero; a real table fills every slot." },
    mistakes: ["Assuming a higher number means higher priority on Cortex-M", "Clearing the peripheral flag after the handler returns, causing re-entry", "Doing long work in SysTick"],
    practice: ["Set two interrupts' priorities and demonstrate preemption with GPIO toggles on a logic analyzer", "Relocate the vector table to RAM and swap a handler at run time"],
    interview: [
      q("What happens from the moment an interrupt fires until the first instruction of its handler?", "The NVIC checks priority against the current execution priority; the core stacks 8 registers (R0-R3, R12, LR, PC, xPSR) on the current stack, fetches the vector in parallel, loads EXC_RETURN into LR, switches to Handler mode on MSP and jumps to the handler. About 12 cycles on Cortex-M3/M4 without wait states.", 3),
      q("What are the first two words of a Cortex-M vector table?", "The initial main stack pointer value and the address of the reset handler (with the Thumb bit set).", 1),
    ],
    resources: ["yiu-cortexm", "arm-armv7m", "gh-cmsis6"],
  },
  {
    id: "emb-asm", title: "Cortex-M assembly and the calling convention", phase: "e2", module: "e2a",
    priority: "should", depth: "basic", difficulty: 3, days: 1, hours: 4, kind: "coding", skills: ["firmware", "arch"],
    why: "You rarely write assembly, but you constantly read it: HardFault analysis, startup code, context switches and 'why is this slow' all end in a disassembly listing.",
    problem: "Engineers who cannot read disassembly cannot verify what the compiler did with volatile, optimisation or inline functions.",
    eli12: "Assembly is the CPU's own tiny words. You do not need to write books in it, just read the sentences the compiler wrote for you, especially when something goes wrong.",
    tech: "Thumb-2 instruction set; load/store architecture (LDR/STR move data, arithmetic works on registers); MOV, ADD, SUB, CMP, B, BL, BX LR; IT blocks for conditional execution; PUSH/POP. AAPCS: R0-R3 arguments and return value, R4-R11 callee-saved, R12 scratch, SP 8-byte aligned at public interfaces, LR holds the return address. Function prologue/epilogue, stack frames, leaf functions. Exception return by loading EXC_RETURN into PC. Inline assembly only for special instructions (cpsid i, wfi, dsb) and usually via CMSIS intrinsics.",
    inChip: "Boot ROM, context switch code and fault handlers contain assembly; bring-up engineers read disassembly daily.",
    breaks: "Misaligned stacks break floating-point and variadic functions; clobbered callee-saved registers corrupt callers.",
    tested: "Compare arm-none-eabi-objdump -d output at -O0 and -O2; single-step in GDB with 'layout asm'.",
    prereqs: ["emb-exceptions"],
    objectives: ["Read a disassembled function and map it to C", "State AAPCS register roles", "Explain what BL and BX LR do", "Use CMSIS intrinsics instead of raw inline assembly"],
    terms: [["Thumb-2", "Mixed 16/32-bit instruction encoding used by Cortex-M"], ["AAPCS", "Arm procedure call standard"], ["Callee-saved", "Registers a called function must preserve"], ["IT block", "If-then prefix making following instructions conditional"]],
    code: { lang: "asm", src: `@ uint32_t add3(uint32_t a, uint32_t b, uint32_t c) { return a + b + c; }  at -O2
add3:
    add     r0, r0, r1      @ a (r0) + b (r1)
    add     r0, r0, r2      @ + c (r2), result returned in r0
    bx      lr              @ return to caller (LR holds the return address)`, note: "Arguments arrive in R0-R2 and the result leaves in R0, exactly as AAPCS specifies." },
    mistakes: ["Writing whole functions in inline assembly when an intrinsic exists", "Ignoring 8-byte stack alignment in hand-written entry code"],
    practice: ["Disassemble three of your functions at -O0 and -O2 and annotate each instruction", "Step through a function call in GDB watching SP and LR change"],
    interview: [q("Which registers must a function preserve under AAPCS, and where do arguments go?", "R4-R11 (and SP) are callee-saved; the first four arguments go in R0-R3, the rest on the stack; results return in R0 (and R1 for 64-bit).", 2)],
    resources: ["yiu-cortexm", "arm-armv7m"],
  },
  {
    id: "emb-toolchain", title: "The cross toolchain: compile, link, ELF, map files and build systems", phase: "e2", module: "e2b",
    priority: "must", depth: "working", difficulty: 2, days: 2, hours: 6, kind: "tool", skills: ["firmware", "linux"],
    why: "Source to compile to link to ELF to flash to run is the backbone of every firmware project, CI job and release. IDEs hide it until something breaks.",
    problem: "IDE-only builds are not reproducible, cannot run in CI, and leave you unable to explain flash and RAM usage.",
    eli12: "A cross-compiler is a translator that runs on your laptop but writes instructions for a different, tiny computer. The build system is the recipe that tells the translator what to do, in what order, every single time.",
    tech: "arm-none-eabi-gcc with -mcpu, -mthumb, -mfpu and -mfloat-abi matching the core; object files and static archives; the linker with a linker script; ELF sections; objcopy to .bin/.hex for flashing; binutils: size (text, data, bss), nm (symbols), readelf -S (sections), objdump -d (disassembly), addr2line (address to source line). The map file shows every symbol's address and size: read it to find what fills flash. newlib versus newlib-nano (--specs=nano.specs), -Os, link-time optimisation. Make fundamentals; CMake with a toolchain file and Ninja; pin the toolchain version for reproducible builds.",
    inChip: "Firmware CI builds the same ELF on every commit; release engineering archives ELF, map and binary with the version.",
    breaks: "Mismatched float ABI between objects, printf pulling in 20 KB, builds that differ between machines.",
    tested: "A clean clone builds with one command; arm-none-eabi-size output is tracked per commit.",
    prereqs: ["emb-c-build", "emb-mcu-arch"],
    objectives: ["Build firmware from the command line with CMake + Ninja", "Read size, nm, readelf and objdump output", "Find the largest symbols in a map file", "Explain ELF versus .bin versus .hex"],
    terms: [["ELF", "Executable and Linkable Format with sections, symbols and debug info"], ["Map file", "Linker report of section and symbol placement"], ["Toolchain file", "CMake file selecting the cross compiler and flags"], ["newlib-nano", "Size-reduced C library for small MCUs"]],
    equations: ["Flash used = text + data;  static RAM used = data + bss (plus stack and heap reservations)"],
    mistakes: ["Committing IDE project files as the only build", "Adding printf with floats and wondering where 30 KB went", "Not keeping the ELF of a released binary"],
    practice: ["Create a CMake + Ninja build for blinky with a toolchain file; build it from a clean clone", "Find the five largest symbols in your map file and shrink one"],
    interview: [
      q("What does the 'data' section cost in flash and RAM?", "Both: initial values are stored in flash (load address) and copied to RAM (run address) by startup code, so it counts once in flash and once in RAM.", 2),
      q("How do you find which function a HardFault PC address belongs to?", "arm-none-eabi-addr2line -e firmware.elf <address>, or look it up in the map file or GDB with info symbol.", 2),
    ],
    resources: ["arm-gnu-toolchain", "gh-bare-metal-guide", "missing-semester"],
  },
  {
    id: "emb-linker-startup", title: "Linker scripts and startup code: from reset to main()", phase: "e2", module: "e2b",
    priority: "must", depth: "advanced", difficulty: 4, days: 2, hours: 6, kind: "coding", skills: ["firmware"],
    why: "'What happens from reset to main()?' is the classic embedded interview question, and bootloaders, memory sections and RAM functions all require editing linker scripts.",
    problem: "When startup code or the linker script is wrong, globals start with garbage, C++ constructors never run or the stack collides with data, and nothing obvious fails at build time.",
    eli12: "Before the play starts, stagehands copy the props from the storage room (flash) to the stage (RAM), sweep the floor clean (zero variables) and set the lights (clocks). Only then does the actor (main) walk on.",
    tech: "Linker script MEMORY regions (FLASH, RAM with origin and length) and SECTIONS: .isr_vector (KEEP) first in flash, .text, .rodata, .data with VMA in RAM and LMA in flash (AT> FLASH), .bss (NOLOAD), stack and heap reservations, exported symbols (_sidata, _sdata, _edata, _sbss, _ebss, _estack). Reset sequence: hardware loads SP from vector 0 and PC from vector 1; Reset_Handler copies .data from flash to RAM, zeroes .bss, calls SystemInit (clocks, FPU enable via CPACR), runs __libc_init_array (C++ constructors and init arrays), calls main, and traps if main returns. Custom sections place code in RAM (.ramfunc) or data in special memories.",
    inChip: "Bootloaders, dual-image layouts, secure/non-secure partitions and shared memory with a coprocessor are all defined in linker scripts.",
    breaks: "Globals with wrong initial values (no .data copy), FPU instructions faulting (CPACR not set), stack overflow into .bss.",
    tested: "Inspect symbols with nm, break at Reset_Handler in GDB and watch memory being copied and zeroed, check the map file layout.",
    prereqs: ["emb-toolchain", "emb-exceptions"],
    objectives: ["Write a minimal linker script and startup file", "Explain VMA versus LMA", "Describe the reset-to-main sequence precisely", "Place a function in RAM with a custom section"],
    terms: [["VMA", "Virtual memory address: where a section lives at run time"], ["LMA", "Load memory address: where it is stored in the image"], ["KEEP", "Linker directive preventing garbage collection of a section"], ["__libc_init_array", "Runs constructors and init functions before main"]],
    code: { lang: "c", src: `#include <stdint.h>
extern uint32_t _sidata, _sdata, _edata, _sbss, _ebss;  /* from the linker script */
extern void SystemInit(void);
extern void __libc_init_array(void);
extern int main(void);

void Reset_Handler(void) {
    uint32_t *src = &_sidata, *dst = &_sdata;
    while (dst < &_edata) *dst++ = *src++;        /* copy .data flash -> RAM */
    for (dst = &_sbss; dst < &_ebss; ) *dst++ = 0; /* zero .bss */
    SystemInit();                                  /* clocks, FPU (CPACR), VTOR */
    __libc_init_array();                           /* C++ constructors, init arrays */
    (void)main();
    for (;;) {}                                    /* main must not return */
}`, note: "The stack pointer was already loaded by hardware from vector 0, so C code can run from the first instruction." },
    mistakes: ["Forgetting AT> FLASH for .data", "Not reserving stack space so the linker cannot warn about RAM overflow", "Calling library functions before .data and .bss are initialised"],
    practice: ["Write your own linker script and startup file for blinky with no vendor files and document each section", "Put a function in RAM, then prove its address from the map file and GDB"],
    interview: [q("Walk me through what happens from reset to main() on a Cortex-M.", "Hardware loads MSP from vector 0 and PC from vector 1. Reset_Handler copies .data from flash to RAM, zeroes .bss, configures clocks and the FPU in SystemInit, runs C/C++ static initialisers and calls main. Main should never return; if it does, startup traps.", 3, "Forgetting the .data copy and .bss zeroing.")],
    resources: ["gh-bare-metal-guide", "yiu-cortexm"], projects: ["e-startup-scratch"],
  },
  {
    id: "emb-cmsis-hal", title: "CMSIS, vendor HALs and what abstraction hides", phase: "e2", module: "e2b",
    priority: "must", depth: "working", difficulty: 2, days: 1, hours: 4, kind: "tool", skills: ["firmware"],
    why: "Professional code uses CMSIS and vendor SDKs, and you must be able to open them and see what they do. The roadmap rule is: do it once with registers, then with the abstraction, and compare.",
    problem: "Arduino-style and HAL-only learners cannot debug below the API, cannot port to a new MCU and cannot explain timing or size costs.",
    eli12: "An abstraction is a remote control: easier than opening the TV, but when the picture breaks, the repair person still needs to know what is inside.",
    tech: "Ladder: raw registers, CMSIS-Core (device headers, core_cm*.h, NVIC_EnableIRQ, SysTick_Config, intrinsics like __DSB), vendor low-level layers (STM32 LL: thin inline register wrappers), vendor HAL (handles, blocking and interrupt APIs, callbacks, timeouts), frameworks (Zephyr device API, Arduino). CMSIS 6 is the current generation; CMSIS-RTOS2 is a portable RTOS API; CMSIS-DSP and CMSIS-NN are optimised kernels. Arduino's digitalWrite hides pin mapping, clock enables and costs many cycles per call. Read HAL source to see exactly which registers it touches.",
    inChip: "Chip vendors ship CMSIS device packs, HALs and SDKs; their applications engineers maintain them, and customers debug through them.",
    breaks: "HAL blocking calls in ISRs, hidden timeouts, callbacks running in interrupt context without you realising.",
    tested: "Toggle a pin three ways (registers, LL, HAL) and measure the toggle rate and code size.",
    prereqs: ["emb-linker-startup"],
    objectives: ["Use CMSIS-Core headers and intrinsics", "Trace one HAL call down to its register writes", "Compare size and speed of register, LL and HAL code", "Explain what Arduino hides"],
    terms: [["CMSIS", "Arm's Common Microcontroller Software Interface Standard"], ["HAL", "Hardware abstraction layer"], ["LL", "STM32 low-layer register wrappers"], ["CMSIS-RTOS2", "Portable RTOS API"]],
    mistakes: ["Calling HAL_Delay inside an interrupt handler", "Assuming HAL callbacks run in thread context", "Never reading the HAL source"],
    practice: ["Toggle a GPIO with registers, LL and HAL; measure frequency with a logic analyzer and compare map-file sizes", "Step into one HAL function in GDB and list every register it writes"],
    interview: [q("What does a vendor HAL cost you, and when would you bypass it?", "Code size, cycles, hidden blocking and timeouts, and sometimes callbacks in ISR context. Bypass it (LL or registers) in hot paths, tight ISRs, or when the HAL does not support a mode you need; keep it for portability elsewhere.", 2)],
    resources: ["gh-cmsis6", "gh-stm32cubef4", "gh-libopencm3", "gh-pico-sdk"],
  },
  {
    id: "emb-gpio", title: "GPIO at the register level", phase: "e3", module: "e3a",
    priority: "must", depth: "working", difficulty: 2, days: 1, hours: 4, kind: "coding", skills: ["firmware"],
    why: "GPIO is the first peripheral and the template for all others: enable clock, configure mode, use it, add interrupts. The ChipCamp roadmap recommends blinking an LED without libraries first.",
    problem: "Library-only GPIO use hides clock enables, alternate functions and interrupt routing, which every other peripheral needs.",
    eli12: "Each pin is a tiny door that can open outward (output), listen inward (input) or be handed over to a special worker (alternate function). You set a few switches to decide which.",
    tech: "Enable the port clock; mode register (input, output, alternate, analog); output type (push-pull or open-drain); speed/slew; pull-up/down; input data register; output data register versus atomic set/reset register; alternate-function mux selecting UART, SPI, timers; external interrupt controller (EXTI on STM32) routing a pin to an NVIC line with rising/falling edge selection; debouncing in hardware or with a timer-sampled state machine.",
    inChip: "The GPIO block, pad ring and pin mux are designed by the chip team; firmware owns pin configuration tables for each board.",
    breaks: "Missing clock enable, wrong alternate function number, floating inputs causing interrupt storms.",
    tested: "Logic analyzer on the pin; register dump from the debugger compared with the reference manual.",
    prereqs: ["emb-cmsis-hal", "emb-electronics"],
    objectives: ["Configure a pin as output, input with pull-up and alternate function", "Blink an LED with registers only", "Route a button to an interrupt", "Debounce in software"],
    terms: [["Alternate function", "Connecting a pin to a peripheral instead of the GPIO block"], ["EXTI", "STM32 external interrupt/event controller"], ["Slew rate", "How fast an output edge changes; affects EMI"]],
    code: { lang: "c", src: `/* STM32F4-style register blink; check addresses and bits in your reference manual. */
#include <stdint.h>
#define RCC_AHB1ENR (*(volatile uint32_t *)0x40023830UL)
#define GPIOA_MODER (*(volatile uint32_t *)0x40020000UL)
#define GPIOA_BSRR  (*(volatile uint32_t *)0x40020018UL)

int main(void) {
    RCC_AHB1ENR |= 1U << 0;                            /* enable GPIOA clock */
    GPIOA_MODER = (GPIOA_MODER & ~(3U << 10)) | (1U << 10); /* PA5 output */
    for (;;) {
        GPIOA_BSRR = 1U << 5;                          /* set */
        for (volatile uint32_t i = 0; i < 400000; i++) {}
        GPIOA_BSRR = 1U << 21;                         /* reset */
        for (volatile uint32_t i = 0; i < 400000; i++) {}
    }
}`, note: "The volatile loop counter keeps the delay at -O2; replace it with SysTick once you reach timers." },
    mistakes: ["Forgetting the port clock", "Using the output data register from both main and an ISR", "Reading a button without a pull resistor"],
    practice: ["Blink with registers, then with HAL, and compare", "Count button presses with an interrupt and show bounce on the logic analyzer before and after debouncing"],
    interview: [q("How would you debounce a button in firmware?", "Sample the pin from a periodic timer (for example every 5 ms) and accept a new state only after it is stable for N samples, or ignore edges for a hold-off period after the first edge; do the logic in a small state machine, not with a delay in the ISR.", 2)],
    resources: ["gh-bare-metal-guide", "gh-libopencm3-ex", "gh-pico-examples"], projects: ["e-gpio-reg", "e-debounce"],
  },
  {
    id: "emb-timers", title: "Timers, PWM and input capture", phase: "e3", module: "e3a",
    priority: "must", depth: "working", difficulty: 3, days: 2, hours: 6, kind: "coding", skills: ["firmware"],
    why: "Timers generate ticks, PWM for motors and LEDs, measure frequencies and pulse widths, and trigger ADCs and DMA. Timer arithmetic is a standard interview numerical.",
    problem: "Busy-wait delays waste the CPU and drift; software-generated PWM jitters. Hardware timers do it exactly.",
    eli12: "A timer is a counter that ticks by itself. When it reaches a number you chose, it can ring a bell, flip a pin, or write down the exact moment something happened.",
    tech: "Prescaler divides the timer clock; the counter runs to the auto-reload value and generates an update event. Output compare toggles or sets pins at a count; PWM modes set duty by the compare value (edge- or center-aligned; dead time for half-bridges). Input capture latches the counter on an edge to measure period or pulse width; handle overflow for long periods. One-pulse and encoder modes. Timer clocks can differ from the bus clock (on STM32 they double when the APB prescaler is not 1). Timers can trigger ADC conversions and DMA transfers.",
    inChip: "Timer IPs are classic RTL blocks; firmware uses them for motor control, power conversion, audio and scheduling.",
    breaks: "Off-by-one in PSC/ARR, wrong timer clock assumption, missed overflow in capture calculations.",
    tested: "Measure frequency and duty on a scope or logic analyzer against your calculation.",
    prereqs: ["emb-gpio"],
    objectives: ["Calculate prescaler and reload values", "Generate PWM with a given frequency and duty", "Measure a signal's frequency with input capture", "Trigger another peripheral from a timer"],
    terms: [["Prescaler", "Divider in front of the counter"], ["Auto-reload", "Value at which the counter wraps"], ["Duty cycle", "Fraction of the period a PWM output is high"], ["Input capture", "Latching the counter value on an input edge"]],
    equations: ["f_update = f_timer / ((PSC + 1) * (ARR + 1))", "PWM duty = CCR / (ARR + 1)", "f_signal = f_tick / (capture_2 - capture_1)  (with overflow handling)"],
    example: "84 MHz timer clock, 1 kHz PWM: PSC = 83 gives 1 MHz ticks; ARR = 999 gives 1 kHz; CCR = 250 gives 25% duty.",
    mistakes: ["Forgetting the +1 in PSC and ARR", "Changing ARR without preload and getting a glitch period", "Ignoring counter overflow between captures"],
    practice: ["Generate 20 kHz PWM at 37.5% duty and verify on a logic analyzer", "Measure an unknown square wave with input capture and print its frequency over UART"],
    interview: [q("Timer clock 72 MHz. Choose PSC and ARR for a 50 Hz servo PWM with 1 microsecond resolution.", "PSC = 71 gives 1 MHz ticks (1 us); ARR = 19999 gives a 20 ms period (50 Hz); CCR from 1000 to 2000 gives 1-2 ms pulses.", 2)],
    resources: ["making-embedded", "gh-pico-examples"], projects: ["e-baud-timer-calc"],
  },
  {
    id: "emb-uart", title: "UART: framing, baud rate, errors and buffered drivers", phase: "e3", module: "e3a",
    priority: "must", depth: "working", difficulty: 2, days: 2, hours: 5, kind: "coding", skills: ["firmware", "protocols"],
    why: "UART is the console for logging, shells and bootloaders on nearly every board. A robust interrupt-driven UART driver is the first real driver most engineers write.",
    problem: "Polling UART loses bytes when the CPU is busy; blocking printf distorts timing; baud mismatches create garbage that looks like a software bug.",
    eli12: "Two people agree to speak at the same speed and start every word with a 'ready' beep. If one talks faster than the other listens, the words get scrambled.",
    tech: "Asynchronous frame: start bit, 5-9 data bits LSB first, optional parity, 1-2 stop bits (8N1 common). Baud divisor from the peripheral clock; total baud mismatch between the two ends must stay within roughly 2-3% for 8N1. Status flags: RX not empty, TX empty, transmission complete, overrun, framing, noise and parity errors. Driver design: RX interrupt into a ring buffer, TX from a ring buffer driven by the TX-empty interrupt, idle-line detection plus DMA for variable-length messages, error counters. Levels: TTL UART versus RS-232 versus RS-485 (half-duplex, driver enable). Optional RTS/CTS flow control.",
    inChip: "The UART RTL you design on the VLSI road is exactly what this driver talks to; its register map is the contract.",
    breaks: "Overrun errors when an ISR is too slow, stuck interrupts from uncleared error flags, 'garbage' from wrong clock assumptions.",
    tested: "Loopback tests, burst tests at max baud, logic-analyzer decoding, error injection by mismatching baud.",
    prereqs: ["emb-gpio", "uart"],
    objectives: ["Calculate baud divisors and error", "Decode a UART frame on a logic analyzer", "Write an interrupt-driven ring-buffered driver", "Handle and count RX errors"],
    terms: [["8N1", "8 data bits, no parity, 1 stop bit"], ["Overrun", "New byte arrived before the previous was read"], ["Framing error", "Stop bit not found where expected"], ["Idle line", "Line stays high for a frame time: end of message"]],
    equations: ["Oversampling by 16 (STM32-style): divisor = f_clk / baud; error = (f_clk / divisor - baud) / baud", "Frame time = (1 + data + parity + stop) / baud;  115200 8N1 -> 86.8 us per byte"],
    example: "16 MHz / 115200 = 138.9, use 139: actual 115108 baud, error -0.08%.",
    mistakes: ["Calling blocking printf from interrupts", "Not clearing error flags, so the interrupt fires forever", "Assuming the peripheral clock equals the core clock"],
    practice: ["Compute divisor and error for 9600, 115200 and 921600 at your clock", "Stress the driver with a 10 KB burst from the PC and count lost bytes"],
    interview: [q("How long does one byte take at 115200 baud 8N1, and what is the maximum byte rate?", "10 bits per byte, so about 86.8 us per byte and 11520 bytes per second.", 1)],
    resources: ["gh-libopencm3-ex", "gh-pico-examples", "sigrok-pulseview"], projects: ["e-uart-irq", "w-uart-cli"],
  },
  {
    id: "emb-spi-i2c", title: "SPI and I2C in practice", phase: "e3", module: "e3a",
    priority: "must", depth: "working", difficulty: 3, days: 2, hours: 6, kind: "coding", skills: ["firmware", "protocols"],
    why: "Almost every sensor, flash chip, display and codec sits on SPI or I2C. Bus-level debugging is one of the most practical embedded skills.",
    problem: "Wrong SPI mode, missing pull-ups, stuck I2C buses and unhandled NACKs cause the 'sensor returns 0xFF' class of bugs.",
    eli12: "SPI is a fast conversation where the boss taps each worker on the shoulder (chip select) and both talk at once. I2C is a slower party line where everyone shares two wires and must say their name first.",
    tech: "SPI: SCLK, MOSI, MISO, CS; CPOL (clock idle level) and CPHA (sampling edge) give modes 0-3; full duplex means every write clocks in a read (send dummy bytes to read); CS timing and multi-byte transactions; speed limited by traces and the slave. I2C: open-drain SDA/SCL with pull-ups; START, 7-bit address + R/W, ACK/NACK on the 9th clock, repeated START for register reads, STOP; 100 kHz, 400 kHz, 1 MHz modes; clock stretching; multi-master arbitration; bus recovery when a slave holds SDA low (clock SCL up to 9 times until SDA releases, then send STOP). Drivers need timeouts and error returns everywhere.",
    inChip: "SPI/I2C controllers are standard IP blocks; board bring-up always starts with 'can we read the WHO_AM_I register'.",
    breaks: "Mode mismatch shifts data by one bit; resets in the middle of a transfer leave an I2C bus stuck; missing timeouts hang the firmware.",
    tested: "Logic analyzer protocol decoders; reading known ID registers; fault injection by disconnecting a device.",
    prereqs: ["emb-uart", "spi-i2c"],
    objectives: ["Pick the SPI mode from a datasheet timing diagram", "Read a sensor register over I2C with repeated start", "Recover a stuck I2C bus", "Add timeouts and error codes to bus drivers"],
    terms: [["CPOL/CPHA", "SPI clock polarity and phase"], ["Repeated START", "New START without STOP, used to switch from write to read"], ["Clock stretching", "Slave holds SCL low to pause the master"], ["Bus recovery", "Clocking a stuck slave until it releases SDA"]],
    mistakes: ["Using a 7-bit address shifted twice (0x76 versus 0xEC)", "No timeout in the I2C busy-wait loop", "Toggling CS between bytes of one transaction"],
    practice: ["Read a sensor's ID register over I2C and decode the transaction on a logic analyzer", "Reset the MCU mid-transfer until the bus locks, then implement and test recovery"],
    interview: [
      q("How do you debug an I2C bus lock?", "Check SDA and SCL levels: if SDA is held low by a slave, clock SCL manually (GPIO mode) up to nine times until SDA goes high, then generate STOP and reinitialise the controller. Add timeouts and run recovery at boot. Confirm pull-ups and look for a reset during a transfer.", 3),
      q("What do CPOL and CPHA mean, and what is SPI mode 0?", "CPOL is the clock idle level, CPHA selects whether data is sampled on the first or second clock edge. Mode 0: clock idles low, data sampled on the rising (first) edge.", 1),
    ],
    resources: ["sigrok-pulseview", "gh-pico-examples"], projects: ["e-i2c-sensor", "d-i2c-lock"],
  },
  {
    id: "emb-adc", title: "ADC and DAC: sampling real signals", phase: "e3", module: "e3a",
    priority: "must", depth: "working", difficulty: 3, days: 1, hours: 4, kind: "coding", skills: ["firmware"],
    why: "Sensors produce voltages; the ADC is how firmware sees temperature, current, audio and vibration. Resolution and sampling numericals are frequent interview questions.",
    problem: "Wrong sample times, no anti-alias filtering and ignored reference voltage give noisy, aliased or offset readings.",
    eli12: "An ADC is a ruler for voltage with a fixed number of tick marks. If you measure too rarely, a fast wiggle can fool you into seeing a slow one.",
    tech: "SAR ADC operation; resolution N bits gives LSB = Vref / 2^N; sample-and-hold time must suit the source impedance; reference voltage accuracy dominates absolute error; calibration; channel sequences and scan mode; timer-triggered conversions for exact sample rates; DMA for continuous acquisition; oversampling and averaging trade bandwidth for noise; Nyquist and anti-alias filtering; DAC output and settling; internal temperature sensor and reference channels.",
    inChip: "ADCs are mixed-signal IP from the analog team; firmware sets sample rates, calibration and filtering.",
    breaks: "Aliasing, readings that drift with supply voltage, crosstalk between channels because of short sample times.",
    tested: "Feed known voltages; compare against a multimeter; check spectrum for aliasing with a known signal.",
    prereqs: ["emb-timers"],
    objectives: ["Compute LSB size and ideal SNR", "Choose sample time for a source impedance", "Trigger conversions from a timer", "Explain aliasing and oversampling"],
    terms: [["SAR ADC", "Successive-approximation ADC"], ["LSB", "Least significant bit: smallest step"], ["Aliasing", "High frequencies folding into low ones when sampling too slowly"], ["Oversampling", "Sampling faster and averaging to reduce noise"]],
    equations: ["LSB = V_ref / 2^N  (12-bit at 3.3 V -> 0.806 mV)", "Ideal SNR = 6.02 * N + 1.76 dB", "f_s > 2 * f_max (Nyquist)"],
    mistakes: ["Reading the ADC in a busy loop without a fixed sample rate", "Using a high-impedance divider with a short sample time", "Assuming Vref is exactly 3.3 V"],
    practice: ["Sample a potentiometer at 1 kHz from a timer trigger and log over UART", "Measure the same voltage with the internal reference correction and without"],
    interview: [q("A 10-bit ADC with 5 V reference reads 512. What is the voltage, and what is the resolution?", "LSB = 5 / 1024 = 4.88 mV; 512 x 4.88 mV = 2.5 V.", 1)],
    resources: ["making-embedded", "lyons-dsp"], projects: ["e-adc-logger", "w-dma-daq"],
  },
  {
    id: "emb-wdt-flash", title: "Watchdog, RTC and internal flash", phase: "e3", module: "e3a",
    priority: "must", depth: "working", difficulty: 2, days: 1, hours: 4, kind: "coding", skills: ["firmware"],
    why: "Products must recover from hangs, keep time and store settings. Watchdog strategy and flash wear are production-quality topics interviewers probe.",
    problem: "Kicking the watchdog from a timer ISR hides hung tasks; writing flash too often wears it out; erasing the bank you execute from stalls the CPU.",
    eli12: "A watchdog is an alarm clock that resets the device unless it is told 'all good' in time. Flash is a notebook where you can only erase whole pages and each page wears out after many erasures.",
    tech: "Independent watchdog on its own low-speed clock (usually cannot be stopped once started); window watchdog rejects kicks that come too early; kick only after every task has checked in; read and log the reset-cause register at boot. RTC with a 32.768 kHz crystal and backup domain, alarms and wake-up. Internal flash: erase by page or sector (erased bits read 1), program in fixed units, typical endurance around 10,000 cycles for MCU flash (check the datasheet), unlock/lock sequences, execution stalls while erasing the same bank, EEPROM emulation with wear levelling and power-loss safety.",
    inChip: "Watchdog and flash controller are RTL blocks; field reliability depends on firmware using them correctly.",
    breaks: "Watchdog resets in the field with no logged cause, corrupted settings after power loss during a write, worn-out flash sectors.",
    tested: "Deliberately hang a task and confirm reset plus logged cause; power-cycle during writes; count erase cycles.",
    prereqs: ["emb-timers"],
    objectives: ["Design a task-check-in watchdog strategy", "Log reset causes", "Erase and program internal flash safely", "Explain flash wear and EEPROM emulation"],
    terms: [["IWDG", "Independent watchdog"], ["Window watchdog", "Watchdog that also rejects early kicks"], ["Reset cause", "Register recording why the chip reset"], ["Endurance", "Number of erase/program cycles flash tolerates"]],
    mistakes: ["Kicking the watchdog from a timer ISR", "Storing a counter in flash that updates every second", "Erasing flash without disabling interrupts that execute from it"],
    practice: ["Implement task check-in before kicking; hang one task and show the reset and logged cause", "Store a config struct with CRC in flash and survive a power cut during write"],
    interview: [q("Why does a watchdog reset occur, and how do you find out why after the fact?", "The watchdog was not refreshed in time: a hang, a deadlock, an infinite loop, a too-long blocking call or a starved task. Log the reset cause at boot, keep a breadcrumb or last-task record in RAM that survives reset (no-init section), and store a crash record.", 3)],
    resources: ["making-embedded", "interrupt-blog"], projects: ["e-wdt-recovery"],
  },
];
