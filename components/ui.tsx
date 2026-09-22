"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { Depth, Priority } from "@/content/schema";
import { actions, useStore } from "@/lib/store";

const PATHS: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  today: "M4 5h16v16H4zM4 9h16M8 3v4M16 3v4M8 13h3v3H8z",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  book: "M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-5a3 3 0 0 0-3 3",
  code: "M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  chat: "M4 5h16v11H9l-5 4z",
  build: "M14 4l6 6-9 9H5v-6zM12 6l6 6",
  flask: "M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4A1.5 1.5 0 0 0 20 19l-6-10V3",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z",
  award: "M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM8.5 14 7 21l5-3 5 3-1.5-7",
  path: "M5 19c0-6 14-4 14-10M5 19a2 2 0 1 0 0-.1M19 9a2 2 0 1 0 0-.1",
  layers: "M12 3 2 8l10 5 10-5zM2 13l10 5 10-5",
  folder: "M3 6h6l2 2h10v11H3z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  history: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 7v5l3 3",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 13l1.6 1-2 3.4-1.8-.7a7 7 0 0 1-2.2 1.3L14.6 21h-4l-.4-2a7 7 0 0 1-2.2-1.3l-1.8.7-2-3.4 1.6-1a7 7 0 0 1 0-2l-1.6-1 2-3.4 1.8.7A7 7 0 0 1 10.2 5l.4-2h4l.4 2a7 7 0 0 1 2.2 1.3l1.8-.7 2 3.4-1.6 1a7 7 0 0 1 0 2z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
  menu: "M4 7h16M4 12h16M4 17h16",
  x: "M6 6l12 12M18 6 6 18",
  copy: "M8 8h11v12H8zM5 16V4h11",
  ext: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  spark: "M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6",
  cpu: "M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  wave: "M3 16h4V8h4v8h4V8h4v8h2",
};

export function Icon({ name, size = 18, label }: { name: string; size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      <path d={PATHS[name] || PATHS.more} />
    </svg>
  );
}

export const PRIORITY_LABEL: Record<Priority, string> = { must: "Must know", should: "Should know", optional: "Optional", specialization: "Specialization", research: "Research / optional" };
export const DEPTH_LABEL: Record<Depth, string> = { awareness: "Awareness", basic: "Basic", working: "Working", advanced: "Advanced", research: "Research" };

export function PriorityBadge({ p }: { p: Priority }) {
  return <span className={`badge ${p}`}>{PRIORITY_LABEL[p]}</span>;
}

export function Bar({ value, label, thin }: { value: number; label: string; thin?: boolean }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={`bar${thin ? " thin" : ""}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageHead({ title, children, crumbs }: { title: string; children?: ReactNode; crumbs?: ReactNode }) {
  return (
    <header className="page-head">
      {crumbs && <div className="crumbs">{crumbs}</div>}
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </header>
  );
}

export function Tabs({ tabs, active, onChange, label }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void; label: string }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (n === null) return;
    const j = (n + tabs.length) % tabs.length;
    refs.current[j]?.focus();
    onChange(tabs[j].id);
  };
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((t, i) => (
        <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`tab-${t.id}`} aria-selected={active === t.id} aria-controls={`panel-${t.id}`} tabIndex={active === t.id ? 0 : -1} onClick={() => onChange(t.id)} onKeyDown={(e) => onKey(e, i)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  return <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} tabIndex={0}>{children}</div>;
}

export function Seg<T extends string>({ options, value, onChange, label }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>{o.label}</button>)}
    </div>
  );
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
    const ok = document.execCommand("copy"); t.remove(); return ok;
  }
}

export function CopyButton({ text, label = "Copy", className = "btn sm" }: { text: string; label?: string; className?: string }) {
  const [msg, setMsg] = useState("");
  return (
    <button type="button" className={className} onClick={async () => { setMsg((await copyText(text)) ? "Copied" : "Copy failed"); setTimeout(() => setMsg(""), 1800); }}>
      <Icon name="copy" size={15} /> {msg || label}
    </button>
  );
}

export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dlg" aria-labelledby={id} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="dlg-head">
        <h2 id={id}>{title}</h2>
        <button type="button" className="btn ghost sm" onClick={onClose} aria-label="Close dialog"><Icon name="x" /></button>
      </div>
      <div className="dlg-body">{open && children}</div>
    </dialog>
  );
}

const CHATS: [string, (q: string) => string][] = [
  ["Claude", (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}`],
  ["ChatGPT", (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`],
];

export function PromptButton({ prompt, label = "Ask AI", title = "Teaching prompt" }: { prompt: string; label?: string; title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn sm" onClick={() => setOpen(true)}><Icon name="spark" size={15} /> {label}</button>
      <Dialog open={open} onClose={() => setOpen(false)} title={title}>
        <p className="small muted">Copy this prompt into any AI assistant. It is built from this topic's data and your place in the roadmap. Check anything important against the resources.</p>
        <div className="row" style={{ marginBottom: 10 }}>
          <CopyButton text={prompt} label="Copy prompt" className="btn sm primary" />
          {CHATS.map(([name, url]) => (
            <a key={name} className="btn sm" href={prompt.length < 6000 ? url(prompt) : url("")} target="_blank" rel="noreferrer" onClick={() => copyText(prompt)}>Open in {name} <Icon name="ext" size={14} /></a>
          ))}
        </div>
        <pre style={{ whiteSpace: "pre-wrap", maxHeight: "50vh" }}>{prompt}</pre>
      </Dialog>
    </>
  );
}

export function NotesBox({ noteKey, label = "Notes", placeholder }: { noteKey: string; label?: string; placeholder?: string }) {
  const s = useStore();
  const [text, setText] = useState(s.notes[noteKey] || "");
  const [saved, setSaved] = useState(true);
  const first = useRef(true);
  useEffect(() => { setText(s.notes[noteKey] || ""); }, [noteKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSaved(false);
    const t = setTimeout(() => { actions.note(noteKey, text); setSaved(true); }, 500);
    return () => clearTimeout(t);
  }, [text, noteKey]);
  const id = useId();
  return (
    <div className="field">
      <div className="between"><label htmlFor={id}>{label}</label><span className="tiny muted" aria-live="polite">{saved ? "Saved on this device" : "Saving..."}</span></div>
      <textarea id={id} value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children} <Icon name="ext" size={13} /></a>;
}

export function Loading() {
  return <p className="muted" aria-live="polite">Loading your progress...</p>;
}
