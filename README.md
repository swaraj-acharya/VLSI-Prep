# Signoff: a personal VLSI training system

Signoff turns a year of VLSI learning into one clear mission per day, with spaced revision, confidence and evidence tracking, flagship projects, proof of work and an honest view of job readiness. It is built for an Electrical Engineering graduate with a software background and no formal VLSI specialization, aiming for an entry-level chip-design role with unusually deep understanding.

In chip design, *signoff* is the final set of checks that proves a design is ready for tapeout. The app is organised around the same idea: progress means evidence, not days completed.

## Quick start

Requirements: Node.js 22.6 or newer (the content scripts use Node's built-in TypeScript stripping).

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run validate` | Checks every cross-reference in the curriculum (prerequisites, resources, projects, papers, certifications, careers, readiness checks) and that prerequisites come before the topics that need them. Runs automatically before `build`. |
| `npm run build` | Production build. All 220 pages are pre-rendered as static HTML. |
| `npm start` | Serve the production build locally. |
| `npm run check-links` | Requests every stored URL and reports failures (needs internet). |
| `npm run typecheck` | TypeScript check without building. |

## Deploy (GitHub to Vercel)

1. Create a GitHub repository and push this folder (`git init`, `git add .`, `git commit -m "Signoff"`, `git remote add origin <your repo>`, `git push -u origin main`).
2. In Vercel, choose **Add New → Project**, import the repository and accept the detected Next.js settings. No environment variables are needed.
3. Every push to `main` redeploys. If a content edit breaks a reference, the `prebuild` validation fails the deploy instead of shipping a broken link, and the Vercel build log names the problem.

There is no database, authentication or server state. Everything is stored in the visitor's browser, so the deployed site can be shared safely: each person gets their own local progress.

## How the app is organised

```
app/                 Pages (App Router). Topic and project pages are generated from content.
components/          AppShell (navigation, search, theme), ui.tsx (primitives), learning.tsx
                     (waveform week, heatmap, revision card, mastery test runner)
content/             The curriculum as typed data. Edit here; the UI follows.
  schema.ts          All content types
  phases.ts          13 phases, modules, 9 specialization tracks, the main road order
  topics/            175 topics split by phase; index.ts builds TOPIC_MAP and UNLOCKS
  roles-guide.ts     Plain-language role explainers, pay and demand reality with sources
  global.ts          Senior-compensation ladder, international hubs, visa notes, application playbook
  projects.ts        Micro and mini learning projects, suggested project per phase
  flagship-a/b.ts    15 flagship projects including the capstone
  resources.ts, papers.ts, certifications.ts, careers.ts, glossary.ts, interview.ts,
  practice.ts, jobs.ts, skills.ts, mastery.ts, careerkit.ts, open-source.ts
lib/
  store.ts           localStorage state, actions, activity log, export/import, migrations
  plan.ts            372-day plan generator and intensity-based task builder
  revision.ts        Spaced revision algorithm
  derive.ts          Streaks, progress, skill levels, readiness evaluation, gates
  prompts.ts         Topic-aware AI prompts and LinkedIn draft generator
  search.ts, questions.ts, dates.ts
  github.ts          Optional GitHub sync: writes progress/README.md and progress/progress.json
scripts/             validate.ts, check-links.ts
public/fonts/        IBM Plex Sans and Mono (SIL Open Font License, see LICENSE file there)
```

## How progress works

**The plan.** The main road (152 topics) is laid out as 53 weeks: five learning days, one consolidation day and one project day per week, with a milestone day every fourth week, plus a graduation day (372 days in total). Day numbers are units of study, not calendar dates: missing a day never shifts or deletes anything, and the app offers catch-up options instead of penalties. After the specialization gate, seven days follow your primary track and four a compressed secondary track.

**Intensity** (Light, Standard, Intensive) changes the number and depth of daily tasks and the daily revision cap. It never changes the curriculum order.

**Revision.** Completed topics return after 1, 3, 7, 21, 45 and 90 days. "Forgot" brings a topic back tomorrow, restarts its ladder and shows its prerequisites. Forgetting twice shrinks future intervals (down to half); remembering three times in a row stretches them (up to 1.5x). The rules are shown in Settings.

**Streaks** count days with real work: a completed topic, a revision, a project milestone or evidence item, an interview answer, a practice attempt, a research status change, a reflection, or at least two plan tasks. Changing a confidence rating does not count.

**Skill levels** (Awareness, Basic, Working, Advanced, Research) are computed from evidence: completed topics, confidence, hands-on evidence ticks, completed projects, interview accuracy and reproduced papers. Every level shows the reasons behind it. The exact rules are on the My Skills page.

**Gates** between phases are soft: the previous phase's mastery test at 80%, or an explicit "continue anyway".

**Job readiness** evaluates each entry-level role's checks automatically from your data; items only you can confirm (for example "resume ready") are manual ticks.

**Flagship completion** is locked until the Documentation stage and most showcase items are done, because an undocumented project is not yet evidence.

## Choosing a target role, pay and going abroad

The **Roles and pay** page answers the questions the target picker used to assume you already knew:

- **What each role is** - plain-language explanations of RTL design, verification, physical design, DFT, FPGA, AI hardware and EDA: what the work actually involves, a typical day, who hires for it, how realistic it is for an EE graduate without an M.Tech, and the exact terms to search on job sites. You can set your target directly from there, and the picker on the Home and Settings pages now shows a summary of the selected role.
- **Pay and demand** - published Indian salary figures for the same year, quoted side by side with their sources, because they disagree by a factor of five and most come from companies selling training. Includes what actually moves the number, and how to check it yourself instead of trusting an average.
- **The crore question** - an honest account of what a one-crore package is (mostly equity, senior level, usually ten or more years), the six levers that decide it, a stage-by-stage ladder, and the traps that cost people years.
- **Working abroad** - the main hubs, the usual route into each, and the permits that matter, with the thresholds and legal status recorded as checked on 2026-09-23. Immigration rules change constantly, so every entry links the official source and says to confirm with a licensed lawyer.
- **How to apply** - a target list, evidence, referrals, interview layers, tracking, and the sequencing that actually works for international roles.

Nothing on that page promises an outcome, and the certification section says plainly that no certificate produces a high-paying or international role.

## GitHub sync (optional)

The **Day log** page lists every plan day and its status, and can push that record to a GitHub repository, in the same shape as a PrepBoard-style `progress/` folder:

- `progress/README.md` - a readable summary: current day, streak, per-phase progress, the last 14 days, the full day table, recently completed topics and finished flagships.
- `progress/progress.json` - the machine-readable state, so the repository is also a backup.

To set it up, open **Settings, GitHub sync**, enter the repository owner, name, branch and folder, and paste a token. Create a **fine-grained** personal access token at `github.com/settings/personal-access-tokens`, give it access to that one repository only, and set Repository permissions, Contents to **Read and write**. Nothing else is required.

With "Push automatically when I finish a day" enabled, pressing **Finish day** commits the updated files; you can also push manually from the Day log or Settings at any time. Files are updated in place using the GitHub contents API, so each push is one commit per file and existing files are updated with their current sha rather than overwritten blindly.

Security notes, worth reading once:

- The token is stored in this browser only, under its own key (`signoff-vlsi:gh-token`), and is deliberately excluded from progress exports.
- Any script running in the page, including browser extensions, can read browser storage. Use a fine-grained token limited to one repository, set an expiry, and revoke it on GitHub when you no longer need it.
- If the repository is public, everything pushed is public. Your private notes and daily reflections are excluded from `progress.json` unless you tick the box that includes them.
- This is a static site with no backend, so the request goes straight from your browser to GitHub; nothing passes through any server of mine.

## Data, backup and migration

- Storage key: `signoff-vlsi:v1`; schema version in `SCHEMA_VERSION` (lib/store.ts).
- Export and import are in **Settings**. Export regularly: clearing browser data deletes progress.
- Import validates the file and runs it through `migrate()`, so older exports keep working.
- To change the state shape: bump `SCHEMA_VERSION`, add a function to `MIGRATIONS` keyed by the old version, and keep `migrate()` filling defaults for missing fields.
- Topic, project and question IDs are stored in progress. Renaming an ID orphans that progress, so prefer adding new IDs over renaming.

## Editing the curriculum

1. Add or edit a topic in the right `content/topics/*.ts` file (the `Topic` type in `schema.ts` documents every field).
2. List the topic ID in its module's `topics` array in `content/phases.ts`, in teaching order.
3. Reference resources, projects, papers, certifications and careers by ID only.
4. Run `npm run validate`. It reports missing references and any topic that appears before one of its prerequisites.
5. Days per topic drive the plan; the validator prints the total so you can keep the year near 52 weeks (about 254 main-road topic days plus 11 specialization days).

Adding a flagship project, paper or certification works the same way: add the entry, reference it by ID, validate.

## Honesty conventions

- Every URL-bearing resource, paper and certification has `verified` and a check date. Items not confirmed in the last research pass show an **Unverified** badge. Books are listed without links by design.
- Certification details, job-market patterns and programme information were researched on 2026-09-22. Prices, programmes and job postings change: confirm on the official page before paying or applying. Several sampled job postings are expired and are kept as dated historical examples.
- No salary benchmarks are presented. One posting's listed range is shown as a single data point only.
- To re-verify: run `npm run check-links`, open any failures in a browser (some sites block automated requests), then update `verified` and `lastChecked`/`lastVerified` in the content files.

## Accessibility and design

Keyboard navigation throughout (arrow keys in tabs, Ctrl/Cmd+K or `/` for search, skip link), visible focus rings, labelled controls, native `<dialog>` for modals, reduced-motion support, light and dark themes with a pre-paint script to avoid a flash, and a mobile tab bar. The visual language borrows from waveform viewers: the current week is drawn as a clock lane and a DONE signal.
# VLSI-Prep
