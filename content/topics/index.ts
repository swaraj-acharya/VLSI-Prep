import type { Topic } from "../schema.ts";
import { P0_P1 } from "./p0-p1.ts";
import { P1_BASICS } from "./p1-basics.ts";
import { P2 } from "./p2.ts";
import { P3 } from "./p3.ts";
import { P4 } from "./p4.ts";
import { P5 } from "./p5.ts";
import { P6 } from "./p6.ts";
import { P7_P8 } from "./p7-p8.ts";
import { P9 } from "./p9.ts";
import { P10_P12 } from "./p10-p12.ts";
import { EMB_A } from "./embedded-a.ts";
import { EMB_B } from "./embedded-b.ts";
import { EMB_C } from "./embedded-c.ts";

export const TOPICS: Topic[] = [...P0_P1, ...P1_BASICS, ...P2, ...P3, ...P4, ...P5, ...P6, ...P7_P8, ...P9, ...P10_P12, ...EMB_A, ...EMB_B, ...EMB_C];
export const TOPIC_MAP: Record<string, Topic> = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/** Topics that list `id` as a prerequisite ("what this unlocks"). */
export const UNLOCKS: Record<string, string[]> = (() => {
  const out: Record<string, string[]> = {};
  for (const t of TOPICS) for (const p of t.prereqs) (out[p] ||= []).push(t.id);
  return out;
})();
