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

  /* The hero title is static. The caret stays -- it is the one piece of
     motion in the hero and it reads as a terminal prompt -- but the words
     are there on first paint rather than typed in one character at a time.
     Reduced-motion users get no caret at all; the stylesheet handles that. */
  /* Somebody who has asked their machine not to animate things should not be handed a
   looping film. The poster frame stays, and it still says what the film says. */
function setupFilm() {
  var v = document.querySelector("video[data-film]");
  if (!v) return;
  var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!mq) return;
  var apply = function () {
    if (mq.matches) { v.pause(); v.removeAttribute("autoplay"); v.setAttribute("controls", ""); }
  };
  apply();
  if (mq.addEventListener) mq.addEventListener("change", apply);
}

/* The live terminal on the homepage.
 *
 * Not a video: the same chain the film runs, running. The clock ticks, the prices move,
 * the tape scrolls, the highlighter sweeps, the chart draws itself, the figures count up
 * and the cursor arcs to what it is about to click. Twelve screens, the same order and
 * roughly the same beat as the film.
 *
 * Three rules it obeys: nothing runs while it is off screen or the tab is hidden, it
 * holds still on the first screen for anyone who has asked for reduced motion, and it
 * animates only opacity and transform so it never costs the page a layout.
 */
function setupLiveTerminal() {
  var root = document.querySelector("[data-term]");
  if (!root) return;
  var $  = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };

  var clockEl = $("[data-term-clock]"), sysEl = $("[data-term-sys]"),
      msgEl   = $("[data-term-msg]"),   rightEl = $("[data-term-right]"),
      progEl  = $("[data-term-prog]");
  var tabs = $$("[data-tab]"), panels = $$("[data-panel]");
  var pxEls = $$("[data-px]"), tapeEl = $("[data-tape]");

  /* seeded, so every device draws the same shapes */
  function rnd(seed) { var a = seed; return function () {
    a = (a * 1664525 + 1013904223) % 4294967296; return a / 4294967296; }; }

  $$("[data-spark]").forEach(function (cell, i) {
    var r = rnd(7 + i * 131), v = 0, pts = [];
    for (var k = 0; k < 36; k++) { v += r() * 2 - 1; pts.push(v); }
    var lo = Math.min.apply(null, pts), sp = (Math.max.apply(null, pts) - lo) || 1, d = "";
    pts.forEach(function (y, k) {
      d += (k ? "L" : "M") + (k / 35 * 100).toFixed(1) + " " + (16 - (y - lo) / sp * 14).toFixed(1);
    });
    cell.innerHTML = '<svg viewBox="0 0 100 18" preserveAspectRatio="none"><path d="' + d +
      '" fill="none" stroke="#7C838D" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>';
  });

  /* sector heat: up is accent, down is grey, magnitude is opacity — red stays reserved
     for the one thing that broke */
  var heatEl = $("[data-heat]");
  if (heatEl) {
    var hr = rnd(4242), html = "";
    for (var h = 0; h < 70; h++) {
      var v = hr() * 2 - 1;
      html += '<i style="background:' + (v > 0 ? "#4F7CFF" : "#7C838D") +
              ';--v:' + (0.14 + Math.abs(v) * 0.6).toFixed(2) + '"></i>';
    }
    heatEl.innerHTML = html;
  }

  var TAPE = [["NRTH","1,842.50","▼4.81"],["ARDN","612.05","▲2.14"],
              ["KSTL","289.70","▲1.06"],["VLLR","1,104.20","▼0.62"],
              ["ORMX","748.35","▲3.42"],["HLDN","2,260.80","▼1.18"],
              ["SBPT","437.15","▲0.88"],["MRDN","955.60","▼2.05"],
              ["CLDR","1,388.90","▲5.07"],["TSSR","176.45","▼0.34"]];
  if (tapeEl) {
    var tp = "";
    for (var c = 0; c < 3; c++) TAPE.forEach(function (x) {
      tp += "<span><b>" + x[0] + "</b><span>" + x[1] + "</span><i>" + x[2] + "</i></span>";
    });
    tapeEl.innerHTML = tp;
  }

  var TYPED = "mix decel is channel, not demand";

  /* the sequence: panel, which tab is lit, how long it holds, what is running
     underneath, and the cues that fire inside it */
  function on(sel, stagger) { return function () {
    $$(sel).forEach(function (el, i) { setTimeout(function () { el.classList.add("is-on"); }, i * (stagger || 0)); });
  }; }
  var SEQ = [
    { p:0, tab:1, ms:4600, sys:"DATA FABRIC", msg:"streaming 10 instruments · 5 venues", right:"live",
      cues:[[2700, function(){ $("[data-toast]").classList.add("is-on"); }]] },
    { p:1, tab:0, ms:4600, sys:"WORLD MODEL", msg:"overnight diff · 5 changes in your book", right:"06:14",
      cues:[[120, on("[data-br]", 170)],
            [2300, function(){ var c=$("[data-cur]"); c.classList.add("is-on"); cursor(c, 1); }]] },
    { p:2, tab:6, ms:5400, sys:"DATA FABRIC", msg:"extracting facts · 34 of 34 sourced", right:"04:12",
      cues:[[350, function(){ $("[data-lit]").classList.add("is-lit"); }],
            [1200, function(){ $("[data-link]").classList.add("is-on"); }],
            [1500, on("[data-fact]", 190)],
            [2700, function(){ $("[data-note]").classList.add("is-on"); }]] },
    { p:3, tab:11, ms:4600, sys:"MODEL COMPILER", msg:"NRTH v14 · recomputing 5 cells", right:"proposed",
      cues:[[900, function(){ $("[data-flip]").classList.add("is-flipped"); }],
            [1500, on("[data-down]", 150)],
            [2600, function(){ $(".tp-prop").classList.add("is-on"); }]] },
    { p:4, tab:4, ms:6200, sys:"WORLD MODEL", msg:"testing 5 assumptions against new facts", right:"06:17",
      cues:[[300, function(){ $("[data-thr]").classList.add("is-on"); $("[data-thrlbl]").classList.add("is-on"); }],
            [1400, function(){ $("[data-line]").classList.add("is-drawn"); }],
            [3600, function(){ $("[data-dot]").classList.add("is-on"); $("[data-dotlbl]").classList.add("is-on"); }]] },
    { p:5, tab:7, ms:4600, sys:"WORLD MODEL", msg:"1 assumption breached · 4 holding", right:"06:17",
      cues:[[120, on("[data-as]", 170)]] },
    { p:6, tab:12, ms:4800, sys:"PORTFOLIO TWIN", msg:"tracing dependencies · 2 indirect found", right:"5 positions",
      cues:[[120, function(){ $("[data-hub]").classList.add("is-on"); }],
            [320, on("[data-edge]", 240)],
            [520, on("[data-dep]", 240)]] },
    { p:7, tab:13, ms:5200, sys:"PORTFOLIO TWIN", msg:"re-pricing book · 1-day VaR 1.94 → 2.36", right:"06:18",
      cues:[[120, on("[data-fig]", 130)],
            [180, function(){ count(); }],
            [1900, function(){ $("[data-figline]").classList.add("is-on"); }],
            [2400, on("[data-rc]", 170)]] },
    { p:8, tab:12, ms:6000, sys:"PORTFOLIO TWIN", msg:"costing 4 courses of action", right:"ready",
      cues:[[120, on("[data-opt]", 150)],
            [1200, function(){ var c=$("[data-cur2]"); c.classList.add("is-on"); cursor(c, 8); }],
            [2000, function(){ $$("[data-opt]")[0].classList.add("is-hot"); }],
            [2300, function(){ $("[data-field]").classList.add("is-on"); }],
            [2700, function(){ type(); }]] },
    { p:9, tab:12, ms:4600, sys:"DECISION RECORD", msg:"sealing evidence, model v15, thesis v4", right:"06:19",
      cues:[[120, on("[data-rf]", 150)]] },
    { p:10, tab:0, ms:5200, sys:"DECISION RECORD", msg:"replaying everything known at 06:19", right:"complete",
      cues:[[120, on("[data-mk]", 90)], [500, function(){ replay(); }],
            [3600, function(){ $("[data-tlnote]").classList.add("is-on"); }]] },
    { p:11, tab:0, ms:4400, sys:"WORLD MODEL", msg:"1 of 5 resolved · 4 open", right:"06:19", cues:[] }
  ];

  /* ---- the moving parts inside a beat ---- */
  var subTimers = [];
  function later(fn, ms) { subTimers.push(setTimeout(fn, ms)); }

  function cursor(el, panelIdx) {
    /* an arc with a 6px overshoot that settles — pointers never travel in straight lines */
    var host = panels[panelIdx].getBoundingClientRect();
    var target = panels[panelIdx].querySelector(panelIdx === 1 ? "[data-br]" : "[data-opt]");
    if (!target) return;
    var tb = target.getBoundingClientRect();
    var x0 = host.width * 0.82, y0 = host.height * 0.78;
    var x1 = tb.left - host.left + 46, y1 = tb.top - host.top + tb.height / 2;
    var t0 = performance.now(), dur = 820;
    (function step(now) {
      var k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      var dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, bow = -70;
      var cx = mx - dy / L * bow, cy = my + dx / L * bow, u = 1 - e;
      var x = u * u * x0 + 2 * u * e * cx + e * e * x1;
      var y = u * u * y0 + 2 * u * e * cy + e * e * y1;
      var over = k > 0.86 ? 6 * (1 - (k - 0.86) / 0.14) : (k > 0.7 ? 6 * ((k - 0.7) / 0.16) : 0);
      el.style.transform = "translate(" + (x - over).toFixed(1) + "px," + (y + over * 0.4).toFixed(1) + "px)";
      if (k < 1 && running) requestAnimationFrame(step);
    })(t0);
  }

  function count() {
    $$("[data-count]").forEach(function (el) {
      var to = parseFloat(el.getAttribute("data-count")),
          dp = +el.getAttribute("data-dp"),
          sign = el.getAttribute("data-sign") || "",
          t0 = performance.now();
      (function step(now) {
        var k = Math.min((now - t0) / 800, 1), e = 1 - Math.pow(1 - k, 3);  /* ease out only */
        el.innerHTML = sign + (to * e).toFixed(dp);
        if (k < 1 && running) requestAnimationFrame(step);
      })(t0);
    });
    later(function () { $("[data-var]").classList.add("is-moved"); $("[data-var]").textContent = "2.36%"; }, 900);
  }

  function type() {
    var out = $("[data-typed]"), i = 0;
    (function tick() {
      if (!running) return;
      out.textContent = TYPED.slice(0, ++i);
      /* a beat after the third word, the way a person types */
      if (i < TYPED.length) later(tick, i === 13 ? 320 : 42 + Math.random() * 46);
    })();
  }

  function replay() {
    var head = $("[data-play]"), marks = $$("[data-mk]");
    head.classList.add("is-on");
    var t0 = performance.now(), dur = 3000;
    (function step(now) {
      var k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      head.style.transform = "translateX(" + (e * headSpan()).toFixed(1) + "px)";
      marks.forEach(function (m, i) { m.classList.toggle("is-past", e >= i / (marks.length - 1) - 0.02); });
      if (k < 1 && running) requestAnimationFrame(step);
    })(t0);
  }
  function headSpan() {
    var tl = $(".tp-tl-line");
    return tl ? tl.getBoundingClientRect().width : 0;
  }
  function layoutMarks() {
    var marks = $$("[data-mk]");
    marks.forEach(function (m, i) { m.style.left = (4 + i * (92 / (marks.length - 1))) + "%"; });
  }
  layoutMarks();
  window.addEventListener("resize", layoutMarks, { passive: true });

  /* ---- the loop ---- */
  var CLASSES = ["is-on","is-lit","is-flipped","is-moved","is-drawn","is-hot","is-past"];
  var step = -1, stepAt = 0, raf = 0, running = false, reduced = false, timers = [];

  var CUE_SEL = "[data-fact],[data-dep],[data-toast],[data-br],[data-as],[data-fig],[data-rc]," +
    "[data-opt],[data-rf],[data-mk],[data-lit],[data-flip],[data-down],[data-thr],[data-thrlbl]," +
    "[data-line],[data-dot],[data-dotlbl],[data-field],[data-cur],[data-cur2],[data-play]," +
    "[data-var],[data-hub],[data-edge],[data-link],.tp-prop,.tp-figline,.tp-tlnote,.tp-note";
  var tidyTimer = 0;

  /* Rewind the screens we are NOT on, once the one we just left has finished fading.
     Deliberately skips the live panel: an earlier version cleared everything on a timer
     that also held the incoming panel's own cues, so each screen wiped its own content
     a fraction of a second before it was due to appear. */
  function tidy(keep) {
    $$(CUE_SEL).forEach(function (el) {
      if (keep && keep.contains(el)) return;
      CLASSES.forEach(function (c) { el.classList.remove(c); });
    });
    if (!keep || !keep.contains($("[data-typed]"))) { var ty = $("[data-typed]"); if (ty) ty.textContent = ""; }
    $$("[data-count]").forEach(function (el) {
      if (keep && keep.contains(el)) return;
      el.innerHTML = (0).toFixed(+el.getAttribute("data-dp"));
    });
    var v = $("[data-var]");
    if (v && !(keep && keep.contains(v))) v.textContent = "1.94%";
  }
  function reset() { clearTimeout(tidyTimer); tidy(null); }

  function enter(i) {
    timers.forEach(clearTimeout); timers = [];
    subTimers.forEach(clearTimeout); subTimers = [];
    clearTimeout(tidyTimer);
    var s = SEQ[i], live = panels[s.p];
    panels.forEach(function (p, k) { p.classList.toggle("is-on", k === s.p); });
    tabs.forEach(function (tb, k) { tb.classList.toggle("is-on", k === s.tab); });
    sysEl.textContent = s.sys; msgEl.innerHTML = s.msg; rightEl.textContent = s.right;
    tidy(live);                                    /* start from a clean screen */
    tidyTimer = setTimeout(function () { tidy(live); }, 420);   /* and rewind the one we left */
    s.cues.forEach(function (c) { timers.push(setTimeout(c[1], c[0])); });
    step = i; stepAt = performance.now();
  }

  /* Text is rewritten ten times a second; only transforms run every frame. Writing six
     prices and a clock into the DOM at 60Hz is work nobody can see, and it is the
     difference between this being smooth and it being a tax on the page. */
  var clockT0 = 0, lastText = 0;
  function frame(now) {
    if (!running) return;
    var s = SEQ[step], el = now - stepAt;

    /* every frame: the two things the eye actually tracks */
    progEl.style.transform = "scaleX(" + Math.min(el / (s.ms * 0.72), 1).toFixed(4) + ")";
    if (tapeEl) tapeEl.style.transform =
      "translate3d(" + (-((now - clockT0) / 1000 * 58) % 1400).toFixed(1) + "px,0,0)";

    /* ten times a second: the things you read */
    if (now - lastText > 100) {
      lastText = now;
      /* one second per second, which is the speed clocks run at. It used to advance five
         minutes across one turn of the loop and read as a stopwatch on fast-forward. */
      var secs = 6 * 3600 + 14 * 60 + Math.floor((now - clockT0) / 1000);
      var p2 = function (n) { return String(n).padStart(2, "0"); };
      clockEl.textContent = p2(Math.floor(secs / 3600) % 24) + ":" +
                            p2(Math.floor(secs / 60) % 60) + ":" + p2(secs % 60) + " IST";
      var t = now / 1000;
      for (var i = 0; i < pxEls.length; i++) {
        var base = parseFloat(pxEls[i].getAttribute("data-px"));
        var w = Math.sin(t * 0.9 + i * 2.1) * 0.0009 + Math.sin(t * 0.31 + i) * 0.0005;
        pxEls[i].textContent =
          (base * (1 + w)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
    if (el >= s.ms) enter((step + 1) % SEQ.length);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    var now = performance.now();
    if (!clockT0) clockT0 = now;
    if (step < 0) enter(0); else stepAt = now;
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; cancelAnimationFrame(raf); timers.forEach(clearTimeout); subTimers.forEach(clearTimeout); }

  var mq = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  function applyMotion() {
    reduced = !!(mq && mq.matches);
    if (reduced) {
      stop(); reset();
      panels.forEach(function (p, k) { p.classList.toggle("is-on", k === 0); });
      tabs.forEach(function (tb, k) { tb.classList.toggle("is-on", k === 0); });
      progEl.style.width = "0%";
    } else if (step < 0) {
      panels.forEach(function (p, k) { p.classList.toggle("is-on", k === 0); });
      tabs.forEach(function (tb, k) { tb.classList.toggle("is-on", k === 0); });
    }
  }
  applyMotion();
  if (mq && mq.addEventListener) mq.addEventListener("change", applyMotion);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); },
      { threshold: 0.15 }).observe(root);
  } else { start(); }
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
}

