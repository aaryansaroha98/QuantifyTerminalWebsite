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
    var spec = el.getAttribute("data-type");
    // words to type; "|" marks a line break in the rendered title
    var parts = spec ? spec.split("|") : [(el.textContent || "").trim()];
    var full = parts.join(" ").trim();
    if (!full) return;

    el.setAttribute("aria-label", full);

    // No-JS / reduced-motion users keep the full (line-split) title as-is.
    if (prefersReducedMotion()) {
      el.textContent = "";
      parts.forEach(function (p, idx) {
        var line = document.createElement("span");
        line.className = "type-line";
        line.textContent = p;
        el.appendChild(line);
      });
      el.classList.add("is-typing", "type-done");
      return;
    }

    el.textContent = "";
    el.classList.add("is-typing");

    // one .type-line per part; caret lives at the end of the last line
    var lines = parts.map(function () {
      var line = document.createElement("span");
      line.className = "type-line";
      line.setAttribute("aria-hidden", "true");
      el.appendChild(line);
      return line;
    });
    var caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");
    lines[0].appendChild(caret);

    var li = 0, ci = 0;
    function tick() {
      var part = parts[li];
      lines[li].textContent = part.slice(0, ci);
      lines[li].appendChild(caret);
      if (ci < part.length) {
        ci++;
        setTimeout(tick, 72);
      } else if (li < parts.length - 1) {
        li++; ci = 0;
        setTimeout(tick, 150);
      } else {
        el.classList.add("type-done");
      }
    }
    setTimeout(tick, 260);
  }

  function setupHeroImage() {
    var img = document.querySelector(".hero-solo-shot img");
    if (!img) return;
    function reveal() {
      img.classList.add("is-loaded");
    }
    if (img.complete && img.naturalWidth) {
      reveal();
    } else {
      img.addEventListener("load", reveal, { once: true });
      img.addEventListener("error", reveal, { once: true });
    }
  }

  function setupDocsNav() {
    var sidebar = document.getElementById("docs-sidebar");
    var openBtn = document.querySelector("[data-docs-nav-open]");
    if (!sidebar || !openBtn) return;
    var backdrop = document.querySelector(".docs-nav-backdrop");
    var closers = Array.prototype.slice.call(document.querySelectorAll("[data-docs-nav-close]"));

    function open() {
      sidebar.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      document.body.classList.add("menu-open");
      openBtn.setAttribute("aria-expanded", "true");
    }
    function close() {
      sidebar.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      openBtn.setAttribute("aria-expanded", "false");
    }

    openBtn.addEventListener("click", open);
    closers.forEach(function (c) { c.addEventListener("click", close); });
    // close after picking a section
    sidebar.querySelectorAll(".docs-nav-link").forEach(function (link) {
      link.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("is-open")) close();
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

  function setupDownloadButtons() {
    var buttons = document.querySelectorAll(".download-btn");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        if (btn.classList.contains("is-downloading")) return;

        // ripple originating from the click point
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement("span");
        ripple.className = "btn-ripple";
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (event.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (event.clientY - rect.top - size / 2) + "px";
        btn.appendChild(ripple);
        ripple.addEventListener("animationend", function () {
          ripple.remove();
        });

        // pressed feedback
        btn.classList.add("is-clicked");
        window.setTimeout(function () {
          btn.classList.remove("is-clicked");
        }, 260);

        // brief "downloading" state so the click clearly registers
        var label = btn.querySelector("span");
        if (label && !label.dataset.original) {
          label.dataset.original = label.textContent;
        }
        btn.classList.add("is-downloading");
        if (label) label.textContent = "Starting download…";

        window.setTimeout(function () {
          btn.classList.remove("is-downloading");
          if (label && label.dataset.original) {
            label.textContent = label.dataset.original;
          }
        }, 2200);
      });
    });
  }

  function setupPricingToggle() {
    var toggle = document.querySelector("[data-billing-toggle]");
    if (!toggle) return;
    var buttons = Array.prototype.slice.call(toggle.querySelectorAll("button"));
    var targets = Array.prototype.slice.call(
      document.querySelectorAll("[data-monthly]")
    );

    function apply(mode) {
      buttons.forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-billing") === mode);
      });
      targets.forEach(function (el) {
        var val = el.getAttribute("data-" + mode);
        if (val === null) return;
        if (el.classList.contains("price-note")) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-billing"));
      });
    });

    apply("monthly");
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    setupHeader();
    setupHeroImage();
    setupDocsNav();
    setupMenu();
    setupReveal();
    setupTypewriter();
    setupLightbox();
    setupDownloadButtons();
    setupPricingToggle();
  });
})();
