import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { validateCatalog } from './catalog-validation.mjs';
import '../dist/catalog-core.js';
const { card, escapeHtml: e } = globalThis.GreenlineUI;
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function build() {
  const data = await validateCatalog(JSON.parse(await readFile(path.join(root,'content/catalog.json'), 'utf8')), root);
  const published = {locale: data.locale, groups:data.groups, products:data.products.filter(p=>p.published !== false).sort((a,b)=>a.order-b.order)};
  await writeFile(path.join(root,'dist/catalog.js'), `window.GreenlineCatalog = ${JSON.stringify(published).replace(/</g,'\\u003c')};\n`);
  let productsHtml = await readFile(path.join(root,'dist/proizvodi/index.html'),'utf8');
  productsHtml = productsHtml.replace(/<!-- products-catalog:start -->[\s\S]*?<!-- products-catalog:end -->/, `<!-- products-catalog:start -->\n${published.products.map((p,i)=>card(p,published.groups,i)).join('\n')}\n<!-- products-catalog:end -->`);
  await writeFile(path.join(root,'dist/proizvodi/index.html'), productsHtml);
  const redirectPage = target => `<!doctype html><html lang="sr-Latn"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${e(target)}"><title>GreenLine Pumps</title><a href="${e(target)}">Otvori ponudu</a></html>`;
  await mkdir(path.join(root,'dist/products'),{recursive:true});
  await writeFile(path.join(root,'dist/products/index.html'), redirectPage('/proizvodi/'));
  for(const p of published.products) {
    const directory = path.join(root,'dist/products',p.slug); await mkdir(directory,{recursive:true});
    await writeFile(path.join(directory,'index.html'), redirectPage(`/proizvodi/#proizvod=${p.slug}`));
  }
  const origin = 'https://greenline-pumps.volodya-d90.chatgpt.site';
  await writeFile(path.join(root,'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url><url><loc>${origin}/proizvodi/</loc></url></urlset>`);
  await writeFile(path.join(root,'dist/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /products/\nSitemap: ${origin}/sitemap.xml\n`);
  console.log(`Generated catalog: ${published.products.length} products / ${published.groups.length} groups.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