function setupHeroTitle() {
    var el = document.querySelector(".hero-solo-inner h1");
    if (!el) return;
    var spec = el.getAttribute("data-type");
    // "|" marks where the title prefers to break; each part is its own span
    var parts = spec ? spec.split("|") : [(el.textContent || "").trim()];
    if (!parts.join(" ").trim()) return;

    el.textContent = "";
    var last = null;
    parts.forEach(function (part, idx) {
      // a real space, not a ::before one: the pseudo-element drew the gap but
      // left the accessible text and any copied selection reading "turnsinformation"
      if (idx) el.appendChild(document.createTextNode(" "));
      var line = document.createElement("span");
      line.className = "type-line";
      line.textContent = part;
      el.appendChild(line);
      last = line;
    });

    var caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");
    if (last) last.appendChild(caret);

    // both classes are what the hero's type rules key off
    el.classList.add("is-typing", "type-done");
  }

  function setupHeader() {
    var header = document.querySelector("[data-hdr]");
    if (!header) return;
    var ticking = false;
    /* The header is "stuck" once whatever sits above it has scrolled past --
       the top strip when there is one, otherwise a short nominal distance. */
    var strip = document.querySelector(".topbar");
    function trigger() {
      return strip ? Math.max(strip.offsetHeight - 1, 1) : 40;
    }
    function update() {
      header.classList.toggle("is-stuck", window.scrollY > trigger());
      ticking = false;
    }
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     The menu is a screen of its own. Opening it pins the body at the
     current offset rather than just hiding overflow, because iOS ignores
     overflow: hidden on body; closing restores the exact offset. A history
     entry is pushed so the hardware back button closes the menu instead of
     leaving the page.
     ------------------------------------------------------------------ */
  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-menu]");
    if (!toggle || !menu) return;

    var open = false;
    var savedY = 0;

    function lock() {
      savedY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = "fixed";
      document.body.style.top = -savedY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

    function unlock() {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      // The page sets scroll-behavior: smooth, which would animate this and
      // land short. Restore instantly, then confirm on the next frame once the
      // document has its full height back.
      var jump = function () {
        try { window.scrollTo({ top: savedY, left: 0, behavior: "instant" }); }
        catch (err) { window.scrollTo(0, savedY); }
      };
      jump();
      window.requestAnimationFrame(jump);
    }

    function setOpen(next, fromHistory) {
      if (next === open) return;
      open = next;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        menu.hidden = false;
        lock();
        if (!fromHistory && window.history && window.history.pushState) {
          window.history.pushState({ menu: true }, "");
        }
      } else {
        menu.hidden = true;
        unlock();
        if (!fromHistory && window.history && window.history.state &&
            window.history.state.menu) {
          window.history.back();
        }
      }
    }

    toggle.addEventListener("click", function () { setOpen(!open); });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && open) setOpen(false);
    });

    window.addEventListener("popstate", function () {
      if (open) setOpen(false, true);
    });

    window.addEventListener("resize", function () {
      if (open && window.innerWidth >= 1024) setOpen(false);
    });
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
    var targets = Array.prototype.slice.call(document.querySelectorAll("[data-monthly]"));

    function apply(mode) {
      buttons.forEach(function (button) {
        button.classList.toggle("is-active", button.getAttribute("data-billing") === mode);
      });

      targets.forEach(function (el) {
        var value = el.getAttribute("data-" + mode);
        if (value === null) return;

        if (el.classList.contains("price-note")) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        apply(button.getAttribute("data-billing"));
      });
    });

    apply("monthly");
  }

  /* ------------------------------------------------------------------
     Live status clock — ticking "we are live" indicator (IST)
     ------------------------------------------------------------------ */
  function setupLiveClock() {
    var clocks = Array.prototype.slice.call(document.querySelectorAll("[data-live-clock]"));
    if (!clocks.length) return;

    function pad(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function istNow() {
      try {
        return new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      } catch (err) {
        // fallback: UTC + 5:30
        var d = new Date(Date.now() + (5 * 60 + 30) * 60000);
        return pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
      }
    }

    function tick() {
      var value = istNow();
      clocks.forEach(function (el) {
        el.textContent = value;
      });
    }

    tick();
    window.setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     Copy-to-clipboard buttons
     ------------------------------------------------------------------ */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error("copy-failed"));
    });
  }

  function flashCopied(btn, label) {
    if (!btn.dataset.originalLabel) btn.dataset.originalLabel = btn.textContent;
    btn.classList.add("is-copied");
    btn.textContent = label || "Copied";
    window.setTimeout(function () {
      btn.classList.remove("is-copied");
      btn.textContent = btn.dataset.originalLabel;
    }, 1800);
  }

  function setupCopyButtons() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-copy-trigger]"));
    if (!triggers.length) return;

    triggers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var host = btn.parentElement || document;
        var source = host.querySelector("[data-copy-value]") || document.querySelector("[data-copy-value]");
        if (!source) return;
        var value = source.getAttribute("data-copy-value") || source.textContent;
        copyText(value).then(
          function () {
            flashCopied(btn, "Copied");
          },
          function () {
            flashCopied(btn, "Select it");
          }
        );
      });
    });
  }

  /* ------------------------------------------------------------------
     Application form — validation + mailto composition
     ------------------------------------------------------------------ */
  var APPLY_MAILBOX = "careers@quantifyterminal.com";

  // Conservative ceiling: a few mail clients truncate mailto links past ~2000
  // chars, and Gmail rejects very long compose URLs outright.
  var SAFE_MAILTO_LENGTH = 1900;

  function plainTextFor(application) {
    return "To: " + APPLY_MAILBOX + "\nSubject: " + application.subject + "\n\n" + application.body;
  }

  // Compose links for the mail routes people actually have. Desktop clients get
  // mailto:; the webmail ones exist so that "no mail app configured" is never a
  // dead end. Gmail uses su= for the subject, the others use subject=.
  function composeLinks(application) {
    var to = encodeURIComponent(APPLY_MAILBOX);
    var subject = encodeURIComponent(application.subject);
    var body = encodeURIComponent(application.body.replace(/\n/g, "\r\n"));

    return {
      mailto: "mailto:" + APPLY_MAILBOX + "?subject=" + subject + "&body=" + body,
      gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=" + to + "&su=" + subject + "&body=" + body,
      outlook: "https://outlook.live.com/mail/0/deeplink/compose?to=" + to + "&subject=" + subject + "&body=" + body,
      yahoo: "https://compose.mail.yahoo.com/?to=" + to + "&subject=" + subject + "&body=" + body
    };
  }

  var APPLY_MESSAGES = {
    name: "Please add your full name.",
    email: "Please add an email address we can reply to.",
    location: "Please add your city and country.",
    track: "Please choose the field you want to work in.",
    experience: "Please choose your experience level.",
    skills: "Please list a few core skills.",
    project: "Please describe one project you have shipped.",
    start: "Please pick your earliest start date.",
    note: "Please tell us why Quantify Terminal.",
    consent: "Please confirm this before sending."
  };

  // The listings on /careers deep-link in as /application?role=<slug>. The form
  // does not ask for the role again; it is read from the URL so the email still
  // names the exact listing, and the matching field is preselected.
  var ROLE_LISTINGS = {
    "python-backtester-engineer": { label: "Python Backtester Engineer", track: "Software engineering" },
    "quant-researcher": { label: "Quant Researcher", track: "Quantitative research" },
    "ml-engineer": { label: "ML Engineer", track: "Machine learning and AI" },
    "frontend-engineer": { label: "Frontend Engineer", track: "Frontend and design" },
    "data-engineer": { label: "Data Engineer", track: "Data engineering" },
    "sales-intern": { label: "Sales Intern", track: "Sales and business development" },
    "marketing-intern": { label: "Marketing Intern", track: "Marketing and growth" },
    "content-writer": { label: "Content Writer", track: "Content and research writing" },
    "qa-engineer": { label: "QA Engineer", track: "Quality and testing" }
  };

  function queryParam(name) {
    var match = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function normalizeLink(value) {
    if (!value) return "";
    return /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : "https://" + value;
  }

  function selectedLabel(select) {
    if (!select || select.selectedIndex < 0) return "";
    var option = select.options[select.selectedIndex];
    return option && option.value !== "" ? option.text : "";
  }

  function setupApplyForm() {
    var form = document.querySelector("[data-apply-form]");
    if (!form) return;

    var feedback = form.querySelector("[data-feedback]");
    var feedbackText = form.querySelector("[data-feedback-text]");
    var roleField = form.querySelector("[data-role-from-url]");
    var trackSelect = form.elements.track;

    function fieldWrap(control) {
      return control.closest(".field");
    }

    function clearError(control) {
      var wrap = fieldWrap(control);
      if (!wrap) return;
      wrap.classList.remove("has-error");
      var slot = wrap.querySelector("[data-error]");
      if (slot) slot.textContent = "";
      control.removeAttribute("aria-invalid");
    }

    function showError(control, message) {
      var wrap = fieldWrap(control);
      if (!wrap) return;
      wrap.classList.add("has-error");
      var slot = wrap.querySelector("[data-error]");
      if (slot) slot.textContent = message;
      control.setAttribute("aria-invalid", "true");
    }

    function showFeedback(message, isError) {
      if (!feedback || !feedbackText) return;
      feedbackText.innerHTML = message;
      feedback.classList.toggle("is-error", !!isError);
      feedback.classList.add("is-visible");
    }

    function hideFeedback() {
      if (!feedback) return;
      feedback.classList.remove("is-visible", "is-error");
    }

    /* --- read the listing from ?role= and preselect its field --- */
    function applyRolePrefill() {
      var listing = ROLE_LISTINGS[queryParam("role")];
      if (!listing) return;

      if (roleField) roleField.value = listing.label;

      if (trackSelect && !trackSelect.value) {
        var i;
        for (i = 0; i < trackSelect.options.length; i++) {
          if (trackSelect.options[i].text === listing.track) {
            trackSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    applyRolePrefill();

    /* --- prefill: time zone + earliest selectable start date --- */
    var tzField = form.querySelector("[data-fill-timezone]");
    if (tzField && !tzField.value) {
      try {
        tzField.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch (err) {
        /* leave it blank */
      }
    }

    var startField = form.elements.start;
    if (startField && !startField.getAttribute("min")) {
      var today = new Date();
      var iso =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1 < 10 ? "0" : "") +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() < 10 ? "0" : "") +
        today.getDate();
      startField.setAttribute("min", iso);
    }

    /* --- live character counters --- */
    Array.prototype.slice.call(form.querySelectorAll("[data-count-for]")).forEach(function (counter) {
      var target = document.getElementById(counter.getAttribute("data-count-for"));
      if (!target) return;
      var max = target.getAttribute("maxlength") || "";
      function render() {
        counter.textContent = target.value.length + " / " + max;
      }
      target.addEventListener("input", render);
      render();
    });

    /* --- clear a field's error as soon as it is touched --- */
    Array.prototype.slice.call(form.querySelectorAll("input, select, textarea")).forEach(function (control) {
      var event = control.type === "checkbox" || control.tagName === "SELECT" ? "change" : "input";
      control.addEventListener(event, function () {
        clearError(control);
      });
    });

    function validate() {
      var invalid = [];

      Array.prototype.slice.call(form.querySelectorAll("[required]")).forEach(function (control) {
        var name = control.getAttribute("name");
        var message = APPLY_MESSAGES[name] || "This field is required.";
        var empty =
          control.type === "checkbox" ? !control.checked : String(control.value || "").trim() === "";
        if (empty) {
          showError(control, message);
          invalid.push(control);
        } else {
          clearError(control);
        }
      });

      var email = form.elements.email;
      if (email && String(email.value).trim() !== "" && !isEmail(String(email.value).trim())) {
        showError(email, "That email does not look right. Check it once.");
        if (invalid.indexOf(email) === -1) invalid.push(email);
      }

      return invalid;
    }

    function buildApplication() {
      function value(name) {
        var control = form.elements[name];
        if (!control) return "";
        return String(control.value || "").trim();
      }

      var lines = [];

      function add(label, text) {
        if (!text) return;
        lines.push(label + ": " + text);
      }

      function block(title) {
        if (lines.length) lines.push("");
        lines.push(title);
      }

      var listing = roleField ? String(roleField.value || "").trim() : "";
      var field = selectedLabel(trackSelect);
      var name = value("name");

      lines.push("QUANTIFY TERMINAL - INTERNSHIP APPLICATION");

      block("ROLE");
      add("Applied via listing", listing);
      add("Field", field);
      add("Experience level", selectedLabel(form.elements.experience));

      block("ABOUT");
      add("Name", name);
      add("Email", value("email"));
      add("Phone", value("phone"));
      add("Location", value("location"));
      add("Time zone", value("timezone"));
      add("LinkedIn", normalizeLink(value("linkedin")));
      add("GitHub or portfolio", normalizeLink(value("portfolio")));

      block("SKILLS");
      add("Core skills", value("skills"));
      add("Tools and libraries", value("tools"));
      if (value("project")) {
        lines.push("Project highlight:");
        lines.push(value("project"));
      }

      block("AVAILABILITY");
      add("Earliest start date", value("start"));

      if (value("note")) {
        block("WHY QUANTIFY TERMINAL");
        lines.push(value("note"));
      }

      var source = selectedLabel(form.elements.source);
      if (source) {
        block("OTHER");
        add("Heard about us via", source);
      }

      lines.push("");
      lines.push("Sent from quantifyterminal.com/application");
      lines.push("CV attached to this email.");

      return {
        subject: "Internship Application - " + (listing || field || "General") + (name ? " - " + name : ""),
        body: lines.join("\n")
      };
    }

    /* ----------------------------------------------------------------
       Send modal — pick a mail route once the form is valid
       ---------------------------------------------------------------- */
    var modal = document.querySelector("[data-send-modal]");
    var modalPanel = modal ? modal.querySelector(".send-modal-panel") : null;
    var modalNote = modal ? modal.querySelector("[data-send-note]") : null;
    var returnFocusTo = null;

    function setNote(html) {
      if (!modalNote) return;
      if (!html) {
        modalNote.setAttribute("hidden", "");
        modalNote.innerHTML = "";
        return;
      }
      modalNote.innerHTML = html;
      modalNote.removeAttribute("hidden");
    }

    function modalFocusables() {
      if (!modal) return [];
      return Array.prototype.slice
        .call(modal.querySelectorAll("a[href], button:not([disabled])"))
        .filter(function (el) {
          return el.offsetParent !== null || el === document.activeElement;
        });
    }

    function closeModal() {
      if (!modal || modal.hasAttribute("hidden")) return;
      modal.setAttribute("hidden", "");
      document.body.classList.remove("menu-open");
      if (returnFocusTo && returnFocusTo.focus) returnFocusTo.focus();
      returnFocusTo = null;
    }

    function openModal(application) {
      if (!modal) return;

      var links = composeLinks(application);
      var map = {
        "[data-send-mailto]": links.mailto,
        "[data-send-gmail]": links.gmail,
        "[data-send-outlook]": links.outlook,
        "[data-send-yahoo]": links.yahoo
      };
      Object.keys(map).forEach(function (sel) {
        var el = modal.querySelector(sel);
        if (el) el.setAttribute("href", map[sel]);
      });

      setNote("");

      // A long application can exceed what mailto and Gmail will carry, so put
      // the full text on the clipboard up front and say so.
      if (links.mailto.length > SAFE_MAILTO_LENGTH) {
        copyText(plainTextFor(application)).then(
          function () {
            setNote(
              "<strong>Long application.</strong> Some mail apps trim a draft this size, so we copied the full text to your clipboard too. " +
                "If the draft looks short, clear the message body and paste."
            );
          },
          function () {
            setNote(
              "<strong>Long application.</strong> Some mail apps trim a draft this size. Check the draft kept everything before you send."
            );
          }
        );
      }

      returnFocusTo = document.activeElement;
      modal.removeAttribute("hidden");
      document.body.classList.add("menu-open");
      if (modalPanel) modalPanel.focus();
    }

    if (modal) {
      Array.prototype.slice.call(modal.querySelectorAll("[data-send-close]")).forEach(function (el) {
        el.addEventListener("click", closeModal);
      });

      // Keep the modal open after a route is picked. If that provider turns out
      // to be the wrong one, the others are still one click away.
      Array.prototype.slice.call(modal.querySelectorAll("[data-send-provider]")).forEach(function (el) {
        el.addEventListener("click", function () {
          setNote(
            "<strong>" +
              el.getAttribute("data-send-provider") +
              " opened in a new tab.</strong> Attach your CV there, then send. Nothing happened? Try another option above."
          );
        });
      });

      var mailtoBtn = modal.querySelector("[data-send-mailto]");
      if (mailtoBtn) {
        mailtoBtn.addEventListener("click", function () {
          setNote(
            "<strong>Opening your mail app.</strong> Attach your CV in the draft, then send. " +
              "If nothing opened, you probably have no mail app set up, so use Gmail, Outlook, or Yahoo above."
          );
        });
      }

      // Esc lives on the document: clicking the scrim moves focus off the
      // panel, and a keydown bound to the modal would never fire after that.
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hasAttribute("hidden")) closeModal();
      });

      modal.addEventListener("keydown", function (event) {
        if (event.key !== "Tab") return;

        var items = modalFocusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && (document.activeElement === first || document.activeElement === modalPanel)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var invalid = validate();
      if (invalid.length) {
        showFeedback(
          "<strong>Almost there.</strong> " +
            invalid.length +
            (invalid.length === 1 ? " field needs" : " fields need") +
            " attention before this can be sent. They are marked in red above.",
          true
        );
        invalid[0].focus();
        if (invalid[0].scrollIntoView) {
          invalid[0].scrollIntoView({ block: "center", behavior: "smooth" });
        }
        return;
      }

      hideFeedback();
      openModal(buildApplication());
    });

    /* --- "Copy as text", in the form footer and inside the modal --- */
    Array.prototype.slice.call(document.querySelectorAll("[data-copy-application]")).forEach(function (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var inModal = modal && modal.contains(copyBtn);
        copyText(plainTextFor(buildApplication())).then(
          function () {
            flashCopied(copyBtn, "Copied");
            if (inModal) {
              setNote(
                "<strong>Copied.</strong> Paste it into a new email to " + APPLY_MAILBOX + ", attach your CV, and send."
              );
            } else {
              showFeedback(
                "<strong>Copied.</strong> Paste it into a new email to " +
                  APPLY_MAILBOX +
                  ", attach your CV, and send.",
                false
              );
            }
          },
          function () {
            var message =
              "<strong>Could not reach your clipboard.</strong> Email your application and CV straight to " +
              APPLY_MAILBOX +
              " instead.";
            inModal ? setNote(message) : showFeedback(message, true);
          }
        );
      });
    });
  }

  /* ------------------------------------------------------------------
     Early access — four fields on /download. Validated here, then handed
     to the visitor's mail client, with a copy-as-text route for anyone
     whose browser has no mail handler.
     ------------------------------------------------------------------ */
  /* The early access request. Every field is read off the form itself, so the
     email that gets composed follows the markup: add a field to the page and
     it appears in the message, in the order it is asked. */
  function setupEarlyAccessForm() {
    var form = document.querySelector("[data-early-form]");
    if (!form) return;

    var MAILBOX = "sales@mail.quantifyterminal.com";
    var feedback = form.querySelector("[data-ea-feedback]");
    var feedbackText = form.querySelector("[data-ea-feedback-text]");

    function controls() {
      return Array.prototype.slice
        .call(form.querySelectorAll("input[name], select[name], textarea[name]"))
        .filter(function (control) { return control.type !== "hidden"; });
    }

    function labelFor(control) {
      if (control.getAttribute("data-label")) return control.getAttribute("data-label");
      var wrap = control.closest(".field");
      var label = wrap && wrap.querySelector("label");
      if (!label) return control.name;
      // strip the "*" and the "Optional" chip out of the visible label
      return label.textContent.replace(/[*]|Optional/g, "").replace(/\s+/g, " ").trim();
    }

    function setError(control, message) {
      var wrap = control.closest(".field");
      if (!wrap) return;
      var slot = wrap.querySelector("[data-error]");
      wrap.classList.toggle("has-error", !!message);
      if (slot) slot.textContent = message || "";
      if (message) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    }

    function say(message, isError) {
      if (!feedback) return;
      if (feedbackText) feedbackText.textContent = message;
      feedback.classList.add("is-visible");
      feedback.classList.toggle("is-error", !!isError);
    }

    controls().forEach(function (control) {
      var event = control.tagName === "SELECT" ? "change" : "input";
      control.addEventListener(event, function () { setError(control, ""); });
    });

    function validate() {
      var first = null;
      controls().forEach(function (control) {
        var value = String(control.value || "").trim();
        var message = "";
        if (control.hasAttribute("required") && !value) message = "This one is required.";
        else if (value && control.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          message = "That email does not look right. Check it once.";
        }
        setError(control, message);
        if (message && !first) first = control;
      });
      if (first) first.focus();
      return !first;
    }

    function compose() {
      var lines = ["QUANTIFY TERMINAL - EARLY ACCESS REQUEST", ""];
      controls().forEach(function (control) {
        var value = String(control.value || "").trim();
        if (!value) return;
        // a label that already ends in "?" does not want a colon after it
        var label = labelFor(control);
        var colon = /[?:]$/.test(label) ? "" : ":";
        if (control.tagName === "TEXTAREA" || value.length > 60) {
          lines.push(label + colon);
          lines.push(value);
          lines.push("");
        } else {
          lines.push(label + colon + " " + value);
        }
      });
      lines.push("");
      lines.push("Sent from quantifyterminal.com/early-access");
      return lines.join("\n");
    }

    function subject() {
      var name = form.elements.name;
      var who = name ? String(name.value || "").trim() : "";
      return "Early access \u2014 Quantify Terminal" + (who ? " \u2014 " + who : "");
    }

    function copyText(text, onDone) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onDone, function () { legacyCopy(text, onDone); });
      } else {
        legacyCopy(text, onDone);
      }
    }

    function legacyCopy(text, onDone) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(area);
      if (ok) onDone();
      else say("Copying is blocked here. Write to " + MAILBOX + " instead.", true);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validate()) {
        say("One of the fields still needs you.", true);
        return;
      }
      window.location.href = "mailto:" + MAILBOX +
        "?subject=" + encodeURIComponent(subject()) +
        "&body=" + encodeURIComponent(compose());
      say("Your mail client is opening with the request written out. Send it and we will " +
          "come back to you. If nothing opened, use Copy as text and send it to " + MAILBOX + ".");
    });

    var copyBtn = form.querySelector("[data-ea-copy]");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!validate()) { say("Fill the form first, then copy.", true); return; }
        copyText(compose(), function () { say("Copied. Send it to " + MAILBOX + "."); });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    setActiveNav();
    setupHeader();
    setupDocsNav();
    setupMenu();
    setupReveal();
    setupHeroTitle();
    setupFilm();
    setupLiveTerminal();
    setupLightbox();
    setupDownloadButtons();
    setupPricingToggle();
    setupLiveClock();
    setupCopyButtons();
    setupApplyForm();
    setupEarlyAccessForm();
  });
})();
