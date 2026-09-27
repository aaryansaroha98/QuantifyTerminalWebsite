"""Write the site footer into every page from one list.

The footer is the site's visible sitemap: every page a visitor can use is one click away
from every other page. It is kept here, once, because nineteen hand-copied footers drift
the moment one of them is edited. Run from the site root:

    python3 tools/build-footer.py

A page opts out by having no <footer class="site-footer"> at all (download.html, a
single-screen holding page, is one).
"""
import html
import os
import re
import sys

COLUMNS = [
    ("Product", [
        ("Overview", "/product"),
        ("Pricing", "/pricing"),
        ("Download", "/download"),
        ("Early access", "/early-access"),
    ]),
    ("Resources", [
        ("What changed today", "/what-changed-today"),
        ("Accuracy", "/accuracy"),
        ("For agents", "/agents"),
    ]),
    ("Company", [
        ("About", "/company"),
        ("Vision", "/vision"),
        ("Founder", "/founder"),
        ("Careers", "/careers"),
        ("Contact", "/contact"),
    ]),
    ("Legal", [
        ("Trust", "/trust"),
        ("Data rights", "/data-rights"),
        ("Privacy", "/privacy"),
        ("Terms", "/terms"),
    ]),
]

TAGLINE = "Desktop research terminal for funds and investment teams."
COPYRIGHT = "&copy; 2026 Quantify Terminal &middot; Jammu, India"

SOCIAL = [
    ('X (Twitter)', 'https://x.com/quantifytml',
     '<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>'),
    ('LinkedIn', 'https://www.linkedin.com/company/quantify-terminal/',
     '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>'),
    ('YouTube', 'https://www.youtube.com/@QuantifyTerminal',
     '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'),
]


def footer(slug):
    here = "/" if slug == "index" else "/" + slug
    cols = []
    for heading, links in COLUMNS:
        items = []
        for label, href in links:
            current = ' aria-current="page"' if href == here else ""
            items.append(f'            <li><a href="{href}"{current}>{html.escape(label)}</a></li>')
        cols.append(
            '        <div class="foot-col">\n'
            f'          <p class="foot-h">{html.escape(heading)}</p>\n'
            '          <ul>\n' + "\n".join(items) + '\n          </ul>\n'
            '        </div>')
    social = "\n".join(
        f'        <a href="{url}" target="_blank" rel="noopener" aria-label="{label}">'
        f'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{path}</svg></a>'
        for label, url, path in SOCIAL)
    return (
        '<footer class="site-footer">\n'
        '    <div class="foot">\n'
        '      <div class="foot-brand">\n'
        '        <a class="foot-mark" href="/">quantify</a>\n'
        f'        <p class="foot-line">{html.escape(TAGLINE)}</p>\n'
        '      </div>\n'
        '      <nav class="foot-cols" aria-label="Site">\n' + "\n".join(cols) + '\n      </nav>\n'
        '      <div class="foot-bottom">\n'
        f'        <p class="foot-copy">{COPYRIGHT}</p>\n'
        '        <div class="footer-social" aria-label="Social links">\n' + social + '\n        </div>\n'
        '      </div>\n'
        '    </div>\n'
        '  </footer>')


def main():
    hrefs = {href for _, links in COLUMNS for _, href in links}
    missing = sorted(h for h in hrefs if not os.path.exists(h.strip("/") + ".html"))
    if missing:
        sys.exit(f"the footer links to pages that are not on disk: {missing}")
    pattern = re.compile(r'<footer class="site-footer">.*?</footer>', re.S)
    changed = 0
    for name in sorted(os.listdir(".")):
        if not name.endswith(".html"):
            continue
        text = open(name, encoding="utf-8").read()
        if not pattern.search(text):
            continue
        new = pattern.sub(lambda _: footer(name[:-5]), text, count=1)
        if new != text:
            open(name, "w", encoding="utf-8").write(new)
            changed += 1
    print(f"footer written to {changed} pages")


if __name__ == "__main__":
    main()
