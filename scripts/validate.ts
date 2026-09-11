// Cross-checks paths/modules against the store-website product data (when available locally).
// Usage: STORE=$WKS/store-website bun scripts/validate.ts
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const root = new URL('..', import.meta.url).pathname;
const modDir = join(root, 'src/content/modules');
const pathDir = join(root, 'src/content/paths');
const store = process.env.STORE ?? join(process.env.WKS ?? `${process.env.HOME}/wks`, 'store-website');
const prodDir = join(store, 'src/data/products');

const modules = new Set(readdirSync(modDir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')));
let errors = 0;
const err = (m: string) => { errors++; console.error('✗', m); };

for (const f of readdirSync(pathDir).filter((f) => f.endsWith('.yml'))) {
  const p = parse(readFileSync(join(pathDir, f), 'utf8'));
  const id = f.replace(/\.yml$/, '');
  const used = new Set<string>();
  for (const ph of p.phases) for (const s of ph.steps) { if (!modules.has(s.module)) err(`${id}: unknown module ${s.module}`); used.add(s.module); }
  for (const prod of p.products) if (modules.has(prod) && !used.has(prod)) err(`${id}: covers product ${prod} but never sequences its module`);
  if (existsSync(prodDir)) {
    for (const prod of p.products) {
      const pf = join(prodDir, `${prod}.json`);
      if (!existsSync(pf)) { if (!prod.startsWith('knowii-')) err(`${id}: product ${prod} not in store-website`); continue; }
      const d = JSON.parse(readFileSync(pf, 'utf8'));
      const included: string[] = [...(d.includedProducts ?? []), ...((d.variants ?? []).flatMap((v: any) => v.includedProducts ?? []))];
      for (const inc of included) if (modules.has(inc) && !used.has(inc) && p.products.includes(prod) && p.products.length === 1)
        console.warn('!', `${id}: ${prod} includes ${inc} (per store data) but the path does not sequence it`);
    }
  }
}
if (existsSync(prodDir)) {
  const skip = new Set(['dev-concepts-starter-bundle', 'everything-knowledge-bundle']);
  for (const f of readdirSync(prodDir)) {
    const m = f.match(/^([a-z0-9-]+)\.json$/);
    if (!m || /-(faq|media|stats|testimonials)$|sales-copy/.test(m[1])) continue;
    if (!skip.has(m[1]) && !modules.has(m[1])) err(`store product ${m[1]} has no module`);
  }
}
console.log(errors ? `${errors} error(s)` : '✓ paths and modules are consistent');
process.exit(errors ? 1 : 0);
