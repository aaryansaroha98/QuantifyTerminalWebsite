#!/usr/bin/env python3
"""Check that no page can reach Google Analytics without the visitor's consent.

    python3 tools/check-analytics-consent.py

Every page must either load /consent.js (which adds the Google tag only after Accept) or
declare <meta name="qt-analytics" content="never"> and load nothing. No page may carry the
Google tag itself: a googletagmanager.com script or a gtag('config') call in the HTML would
send a request to Google before anyone has chosen. A page with a "Cookie settings" link must
load the script that answers it. Exits non-zero, naming each page, when a rule is broken.
"""
import glob
import re
import sys

NEVER = re.compile(r'<meta name="qt-analytics" content="never">')
CONSENT = re.compile(r'<script src="/consent\.js" defer></script>')
TAG = re.compile(r"googletagmanager\.com|gtag\(\s*['\"]config['\"]")


def main():
    pages = sorted(glob.glob("*.html")) + sorted(glob.glob("blog/*.html"))
    problems = []
    for path in pages:
        text = open(path, encoding="utf-8").read()
        never = bool(NEVER.search(text))
        consent = bool(CONSENT.search(text))
        if TAG.search(text):
            problems.append(f"{path}: carries the Google tag itself")
        if never and consent:
            problems.append(f"{path}: says never, yet loads consent.js")
        if not never and not consent:
            problems.append(f"{path}: neither loads consent.js nor says never")
        if "data-cookie-settings" in text and not consent:
            problems.append(f"{path}: has a Cookie settings link with nothing to answer it")
    if problems:
        print("\n".join(problems))
        sys.exit(1)
    print(f"{len(pages)} pages: none reaches Google before consent")


if __name__ == "__main__":
    main()
