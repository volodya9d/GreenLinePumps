// Mechanical migration to relative URLs: the presentation also works as a local HTML file.
import { readFile, writeFile } from 'node:fs/promises';
let html=await readFile('dist/index.html','utf8');
html=html.replaceAll('src="/assets/','src="assets/').replaceAll('href="/assets/','href="assets/').replace('href="/styles.css"','href="styles.css"').replace('<script src="/catalog.js" defer></script><script src="/app.js" type="module"></script>','<script src="catalog-core.js" defer></script><script src="catalog.js" defer></script><script src="app.js" defer></script>');
await writeFile('dist/index.html',html);
let css=await readFile('dist/styles.css','utf8');css=css.replaceAll("'/assets/","'assets/");await writeFile('dist/styles.css',css);
let fonts=await readFile('dist/assets/fonts/fonts.css','utf8');fonts=fonts.replaceAll('/assets/fonts/','./');await writeFile('dist/assets/fonts/fonts.css',fonts);
let app=await readFile('dist/app.js','utf8');app=app.replaceAll('href="/assets/','href="assets/').replace('aria-label="Nuotrauke proizvoda"','aria-label="Fotografije proizvoda"');await writeFile('dist/app.js',app);
