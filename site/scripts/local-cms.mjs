import http from 'node:http';
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { build, root } from './build.mjs';
import { validateCatalog } from './catalog-validation.mjs';

const port=4184, origin=`http://127.0.0.1:${port}`, token=randomBytes(32).toString('hex');
const file=path.join(root,'content/catalog.json');
const revision=bytes=>createHash('sha256').update(bytes).digest('hex');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
let saving=false;
async function body(req,limit){let length=0,chunks=[];for await(const chunk of req){length+=chunk.length;if(length>limit)throw new Error('Datoteka je prevelika.');chunks.push(chunk);}return Buffer.concat(chunks);}
const send=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});res.end(JSON.stringify(data));};
await build();
http.createServer(async(req,res)=>{
  try {
    if(req.headers.host!==`127.0.0.1:${port}` && req.headers.host!==`localhost:${port}`){send(res,403,{error:'Dozvoljen je samo lokalni pristup.'});return;}
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
    const url=new URL(req.url,origin);
    if(url.pathname.startsWith('/api/')){
      if(req.method==='GET'&&url.pathname==='/api/catalog'){const bytes=await readFile(file);send(res,200,{data:JSON.parse(bytes),revision:revision(bytes),token});return;}
      if(req.headers['x-csrf-token']!==token || ![origin,`http://localhost:${port}`].includes(req.headers.origin)){send(res,403,{error:'Osvežite editor i pokušajte ponovo.'});return;}
      if(req.method==='PUT'&&url.pathname==='/api/catalog'){
        if(saving){send(res,409,{error:'Čuvanje je u toku. Pokušajte ponovo.'});return;}
        saving=true;
        try {
          const payload=JSON.parse((await body(req,2*1024*1024)).toString());const current=await readFile(file);
          if(payload.revision!==revision(current)){send(res,409,{error:'Sadržaj je promenjen u drugom prozoru. Sačuvajte lokalne izmene pre ponovnog učitavanja.'});return;}
          await validateCatalog(payload.data,root);
          await mkdir(path.join(root,'.backups'),{recursive:true});
          await writeFile(path.join(root,'.backups',`catalog-${Date.now()}.json`),current,{flag:'wx'});
          const next=JSON.stringify(payload.data,null,2)+'\n';
          await writeFile(file+'.tmp',next);await rename(file+'.tmp',file);await build();
          send(res,200,{revision:revision(next),message:'Sačuvano na ovom računaru. Pregled sajta je ažuriran.'});
        } finally {saving=false;}
        return;
      }
      if(req.method==='POST'&&url.pathname==='/api/upload'){
        const bytes=await body(req,20*1024*1024),name=decodeURIComponent(req.headers['x-file-name']||'');
        const ext=path.extname(name).toLowerCase();
        const valid=(ext==='.png'&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||(['.jpg','.jpeg'].includes(ext)&&bytes[0]===255&&bytes[1]===216&&bytes[2]===255)||(ext==='.webp'&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP')||(ext==='.pdf'&&bytes.toString('ascii',0,5)==='%PDF-');
        if(!valid){send(res,400,{error:'Koristite ispravnu PNG, JPG, WebP sliku ili PDF (do 20 MB).'});return;}
        const destination=`assets/uploads/${randomUUID()}${ext}`;await mkdir(path.join(root,'dist/assets/uploads'),{recursive:true});await writeFile(path.join(root,'dist',destination),bytes,{flag:'wx'});send(res,201,{path:destination});return;
      }
      send(res,404,{error:'Nepoznata operacija.'});return;
    }
    if(!['GET','HEAD'].includes(req.method)){send(res,405,{error:'Method not allowed'});return;}
    const relative=decodeURIComponent(url.pathname);const isAdmin=relative==='/admin'||relative.startsWith('/admin/');
    const base=path.join(root,isAdmin?'admin':'dist');let requested=path.resolve(base,'.'+(isAdmin?relative.replace(/^\/admin/,'')||'/':relative));
    if(requested!==base&&!requested.startsWith(base+path.sep)){send(res,403,{error:'Forbidden'});return;}
    if((await stat(requested)).isDirectory())requested=path.join(requested,'index.html');
    const data=await readFile(requested);res.writeHead(200,{'content-type':types[path.extname(requested)]||'application/octet-stream','cache-control':'no-store'});res.end(req.method==='HEAD'?undefined:data);
  }catch(error){send(res,error.code==='ENOENT'?404:400,{error:error.code==='ENOENT'?'Datoteka nije pronađena.':error.message});}
}).listen(port,'127.0.0.1',()=>{console.log(`Site: ${origin}/`);console.log(`Local CMS: ${origin}/admin/`);});
