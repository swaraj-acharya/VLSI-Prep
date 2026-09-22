import { addDays } from "./dates.ts";

/**
 * Spaced revision ladder (days after the previous review).
 * Expanding intervals follow the spacing-effect literature; the adaptive factor
 * is deliberately simple so the learner can predict it.
 */
export const LADDER = [1, 3, 7, 21, 45, 90];

export interface Rev {
  stage: number;
  due: string;
  lapses: number;
  streak: number;
  hist: { d: string; ok: boolean }[];
}

/** Topics you forget repeatedly come back sooner; topics you keep remembering come back later. */
export function factor(r: Pick<Rev, "lapses" | "streak">): number {
  let f = 1;
  if (r.lapses >= 2) f = Math.max(0.5, 1 - 0.15 * (r.lapses - 1));
  if (r.streak >= 3) f = Math.min(1.5, f * (1 + 0.1 * (r.streak - 2)));
  return f;
}

export function firstReview(on: string): Rev {
  return { stage: 0, due: addDays(on, LADDER[0]), lapses: 0, streak: 0, hist: [] };
}

export function review(r: Rev, ok: boolean, on: string): Rev {
  const hist = [...r.hist, { d: on, ok }].slice(-20);
  if (!ok) return { stage: 0, due: addDays(on, 1), lapses: r.lapses + 1, streak: 0, hist };
  const stage = Math.min(r.stage + 1, LADDER.length - 1);
  const streak = r.streak + 1;
  const next = { ...r, stage, streak, hist };
  return { ...next, due: addDays(on, Math.max(1, Math.round(LADDER[stage] * factor(next)))) };
}

export const RULES = [
  `After you complete a topic it returns after ${LADDER[0]} day, then ${LADDER.slice(1).join(", ")} days as long as you remember it.`,
  "Forgot: the topic comes back tomorrow, restarts the ladder, and its prerequisites are shown so you can review them.",
  "Forgot it twice or more: every interval shrinks (down to half) until you remember it reliably.",
  "Remembered three times in a row: intervals stretch (up to 1.5x).",
  "Your intensity setting caps how many revisions appear per day; the rest wait in order of due date.",
];
