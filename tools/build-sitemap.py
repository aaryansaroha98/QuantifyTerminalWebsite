#!/usr/bin/env python3
"""Generate sitemap.xml from the page list below.

The sitemap is generated rather than hand-edited so that renaming a page, or
adding one, cannot leave the index quietly disagreeing with the site. Run from
the repo root:  python3 tools/build-sitemap.py

What goes in, and why (Google Search Central, build-sitemap and video-sitemaps;
Bing Webmaster blog, July 2025):

- <loc> is the page's canonical URL, exactly. A listed page that is noindex, or
  whose rel=canonical names another URL, fails the build.
- <lastmod> is the last commit that changed what the page SAYS. Google uses it
  only while it stays "consistently and verifiably accurate", and says a change
  to the footer or the copyright line is not a significant change -- so a commit
  that only rewrote the shared footer does not move a page's date. Full
  timestamp with offset, which Bing asks for.
- No <changefreq> or <priority>: Google and Bing both say they ignore them.
- A page with a film gets a video entry, read from the page's own VideoObject
  structured data so the two can never disagree.

To drop a page from the sitemap, move its slug to EXCLUDED with a reason. That
stops it being submitted; it does not deindex it -- for that the page itself
needs a noindex.
"""
import datetime
import json
import os
import re
import subprocess
import sys
from xml.sax.saxutils import escape

BASE = "https://www.quantifyterminal.com"
VIDEO_NS = "http://www.google.com/schemas/sitemap-video/1.1"

# in the order a reader would want them
PAGES = [
    "index",
    "product",
    "demo-video",
    "vision",
    "pricing",
    "early-access",
    "download",
    "accuracy",
    "what-changed-today",
    "blog",
    "blog/best-bloomberg-terminal-alternatives-2026",
    "blog/bloomberg-terminal-cost-2026",
    "blog/best-free-trading-terminal-software-2026",
    "blog/best-crypto-trading-terminal-2026",
    "blog/what-is-a-quant-trading-terminal",
    "blog/how-to-backtest-a-trading-strategy",
    "agents",
    "trust",
    "data-rights",
    "company",
    "founder",
    "careers",
    "contact",
    "privacy",
    "terms",
]

# Pages that exist and are deliberately not submitted. A page is in one list or the other;
# it cannot be in neither, which is the whole point of the check below.
EXCLUDED = {
    "404": "the error page, and noindex in its own head",
    "application": "internship applications are closed; /application redirects to /careers",
}

FOOTER = re.compile(r'<footer class="site-footer">.*?</footer>', re.S)


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True).stdout


def content(text):
    """What a page says, for dating it: everything but the shared footer."""
    return FOOTER.sub("", text or "")


def lastmod(slug):
    """The last time the page's own content changed, as an ISO timestamp with offset.

    Walk the page's history newest first and find the commit that introduced the words it
    has now. A commit that only touched the footer, or that deleted the page when it was
    later restored with the same words, does not count as a change.
    """
    path = f"{slug}.html"
    now = content(open(path, encoding="utf-8").read())
    head = content(git("show", f"HEAD:{path}"))
    if head and head != now:
        # about to be committed: the change is now
        return datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()
    found = None
    for line in git("log", "--format=%H %cI", "--", path).splitlines():
        sha, stamp = line.split(" ", 1)
        after = content(git("show", f"{sha}:{path}"))
        if after == now:
            found = stamp
        elif after == "":
            continue
        else:
            break
    return found or datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()


def head_of(slug):
    text = open(f"{slug}.html", encoding="utf-8").read()
    return text[: text.find("</head>")]


def iso_seconds(duration):
    m = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration or "")
    if not m or not any(m.groups()):
        sys.exit(f"cannot read the duration {duration!r}")
    h, mi, s = (int(g or 0) for g in m.groups())
    return h * 3600 + mi * 60 + s


def videos(slug):
    """The page's films, from its VideoObject structured data."""
    found = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', head_of(slug), re.S):
        data = json.loads(block)
        for item in data if isinstance(data, list) else [data]:
            if item.get("@type") == "VideoObject":
                found.append(item)
    return found


def check(slug, loc):
    head = head_of(slug)
    robots = re.search(r'<meta name="robots" content="([^"]*)"', head)
    if robots and "noindex" in robots.group(1):
        sys.exit(f"{slug}.html is noindex but listed in the sitemap")
    canonical = re.search(r'<link rel="canonical" href="([^"]*)"', head)
    if not canonical or canonical.group(1) != loc:
        sys.exit(f"{slug}.html canonical {canonical and canonical.group(1)!r} does not match {loc}")


missing = [s for s in PAGES if not os.path.exists(f"{s}.html")]
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
unlisted = sorted(on_disk - set(PAGES) - set(EXCLUDED))
if unlisted:
    sys.exit("on disk but neither listed nor excluded — add it to PAGES, or a reason to "
             f"EXCLUDED: {unlisted}")

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<?xml-stylesheet type="text/css" href="/sitemap.css"?>',
         f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="{VIDEO_NS}">']
films = 0
for slug in PAGES:
    loc = BASE + ("/" if slug == "index" else "/" + slug)
    check(slug, loc)
    lines += ["  <url>",
              f"    <loc>{loc}</loc>",
              f"    <lastmod>{lastmod(slug)}</lastmod>"]
    for v in videos(slug):
        if v.get("embedUrl") == loc:
            sys.exit(f"{slug}.html: the VideoObject embedUrl is the page itself; Google rejects that")
        description = v["description"]
        if len(description) > 2048:
            sys.exit(f"{slug}.html: video description is over 2,048 characters")
        lines += ["    <video:video>",
                  f"      <video:thumbnail_loc>{escape(v['thumbnailUrl'])}</video:thumbnail_loc>",
                  f"      <video:title>{escape(v['name'])}</video:title>",
                  f"      <video:description>{escape(description)}</video:description>",
                  f"      <video:content_loc>{escape(v['contentUrl'])}</video:content_loc>",
                  f"      <video:duration>{iso_seconds(v['duration'])}</video:duration>",
                  f"      <video:publication_date>{escape(v['uploadDate'])}</video:publication_date>",
                  "      <video:family_friendly>yes</video:family_friendly>",
                  "    </video:video>"]
        films += 1
    lines += ["  </url>"]
lines += ["</urlset>", ""]
open("sitemap.xml", "w", encoding="utf-8").write("\n".join(lines))
print(f"sitemap.xml: {len(PAGES)} urls, {films} films")
