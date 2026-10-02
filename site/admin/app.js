import '/catalog-core.js';
const { escapeHtml: e } = window.GreenlineUI;
let data, savedData, token, revision, selected, dirty=false;
const $=s=>document.querySelector(s), editor=$('#editor'), groupEditor=$('#groups-editor');
const lines=value=>value.split('\n').map(v=>v.trim()).filter(Boolean);
const field=name=>editor.elements.namedItem(name);
function notify(text,error=false){$('#status').textContent=text;$('#status').classList.toggle('error',error);}
function navigation(){
  $('#product-list').innerHTML=data.products.map(p=>`<button type="button" data-id="${e(p.id)}" aria-current="${selected===p.id}">${e(p.name)}${p.published===false?' (skriven)':''}<small>${e(data.groups.find(g=>g.id===p.category)?.name)}</small></button>`).join('');
  field('category').innerHTML=data.groups.map(g=>`<option value="${e(g.id)}">${e(g.name)}</option>`).join('');
}
function canSwitch(){if(!dirty)return true;if(!confirm('Imate nesačuvane izmene. Želite li da ih odbacite?'))return false;data=structuredClone(savedData);dirty=false;return true;}
function showProduct(id){
  selected=id;navigation();const p=data.products.find(p=>p.id===id);editor.hidden=false;groupEditor.hidden=true;$('#editor-title').textContent=p.name;
  for(const key of ['name','slug','category','order','manufacturer','badge','intro','description','image','seoTitle','seoDescription'])field(key).value=p[key]??'';
  field('published').checked=p.published!==false;
  for(const key of ['applications','benefits','gallery'])field(key).value=p[key].join('\n');
  field('specs').value=p.specs.map(s=>`${s.label} | ${s.value}`).join('\n');
  field('documents').value=p.documents.map(d=>`${d.label} | ${d.path}`).join('\n');
  $('#image-preview').src='/'+p.image;$('#image-preview').hidden=!p.image;dirty=false;
}
function parsePairs(value,key){return lines(value).map(line=>{const separator=line.indexOf('|');if(separator<1)throw new Error('Koristite format naziv | vrednost za specifikacije i dokumente.');return{label:line.slice(0,separator).trim(),[key]:line.slice(separator+1).trim()};});}
async function persist(next){
  const response=await fetch('/api/catalog',{method:'PUT',headers:{'Content-Type':'application/json','X-CSRF-Token':token},body:JSON.stringify({data:next,revision})});
  const result=await response.json();if(!response.ok)throw new Error(result.error);
  data=next;savedData=structuredClone(next);revision=result.revision;dirty=false;notify(result.message);return result;
}
editor.addEventListener('input',()=>dirty=true);groupEditor.addEventListener('input',()=>dirty=true);
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
$('#product-list').addEventListener('click',event=>{const button=event.target.closest('[data-id]');if(button&&button.dataset.id!==selected&&canSwitch())showProduct(button.dataset.id);});
editor.addEventListener('submit',async event=>{
  event.preventDefault();const buttons=[...editor.querySelectorAll('[type=submit]')];buttons.forEach(b=>b.disabled=true);
  try{const next=structuredClone(data),p=next.products.find(p=>p.id===selected);for(const key of ['name','slug','category','manufacturer','badge','intro','description','image','seoTitle','seoDescription'])p[key]=field(key).value.trim();p.order=Number(field('order').value);p.published=field('published').checked;for(const key of ['applications','benefits','gallery'])p[key]=lines(field(key).value);p.specs=parsePairs(field('specs').value,'value');p.documents=parsePairs(field('documents').value,'path');await persist(next);showProduct(selected);}catch(error){notify(error.message,true);}finally{buttons.forEach(b=>b.disabled=false);}
});
$('#new-product').addEventListener('click',()=>{if(!canSwitch())return;const id='novi-proizvod-'+Date.now();data.products.push({id,slug:id,name:'Novi proizvod',category:data.groups[0]?.id||'',order:data.products.length,manufacturer:'',badge:'',intro:'',description:'',image:'',gallery:[],applications:[],benefits:[],specs:[],documents:[],published:false,seoTitle:'',seoDescription:''});showProduct(id);dirty=true;notify('Unesite podatke i fotografiju, pa sačuvajte proizvod.');});
function renderGroups(){groupEditor.hidden=false;editor.hidden=true;$('#groups-fields').innerHTML=data.groups.map((g,i)=>`<fieldset class="group-row" data-index="${i}"><legend>${e(g.name)}</legend><label>ID grupe<input name="id" value="${e(g.id)}" readonly></label><label>Naziv<input name="name" value="${e(g.name)}" required></label><label>Kratak naziv (filter)<input name="shortName" value="${e(g.shortName)}" required></label><label>Opis<textarea name="description">${e(g.description||'')}</textarea></label></fieldset>`).join('');}
$('#edit-groups').addEventListener('click',()=>{if(canSwitch()){renderGroups();dirty=false;}});
$('#new-group').addEventListener('click',()=>{if(!canSwitch())return;data.groups.push({id:'grupa-'+Date.now(),name:'Nova grupa',shortName:'Nova grupa',description:''});renderGroups();dirty=true;});
groupEditor.addEventListener('submit',async event=>{event.preventDefault();const b=groupEditor.querySelector('[type=submit]');b.disabled=true;try{const next=structuredClone(data);groupEditor.querySelectorAll('[data-index]').forEach(row=>{const g=next.groups[Number(row.dataset.index)];for(const key of ['name','shortName','description'])g[key]=row.querySelector(`[name=${key}]`).value.trim();});await persist(next);navigation();}catch(error){notify(error.message,true);}finally{b.disabled=false;}});
async function upload(input,target){const file=input.files[0];if(!file)return;input.disabled=true;notify('Dodavanje datoteke…');try{const response=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-CSRF-Token':token,'X-File-Name':encodeURIComponent(file.name)},body:file});const result=await response.json();if(!response.ok)throw new Error(result.error);if(target==='image'){field('image').value=result.path;$('#image-preview').src='/'+result.path;$('#image-preview').hidden=false;}else if(target==='gallery'){field(target).value+=(field(target).value?'\n':'')+result.path;}else{field('documents').value+=(field('documents').value?'\n':'')+file.name.replace(/[|\r\n]/g,' ')+' | '+result.path;}dirty=true;notify('Datoteka je dodata. Sačuvajte proizvod da biste primenili izmenu.');}catch(error){notify(error.message,true);}finally{input.disabled=false;input.value='';}}
$('#image-upload').addEventListener('change',event=>upload(event.target,'image'));
$('#gallery-upload').addEventListener('change',event=>upload(event.target,'gallery'));
$('#document-upload').addEventListener('change',event=>upload(event.target,'documents'));
try{const response=await fetch('/api/catalog');if(!response.ok)throw new Error('Lokalni server nije dostupan.');const result=await response.json();({data,token,revision}=result);savedData=structuredClone(data);if(data.products.length)showProduct(data.products[0].id);else navigation();notify('Spremno. Izaberite proizvod ili grupu koju želite da izmenite.');}catch(error){notify(error.message,true);}
