(() => {
  const products = window.GreenlineProducts || [];
  const grid = document.querySelector("#product-grid");
  const result = document.querySelector("#catalog-result");
  const search = document.querySelector("#product-search");
  const pills = [...document.querySelectorAll(".filter-pill")];
  const dialog = document.querySelector("#product-dialog");
  const dialogContent = document.querySelector("#dialog-content");
  let activeCategory = "Sve";

  const textForSearch = (product) => [product.name, product.category, product.intro, product.description, ...product.applications, ...product.benefits].join(" ").toLocaleLowerCase("sr-Latn");

  const productCard = (product) => `
    <article class="product-card">
      <div class="product-card__top"><span>${product.category}</span>${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ""}</div>
      <div class="product-card__image"><img src="${product.image}" alt="${product.name} - ${product.category}" loading="lazy" /></div>
      <h3>${product.name}</h3>
      <p>${product.intro}</p>
      <div class="product-card__bottom"><span class="product-card__spec">${product.specs[0][0]}: ${product.specs[0][1]}</span><button type="button" class="product-card__open" data-product-id="${product.id}">Detalji</button></div>
    </article>`;

  const renderProducts = () => {
    const query = search.value.trim().toLocaleLowerCase("sr-Latn");
    const filtered = products.filter((product) => (activeCategory === "Sve" || product.category === activeCategory) && (!query || textForSearch(product).includes(query)));
    grid.innerHTML = filtered.length ? filtered.map(productCard).join("") : `<p class="no-results">Nismo pronašli odgovarajući model. Pošaljite nam upit - predložićemo rešenje za vašu aplikaciju.</p>`;
    result.textContent = `${filtered.length} ${filtered.length === 1 ? "model" : "modela"} u prikazu`;
  };

  const openProduct = (id) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    dialogContent.innerHTML = `
      <div class="dialog-layout">
        <div class="dialog-image"><img src="${product.image}" alt="${product.name} - ${product.category}" /></div>
        <div class="dialog-content">
          <p class="eyebrow">${product.category}</p>
          <h2 id="dialog-title">${product.name}</h2>
          <p>${product.description}</p>
          <div class="spec-list">${product.specs.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>
          <ul class="dialog-benefits">${product.benefits.map((benefit) => `<li>${benefit}</li>`).join("")}</ul>
          <a class="button button--solid" href="#kontakt" data-dialog-contact="${product.name}">Pošaljite upit za model <span aria-hidden="true">↗</span></a>
        </div>
      </div>`;
    dialog.showModal();
  };

  pills.forEach((pill) => pill.addEventListener("click", () => {
    activeCategory = pill.dataset.filter;
    pills.forEach((item) => item.classList.toggle("is-active", item === pill));
    renderProducts();
  }));
  search.addEventListener("input", renderProducts);
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-product-id]");
    if (button) openProduct(button.dataset.productId);
  });
  document.querySelectorAll("[data-category-link]").forEach((link) => link.addEventListener("click", () => {
    activeCategory = link.dataset.categoryLink;
    pills.forEach((item) => item.classList.toggle("is-active", item.dataset.filter === activeCategory));
    renderProducts();
  }));

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target.closest(".dialog-close")) dialog.close();
    const contactLink = event.target.closest("[data-dialog-contact]");
    if (contactLink) {
      const interest = document.querySelector('[name="interest"]');
      const message = document.querySelector('[name="message"]');
      if (interest) interest.value = "Preporuka pumpe";
      if (message) message.value = `Zanima me model ${contactLink.dataset.dialogContact}. `;
      dialog.close();
    }
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    navigation.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.website.value) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`GreenLine Pumps upit: ${data.get("interest")}`);
    const body = encodeURIComponent(`Ime: ${data.get("name")}\nKompanija: ${data.get("company") || "-"}\nE-mail: ${data.get("email")}\nTelefon: ${data.get("phone") || "-"}\nTema: ${data.get("interest")}\n\nPoruka:\n${data.get("message")}`);
    status.textContent = "Otvaramo e-mail program sa pripremljenim upitom.";
    window.location.href = `mailto:greenlinepumps@gmail.com?subject=${subject}&body=${body}`;
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
  renderProducts();
})();
