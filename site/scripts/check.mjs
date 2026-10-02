import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { root } from './build.mjs';
import { validateCatalog } from './catalog-validation.mjs';
import '../dist/catalog-core.js';
const data=JSON.parse(await readFile(path.join(root,'content/catalog.json'),'utf8'));
await validateCatalog(data,root);
const duplicate=structuredClone(data);duplicate.products.push(duplicate.products[0]);
await assert.rejects(validateCatalog(duplicate,root),/jedinstveni/);
const traversal=structuredClone(data);traversal.products[0].image='assets/../secret.png';
await assert.rejects(validateCatalog(traversal,root),/lokalnu/);
assert.equal(globalThis.GreenlineUI.normalize('ZUPČASTE đ'), 'zupcaste dj');
assert.equal(globalThis.GreenlineUI.escapeHtml('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
const html=await readFile(path.join(root,'dist/index.html'),'utf8');
const productsHtml=await readFile(path.join(root,'dist/proizvodi/index.html'),'utf8');
for(const source of [html,productsHtml]){
  const paths=[...source.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"#]*)?(?:#[^"]*)?"/g)].map(m=>m[1]).filter(s=>!/^https?:|^tel:|^mailto:/.test(s));
  for(const asset of paths)await access(path.join(root,'dist',asset));
}
assert.ok(html.includes('assets/images/logo-white.png'));
assert.ok(html.includes('<template id="catalog-source">'));
assert.equal((productsHtml.match(/class="product-card"/g)||[]).length,data.products.filter(p=>p.published!==false).length);
assert.ok(productsHtml.includes('id="pagination"'));
for(const file of ['dist/app.js','dist/catalog.js','dist/catalog-core.js','admin/app.js','scripts/local-cms.mjs']){
  const result=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
}
console.log('PASS: catalog schema, unique IDs, asset paths, HTML escaping, Serbian search, static cards and JavaScript syntax.');
