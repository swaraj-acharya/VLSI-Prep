export const GLOBAL_RESEARCHED = "2026-09-23";

export const CRORE_REALITY = {
  headline: "A one-crore package is a real destination, but it is a senior-engineer outcome, not an entry-level one.",
  facts: [
    "At that level, compensation is usually 'total compensation': base salary plus bonus plus stock that vests over several years. Quoted crore figures almost always include equity, so the money arrives over time and moves with the share price.",
    "In India, packages at that level are generally found at large global product companies and a few well-funded startups, at principal, staff or architect level. Public salary reporting consistently places these bands at roughly ten or more years of experience, with senior specialists in scarce areas reaching them sooner.",
    "Abroad, senior engineers at major chip companies in the United States can reach an equivalent figure in local currency earlier in absolute terms, but the comparison is misleading until you subtract cost of living, tax and the cost of getting there.",
    "Nobody reaches this level through certificates or by collecting tools on a resume. It comes from being demonstrably excellent at something scarce, at a company that pays for it.",
  ],
  levers: [
    { title: "Scarcity of your specialisation", detail: "Reporting consistently shows the highest bands in analog and mixed-signal design, architecture, advanced-node physical design, and deep verification expertise. The common factor is that few people can do the work and mistakes are expensive." },
    { title: "Company tier", detail: "The same person is paid very differently at a global product company, an EDA vendor and a services firm. Moving tier is usually a bigger jump than any number of years in place." },
    { title: "Equity", detail: "Large packages are mostly stock. This is why total compensation at a public product company can be multiples of a services salary with the same title." },
    { title: "Depth over breadth", detail: "Being the person the team asks about clock domain crossing, or coherence, or timing closure at an advanced node, is worth more than having touched ten areas shallowly." },
    { title: "Visible track record", detail: "Tapeouts you contributed to, blocks you owned, bugs you caught that would have been expensive, papers or talks. This is what makes a senior hiring loop straightforward." },
    { title: "Geography", detail: "A move to the United States, western Europe, Israel, Singapore or Japan changes the currency you are paid in. It also changes your cost base, so compare take-home and savings, not headline numbers." },
  ],
  stages: [
    { window: "Year 0 to 1", focus: "Get in. Accept that the first job is about learning the real flow, tools and review culture, not about the package.", signal: "You can own a small block or a testbench end to end without supervision." },
    { window: "Year 1 to 3", focus: "Become genuinely good at one area and ship. Take the unglamorous debugging nobody wants; that is where reputations form.", signal: "People route hard problems in your area to you." },
    { window: "Year 3 to 6", focus: "This is usually the fastest-growing phase. Move to a product company if you started in services, or move to a harder project inside one. Own a block on a real tapeout.", signal: "You are trusted with architecture decisions and mentoring." },
    { window: "Year 6 to 10", focus: "Deepen into scarcity: advanced nodes, complex protocols, coherence, security, or an architecture role. Present externally, publish, or contribute in the open.", signal: "You are recruited rather than applying." },
    { window: "Year 10 and beyond", focus: "Principal, staff or architect scope, where you are accountable for outcomes across teams. This is the band where crore-level total compensation appears in India.", signal: "Your decisions shape products rather than blocks." },
  ],
  cautions: [
    "Anyone promising a crore-level package for a fresher, or a course that guarantees it, is selling something. Treat that as a reliable signal to walk away.",
    "Chasing the number by switching jobs every year eventually works against you: senior loops ask for depth and ownership, which take time to accumulate.",
    "A high package with a bad team can stall your growth for years. Early on, optimise for the quality of the engineers reviewing your work.",
  ],
};

export interface Hub { region: string; whatIsThere: string; route: string; caution: string }

