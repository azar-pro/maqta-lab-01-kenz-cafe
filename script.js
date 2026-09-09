const menuData = {
  coffee: [
    { name: "Espresso", desc: "Sweet, balanced seasonal espresso.", price: "24 DH" },
    { name: "Cortado", desc: "Double espresso with silky steamed milk.", price: "30 DH" },
    { name: "Flat White", desc: "Velvety milk, strong espresso, smooth finish.", price: "34 DH" },
    { name: "V60", desc: "Hand-poured single origin, changing weekly.", price: "38 DH" }
  ],
  cold: [
    { name: "Iced Latte", desc: "Espresso, cold milk and clear ice.", price: "34 DH" },
    { name: "Cold Brew", desc: "Slow-steeped for 16 hours, soft and chocolatey.", price: "38 DH" },
    { name: "Orange Tonic", desc: "Espresso, citrus, tonic and fresh orange.", price: "42 DH" },
    { name: "Date Shake", desc: "Milk, dates, cinnamon and a shot of espresso.", price: "44 DH" }
  ],
  bakes: [
    { name: "Almond Croissant", desc: "Buttery layers with toasted almond cream.", price: "30 DH" },
    { name: "Orange Cake", desc: "Olive oil cake with fresh orange zest.", price: "28 DH" },
    { name: "Chocolate Babka", desc: "Dark chocolate, brioche and sea salt.", price: "32 DH" },
    { name: "Amlou Toast", desc: "Sourdough, almond, argan oil and honey.", price: "36 DH" }
  ]
};

const menuList = document.getElementById("menuList");
const tabs = document.querySelectorAll(".tab");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const siteHeader = document.getElementById("siteHeader");

function renderMenu(category) {
  menuList.innerHTML = menuData[category]
    .map(
      (item, index) => `
        <article class="menu-item" style="animation-delay:${index * 60}ms">
          <span class="menu-item-index">0${index + 1}</span>
          <div>
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-desc">${item.desc}</div>
          </div>
          <span class="menu-item-price">${item.price}</span>
        </article>
      `
    )
    .join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderMenu(tab.dataset.category);
  });
});

function closeMenu() {
  menuToggle.classList.remove("open");
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40);
});

document.getElementById("year").textContent = new Date().getFullYear();

renderMenu("coffee");
