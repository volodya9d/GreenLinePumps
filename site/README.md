# GreenLine Pumps — nova verzija

Samostalan sajt na srpskom: HTML, CSS i JavaScript bez frontend biblioteka. Objavljuje se sadržaj direktorijuma `dist/`. Početna stranica predstavlja kategorije i proces izbora, dok `dist/proizvodi/index.html` sadrži kompletnu ponudu sa filterima, pretragom i paginacijom od šest proizvoda. Fotografije modela proverene su na pojedinačnim stranicama originalnog Webflow sajta. Originalni Montserrat i Lato fontovi nalaze se lokalno.

## Pregled i lokalni CMS

Potreban je Node.js 22 ili noviji. Nema dodatnih npm zavisnosti.

```powershell
npm run dev
```

- Sajt: `http://127.0.0.1:4184/`
- Editor: `http://127.0.0.1:4184/admin/`

Sajt možete pregledati i otvaranjem `dist/index.html`. Za ispravan pregled svih putanja i za editor koristite lokalni server.

Editor omogućava dodavanje i uređivanje proizvoda, skrivanje proizvoda iz ponude, raspored prikaza, grupe, fotografije i galeriju, opise, specifikacije, primene, prednosti, proizvođača, PDF dokumente i SEO polja. Svako čuvanje ažurira lokalni prikaz, a prethodni katalog odlazi u `.backups/`.

Ovo je **lokalni CMS za administratora**, ne javna administratorska stranica. Podaci su trajno u `content/catalog.json`, a fotografije i dokumenti u `dist/assets/uploads/`. CMS radi samo na loopback adresi. `admin/`, API i rezervne kopije ne ulaze u Sites objavu. Izmene u editoru ne menjaju objavljeni sajt dok se ponovo ne objavi.

Za ovaj obim ponude i administratora koji poznaje razvoj ovo uklanja zavisnost od CMS naloga, baze i OAuth podešavanja. Ako kasnije bude potrebno uređivanje iz više računara, sledeći korak je server sa prijavom, bazom i skladištem slika ili povezivanje istog JSON modela sa Git CMS-om.

## Ažuriranje ručno

Menjajte `content/catalog.json`, pa pokrenite:

```powershell
npm run build
npm run check
```

Build proverava podatke i putanje, generiše `dist/catalog.js`, ugrađuje kartice u HTML da sadržaj bude vidljiv bez JavaScripta, i obnavlja preusmerenja sa starih `/products/...` putanja. Ne menjajte generisani katalog direktno.

Glavni izgled: `dist/index.html`, `dist/proizvodi/index.html` i `dist/styles.css`. Interakcije: `dist/app.js`. Svetla varijanta znaka za transparentan header nalazi se u `dist/assets/images/logo-white.png`. Podaci podržavaju kategorije, jedinstven `id`/`slug`, `published`, `order`, `image`, `gallery`, `specs`, `applications`, `benefits`, `documents`, `manufacturer`, `seoTitle`, `seoDescription`. `locale` priprema strukturu za budući jezik. SEO polja modela menjaju naslov i opis dok su otvoreni detalji; zasebne indeksirane stranice proizvoda za sada nisu uključene.

## Kontakt

Pozivi, direktni e-mail linkovi i PDF rade odmah. Forma priprema poruku i otvara e-mail program; korisnik sam šalje poruku. Postoji kopiranje upita ako nema podešen e-mail program. Ne prikazuje se lažna potvrda slanja.

Za slanje direktno sa sajta potreban je izabrani servis za e-mail ili server sa pristupom pošti. Takav servis nije povezan. Upiti se ne čuvaju na serveru.

## Izvori i provera podataka

- Podaci/fotografije: originalni `https://greenlinepumps.webflow.io/products` i njegove pojedinačne stranice; mapiranje je u `content/source-audit.json`.
- PDF je original iz januara 2025, sačuvan bez prepravke. Naslovna strana je renderovana za prikaz u sajtu.
- CP-1, CPV-1, VCP-1 i VP-1 vakuumska stanica sada koriste fotografije sa odgovarajućih pojedinačnih stranica, umesto pogrešno povezanih kartica prethodne verzije.
- Vrednost ZP-1 kapaciteta `16.000 l/min` je preneta doslovno iz izvora. Potvrdite je sa tehničkom službom pre prodajne objave; katalog je stariji.
- Nema izmišljenih klijenata, proizvođača, referenci ili sertifikata. CE opis potiče sa originalnog sajta, a dokumentacija za pojedinačni model traži se na upit.
- Sajt koristi e-mail bez tačke, kao originalni Webflow; originalni PDF sadrži varijantu sa tačkom.

## Sites

Identitet sajta je u `.openai/hosting.json`. Objavljuje se samo `dist/` kao privatni Sites pregled. Ponovna objava koristi isti Site. Za drugi domen ažurirajte origin u `scripts/build.mjs` (sitemap) i podesite odgovarajuće preusmeravanje kod hosting provajdera. Dostupnost/registracija domena nije obavljena.

Testovi: `scripts/check.mjs` proverava katalog, putanje, bezbedno prikazivanje teksta i JavaScript. `node scripts/check-cms.mjs`, uz pokrenut lokalni server, proverava čuvanje istog kataloga, regeneraciju stranice, CSRF i konflikte istovremenog uređivanja.
