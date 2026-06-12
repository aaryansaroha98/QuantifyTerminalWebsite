/* ==========================================================================
   Quantify Terminal — Professional Interaction Layer
   Loaded AFTER main.js. Additive progressive enhancements:
   scroll progress, scrolled header, pointer-reactive hero glow,
   card spotlight, magnetic buttons, animated KPI counters, CTA border sweep.
   All guarded by prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll progress bar -------------------------------------------- */
  function setupProgress() {
    var bar = document.createElement("div");
    bar.className = "qt-progress";
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var h =
        document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
      bar.style.setProperty("--qt-scroll", p.toFixed(4));
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
    update();
  }

  /* ---- Header scrolled state ------------------------------------------ */
  function setupScrolledHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("scrolled", window.scrollY > 16);
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
    update();
  }

  /* ---- Pointer-reactive hero glow ------------------------------------- */
  function setupHeroGlow() {
    if (reduce) return;
    var hero = document.querySelector(".hero");
    if (!hero) return;
    hero.addEventListener(
      "pointermove",
      function (e) {
        var r = hero.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        var y = ((e.clientY - r.top) / r.height) * 100;
        hero.style.setProperty("--hero-mx", x.toFixed(1) + "%");
        hero.style.setProperty("--hero-my", y.toFixed(1) + "%");
      },
      { passive: true }
    );
  }

  /* ---- Card spotlight (cursor-follow) --------------------------------- */
  function setupSpotlight() {
    if (reduce) return;
    var cards = document.querySelectorAll(
      ".showcase-card, .image-card, .social-card, .download-card, .work-card"
    );
    cards.forEach(function (card) {
      card.addEventListener(
        "pointermove",
        function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty(
            "--mx",
            (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%"
          );
          card.style.setProperty(
            "--my",
            (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%"
          );
        },
        { passive: true }
      );
    });
  }

  /* ---- Magnetic primary buttons --------------------------------------- */
  function setupMagnetic() {
    if (reduce) return;
    if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    var btns = document.querySelectorAll(".btn.primary");
    btns.forEach(function (btn) {
      var strength = 14;
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left) / r.width - 0.5;
        var my = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform =
          "translate(" +
          (mx * strength).toFixed(2) +
          "px," +
          (my * strength - 1).toFixed(2) +
          "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---- Animated KPI / stat counters ----------------------------------- */
  function setupCounters() {
    if (reduce) return;
    var nodes = document.querySelectorAll(".kpi strong");
    if (!nodes.length || !("IntersectionObserver" in window)) return;

    function animate(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^(\d[\d,]*)(.*)$/);
      if (!match) return; // non-numeric (e.g. "Multi", "Fast") — leave as-is
      var target = parseInt(match[1].replace(/,/g, ""), 10);
      var suffix = match[2] || "";
      if (isNaN(target) || target === 0) return;
      var dur = 1100;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      window.requestAnimationFrame(step);
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nodes.forEach(function (n) {
      obs.observe(n);
    });
  }

  /* ---- CTA panel animated border sweep -------------------------------- */
  function setupCtaSweep() {
    if (reduce) return;
    var supportsProp =
      window.CSS && CSS.registerProperty !== undefined
        ? true
        : false;
    var panels = document.querySelectorAll(".cta-panel");
    if (!panels.length) return;
    var angle = 0;
    var visible = false;

    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
        });
      });
      panels.forEach(function (p) {
        obs.observe(p);
      });
    } else {
      visible = true;
    }

    function loop() {
      if (visible) {
        angle = (angle + 0.6) % 360;
        panels.forEach(function (p) {
          p.style.setProperty("--qt-angle", angle + "deg");
        });
      }
      window.requestAnimationFrame(loop);
    }
    if (supportsProp) window.requestAnimationFrame(loop);
  }

  function init() {
    setupProgress();
    setupScrolledHeader();
    setupHeroGlow();
    setupSpotlight();
    setupMagnetic();
    setupCounters();
    setupCtaSweep();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
