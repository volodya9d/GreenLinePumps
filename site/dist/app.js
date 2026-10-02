(() => {
const { escapeHtml: e, normalize, assetUrl, card } = window.GreenlineUI;
const { products, groups } = window.GreenlineCatalog;
const $ = selector => document.querySelector(selector);
const dialog = $('#product-dialog');
const initialTitle = document.title;
const initialDescription = $('meta[name="description"]')?.content || '';
let returnHash = '';
if($('#groups-count'))$('#groups-count').textContent=groups.length;
if($('#products-count'))$('#products-count').textContent=products.length;

const header = $('.header');
if (document.body.classList.contains('home-page')) {
  const setHeaderState = () => header.classList.toggle('is-scrolled', scrollY > 34);
  setHeaderState(); addEventListener('scroll', setHeaderState, {passive:true});
}

const menu=$('.menu-toggle'), nav=$('#navigation');
function closeMenu(){if(!menu||!nav)return;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Otvori meni');nav.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Zatvori meni':'Otvori meni');nav.classList.toggle('open',open);});
nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});

if(document.body.classList.contains('home-page')&&nav){const sectionLinks=[...nav.querySelectorAll('a[href^="#"]')];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)sectionLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));}),{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id]').forEach(section=>observer.observe(section));}

const productSelect=$('#inquiry-product');
if(productSelect)productSelect.insertAdjacentHTML('beforeend',products.map(product=>`<option value="${e(product.id)}">${e(product.name)}</option>`).join(''));

const catalog=$('#product-grid'),filters=$('#filters'),search=$('#search');
if(catalog&&filters&&search){
  const requestedCategory=new URLSearchParams(location.search).get('kategorija');
  let selectedCategory=groups.some(group=>group.id===requestedCategory)?requestedCategory:'all',page=1;
  const pageSize=6;
  filters.innerHTML=[{id:'all',shortName:'Sve pumpe'},...groups].map(group=>`<button class="filter" type="button" data-filter="${e(group.id)}" aria-pressed="${group.id===selectedCategory}">${e(group.shortName)}${group.id==='all'?` <span>${products.length}</span>`:''}</button>`).join('');
  const matches=()=>{const query=normalize(search.value);return products.filter(product=>(selectedCategory==='all'||product.category===selectedCategory)&&(!query||normalize([product.name,groups.find(group=>group.id===product.category)?.name,product.intro,product.description,...product.applications].join(' ')).includes(query)));};
  function updateUrl(){const url=new URL(location.href);if(selectedCategory==='all')url.searchParams.delete('kategorija');else url.searchParams.set('kategorija',selectedCategory);history.replaceState(history.state,'',`${url.pathname}${url.search}${url.hash}`);}
  function renderPagination(total){const pagination=$('#pagination');if(!pagination)return;if(total<=1){pagination.innerHTML='';return;}pagination.innerHTML=`<button type="button" data-page="${page-1}" ${page===1?'disabled':''}>Prethodna</button>${Array.from({length:total},(_,i)=>`<button type="button" data-page="${i+1}" ${page===i+1?'class="current" aria-current="page"':''}>${i+1}</button>`).join('')}<button type="button" data-page="${page+1}" ${page===total?'disabled':''}>Sledeća</button>`;}
  function render(){const results=matches(),totalPages=Math.max(1,Math.ceil(results.length/pageSize));page=Math.min(page,totalPages);const start=(page-1)*pageSize,shown=results.slice(start,start+pageSize);catalog.innerHTML=shown.map(product=>card(product,groups,products.indexOf(product))).join('');$('#result-count').textContent=results.length?`${start+1}–${start+shown.length} od ${results.length} modela`:'0 modela';$('#empty-state').hidden=results.length>0;$('#clear-filters').hidden=!search.value&&selectedCategory==='all';filters.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===selectedCategory)));renderPagination(results.length?totalPages:0);}
  function resetCatalog(){selectedCategory='all';page=1;search.value='';updateUrl();render();search.focus({preventScroll:true});}
  filters.addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(!button)return;selectedCategory=button.dataset.filter;page=1;updateUrl();render();});
  search.addEventListener('input',()=>{page=1;render();});
  $('#clear-filters')?.addEventListener('click',resetCatalog);$('#reset-search')?.addEventListener('click',resetCatalog);
  $('#pagination')?.addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(!button||button.disabled)return;page=Number(button.dataset.page);render();$('#catalog-page-title')?.scrollIntoView({behavior:'smooth',block:'start'});catalog.querySelector('button')?.focus({preventScroll:true});});
  render();
}

