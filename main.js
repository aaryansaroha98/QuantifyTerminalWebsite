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
    setupLiveClock();
    setupCopyButtons();
    setupApplyForm();
  });
})();
