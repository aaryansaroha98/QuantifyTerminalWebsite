document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initActiveNav();
  initReveal();
  initDownloadTabs();
  initHeaderShadow();
});

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      close();
      return;
    }
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("open");
    document.body.classList.add("menu-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", close);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 920) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function initActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function initReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  items.forEach((item) => observer.observe(item));
}

function initDownloadTabs() {
  const buttons = Array.from(document.querySelectorAll("[data-os-button]"));
  const panels = Array.from(document.querySelectorAll("[data-os-panel]"));
  if (!buttons.length || !panels.length) return;

  const setActive = (target) => {
    buttons.forEach((button) => {
      const active = button.dataset.osButton === target;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((panel) => {
      const active = panel.dataset.osPanel === target;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setActive(button.dataset.osButton);
    });
  });

  const platform = `${navigator.platform || ""} ${navigator.userAgent || ""}`.toLowerCase();
  if (platform.includes("mac")) {
    setActive("macos");
  } else if (platform.includes("linux")) {
    setActive("linux");
  } else {
    setActive("windows");
  }
}

function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}
