/*
 * Writing URLs are intentionally placeholders until Aisha's writing site ships.
 * Replace WRITING_SITE_HOME and the four route values together once confirmed.
 */
const WRITING_SITE_HOME = null;
const WRITING_ROUTES = {
  "world-bigger": null,
  "dating-myself": null,
  "ai-ownership": null,
  "own-anything": null
};

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.textContent = open ? "Menu" : "Close";
    links.classList.toggle("is-open", !open);
  });

  links.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
    links.classList.remove("is-open");
  });
}

function initWritingShelf() {
  const books = [...document.querySelectorAll(".book")];
  const titleBox = document.querySelector(".book-titles");

  function showTitle(book) {
    const id = book.getAttribute("aria-describedby");
    books.forEach((item) => item.classList.toggle("is-active", item === book));
    titleBox?.classList.add("has-active");
    document.querySelectorAll(".book-titles p").forEach((title) => {
      title.classList.toggle("is-active", title.id === id);
    });
  }

  books.forEach((book) => {
    const route = WRITING_ROUTES[book.dataset.writingKey];
    if (WRITING_SITE_HOME && route) {
      book.href = new URL(route, WRITING_SITE_HOME).href;
      book.target = "_blank";
      book.rel = "noopener";
    } else {
      book.dataset.pendingUrl = "true";
      book.setAttribute("aria-label", `${document.getElementById(book.getAttribute("aria-describedby"))?.textContent}. Writing URL pending.`);
      book.addEventListener("click", (event) => {
        event.preventDefault();
        showTitle(book);
      });
    }
    book.addEventListener("mouseenter", () => showTitle(book));
    book.addEventListener("focus", () => showTitle(book));
  });

  document.querySelectorAll("[data-writing-home]").forEach((link) => {
    if (WRITING_SITE_HOME) {
      link.href = WRITING_SITE_HOME;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.dataset.pendingUrl = "true";
      link.setAttribute("aria-label", `${link.textContent.trim()}. Writing website URL pending.`);
      link.addEventListener("click", (event) => event.preventDefault());
    }
  });
}

function initReveals() {
  const items = document.querySelectorAll(".reveal");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("in-view"));
    document.querySelectorAll(".credits li").forEach((li) => li.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  items.forEach((item) => observer.observe(item));

  // stagger credits
  const creditObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const li = entry.target;
      const idx = [...li.parentElement.children].indexOf(li);
      li.style.transitionDelay = `${idx * 0.12}s`;
      li.classList.add("in-view");
      creditObserver.unobserve(li);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".credits li").forEach((li) => creditObserver.observe(li));
}

initNavigation();
initWritingShelf();
initReveals();