export const HUBS: Hub[] = [
  { region: "United States", whatIsThere: "The largest concentration of chip companies, EDA vendors and the highest compensation bands, especially in California, Texas, Oregon, Arizona and the north-east.", route: "Two realistic paths: a master's degree there followed by campus hiring, or joining a US company's India design centre and transferring internally later.", caution: "Immigration is the hard part, not the job: the H-1B cap is heavily oversubscribed and the rules have changed repeatedly in the last year." },
  { region: "Germany", whatIsThere: "Infineon, Bosch, NXP and others in automotive, power and industrial semiconductors, plus large design centres in Munich, Dresden and Nuremberg.", route: "Direct hire with an EU Blue Card is realistic for experienced engineers, and engineering appears on the shortage-occupation list.", caution: "German is often unnecessary for the job itself but makes daily life and long-term settling far easier." },
  { region: "Netherlands", whatIsThere: "ASML and its supply chain, NXP, Imec collaboration nearby, and strong semiconductor equipment work around Eindhoven.", route: "The Highly Skilled Migrant route through a recognised sponsor is one of Europe's more straightforward, and most large employers are sponsors.", caution: "It runs on salary thresholds: if the offer is below the threshold for your age band, the permit fails regardless of your skill." },
  { region: "Ireland", whatIsThere: "Intel's manufacturing and design presence, Analog Devices, and several EDA and design-services operations.", route: "The Critical Skills Employment Permit covers degree-level engineering occupations and leads to residency.", caution: "Housing costs in Dublin are severe; weigh the offer against them." },
  { region: "Israel", whatIsThere: "Very dense concentration of design centres: Intel, NVIDIA, Apple, Qualcomm, Marvell and a large startup scene.", route: "Usually an internal transfer or direct hire into a specific team; roles are senior-weighted.", caution: "Fewer entry-level openings for non-residents; check current conditions carefully before planning around it." },
  { region: "Taiwan, Singapore, Japan, South Korea", whatIsThere: "Foundries and manufacturing (TSMC, UMC), plus design centres for memory, automotive and consumer SoCs. Singapore is the main English-working hub.", route: "Direct hire on a work pass, or transfer within a multinational.", caution: "Language expectations vary sharply: Singapore is the easiest to enter as an English speaker, Japan and Korea generally expect local language for long-term growth." },
  { region: "Canada", whatIsThere: "Design centres in Toronto, Ottawa, Markham and Vancouver, including AMD, Qualcomm, Synopsys and Huawei-successor teams.", route: "Employer-sponsored work permits, or permanent residence through the points-based system, which many engineers pursue independently of a job offer.", caution: "Salaries are lower than in the United States for the same role; the trade is stability and a clearer path to permanent residence." },
  { region: "United Kingdom and Switzerland", whatIsThere: "Arm, Imagination, Graphcore and Nordic-facing design work in the UK; ETH-adjacent research and design teams in Switzerland.", route: "Skilled Worker sponsorship in the UK; direct hire in Switzerland, where pay is high but so are living costs.", caution: "Sponsorship thresholds in the UK have risen repeatedly; verify the current level before counting on it." },
];

export interface VisaNote { name: string; what: string; status: string; url: string }

export const VISA_NOTES: VisaNote[] = [
  {
    name: "United States, H-1B",
    what: "The main work visa for engineers. Employers register you in an annual lottery; the cap is about 85,000 including the advanced-degree allocation, and registration costs 215 US dollars per person.",
    status: "In flux. A December 2025 rule replaced the random draw with wage-weighted selection, which favours higher-paid positions, and applied from the registration period that opened on 4 March 2026; registrations fell to about 211,600 for that cycle. A September 2025 proclamation added a 100,000 US dollar supplemental payment for certain new petitions for people outside the country; a federal court vacated the guidance implementing it on 8 June 2026, the government appealed, and reporting through mid-2026 described the position as contested and changing. Verify the current position with USCIS and a licensed attorney before planning anything around it.",
    url: "https://www.uscis.gov/newsroom/alerts/h-1b-faq",
  },
  {
    name: "United States, L-1 intra-company transfer",
    what: "Moves an employee from a company's foreign office to its US office after qualifying employment abroad. No lottery.",
    status: "This is why joining the India design centre of a US company is the most practical long-term route for many engineers: you build the track record and the transfer becomes an internal conversation.",
    url: "https://www.uscis.gov/working-in-the-united-states/temporary-workers",
  },
  {
    name: "United States, O-1 and EB-2 NIW",
    what: "Routes for people with demonstrated extraordinary ability or whose work is judged to be in the national interest. Evidence-based rather than lottery-based.",
    status: "Realistic only with a real record: publications, patents, significant open-source or standards contributions, press, or awards. Worth knowing about early because the evidence takes years to accumulate.",
    url: "https://www.uscis.gov/working-in-the-united-states/temporary-workers",
  },
  {
    name: "Germany, EU Blue Card",
    what: "Residence permit for graduates with a qualifying job offer, leading to settlement.",
    status: "Thresholds effective 1 January 2026: 50,700 euros gross per year for standard occupations, and 45,934.20 euros for shortage occupations, which include engineering and IT, as well as recent graduates within three years of graduating. The lower threshold requires Federal Employment Agency approval, which adds time.",
    url: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
  },
  {
    name: "Netherlands, Highly Skilled Migrant and EU Blue Card",
    what: "Permit through an employer registered as a recognised sponsor, with no labour-market test but a strict salary floor.",
    status: "2026 gross monthly minimums, excluding the 8 percent holiday allowance: 5,942 euros at 30 and over, 4,357 euros under 30, 3,122 euros under the reduced criterion for recent graduates in the orientation year, and 4,754 euros for the reduced Blue Card rate. Indexed annually.",
    url: "https://ind.nl/en",
  },
  {
    name: "Ireland, Critical Skills Employment Permit",
    what: "Permit for listed degree-level occupations including engineering, with a path to residence.",
    status: "Reported 2026 minimums of 40,904 euros for listed occupations and 36,848 euros for graduates within twelve months of their degree. Confirm on the official site before applying.",
    url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/",
  },
];

