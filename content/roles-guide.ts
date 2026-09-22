import type { RoleTarget } from "./schema.ts";

export const RESEARCHED = "2026-09-23";

export interface RoleGuide {
  target: RoleTarget;
  title: string;
  oneLine: string;
  whatItIs: string;
  day: string;
  whoNeeds: string;
  entryRealism: string;
  goodIf: string[];
  badIf: string[];
  payPosition: string;
  searchTerms: string[];
}

export const ROLE_GUIDE: RoleGuide[] = [
  {
    target: "rtl", title: "RTL design engineer (digital design)",
    oneLine: "You write the code that becomes the actual circuit.",
    whatItIs: "RTL stands for register-transfer level. It is a way of describing hardware as 'on every clock tick, move this data here and do this to it'. You write it in Verilog or SystemVerilog, and a synthesis tool turns your description into millions of real transistors. It looks like programming but it is not: every line you write becomes physical gates that occupy area, burn power and take time to switch. An RTL designer decides how a block is structured, how deeply it is pipelined, how wide the datapath is, and which tradeoffs to accept.",
    day: "Read a specification, sketch a microarchitecture, write or modify RTL, run lint and simulation, look at waveforms when something is wrong, check synthesis and timing reports, fix paths that are too slow, and answer questions from verification and physical design about your block.",
    whoNeeds: "Every company that designs a chip: processor and GPU companies, phone and networking SoC teams, automotive and industrial chipmakers, storage and memory controller teams, and the design-services firms that do this work for them under contract.",
    entryRealism: "Honest picture: RTL is the role most freshers want, and many postings ask for experience because a bug in RTL is expensive. It is reachable from a strong project portfolio, but entry is usually through a campus programme, a design-services company, or by moving across from verification after a year or two. Your software background is not a disadvantage here, but your projects must show synthesis and timing results, not just simulations that pass.",
    goodIf: ["You enjoy building something from a blank page", "You like optimising: making something smaller, faster or lower power", "You are comfortable being responsible for design decisions"],
    badIf: ["You dislike waiting hours for tool runs", "You want your work judged mainly by software-style output speed"],
    payPosition: "Mid-to-high within digital roles. Pay tracks company tier far more than role: the same title pays very differently at a product company and a services firm.",
    searchTerms: ["RTL design engineer", "digital design engineer", "ASIC design engineer", "SoC design engineer"],
  },
  {
    target: "dv", title: "Design verification engineer (DV)",
    oneLine: "You try to break the design before the factory does.",
    whatItIs: "Verification is proving a design does what the specification says, and finding the cases where it does not. You build a testbench: a piece of software in SystemVerilog that pretends to be everything around the block, feeds it millions of random and directed scenarios, and automatically checks every response against a reference model. You write assertions that watch for illegal behaviour and coverage that measures what you have actually exercised. Most verification is really software engineering aimed at hardware.",
    day: "Write or extend a test plan, code sequences and checkers, run regressions overnight, triage the failures in the morning, debug waveforms and logs to decide whether the bug is in the design or your testbench, and chase the remaining coverage holes.",
    whoNeeds: "Everyone who makes chips, in larger numbers than design: verification is typically the biggest part of a chip project, because a bug found after manufacturing can cost millions and months.",
    entryRealism: "The most realistic entry point for your profile, and the role where your software and debugging experience counts immediately. Of the new-graduate postings sampled for this app, DV roles appeared most often and asked for coursework or projects plus Verilog or SystemVerilog familiarity, with UVM to be learned on the job.",
    goodIf: ["You enjoy finding out why something is broken", "You like writing code and automating things", "You are systematic and like being thorough"],
    badIf: ["You want to be the person who designs the thing rather than tests it", "You dislike long debugging sessions"],
    payPosition: "Comparable to RTL, and senior verification specialists are among the better-paid digital roles because the skill is scarce and the cost of missing a bug is enormous.",
    searchTerms: ["design verification engineer", "DV engineer UVM", "ASIC verification fresher", "SystemVerilog verification"],
  },
  {
    target: "pd", title: "Physical design engineer (backend)",
    oneLine: "You turn the netlist into the actual layout that gets manufactured.",
    whatItIs: "After synthesis you have a list of gates and connections. Physical design decides where every one of those gates physically sits on the silicon, how the clock reaches them all at nearly the same instant, and how the wires are routed, so that the chip meets its timing, power and area targets and obeys thousands of manufacturing rules. It is a highly tool-driven role: you run commercial tools, read their reports, and change constraints and floorplans until everything is clean.",
    day: "Launch flow runs that take hours, read timing and congestion reports, fix the worst paths, adjust the floorplan or the constraints, rerun, and work through DRC and LVS violations as tapeout approaches.",
    whoNeeds: "Product companies with their own chips, and especially design-services companies, which do a lot of backend work for clients. Demand is steady because every design must go through this stage.",
    entryRealism: "Harder to enter from home projects, because the industry runs on expensive commercial tools you cannot legally practise with. You can build real credibility with the open-source flow (OpenROAD, LibreLane and open PDKs), which is genuine end-to-end experience, but expect employers to value commercial tool exposure from an institute programme or an internship.",
    goodIf: ["You like closing in on a target with numbers and iterations", "You enjoy scripting repetitive work in Tcl and Python", "You are patient with long tool runs"],
    badIf: ["You want to invent architecture rather than optimise an implementation", "You dislike depending on tool licences"],
    payPosition: "Strong, and rises steeply with experience at advanced process nodes; reporting consistently places experienced physical design among the better-paid specialisations.",
    searchTerms: ["physical design engineer", "PnR engineer", "STA engineer", "backend VLSI engineer"],
  },
  {
    target: "dft", title: "Design for test (DFT) engineer",
    oneLine: "You add the circuitry that lets a factory tell a good chip from a broken one.",
    whatItIs: "Manufacturing is imperfect, so some chips come out defective. DFT inserts extra hardware into the design (scan chains, built-in self-test, compression, JTAG access) so that automated equipment can shift test patterns in, run them and shift results out, catching defects before a chip reaches a customer. You also generate those patterns with ATPG tools and measure what fraction of possible defects they catch.",
    day: "Insert and verify scan structures, run ATPG, look at coverage numbers and improve them, debug why a pattern fails in simulation, and work with physical design on the routing and power impact of test logic.",
    whoNeeds: "Any company shipping chips in volume, particularly automotive, industrial and safety-critical products where an escaped defect is dangerous rather than merely embarrassing.",
    entryRealism: "A smaller, more specialised field with fewer openings than DV, but also fewer people who understand it, which can work in your favour. Entry is usually through a company that trains you; self-study plus a clear scan and ATPG project makes you unusual among freshers.",
    goodIf: ["You like a niche where being one of the few who understands it has value", "You enjoy the link between design and manufacturing"],
    badIf: ["You want the widest possible choice of openings", "You prefer inventing functionality to enabling testing"],
    payPosition: "Good, and rises well with experience because the specialism is scarce.",
    searchTerms: ["DFT engineer", "scan ATPG engineer", "design for testability"],
  },
  {
    target: "fpga", title: "FPGA engineer",
    oneLine: "You build working hardware on a reprogrammable chip, often within weeks.",
    whatItIs: "An FPGA is a chip full of configurable logic you can program into any digital circuit and reprogram tomorrow. The design work is close to RTL design, but the loop is far shorter: you can hold the working result in your hand. FPGAs are used in products where volumes are too small to justify a custom chip, where the design must change in the field, and as prototypes of chips before they are manufactured.",
    day: "Write RTL, run the vendor tool flow, close timing, load the bitstream onto a board, and debug real signals with on-chip logic analysers when the hardware misbehaves.",
    whoNeeds: "Aerospace and defence, telecom and broadcast equipment, medical and scientific instruments, trading firms, industrial automation, and chip companies using FPGAs for prototyping and emulation.",
    entryRealism: "One of the most accessible entry points, because you can buy an inexpensive board, build something real, and record a video of it working. Hardware demos are rare in fresher portfolios and disproportionately convincing.",
    goodIf: ["You want to see your design running in the physical world quickly", "You like hardware-software projects"],
    badIf: ["You specifically want to work on chips that go to a fab", "You dislike vendor-specific tools"],
    payPosition: "Moderate in India relative to ASIC roles, with strong exceptions in defence, trading and specialist product companies.",
    searchTerms: ["FPGA design engineer", "FPGA developer Verilog", "embedded FPGA engineer"],
  },
  {
    target: "aihw", title: "AI hardware / accelerator engineer",
    oneLine: "You design the silicon that runs neural networks efficiently.",
    whatItIs: "Neural networks are mostly enormous numbers of multiply-accumulate operations with heavy data movement. Accelerator designers build arrays of arithmetic units, memory hierarchies and dataflows that keep those units busy without spending all the energy moving data. The job mixes computer architecture, RTL design and a real understanding of the models being run.",
    day: "Model a dataflow in Python to estimate performance, argue about memory bandwidth, write or review RTL for compute and buffering, and measure utilisation and energy per operation against targets.",
    whoNeeds: "AI chip teams at large product companies, GPU and mobile SoC teams, and a growing set of startups. It is a smaller field than DV or PD, and most openings expect real architecture depth.",
    entryRealism: "Rarely an entry-level role on its own. The realistic route is to enter through RTL or DV, build accelerator projects on the side, and move across. Your machine-learning background is a genuine advantage here, but only on top of solid digital fundamentals.",
    goodIf: ["You already know neural networks and want to make them fast", "You enjoy performance analysis and tradeoffs"],
    badIf: ["You want the broadest set of entry-level openings", "You are not yet comfortable with architecture fundamentals"],
    payPosition: "Among the highest for experienced engineers, concentrated in a few companies; expectations are correspondingly high.",
    searchTerms: ["AI accelerator design engineer", "NPU RTL engineer", "machine learning hardware engineer"],
  },
  {
    target: "eda", title: "EDA / CAD software engineer",
    oneLine: "You write the software that other engineers use to design chips.",
    whatItIs: "Every chip is built with tools: simulators, synthesis, placement and routing, timing analysis, formal verification. Someone writes those tools, and someone inside each chip company builds the flows and scripts that hold them together. This is a software engineering job with a hardware domain: graph algorithms, optimisation, huge data sets and performance work.",
    day: "Write and review C++ or Python, profile something that is too slow on a million-gate design, fix algorithmic bugs, and talk to the design teams who use your tool about what is failing.",
    whoNeeds: "EDA vendors (Synopsys, Cadence, Siemens EDA), the internal CAD and methodology teams that almost every large chip company runs, and a handful of startups applying machine learning to the design flow.",
    entryRealism: "The most natural fit for someone with your software background, and the role where years of JavaScript, data structures and debugging convert directly into value. You still need enough hardware knowledge to understand what the tool is doing. Expect standard software interviews, so keep your DSA sharp.",
    goodIf: ["You genuinely enjoy programming and algorithms", "You like building things other engineers depend on"],
    badIf: ["You want to design the chip itself", "You dislike large legacy codebases"],
    payPosition: "Strong, and often the highest early-career pay among these roles because it competes with the software job market.",
    searchTerms: ["EDA software engineer", "CAD engineer semiconductor", "physical design automation C++"],
  },
];

