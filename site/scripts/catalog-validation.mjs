import { access } from 'node:fs/promises';
import path from 'node:path';
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text = (value, field, max = 4000) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`Neispravno polje: ${field}`);
};
export async function validateCatalog(data, root) {
  if (!data || !Array.isArray(data.products) || !Array.isArray(data.groups) || data.products.length > 500 || data.groups.length > 50) throw new Error('Katalog mora imati products i groups liste.');
  const groups = new Set(), ids = new Set(), slugs = new Set();
  for (const group of data.groups) {
    if (!slug.test(group.id) || groups.has(group.id)) throw new Error('ID grupe mora biti jedinstven.');
    groups.add(group.id); text(group.name, 'naziv grupe', 80); text(group.shortName, 'kratak naziv grupe', 40);
  }
  for (const p of data.products) {
    if (!slug.test(p.id) || !slug.test(p.slug) || ids.has(p.id) || slugs.has(p.slug)) throw new Error('ID i slug proizvoda moraju biti jedinstveni (mala slova, brojevi, crtice).');
    ids.add(p.id); slugs.add(p.slug);
    if (!groups.has(p.category)) throw new Error(`${p.name}: nepostojeća grupa.`);
    text(p.name, 'naziv proizvoda', 120); text(p.intro, 'kratak opis', 350); text(p.description, 'opis');
    if (!Number.isFinite(p.order) || p.order < 0) throw new Error('Redosled mora biti pozitivan broj ili nula.');
    if (!Array.isArray(p.specs) || !p.specs.length || p.specs.length > 30) throw new Error('Unesite 1–30 specifikacija.');
    p.specs.forEach(s => { text(s.label, 'naziv specifikacije', 100); text(s.value, 'vrednost specifikacije', 150); });
    for (const key of ['applications','benefits','gallery','documents']) if (!Array.isArray(p[key])) throw new Error(`${key}: očekuje se lista.`);
    for (const field of [...p.applications, ...p.benefits]) text(field, 'primene/prednosti', 250);
    const assets = [p.image, ...p.gallery, ...p.documents.map(d => { text(d.label, 'naziv dokumenta', 120); return d.path; })];
    for (const asset of assets) {
      if (typeof asset !== 'string' || !/^assets\/[a-zA-Z0-9_./-]+$/.test(asset) || asset.split('/').includes('..')) throw new Error('Datoteke moraju koristiti lokalnu assets/ putanju.');
      if (!/\.(png|jpe?g|webp|pdf)$/i.test(asset)) throw new Error('Dozvoljeni formati: PNG, JPG, WebP i PDF.');
      if (root) await access(path.join(root, 'dist', asset)).catch(() => { throw new Error(`Datoteka ne postoji: ${asset}`); });
    }
  }
  return data;
}
