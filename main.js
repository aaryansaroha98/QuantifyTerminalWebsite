(function () {
  document.documentElement.classList.add("js");

  function setActiveNav() {
    var current = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll("[data-nav-link]").forEach(function (link) {
      var href = link.getAttribute("href") || "/";
      var normalized = href.replace(/\/$/, "") || "/";
      if (normalized === current) {
        link.classList.add("active");
      }
    });
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (!toggle || !menu) return;

    function closeMenu() {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1040) closeMenu();
    });
  }

  function setupReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 38, 190) + "ms";
      observer.observe(item);
    });
  }

  function setupLightbox() {
    var images = Array.prototype.slice.call(
      document.querySelectorAll(".library-grid img, .image-grid img, .media-panel img")
    );
    if (!images.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close image">×</button>' +
      "<figure><img alt=\"\"><figcaption></figcaption></figure>";
    document.body.appendChild(overlay);

    var bigImg = overlay.querySelector("img");
    var caption = overlay.querySelector("figcaption");
    var closeBtn = overlay.querySelector(".lightbox-close");

    function openImage(src, alt) {
      bigImg.setAttribute("src", src);
      bigImg.setAttribute("alt", alt || "");
      caption.textContent = alt || "";
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
    }

    function closeImage() {
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
      bigImg.setAttribute("src", "");
    }

    images.forEach(function (img) {
      img.classList.add("gallery-zoom");
      img.addEventListener("click", function () {
        openImage(img.getAttribute("src"), img.getAttribute("alt"));
      });
    });

    closeBtn.addEventListener("click", closeImage);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeImage();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeImage();
      }
    });
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function setupTypewriter() {
    var el = document.querySelector(".hero-solo-inner h1");
    if (!el) return;
    var full = (el.textContent || "").trim();
    if (!full) return;

    // No-JS / reduced-motion users keep the full title as-is.
    if (prefersReducedMotion()) return;

    el.setAttribute("aria-label", full);
    var text = document.createElement("span");
    text.className = "type-text";
    text.setAttribute("aria-hidden", "true");
    var caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");

    el.textContent = "";
    el.classList.add("is-typing");
    el.appendChild(text);
    el.appendChild(caret);

    var i = 0;
    function tick() {
      text.textContent = full.slice(0, i);
      if (i < full.length) {
        i++;
        // slight natural variation in typing cadence
        setTimeout(tick, 70 + (full.charAt(i - 1) === " " ? 120 : 0));
      } else {
        el.classList.add("type-done");
      }
    }
    // small delay so the reveal fade-in has started first
    setTimeout(tick, 260);
  }

  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      if (y > lastY && y > 220 && !document.body.classList.contains("menu-open")) {
        header.classList.add("hide");
      } else {
        header.classList.remove("hide");
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    setupHeader();
    setupMenu();
    setupReveal();
    setupTypewriter();
    setupLightbox();
  });
})();