export const ROLE_GUIDE_MAP: Record<string, RoleGuide> = Object.fromEntries(ROLE_GUIDE.map((r) => [r.target, r]));

/** Published pay figures disagree wildly. The disagreement itself is the finding. */
export const PAY_REALITY = {
  summary: "There is no single trustworthy number for what a VLSI fresher earns in India. Published figures for the same year disagree by a factor of five or more, and most of the sites publishing them sell training courses, which gives them a reason to quote high numbers. Below is the actual spread found on 2026-09-23 so you can judge it yourself.",
  points: [
    { claim: "About INR 4-6 LPA for freshers, rising with experience", source: "Futurense (training provider blog)", url: "https://futurense.com/blog/vlsi-engineer-salary-in-india" },
    { claim: "INR 1.8-5 LPA starting, citing PayScale for an average around INR 5.9 LPA", source: "Collegedunia (education portal)", url: "https://collegedunia.com/courses/vlsi-courses/career-options-and-jobs" },
    { claim: "Average INR 7.05 LPA, 25th percentile INR 4.34 LPA, 75th percentile INR 14 LPA, from 131 self-reported salaries", source: "Glassdoor (self-reported, employee submitted)", url: "https://www.glassdoor.co.in/Salaries/vlsi-design-engineer-salary-SRCH_KO0,20.htm" },
    { claim: "INR 3-6 LPA for freshers, with tier-1 college graduates at the top of that band", source: "GUVI (training provider blog)", url: "https://www.guvi.in/blog/vlsi-salary-in-india/" },
    { claim: "Entry-level around INR 4-8 LPA, with reporting of INR 6-12 LPA offers in recent semiconductor hiring", source: "Takshila VLSI (training provider blog)", url: "https://www.takshila-vlsi.com/blog/vlsi-engineer-salary-india-2026/" },
    { claim: "Median fresher INR 8-15 LPA across tiers; INR 4-10 LPA at Indian services companies, INR 15-30 LPA at large product companies", source: "salaryinsight.in (aggregator blog)", url: "https://salaryinsight.in/vlsi-engineer-salary/" },
  ],
  drivers: [
    "Company tier is the single biggest factor. The same role pays very differently at a global product company, an EDA vendor, and a design-services firm.",
    "Location: Bengaluru and Hyderabad concentrate most design centres, and pay there is reported higher than elsewhere in India.",
    "How you enter: campus offers, lateral hiring and services-to-product switches all land in different bands.",
    "Demonstrable skill: the gap between someone who has only coursework and someone who can discuss CDC, constraints, coverage and their own tapeout-style project is large and visible in interviews.",
    "Equity: at large product companies a meaningful part of senior compensation is stock, which is why quoted 'total compensation' figures run far above base salary.",
  ],
  howToCheck: [
    "Read live postings rather than blog averages. Most postings in India do not state pay, but the ones that do are real data.",
    "On self-reported sites (Glassdoor, AmbitionBox, levels.fyi), filter by company, location and years of experience rather than reading the headline average, and remember the samples are small and self-selected.",
    "Ask engineers directly, politely and specifically: 'what band does a fresher in your team usually start at?' is answerable; 'what do you earn?' is not.",
    "Treat any single posting or any one blog as an anecdote. Look for the same range from three unrelated sources before believing it.",
  ],
  sampled: "One posting sampled for this app (Bengaluru, IP verification, 2+ years) listed INR 8-20 LPA. That is one data point from one company, not a benchmark.",
};

