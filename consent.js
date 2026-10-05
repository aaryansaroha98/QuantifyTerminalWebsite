/* Cookie consent for quantifyterminal.com.
 *
 * The site works without cookies. The only optional ones are Google Analytics', and no page
 * carries the Google tag by itself: this file asks the question, records the answer in the
 * browser, and adds the tag only once Analytics is accepted, so nothing is requested from
 * Google before then. Refusing switches it off and removes its cookies.
 *
 * The choice lives in localStorage under qt-consent as {"v":1,"analytics":bool,"at":ISO}. A
 * "Cookie settings" link anywhere on a page (data-cookie-settings) reopens the choice.
 */
(function () {
  "use strict";

  var KEY = "qt-consent";
  var VERSION = 1;
  var MAX_AGE_MS = 183 * 24 * 60 * 60 * 1000;

  function readChoice() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== VERSION) return null;
      /* A choice is kept six months, then asked again. */
      var age = Date.now() - Date.parse(parsed.at);
      return age >= 0 && age < MAX_AGE_MS ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function saveChoice(analytics) {
    var choice = { v: VERSION, analytics: !!analytics, at: new Date().toISOString() };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(choice));
    } catch (e) {
      /* Private windows can refuse storage; the choice still applies to this page. */
    }
    return choice;
  }

  var ANALYTICS_ID = "G-DLHEB50F0J";
  var analyticsLoaded = false;

  /* Google Analytics is not on the page until it is accepted: no request goes to Google
     before then. It loads with Google signals and ad personalisation off; advertising
     storage is never granted. */
  function loadAnalytics() {
    window["ga-disable-" + ANALYTICS_ID] = false;
    var settings = {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    };
    if (analyticsLoaded) {
      window.gtag("consent", "update", { analytics_storage: "granted" });
      window.gtag("config", ANALYTICS_ID, settings);
      return;
    }
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "granted"
    });
    window.gtag("js", new Date());
    window.gtag("config", ANALYTICS_ID, settings);
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + ANALYTICS_ID;
    document.head.appendChild(script);
  }

  /* Remove Analytics' cookies (_ga, _ga_<id>, and the older _gid/_gat) from this host and
     every parent domain they may have been written to. */
  function clearAnalyticsCookies() {
    var names = document.cookie.split(";").map(function (part) {
      return part.split("=")[0].trim();
    }).filter(function (name) {
      return /^_ga(_|$)|^_gid$|^_gat/.test(name);
    });
    if (!names.length) return;
    var labels = window.location.hostname.split(".");
    var scopes = [""];
    for (var i = 0; i < labels.length - 1; i++) {
      var domain = labels.slice(i).join(".");
      scopes.push("; domain=" + domain, "; domain=." + domain);
    }
    names.forEach(function (name) {
      scopes.forEach(function (scope) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + scope;
      });
    });
  }

  function stopAnalytics() {
    window["ga-disable-" + ANALYTICS_ID] = true;
    if (analyticsLoaded && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
    clearAnalyticsCookies();
  }

  function apply(choice) {
    if (choice.analytics) loadAnalytics();
    else stopAnalytics();
  }

  /* A page that must never load analytics or store anything says so in its head with
     <meta name="qt-analytics" content="never">; nothing here runs on it. */
  function analyticsNever() {
    var meta = document.querySelector('meta[name="qt-analytics"]');
    return !!meta && String(meta.getAttribute("content") || "").trim() === "never";
  }

  var CSS = [
    ".qtc{position:fixed;right:24px;bottom:24px;z-index:2147483000;box-sizing:border-box;width:min(560px,calc(100vw - 48px));",
    "padding:24px 26px 22px;border:1px solid #2b2b2b;border-radius:16px;background:#0b0b0b;color:#a3a3a3;",
    "font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Inter,Arial,sans-serif;",
    "font-size:15px;line-height:1.6;box-shadow:0 18px 48px rgba(0,0,0,.28);-webkit-font-smoothing:antialiased}",
    ".qtc[hidden]{display:none}",
    ".qtc *{box-sizing:border-box}",
    ".qtc p{color:#a3a3a3;font-size:inherit;line-height:1.6}.qtc .qtc-text{margin:0;padding-right:28px}",
    ".qtc a{color:#fff !important;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}",
    ".qtc a:hover{text-decoration-thickness:2px}",
    ".qtc-x{position:absolute;top:16px;right:16px;display:inline-flex;align-items:center;justify-content:center;",
    "width:32px;height:32px;padding:0;border:0;border-radius:50%;background:transparent;color:#8a8a8a;font:inherit;",
    "font-size:20px;line-height:1;cursor:pointer}",
    ".qtc-x:hover{color:#fff;background:#1b1b1b}",
    ".qtc-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:18px}",
    ".qtc-end{display:flex;flex-wrap:wrap;gap:10px}",
    ".qtc-row.qtc-row-end{justify-content:flex-end;gap:10px}",
    ".qtc-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;",
    "border:1px solid #fff;border-radius:999px;background:#fff;color:#0b0b0b;font:inherit;font-size:15px;",
    "font-weight:550;letter-spacing:0;line-height:1;cursor:pointer;white-space:nowrap}",
    ".qtc-btn:hover{background:#e6e6e6;border-color:#e6e6e6}",
    ".qtc-btn.ghost{border-color:#3a3a3a;background:transparent;color:#fff}",
    ".qtc-btn.ghost:hover{border-color:#fff;background:transparent}",
    ".qtc-btn:focus-visible,.qtc-x:focus-visible,.qtc a:focus-visible,.qtc-switch input:focus-visible+span{",
    "outline:2px solid #9810fa;outline-offset:3px}",
    ".qtc .qtc-title{margin:0 0 4px;color:#fff;font-size:17px;font-weight:600;line-height:1.3;padding-right:28px}",
    ".qtc-list{list-style:none;margin:14px 0 0;padding:0}",
    ".qtc-list li{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:14px 0;",
    "border-top:1px solid #222}",
    ".qtc-list li:last-child{border-bottom:1px solid #222}",
    ".qtc .qtc-list b{display:block;color:#fff;font-weight:600}",
    ".qtc .qtc-list small{display:block;margin-top:2px;color:#9a9a9a;font-size:13.5px;line-height:1.5}",
    ".qtc-always{flex:0 0 auto;padding-top:2px;color:#fff;font-size:13px;font-weight:600;white-space:nowrap}",
    ".qtc-switch{position:relative;flex:0 0 auto;display:inline-block;width:46px;height:26px;margin-top:2px}",
    ".qtc-switch input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}",
    ".qtc-switch span{position:absolute;inset:0;border:1px solid #3a3a3a;border-radius:999px;background:#1b1b1b;",
    "pointer-events:none}",
    ".qtc-switch span::after{content:\"\";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;",
    "background:#8a8a8a}",
    ".qtc-switch input:checked+span{border-color:#fff;background:#fff}",
    ".qtc-switch input:checked+span::after{left:23px;background:#0b0b0b}",
    "@media (max-width:560px){.qtc{right:12px;bottom:12px;width:calc(100vw - 24px);padding:20px 18px 18px;font-size:14px}",
    ".qtc-row{flex-direction:column-reverse;align-items:stretch}.qtc-end{display:grid;grid-template-columns:1fr 1fr}",
    ".qtc-btn{width:100%;padding:0 14px;font-size:14px}",
    ".qtc-row.qtc-row-end{display:grid;grid-template-columns:1fr 1fr}.qtc-row-end .qtc-btn:first-child{grid-column:1/-1;order:3}}",
    "@media print{.qtc{display:none}}"
  ].join("");

  var POLICY = '<a href="/privacy#cookies">Privacy Policy</a>';

  var NOTICE =
    '<button type="button" class="qtc-x" data-qtc="close" aria-label="Close and reject analytics">&times;</button>' +
    '<p class="qtc-text">Nothing on this site needs cookies. If you allow it, Google Analytics sets cookies ' +
    "that show us which pages are read. Google processes the data, including in the US. Closing this " +
    "message rejects them; change your mind any time in Cookie settings. " + POLICY + ".</p>" +
    '<div class="qtc-row">' +
    '<button type="button" class="qtc-btn ghost" data-qtc="settings">Cookie settings</button>' +
    '<div class="qtc-end">' +
    '<button type="button" class="qtc-btn" data-qtc="reject">Reject analytics</button>' +
    '<button type="button" class="qtc-btn" data-qtc="accept">Accept analytics</button>' +
    "</div></div>";

  function settingsHTML(analyticsOn) {
    return (
      '<button type="button" class="qtc-x" data-qtc="close" aria-label="Close">&times;</button>' +
      '<p class="qtc-title" id="qtc-title">Cookie settings</p>' +
      '<p class="qtc-text">One optional service runs on this site. Your answer is kept in this browser for ' +
      "six months; change it here any time. " + POLICY + ".</p>" +
      '<ul class="qtc-list">' +
      "<li><div><b>Your choice</b><small>Remembers your answer so we do not ask on every page. Saved in " +
      "your browser&rsquo;s local storage, not a cookie, and never sent to us or anyone else. Kept six " +
      "months.</small></div><span class=\"qtc-always\">Always on</span></li>" +
      "<li><div><b>Analytics</b><small>Which pages are visited, for how long, and where visitors come " +
      "from: a random ID, the pages, the referring site, browser, device type and approximate country. " +
      "Provider: Google LLC. Cookies: <code>_ga</code> and <code>_ga_DLHEB50F0J</code>, kept two " +
      "years.</small></div>" +
      '<label class="qtc-switch"><input type="checkbox" data-qtc="analytics" aria-label="Analytics cookies"' +
      (analyticsOn ? " checked" : "") + "><span></span></label></li>" +
      "</ul>" +
      '<div class="qtc-row qtc-row-end">' +
      '<button type="button" class="qtc-btn" data-qtc="reject">Reject all</button>' +
      '<button type="button" class="qtc-btn" data-qtc="save">Save choices</button>' +
      '<button type="button" class="qtc-btn" data-qtc="accept">Accept all</button>' +
      "</div>"
    );
  }

  var box = null;
  var mode = "notice";

  function ensureBox() {
    if (box) return box;
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    box = document.createElement("div");
    box.className = "qtc";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-live", "polite");
    box.hidden = true;
    box.addEventListener("click", onClick);
    box.addEventListener("keydown", function (event) {
      if (event.key === "Escape") onAction("close");
    });
    document.body.appendChild(box);
    return box;
  }

  function show(view) {
    ensureBox();
    mode = view;
    var current = readChoice();
    if (view === "settings") {
      box.innerHTML = settingsHTML(current ? current.analytics : false);
      box.setAttribute("aria-labelledby", "qtc-title");
      box.removeAttribute("aria-label");
    } else {
      box.innerHTML = NOTICE;
      box.removeAttribute("aria-labelledby");
      box.setAttribute("aria-label", "Cookie consent");
    }
    box.hidden = false;
  }

  function hide() {
    if (box) box.hidden = true;
  }

  function decide(analytics) {
    apply(saveChoice(analytics));
    hide();
  }

  function onAction(action) {
    if (action === "accept") return decide(true);
    if (action === "reject") return decide(false);
    if (action === "settings") {
      show("settings");
      var first = box.querySelector("[data-qtc='analytics']");
      if (first) first.focus();
      return;
    }
    if (action === "save") {
      var toggle = box.querySelector("[data-qtc='analytics']");
      return decide(!!(toggle && toggle.checked));
    }
    if (action === "close") {
      /* Closing the first notice is a refusal; closing settings after a choice keeps it. */
      if (mode === "notice" || !readChoice()) return decide(false);
      return hide();
    }
  }

  function onClick(event) {
    var target = event.target.closest ? event.target.closest("[data-qtc]") : null;
    if (!target || target.getAttribute("data-qtc") === "analytics") return;
    event.preventDefault();
    onAction(target.getAttribute("data-qtc"));
  }

  function init() {
    if (analyticsNever()) return;
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest("[data-cookie-settings]") : null;
      if (!link) return;
      event.preventDefault();
      show("settings");
    });
    var choice = readChoice();
    if (choice) {
      apply(choice);
      return;
    }
    show("notice");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
