// Re-check every stored URL: node --experimental-strip-types scripts/check-links.ts
import { RESOURCES } from "../content/resources.ts";
import { PAPERS } from "../content/papers.ts";
import { CERTIFICATIONS } from "../content/certifications.ts";
import { OPEN_SOURCE } from "../content/open-source.ts";
import { MARKET_POSTINGS } from "../content/jobs.ts";

const urls = new Map<string, string>();
RESOURCES.forEach((r) => r.url && urls.set(r.url, `resource ${r.id}`));
PAPERS.forEach((p) => p.url && urls.set(p.url, `paper ${p.id}`));
CERTIFICATIONS.forEach((c) => c.url && urls.set(c.url, `cert ${c.id}`));
OPEN_SOURCE.forEach((o) => urls.set(o.url, `open-source ${o.id}`));
MARKET_POSTINGS.forEach((m) => urls.set(m.link, `posting ${m.company}`));

async function check(url: string): Promise<string> {
  try {
    const ctrl = AbortSignal.timeout(15000);
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: ctrl });
    if (res.status === 405 || res.status === 403) res = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000) });
    return String(res.status);
  } catch (e) {
    return `ERROR ${(e as Error).name}`;
  }
}

const entries = [...urls.entries()];
let bad = 0;
for (let i = 0; i < entries.length; i += 8) {
  const batch = entries.slice(i, i + 8);
  const results = await Promise.all(batch.map(async ([u, who]) => [u, who, await check(u)] as const));
  for (const [u, who, st] of results) {
    const ok = st.startsWith("2") || st.startsWith("3");
    if (!ok) bad++;
    console.log(`${ok ? "OK  " : "FAIL"} ${st.padEnd(14)} ${who.padEnd(28)} ${u}`);
  }
}
console.log(`\n${entries.length} URLs checked, ${bad} need attention. Some sites block automated requests; open failures in a browser before removing them.`);
console.log("After checking, update `verified` and `lastChecked` in the content files.");
