# GreenLine Pumps — aktivna nova verzija

Nova verzija se nalazi u **site/**. Otvorite `index.html` u ovom direktorijumu da pređete na novi sajt, ili pokrenite `npm run dev` za lokalni pregled i CMS na `http://127.0.0.1:4184/admin/`.

Aktuelno uputstvo: [site/README.md](site/README.md). Prethodni početni HTML je sačuvan kao `previous-index.html`, a stari `styles.css`, `app.js` i `data/` su zadržani radi poređenja. Za novo uređivanje koristite samo `site/`.

---

## Beleške iz prethodne verzije (arhiva)

Jednostavan, responzivan HTML/CSS/JavaScript redizajn za prezentaciju industrijskih pumpi. Nema Webflow zavisnosti i može se objaviti na svakom statičkom hostingu.

## Lokalno pokretanje

Otvorite projekat kroz lokalni server, na primer VS Code Live Server ili:

```powershell
npx serve .
```

Zatim otvorite adresu koju komanda prikaže. Ne preporučuje se direktno otvaranje `index.html` duplim klikom samo zbog ponašanja browsera sa lokalnim resursima.

## Gde se ažuriraju proizvodi

Svi proizvodi su u [data/products.js](data/products.js). Jedan zapis sadrži naziv, kategoriju, sliku, kratak opis, specifikacije, primene i prednosti. JavaScript automatski prikazuje kartice, pretragu, filtere i prozor sa detaljima.

- novu sliku stavite u `assets/images/`;
- dodajte ili izmenite jedan objekat u `window.GreenlineProducts`;
- promenite PDF u `assets/documents/greenlinepumps-katalog.pdf` kada katalog bude osvežen.

Brend fajlovi su u `assets/images/logo.png` i `assets/images/tab-logo.png`; drugi se koristi kao favicon u browser tabu.

## Preporučeni CMS za produkciju

Za oko 20 proizvoda i administratora koji ume da radi sa Git-om preporuka je **Decap CMS + Git repozitorijum + Netlify/Vercel hosting**. CMS daje web administraciju na `/admin`, a sajt ostaje statički, brz i bez sopstvene baze.

Predloženi tok je:

1. Svaki proizvod postaje zaseban `content/products/[slug].json` zapis.
2. Decap CMS uređuje te zapise i fotografije u browseru.
3. Kratka Node build skripta spaja zapise u `data/products.js` pre objave.
4. Git commit automatski aktivira novi statički deploy.

Tako se izbegava skupi backend, a svaki proizvod može da ima: naziv, kategoriju, proizvođača, slike, kratki i detaljni opis, tehničke specifikacije, primene, prednosti, PDF dokumenta i SEO polja.

Za jednostavniji početak, aktuelna verzija koristi `data/products.js` kao jedino mesto za sadržaj. To je dobar prelazni model: ne blokira objavu sada, a kasnije se bez promene frontenda zamenjuje CMS generisanim fajlom.

## Forma i objava

Forma trenutno otvara korisnikov e-mail program sa popunjenim upitom na `greenlinepumps@gmail.com`; ne postoji server koji prima podatke. Za automatsko slanje, spam zaštitu i poruku uspeha pre objave povežite formu sa Netlify Forms, Formspree ili sopstvenim endpointom. Nakon toga se u `app.js` zameni `mailto` obrada sa `fetch` pozivom.

Pre objave proverite kontakt adresu: postojeći sajt navodi `greenlinepumps@gmail.com`, dok stariji katalog koristi adresu sa tačkom (`greenline.pumps@gmail.com`). U interfejsu je korišćena adresa sa aktuelnog Webflow sajta.
