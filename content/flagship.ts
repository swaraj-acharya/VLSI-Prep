import type { Flagship } from "./schema.ts";
import { FLAGSHIP_A } from "./flagship-a.ts";
import { FLAGSHIP_B } from "./flagship-b.ts";

export const FLAGSHIPS: Flagship[] = [...FLAGSHIP_A, ...FLAGSHIP_B];
export const FLAGSHIP_MAP: Record<string, Flagship> = Object.fromEntries(FLAGSHIPS.map((f) => [f.id, f]));
