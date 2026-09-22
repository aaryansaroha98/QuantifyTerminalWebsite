#!/usr/bin/env python3
"""Generate sitemap.xml from the page list below.

The sitemap is generated rather than hand-edited so that renaming a page, or
adding one, cannot leave the index quietly disagreeing with the site. Run from
the repo root:  python3 tools/build-sitemap.py

lastmod comes from the last commit that actually touched each file, not from
whenever somebody last edited the line, so the dates are true.

To drop a page from the sitemap, delete its row. That stops it being submitted;
it does not deindex it, and it does not stop it being crawled — for that the
page itself needs a noindex.
"""
import subprocess, os, sys, datetime

BASE = "https://www.quantifyterminal.com"

#      slug                 changefreq  priority
PAGES = [
    ("index",              "weekly",  "1.0"),
    ("product",            "monthly", "0.9"),
    ("early-access",       "monthly", "0.8"),
    ("vision",             "monthly", "0.8"),
    ("pricing",            "monthly", "0.8"),
    ("accuracy",           "weekly",  "0.7"),
    ("agents",             "monthly", "0.7"),
    ("data-rights",        "monthly", "0.7"),
    ("trust",              "monthly", "0.7"),
    ("changelog",          "weekly",  "0.6"),
    ("download",           "monthly", "0.6"),
    ("company",            "monthly", "0.6"),
    ("founder",            "monthly", "0.5"),
    ("contact",            "monthly", "0.5"),
    ("careers",            "monthly", "0.5"),
    ("privacy",            "yearly",  "0.3"),
    ("terms",              "yearly",  "0.3"),
    ("application",        "monthly", "0.6"),
    ("what-changed-today", "weekly",  "0.6"),
    ("blog",               "weekly",  "0.6"),
    ("blog/best-bloomberg-terminal-alternatives-2026", "monthly", "0.5"),
    ("blog/bloomberg-terminal-cost-2026",              "monthly", "0.5"),
    ("blog/best-free-trading-terminal-software-2026",  "monthly", "0.5"),
    ("blog/best-crypto-trading-terminal-2026",         "monthly", "0.5"),
    ("blog/what-is-a-quant-trading-terminal",          "monthly", "0.5"),
    ("blog/how-to-backtest-a-trading-strategy",        "monthly", "0.5"),
]

# Pages that exist and are deliberately not submitted. A page is in one list or the other;
# it cannot be in neither, which is the whole point of the check below.
EXCLUDED = {
    "404": "the error page, and noindex in its own head",
}

def lastmod(slug):
    d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", f"{slug}.html"],
                       capture_output=True, text=True).stdout.strip()
    return d or datetime.date.today().isoformat()

missing = [s for s, _, _ in PAGES if not os.path.exists(f"{s}.html")]
if missing:
    sys.exit(f"listed in the sitemap but not on disk: {missing}")

# The check that was not here, and the one that failed. Only the first half was checked —
# a page listed but deleted — so the sitemap could never name a page that did not exist,
# and it silently omitted nine that did: the whole blog, /application and
# /what-changed-today, each of which asks to be indexed in its own head. A page list kept
# by hand disagrees with the site the moment somebody adds a page, which is exactly what
# the docstring says this file exists to prevent.
on_disk = {
    os.path.relpath(os.path.join(root, name), ".")[: -len(".html")]
    for root, _dirs, names in os.walk(".")
    for name in names
    if name.endswith(".html") and ".git" not in root.split(os.sep)
}
unlisted = sorted(on_disk - {s for s, _, _ in PAGES} - set(EXCLUDED))
if unlisted:
    sys.exit("on disk but neither listed nor excluded — add a row to PAGES, or a reason to "
             f"EXCLUDED: {unlisted}")

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for slug, freq, pri in PAGES:
    loc = BASE + ("/" if slug == "index" else "/" + slug)
    lines += ["  <url>",
              f"    <loc>{loc}</loc>",
              f"    <lastmod>{lastmod(slug)}</lastmod>",
              f"    <changefreq>{freq}</changefreq>",
              f"    <priority>{pri}</priority>",
              "  </url>"]
lines += ["</urlset>", ""]
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(lines))
print(f"sitemap.xml: {len(PAGES)} urls")
