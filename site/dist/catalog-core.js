(() => {
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'dj').replace(/[^a-z0-9]+/g, ' ').trim();
const assetUrl = path => String(path).replace(/^\/+/, '');
function card(product, groups, index) {
  const e = escapeHtml;
  const group = groups.find(g => g.id === product.category);
  return `<article class="product-card" data-card="${e(product.id)}">
    <button class="product-image" type="button" data-product="${e(product.id)}" aria-label="Detalji: ${e(product.name)}"><span class="product-index">${String(index + 1).padStart(2, '0')}</span>${product.badge ? `<span class="product-tag">${e(product.badge)}</span>` : ''}<img src="${e(assetUrl(product.image))}" alt="${e(product.name)} — ${e(group?.name)}" width="420" height="260" loading="lazy"></button>
    <div class="product-info"><p class="product-category">${e(group?.name)}</p><h3>${e(product.name)}</h3><p>${e(product.intro)}</p>
    <div class="product-specs">${product.specs.slice(0, 2).map(s => `<div><strong>${e(s.value)}</strong><span>${e(s.label)}</span></div>`).join('')}</div>
    <div class="product-card-footer"><button type="button" data-product="${e(product.id)}" aria-label="Tehnički detalji: ${e(product.name)}">Tehnički detalji</button><button type="button" data-inquire="${e(product.id)}" aria-label="Upit za ${e(product.name)}">Pošalji upit</button></div></div>
  </article>`;
}
globalThis.GreenlineUI = { escapeHtml, normalize, assetUrl, card };
})();