function openProduct(id,writeHistory=true){
  const product=products.find(item=>item.id===id||item.slug===id);if(!product||!dialog)return;
  const group=groups.find(item=>item.id===product.category),gallery=[product.image,...product.gallery];
  $('#product-detail').innerHTML=`<div class="detail-layout"><div class="detail-media"><img class="detail-image" id="detail-image" src="${e(assetUrl(product.image))}" alt="${e(product.name)}">${gallery.length>1?`<div class="detail-gallery" role="group" aria-label="Fotografije proizvoda">${gallery.map((src,i)=>`<button type="button" data-gallery="${e(src)}" aria-label="Fotografija ${i+1}" aria-pressed="${i===0}"><img src="${e(assetUrl(src))}" alt=""></button>`).join('')}</div>`:''}</div><div class="detail-content"><div class="eyebrow">${e(group.name)}</div><h2 id="detail-title">${e(product.name)}</h2>${product.manufacturer?`<p>${e(product.manufacturer)}</p>`:''}<p>${e(product.description)}</p><h3>Tehničke karakteristike</h3><table class="spec-table"><caption class="sr-only">Specifikacije modela ${e(product.name)}</caption><tbody>${product.specs.map(spec=>`<tr><th scope="row">${e(spec.label)}</th><td>${e(spec.value)}</td></tr>`).join('')}</tbody></table><h3>Primene</h3><p class="detail-applications">${product.applications.map(e).join(' · ')}</p><ul class="detail-benefits">${product.benefits.map(benefit=>`<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>${e(benefit)}</li>`).join('')}</ul><div class="detail-documents"><a href="assets/documents/greenlinepumps-katalog.pdf" target="_blank" rel="noopener">Otvori katalog (PDF)</a>${product.documents.map(document=>`<a href="${e(assetUrl(document.path))}" target="_blank" rel="noopener">${e(document.label)}</a>`).join('')}</div><p class="detail-note">Prikazane su granične vrednosti serije iz kataloga. Radnu tačku i podobnost za konkretan medij potvrdite sa našom tehničkom službom.</p><button class="button button-green" data-inquire="${e(product.id)}">Zatraži ponudu za ${e(product.name)}</button></div></div>`;
  if(writeHistory){returnHash=location.hash.startsWith('#proizvod=')?'':location.hash;history.pushState({product:product.id},'',`#proizvod=${product.slug}`);}
  document.title=product.seoTitle||`${product.name} | GreenLine Pumps`;const meta=$('meta[name="description"]');if(meta)meta.content=product.seoDescription||product.intro;if(!dialog.open)dialog.showModal();
}
function restoreMetadata(){document.title=initialTitle;const meta=$('meta[name="description"]');if(meta)meta.content=initialDescription;}
dialog?.addEventListener('close',()=>{restoreMetadata();if(location.hash.startsWith('#proizvod='))history.replaceState(null,'',location.pathname+location.search+(returnHash||''));});
addEventListener('hashchange',()=>{if(location.hash.startsWith('#proizvod='))openProduct(decodeURIComponent(location.hash.slice(10)),false);else if(dialog?.open)dialog.close();});
document.querySelectorAll('dialog').forEach(item=>{item.querySelector('.dialog-close')?.addEventListener('click',()=>item.close());item.addEventListener('click',event=>{if(event.target!==item)return;const rect=item.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)item.close();});});

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-product],[data-inquire],[data-gallery],[data-hero]');if(!button)return;
  if(button.dataset.product)openProduct(button.dataset.product);
  if(button.dataset.inquire){const product=products.find(item=>item.id===button.dataset.inquire);if(!product)return;if(dialog?.open)dialog.close();if(productSelect){productSelect.value=product.id;location.hash='kontakt';$('#inquiry-message')?.focus({preventScroll:true});}else location.href=`./?upit=${encodeURIComponent(product.id)}#kontakt`;}
  if(button.dataset.gallery){$('#detail-image').src=assetUrl(button.dataset.gallery);dialog.querySelectorAll('[data-gallery]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));}
  if(button.dataset.hero){const product=products.find(item=>item.id===button.dataset.hero);if(!product)return;$('#hero-product-image').src=assetUrl(product.image);$('#hero-product-image').alt=product.name;$('#hero-product-name').textContent=product.name;$('#hero-product-category').textContent=groups.find(group=>group.id===product.category).name;$('#hero-product-detail').dataset.product=product.id;$('#hero-product-detail').setAttribute('aria-label',`Detalji: ${product.name}`);$('#hero-counter').textContent=product.id==='zpa-tip'?'01 / 02':'02 / 02';document.querySelectorAll('[data-hero]').forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-pressed',String(item===button));});}
});

$('#privacy-open')?.addEventListener('click',()=>$('#privacy-dialog')?.showModal());
const form=$('#inquiry-form'),feedback=$('#form-feedback');
if(form){
  const requestedProduct=new URLSearchParams(location.search).get('upit');if(products.some(product=>product.id===requestedProduct))productSelect.value=requestedProduct;
  const inquiryText=()=>{const data=new FormData(form),product=products.find(item=>item.id===data.get('product'));return `Upit za: ${product?.name||'preporuku pumpe'}\n\nIme: ${data.get('name')}\nKompanija: ${data.get('company')||'-'}\nE-mail: ${data.get('email')}\nTelefon: ${data.get('phone')||'-'}\n\n${data.get('message')}`;};
  form.addEventListener('submit',event=>{event.preventDefault();if(new FormData(form).get('website')||!form.reportValidity())return;const text=inquiryText(),product=products.find(item=>item.id===productSelect.value);feedback.hidden=false;feedback.textContent='Upit je pripremljen. Ako se e-mail program ne otvori, kopirajte tekst i pošaljite ga na greenlinepumps@gmail.com.';$('#copy-inquiry').hidden=false;location.href=`mailto:greenlinepumps@gmail.com?subject=${encodeURIComponent(`Upit — ${product?.name||'izbor pumpe'}`)}&body=${encodeURIComponent(text)}`;});
  $('#copy-inquiry')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(inquiryText());feedback.textContent='Tekst upita je kopiran. Nalepite ga u e-mail za greenlinepumps@gmail.com.';}catch{feedback.textContent='Kopiranje nije dostupno. Označite i kopirajte sledeći tekst: '+inquiryText();}});
}
$('#year').textContent=new Date().getFullYear();if(location.hash.startsWith('#proizvod='))openProduct(decodeURIComponent(location.hash.slice(10)),false);
})();
