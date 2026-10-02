import { readFile, writeFile, mkdir } from 'node:fs/promises';
import vm from 'node:vm';

const old = await readFile('../data/products.js', 'utf8');
const context = { window: {} }; vm.runInNewContext(old, context);
const records = context.window.GreenlineProducts;
const clean = text => text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
await mkdir('content', { recursive: true });
const audit = await Promise.all(records.map(async p => {
  const url = `https://greenlinepumps.webflow.io/products/${p.id}`;
  const html = await (await fetch(url)).text();
  const section = html.split('class="main-image-wrapper')[1]?.split('</section>')[0] || '';
  const src = section.match(/<img src="([^"]+)"/)?.[1];
  if (!src) throw new Error(`No main image: ${p.id}`);
  const file = `assets/images/${p.id}.png`;
  const image = await fetch(src);
  if (!image.ok) throw new Error(`${src}: ${image.status}`);
  await writeFile(`dist/${file}`, Buffer.from(await image.arrayBuffer()));
  p.image = file;
  return { id: p.id, url, image: src, text: clean(section) };
}));
const groups = [
  { id: 'zupcaste', name: 'Zupčaste pumpe', shortName: 'Zupčaste', description: 'Za ulja, maziva, asfalt i viskozne medije.' },
  { id: 'centrifugalne', name: 'Centrifugalne pumpe', shortName: 'Centrifugalne', description: 'Za vodu, termalna ulja i sisteme sa višim potiskom.' },
  { id: 'zavojne', name: 'Zavojne pumpe', shortName: 'Zavojne', description: 'Ravnomeran transport medija sa česticama i vlaknima.' },
  { id: 'vakuum', name: 'Vakuum pumpe', shortName: 'Vakuum', description: 'Za stvaranje i održavanje vakuuma u procesu.' },
  { id: 'membranske', name: 'Membranske pumpe', shortName: 'Membranske', description: 'Plastična i metalna rešenja za hemijske medije.' }
];
const products = records.map((p, i) => ({ ...p, category: groups.find(g => g.name === p.category).id, slug: p.id, order: i, manufacturer: '', gallery: [], documents: [], seoTitle: `${p.name} | GreenLine Pumps`, seoDescription: p.intro, specs: p.specs.map(([label, value]) => ({label, value})), source: audit[i].url }));
await writeFile('content/source-audit.json', JSON.stringify(audit, null, 2));
await writeFile('content/catalog.json', JSON.stringify({locale:'sr-Latn-RS', groups, products},null,2));
for (const a of audit) console.log(JSON.stringify(a));
