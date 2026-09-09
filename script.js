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
const year = document.getElementById("year");

function renderMenu(category) {
  if (!menuList || !menuData[category]) return;

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

if (tabs.length) {
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
}

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.classList.remove("open");
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const currentPage = document.body.dataset.page;
if (currentPage) {
  const activeLink = document.querySelector(`[data-nav="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

const bookingForm = document.getElementById("bookingForm");
const formStatus = document.getElementById("formStatus");

function setFieldError(fieldName, message) {
  const target = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (target) target.textContent = message;
}

if (bookingForm) {
  const dateInput = bookingForm.elements.date;
  if (dateInput) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    dateInput.min = localToday;
  }

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    ["name", "phone", "date", "guests", "message"].forEach((field) => setFieldError(field, ""));
    if (formStatus) {
      formStatus.textContent = "";
      formStatus.classList.remove("success");
    }

    const name = bookingForm.elements.name.value.trim();
    const phone = bookingForm.elements.phone.value.trim();
    const date = bookingForm.elements.date.value;
    const guests = bookingForm.elements.guests.value;

    let valid = true;

    if (name.length < 2) {
      setFieldError("name", "Please enter at least 2 characters.");
      valid = false;
    }

    if (!/^[+0-9 ()-]{8,20}$/.test(phone)) {
      setFieldError("phone", "Enter a valid phone number.");
      valid = false;
    }

    if (!date) {
      setFieldError("date", "Choose a date.");
      valid = false;
    }

    if (!guests) {
      setFieldError("guests", "Choose the number of guests.");
      valid = false;
    }

    if (!valid) {
      if (formStatus) formStatus.textContent = "Please check the highlighted fields.";
      return;
    }

    if (formStatus) {
      formStatus.textContent = "Perfect — the front-end validation works. No information was sent anywhere.";
      formStatus.classList.add("success");
    }

    bookingForm.reset();
  });
}

renderMenu("coffee");
