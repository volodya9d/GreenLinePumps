/**
 * Privremeni izvor podataka za statičku verziju sajta.
 * Svaki objekat odgovara jednom proizvodu. Kada se uvede Decap CMS,
 * build skripta će generisati ovaj fajl iz content/products/*.json zapisa.
 */
window.GreenlineProducts = [
  {
    id: "zpa-tip",
    name: "ZPA tip",
    category: "Zupčaste pumpe",
    image: "assets/images/zpa-gear.png",
    badge: "Istaknuto rešenje",
    intro: "Toplotno izolovana zupčasta pumpa za medije više temperature.",
    description: "Za prenos teške nafte, asfalta, smole, deterdženta i lepka bez čvrstih čestica.",
    specs: [["Maks. kapacitet", "80 m³/h"], ["Diferencijalni pritisak", "6 bar"], ["Temperatura medija", "do 300°C"]],
    applications: ["asfalt", "smola", "lepak", "teška nafta"],
    benefits: ["Toplotna izolacija", "Pouzdan prenos viskoznih medija", "Rešenje za visoke temperature"]
  },
  {
    id: "zp-1-serija",
    name: "ZP-1 serija",
    category: "Zupčaste pumpe",
    image: "assets/images/zp-gear.png",
    intro: "Zupčasta pumpa za prenos i povišenje pritiska ulja.",
    description: "Konstrukcija za transport nekorozivnih maziva, sa termički obrađenim zupčanicima i sigurnosnim ventilom.",
    specs: [["Maks. kapacitet", "16.000 l/min"], ["Diferencijalni pritisak", "15 bar"], ["Medij", "nekorozivna maziva"]],
    applications: ["maziva", "sistemi za dovod ulja", "industrijski prenos"],
    benefits: ["Sigurnosni ventil", "Samopodmazivanje medijem", "Povećana tvrdoća zupčanika"]
  },
  {
    id: "zp-2-serija",
    name: "ZP-2 serija",
    category: "Zupčaste pumpe",
    image: "assets/images/zp2-gear.png",
    intro: "Cirkularna zupčasta pumpa za čista ulja i visoke temperature.",
    description: "Za transport nekorozivnog ulja za podmazivanje i sličnih tečnosti bez čvrstih čestica.",
    specs: [["Maks. kapacitet", "97 m³/h"], ["Diferencijalni pritisak", "16 bar"], ["Temperatura medija", "do 300°C"]],
    applications: ["ulja", "podmazivanje", "procesna industrija"],
    benefits: ["Niži nivo buke", "Dug radni vek", "Visoka efikasnost"]
  },
  {
    id: "cp-1-serija",
    name: "CP-1 serija",
    category: "Centrifugalne pumpe",
    image: "assets/images/cp1-multistage.png",
    badge: "Istaknuto rešenje",
    intro: "Pouzdano rešenje za termalno ulje i toplu vodu.",
    description: "Centrifugalna pumpa za prenos tečnosti visoke temperature bez čvrstih čestica.",
    specs: [["Maks. kapacitet", "50 m³/h"], ["Maks. potisak", "125 m"], ["Pogon", "motor preko spojnice"]],
    applications: ["termalno ulje", "topla voda", "grejni sistemi"],
    benefits: ["Stabilne performanse", "Pouzdan rad na temperaturi", "Jednostavna integracija"]
  },
  {
    id: "cpv-1-serija",
    name: "CPV-1 serija",
    category: "Centrifugalne pumpe",
    image: "assets/images/cpv-vertical.png",
    intro: "Višestepena centrifugalna pumpa za prenos na velike udaljenosti.",
    description: "Projektovana za transport tečnog ulja bez čvrstih čestica i drugih odgovarajućih tečnosti.",
    specs: [["Maks. kapacitet", "150 m³/h"], ["Maks. potisak", "603 m"], ["Konstrukcija", "višestepena"]],
    applications: ["prenos na velike udaljenosti", "ulja", "industrijski sistemi"],
    benefits: ["Visok potisak", "Višestepena konstrukcija", "Kontinuiran rad"]
  },
  {
    id: "vcp-1-serija",
    name: "VCP-1 serija",
    category: "Centrifugalne pumpe",
    image: "assets/images/vcp-centrifugal.png",
    intro: "Vertikalna višestepena pumpa koja štedi prostor.",
    description: "Pogodna za transport hladne i tople vode kada su jednostavna instalacija i prostorna efikasnost prioritet.",
    specs: [["Maks. kapacitet", "162 m³/h"], ["Maks. potisak", "200 m"], ["Kućište", "nerđajući čelik"]],
    applications: ["vodosnabdevanje", "topla voda", "kompaktne mašinske sobe"],
    benefits: ["Prostorno efikasna", "Stabilan rad", "Jednostavna instalacija"]
  },
  {
    id: "cpp-1",
    name: "CPP-1",
    category: "Membranske pumpe",
    image: "assets/images/cpp-diaphragm.png",
    intro: "Plastične i metalne membranske pumpe za zahtevne fluide.",
    description: "Otporne na hemikalije, sa širokim spektrom primene i pogonom na komprimovani vazduh, paru ili otpadni gas.",
    specs: [["Maks. kapacitet", "0–30 m³/h"], ["Maks. potisak", "0–50 m"], ["Pogon", "pneumatski / para / gas"]],
    applications: ["hemikalije", "otpadne vode", "korozivni mediji"],
    benefits: ["Hemijska otpornost", "Široka primena", "Više opcija pogona"]
  },
  {
    id: "zm-1-serija",
    name: "ZM-1 serija",
    category: "Zavojne pumpe",
    image: "assets/images/zm-mono.png",
    intro: "Mono zavojna pumpa za medije sa čvrstim česticama i vlaknima.",
    description: "Rotaciona pumpa za stabilan protok i pritisak, sa malim brojem sastavnih delova i jednostavnim održavanjem.",
    specs: [["Maks. kapacitet", "na upit"], ["Diferencijalni pritisak", "na upit"], ["Protok", "stalan, bez pulsiranja"]],
    applications: ["mulj", "mediji sa vlaknima", "otpadne vode"],
    benefits: ["Nizak nivo buke", "Bez pulsiranja", "Lako održavanje"]
  },
  {
    id: "vp-1-serija",
    name: "VP-1 serija",
    category: "Vakuum pumpe",
    image: "assets/images/vp-vacuum.png",
    intro: "Vakuum pumpa sa vodenim prstenom za gasove i paru.",
    description: "Za pumpanje ili komprimovanje vazduha i drugih nekorozivnih gasova nerastvorljivih u vodi.",
    specs: [["Maks. kapacitet", "na upit"], ["Diferencijalni pritisak", "na upit"], ["Radni princip", "vodeni prsten"]],
    applications: ["vakuum procesi", "gasovi", "para"],
    benefits: ["Izotermna kompresija", "Pogodna za zahtevne gasove", "Pouzdan vakuum"]
  },
  {
    id: "vp-1-serija-vs",
    name: "VP-1 vakuumska stanica",
    category: "Vakuum pumpe",
    image: "assets/images/ry-air.svg",
    intro: "Kompletan sistem za skladištenje i upravljanje vakuumom.",
    description: "Stanica sa jednom ili dve vakuum pumpe sa vodenim prstenom kao opremom za prikupljanje vakuuma.",
    specs: [["Konfiguracija", "1 ili 2 pumpe"], ["Kapacitet", "na upit"], ["Prednost", "ušteda energije"]],
    applications: ["centralni vakuum", "procesni sistemi", "česta upotreba vakuuma"],
    benefits: ["Duži vek opreme", "Energetska efikasnost", "Kompletno rešenje"]
  }
];
