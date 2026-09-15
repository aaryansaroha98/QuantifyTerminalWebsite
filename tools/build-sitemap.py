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
]

def lastmod(slug):
    d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", f"{slug}.html"],
                       capture_output=True, text=True).stdout.strip()
    return d or datetime.date.today().isoformat()

missing = [s for s, _, _ in PAGES if not os.path.exists(f"{s}.html")]
if missing:
    sys.exit(f"listed in the sitemap but not on disk: {missing}")

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