export const DEMAND_REALITY = {
  summary: "Demand signals for Indian semiconductor work are strong but the widely quoted job numbers are projections, not headcounts, and most of the projected jobs are in fabrication, assembly and testing rather than chip design.",
  points: [
    { claim: "Industry reporting projects roughly one million semiconductor-related jobs in India by FY2026-27, of which about 300,000 are in fabrication and 200,000 in assembly, testing, marking and packaging.", source: "Taggd, India Decoding Jobs 2026", url: "https://taggd.in/blogs/semiconductor-hiring-trends/" },
    { claim: "The same reporting estimates the sector could employ close to 220,000 professionals by FY2026, and notes that design and R&D hiring is concentrated in Bengaluru, Hyderabad and Noida.", source: "Taggd, semiconductor workforce analysis", url: "https://taggd.in/blogs/semiconductor-workforce-in-india/" },
    { claim: "Reporting repeatedly describes a shortage of industry-ready engineers rather than a shortage of graduates: the gap is in practical skill, not numbers.", source: "Futurense career analysis", url: "https://futurense.com/blog/vlsi-career-in-india" },
  ],
  whatItMeans: [
    "Design roles are a minority of those projected numbers, so do not read 'one million jobs' as a million chip-design openings.",
    "The stated shortage is of people who can actually do the work. That is good news for you specifically, because the whole point of this roadmap is demonstrable skill rather than a certificate.",
    "Verification consistently has the most openings of the design-side roles, which is why it is the most realistic first job.",
    "Almost all of this work sits in a few cities. Be honest with yourself about relocating.",
  ],
  checkYourself: [
    "Search each role title on LinkedIn Jobs and Naukri, filter to India and to the last month, and write down the number of results. Repeat monthly: the trend matters more than the number.",
    "Search the same titles with '0-2 years' or 'fresher' to see how many are actually open to you.",
    "Note which companies appear repeatedly: those are your targets for referrals and applications.",
  ],
};

export const SOURCES_NOTE = `Figures on this page were collected on ${RESEARCHED} from public web sources and are quoted with their origin so you can weigh them. Salary and hiring data changes; re-check before making decisions, and treat training-provider blogs with particular caution.`;
