import { BANK } from "@/content/interview";
import { TOPICS } from "@/content/topics";
import type { InterviewCat, SkillId } from "@/content/schema";

export interface PoolQ { id: string; cat: InterviewCat; q: string; a: string; level: number; concept: string; reasoning?: string; trap?: string; topics: string[] }

const SKILL_CAT: Record<SkillId, InterviewCat> = {
  digital: "digital", hdl: "hdl", rtl: "rtl", verification: "verification", timing: "timing", asic: "asic", pd: "pd", dft: "dft",
  arch: "arch", linux: "linux", python: "programming", tcl: "programming", cpp: "programming", protocols: "protocols", riscv: "riscv",
  aihw: "aihw", eda: "asic", interview: "career", firmware: "firmware", rtos: "rtos", emblinux: "emblinux",
};

export const POOL: PoolQ[] = [
  ...BANK.map((b) => ({ id: b.id, cat: b.cat, q: b.q, a: b.a, level: b.level, concept: b.concept, reasoning: b.reasoning, trap: b.trap, topics: b.topics })),
  ...TOPICS.flatMap((t) => t.interview.map((iq, i) => ({
    id: `t:${SKILL_CAT[t.skills[0]]}:${t.id}:${i}`,
    cat: t.kind === "career" ? ("career" as InterviewCat) : SKILL_CAT[t.skills[0]],
    q: iq.q, a: iq.a, level: iq.level || 2, concept: t.title, trap: iq.trap, topics: [t.id],
  }))),
];

export const POOL_MAP: Record<string, PoolQ> = Object.fromEntries(POOL.map((q) => [q.id, q]));
