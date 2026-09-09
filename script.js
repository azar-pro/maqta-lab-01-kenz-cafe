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
  const activateTab = (tab) => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
      item.setAttribute("tabindex", "-1");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    renderMenu(tab.dataset.category);
  };

  tabs.forEach((tab, index) => {
    tab.setAttribute("tabindex", tab.classList.contains("active") ? "0" : "-1");

    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });
}

function closeMenu() {
  if (!menuToggle || !mainNav) return;
  menuToggle.classList.remove("open");
  mainNav.classList.remove("open");
  if (siteHeader) siteHeader.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  document.body.style.overflow = "";
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    if (siteHeader) siteHeader.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && mainNav.classList.contains("open")) closeMenu();
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
  const field = bookingForm?.elements?.[fieldName];
  if (target) target.textContent = message;
  if (field && fieldName !== "message") field.setAttribute("aria-invalid", message ? "true" : "false");
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
    } else if (dateInput && date < dateInput.min) {
      setFieldError("date", "Choose today or a future date.");
      valid = false;
    }

    if (!guests) {
      setFieldError("guests", "Choose the number of guests.");
      valid = false;
    }

    if (!valid) {
      if (formStatus) formStatus.textContent = "Please check the highlighted fields.";
      const firstInvalid = bookingForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
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
