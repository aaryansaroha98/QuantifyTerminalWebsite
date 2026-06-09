# Mockup & Hero Layout Plan

## Goals (from request)
1. Homepage hero: the iMac mockup sits too low — pull it up so it's right under
   the subtitle/buttons (remove the big empty gap).
2. Homepage hero: make the iMac mockup **bigger on desktop**, keep **mobile the
   same size**.
3. Features page: the first/hero image currently sits inside a custom bordered
   `.device-frame`. Replace it with the new MacBook image the user added to
   `/Public` (which already has the dashboard screenshot composited into the
   screen, transparent background, no border).
4. The MacBook-image swap is **only** for the features page hero image — every
   other image on the site stays unchanged.

## Asset
- Source added by user: `Public/Screenshot 2026-04-11 at 11.11.35 PM-front.png`
  (4340x2860, transparent PNG, MacBook + screenshot baked in, ~3.5MB).
- Optimized copy created: `Public/mac-mockup.png` (2200x1449, ~1.2MB) — this is
  what the page will load.

## Changes

### A. Homepage hero (index.html — no markup change needed)
Order stays: eyebrow → h1 → subtitle → buttons → mockup.
Only spacing + size change in CSS.

### B. style.css — homepage `.hero-mockup`
- Desktop: width `min(1120px, 94vw)` → `min(1320px, 96vw)` (bigger).
- Pull up: `.hero .hero-mockup` margin-top `52px` → `24px`.
- Slightly tighten hero bottom padding so the page doesn't get too tall.
- Mobile (`max-width: 1040px`): keep `.hero-mockup` `max-width: 360px` and
  `margin-top` ~18px UNCHANGED so mobile size is identical to now.

### C. features.html — hero image only
Replace:
```
<div class="device-frame reveal">
  <img class="screen-shot" src="/Public/qt_images/optimized/image_33.jpg" ...>
  <div class="device-foot"></div>
</div>
```
with:
```
<div class="mac-shot reveal">
  <img src="/Public/mac-mockup.png" alt="Quantify Terminal command dashboard
       running on a MacBook" width="2200" height="1449" fetchpriority="high">
</div>
```

### D. style.css — new `.mac-shot` class (used only on features hero)
- Block, centered, width `min(1080px, 94vw)`.
- Transparent, no border, no padding (the PNG is already a finished mockup).
- Soft drop-shadow via `filter: drop-shadow(...)` so the laptop floats nicely.
- Subtle hover lift to match the rest of the site's motion.
- Mobile: width 100%, smaller shadow.

## Safety / scope
- No other module images touched.
- Keep the original full-res PNG in repo; load the optimized one.
- Verify CSS braces balance and HTML validity before committing.
- Commit + push at the end.
