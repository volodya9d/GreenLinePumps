import { mkdir,writeFile } from 'node:fs/promises';
const url='https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;500;600;650;700;750;800&display=swap';
const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'}});
if(!response.ok)throw new Error('Fonts unavailable');
let css=await response.text();const urls=[...new Set([...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map(m=>m[1]))];
await mkdir('dist/assets/fonts',{recursive:true});
await Promise.all(urls.map(async(url,i)=>{const r=await fetch(url);if(!r.ok)throw new Error(url);const extension=url.split('.').pop().split('?')[0];const file=`font-${i}.${extension}`;await writeFile(`dist/assets/fonts/${file}`,Buffer.from(await r.arrayBuffer()));css=css.replaceAll(url,`/assets/fonts/${file}`);}));
await writeFile('dist/assets/fonts/fonts.css',css);console.log(`Stored ${urls.length} font files locally.`);
