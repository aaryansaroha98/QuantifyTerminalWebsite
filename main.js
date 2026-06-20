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

    var backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.appendChild(backdrop);

    function closeMenu() {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
      }
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
    var el = document.querySelector("[data-typewriter]");
    if (!el) return;

    var text = el.getAttribute("data-text") || el.textContent;
    if (prefersReducedMotion()) {
      el.textContent = text;
      return;
    }

    el.classList.add("typing");
    el.textContent = "";
    var i = 0;

    function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += 1;
        window.setTimeout(tick, 65);
      } else {
        el.classList.remove("typing");
        el.classList.add("typed");
      }
    }

    window.setTimeout(tick, 240);
  }

  function setupWordReveal() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-words]"));
    if (!nodes.length) return;

    nodes.forEach(function (node) {
      var text = node.textContent.trim();
      if (prefersReducedMotion()) return;

      var words = text.split(/\s+/);
      node.textContent = "";
      var frag = document.createDocumentFragment();

      words.forEach(function (word, idx) {
        var span = document.createElement("span");
        span.className = "word";
        span.textContent = word;
        span.style.transitionDelay = 600 + idx * 22 + "ms";
        frag.appendChild(span);
        if (idx < words.length - 1) {
          frag.appendChild(document.createTextNode(" "));
        }
      });

      node.appendChild(frag);

      window.requestAnimationFrame(function () {
        node.classList.add("words-in");
      });
    });
  }

  function setupTilt() {
    if (prefersReducedMotion()) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-tilt]"));
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" +
          (-py * 5).toFixed(2) +
          "deg) rotateY(" +
          (px * 5).toFixed(2) +
          "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
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
    setupLightbox();
    setupTypewriter();
    setupWordReveal();
    setupTilt();
  });
})();
