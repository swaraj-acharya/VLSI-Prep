import { TOPICS } from "@/content/topics";
import { PHASES } from "@/content/phases";
import { LEARNING_PROJECTS } from "@/content/projects";
import { FLAGSHIPS } from "@/content/flagship";
import { RESOURCES } from "@/content/resources";
import { PAPERS } from "@/content/papers";
import { CERTIFICATIONS } from "@/content/certifications";
import { CAREERS } from "@/content/careers";
import { GLOSSARY } from "@/content/glossary";
import { PRACTICE } from "@/content/practice";
import { OPEN_SOURCE } from "@/content/open-source";
import { POOL } from "./questions";

export interface Hit { type: string; title: string; sub: string; href: string; external?: boolean; text: string }

let INDEX: Hit[] | null = null;

function build(): Hit[] {
  return [
    ...PHASES.map((p) => ({ type: "Phase", title: `Phase ${p.num}: ${p.title}`, sub: p.stage, href: `/roadmap#${p.id}`, text: `${p.title} ${p.goal}` })),
    ...TOPICS.map((t) => ({ type: "Topic", title: t.title, sub: t.why, href: `/topics/${t.id}`, text: `${t.title} ${t.terms.map((x) => x.join(" ")).join(" ")} ${t.why} ${t.skills.join(" ")}` })),
    ...FLAGSHIPS.map((f) => ({ type: "Flagship", title: f.title, sub: f.exceptional, href: `/projects/${f.id}`, text: `${f.title} ${f.categories.join(" ")} ${f.tools.join(" ")}` })),
    ...LEARNING_PROJECTS.map((p) => ({ type: "Project", title: p.title, sub: p.summary, href: `/projects/${p.id}`, text: `${p.title} ${p.tools.join(" ")}` })),
    ...POOL.map((q) => ({ type: "Interview", title: q.q, sub: q.concept, href: `/interview?q=${encodeURIComponent(q.id)}`, text: `${q.q} ${q.concept} ${q.cat}` })),
    ...PRACTICE.map((p) => ({ type: "Practice", title: p.title, sub: `${p.level} ${p.type}`, href: `/practice#${p.id}`, text: `${p.title} ${p.prompt}` })),
    ...RESOURCES.map((r) => ({ type: "Resource", title: r.title, sub: r.source, href: r.url || "/resources", external: !!r.url, text: `${r.title} ${r.source} ${r.type}` })),
    ...PAPERS.map((p) => ({ type: "Paper", title: p.title, sub: `${p.authors}, ${p.venue} ${p.year}`, href: `/research#${p.id}`, text: `${p.title} ${p.authors} ${p.problem}` })),
    ...CERTIFICATIONS.map((c) => ({ type: "Certification", title: c.name, sub: c.issuer, href: `/certifications#${c.id}`, text: `${c.name} ${c.issuer}` })),
    ...CAREERS.map((c) => ({ type: "Career", title: c.title, sub: c.does, href: `/career-paths#${c.id}`, text: `${c.title} ${c.skills.join(" ")} ${c.tools.join(" ")} ${c.companies.join(" ")}` })),
    ...GLOSSARY.map((g) => ({ type: "Glossary", title: g.full ? `${g.term} (${g.full})` : g.term, sub: g.simple, href: `/glossary#${encodeURIComponent(g.term)}`, text: `${g.term} ${g.full || ""} ${g.simple}` })),
    ...OPEN_SOURCE.map((o) => ({ type: "Open source", title: o.name, sub: o.what, href: `/open-source#${o.id}`, text: `${o.name} ${o.what}` })),
  ];
}

export function search(query: string, limit = 30): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  INDEX ||= build();
  const words = q.split(/\s+/).filter(Boolean);
  const scored: { h: Hit; s: number }[] = [];
  for (const h of INDEX) {
    const title = h.title.toLowerCase();
    const text = h.text.toLowerCase();
    let s = 0;
    for (const w of words) {
      if (title.includes(w)) s += title.startsWith(w) ? 6 : 4;
      else if (text.includes(w)) s += 1;
      else { s = 0; break; }
    }
    if (s > 0) scored.push({ h, s: s + (h.type === "Topic" ? 1 : 0) });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.h);
}