export const VISA_WARNING = `Immigration rules change frequently and the details above were collected on ${GLOBAL_RESEARCHED} from public reporting and official alerts. Treat them as a starting point for your own research, always confirm on the official government site, and speak to a licensed immigration lawyer before making decisions. Never pay an agent who guarantees a visa or a job abroad: in hardware, legitimate employers sponsor you, and you are not asked to buy the sponsorship.`;

export const CERTS_FOR_GLOBAL = {
  summary: "No certification will get you a high-paying or an international role in chip design. None of the job postings sampled for this app named one. What employers check is whether you can do the work, and what immigration authorities check is your degree, your salary and your employer. Certificates only help at the margins, in specific situations.",
  worth: [
    { item: "A recognised degree, properly documented", why: "This is the one credential that matters for immigration: several routes require a degree recognised in that country. For Germany in particular, check whether your degree is listed as recognised, and keep transcripts and certificates ready in English.", when: "Before any international application." },
    { item: "A master's degree abroad", why: "Not needed to be good at the work, but it is the most reliable route into the United States, because it provides local campus hiring plus a different immigration lane. It is also expensive and worth treating as an investment decision, not a default.", when: "Only if the United States is a firm goal and you can fund it." },
    { item: "RISC-V Foundational Associate (Linux Foundation and RISC-V International)", why: "The rare certification with genuine industry backing, and it signals the RISC-V ecosystem that many new designs are built on. It supports a story; it does not replace one.", when: "If you are targeting RISC-V-based teams and already have projects to show." },
    { item: "Vendor tool badges (Cadence, Siemens Xcelerator Academy)", why: "Useful only where commercial tool exposure is the barrier, most often in physical design, because you cannot legally practise with those tools at home.", when: "If a specific target role keeps asking for tool experience you lack." },
    { item: "English language tests (IELTS or equivalent)", why: "Not for employers, but several immigration systems, including Canada's points-based route, score language formally.", when: "Only when a specific immigration route requires it." },
  ],
  insteadInvest: [
    "A tapeout you can point to, including an open shuttle such as Tiny Tapeout: very few applicants anywhere have physically manufactured something.",
    "Merged contributions to tools the industry actually uses, such as Verilator, cocotb, OpenROAD or LibreLane. This is visible, verifiable evidence that survives any border.",
    "A reproduced or extended paper, or a talk at an open conference such as DVCon, ORConf or a RISC-V event. This is what O-1 and national-interest routes are built from.",
    "Deep, documented projects with measured results, which is what every senior technical interview actually probes.",
  ],
};

export const APPLY_PLAYBOOK = [
  { step: "Build the target list", detail: "Thirty companies, split into three groups: global product companies with India design centres (the best long-term route abroad), EDA vendors, and strong design-services firms. Record each one's typical entry titles and where they hire." },
  { step: "Make the evidence findable", detail: "A GitHub profile where the top three repositories are your flagships, each with a README a stranger can follow, results with numbers, and a diagram. A one-page resume where every project bullet names what you built, how you verified it and what you measured." },
  { step: "Apply where applications are actually read", detail: "Company career sites directly, plus campus and new-graduate programmes in their hiring windows, which for many multinationals open in autumn for the following year. Aggregator applications without a referral have low response rates." },
  { step: "Get referrals honestly", detail: "Find engineers in the team, read something they wrote, ask one specific technical question, and only later ask whether they would consider referring you. Never open with the request. Use the templates on the Build in public page." },
  { step: "Prepare the three interview layers", detail: "Fundamentals you can explain on a whiteboard (setup and hold, CDC, FSMs, pipelining), your own projects in forensic detail, and scripting or DSA rounds for verification and EDA roles." },
  { step: "Answer the career-change question well", detail: "Expect 'why are you moving from software to hardware' in every loop. Have a sixty-second answer that is specific, positive about what transfers (debugging, automation, testing discipline) and backed by what you have actually built." },
  { step: "Track everything", detail: "A spreadsheet of company, role, date, source, contact, stage and outcome. After twenty applications the pattern tells you whether the problem is the resume, the targeting or the interviews." },
  { step: "For international roles, sequence it", detail: "Join a multinational in India, become genuinely strong for two to four years, then pursue an internal transfer or apply directly from a position of strength. Applying abroad as a fresher with no sponsorship is the lowest-probability route and the one most exploited by paid agents." },
  { step: "Negotiate on evidence", detail: "When an offer arrives, ask for the band, compare with at least three independent sources for that company and city, and be ready to say what you bring. Early offers are rarely the last word, and a polite conversation costs nothing." },
];
