"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { streaks } from "@/lib/derive";
import { search, type Hit } from "@/lib/search";
import { Dialog, Icon } from "./ui";

export const NAV: { group: string; links: [string, string, string][] }[] = [
  { group: "Learn", links: [["/", "Home", "home"], ["/today", "Today", "today"], ["/roadmap", "Roadmap", "map"], ["/topics", "Topics", "book"], ["/practice", "Practice", "code"], ["/interview", "Interview", "chat"]] },
  { group: "Build", links: [["/projects", "Projects", "build"], ["/research", "Research lab", "flask"], ["/open-source", "Open source", "layers"]] },
  { group: "Career", links: [["/roles", "Roles and pay", "target"], ["/skills", "My skills", "grid"], ["/job-readiness", "Job readiness", "target"], ["/portfolio", "Portfolio", "folder"], ["/build-in-public", "Build in public", "users"], ["/certifications", "Certifications", "award"], ["/career-paths", "Career paths", "path"]] },
  { group: "Library", links: [["/resources", "Resources", "book"], ["/glossary", "Glossary", "spark"], ["/toolkit", "Toolkit", "cpu"]] },
  { group: "You", links: [["/progress", "Day log", "layers"], ["/history", "History", "history"], ["/settings", "Settings", "gear"]] },
];

const TABS: [string, string, string][] = [["/", "Home", "home"], ["/today", "Today", "today"], ["/roadmap", "Roadmap", "map"], ["/projects", "Build", "build"]];

function Logo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1" y="1" width="24" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 16h4V9h4v7h4V9h4" fill="none" stroke="var(--signal)" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function isOn(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const hits: Hit[] = search(q);
  return (
    <Dialog open={open} onClose={() => { setQ(""); onClose(); }} title="Search everything">
      <label htmlFor="global-search" className="sr-only">Search</label>
      <input id="global-search" className="search-input" type="search" autoFocus placeholder="Topics, projects, questions, papers, certifications, terms..." value={q} onChange={(e) => setQ(e.target.value)} />
      {q && hits.length === 0 && <p className="muted small" style={{ marginTop: 10 }}>No results. Try a shorter word, such as "fifo" or "setup".</p>}
      <ul className="hits">
        {hits.map((h, i) => (
          <li key={h.type + h.href + i}>
            {h.external
              ? <a href={h.href} target="_blank" rel="noreferrer"><span className="ty">{h.type}</span>{h.title} <span className="tiny muted">{h.sub}</span></a>
              : <Link href={h.href} onClick={onClose}><span className="ty">{h.type}</span>{h.title}<div className="tiny muted">{h.sub.slice(0, 120)}</div></Link>}
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const s = useStore();
  const st = streaks(s);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    if (s.settings.theme === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", s.settings.theme);
  }, [s.settings.theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { setMoreOpen(false); }, [path]);

  const navList = (
    <nav aria-label="Main">
      {NAV.map((g) => (
        <div className="navgroup" key={g.group}>
          <h2>{g.group}</h2>
          {g.links.map(([href, label, icon]) => (
            <Link key={href} href={href} className="navlink" aria-current={isOn(path, href) ? "page" : undefined}><Icon name={icon} size={17} />{label}</Link>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <a href="#content" className="skip">Skip to content</a>
      <div className="topbar">
        <Link href="/" className="brand"><Logo /> Signoff</Link>
        <div className="row">
          <span className="tiny muted" title="Current streak">{st.current}d streak</span>
          <button className="btn sm" onClick={() => setSearchOpen(true)} aria-label="Search"><Icon name="search" /></button>
        </div>
      </div>
      <div className="shell">
        <aside className="side">
          <Link href="/" className="brand"><Logo /><span>Signoff<small>VLSI training system</small></span></Link>
          <button className="searchbtn" onClick={() => setSearchOpen(true)}><span className="row" style={{ gap: 6 }}><Icon name="search" size={16} /> Search</span><kbd>Ctrl K</kbd></button>
          {navList}
          <p className="tiny muted" style={{ margin: "6px 6px 0" }}>{st.current} day streak, longest {st.longest}</p>
        </aside>
        <main id="content" className="main" tabIndex={-1}>{children}</main>
      </div>
      <nav className="tabbar" aria-label="Quick navigation">
        {TABS.map(([href, label, icon]) => (
          <Link key={href} href={href} aria-current={isOn(path, href) ? "page" : undefined}><Icon name={icon} />{label}</Link>
        ))}
        <button type="button" onClick={() => setMoreOpen(true)} aria-haspopup="dialog"><Icon name="menu" />More</button>
      </nav>
      <Dialog open={moreOpen} onClose={() => setMoreOpen(false)} title="All sections">{navList}</Dialog>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
