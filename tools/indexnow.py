#!/usr/bin/env python3
"""Tell Bing and the other IndexNow engines which pages changed. Google does not take part;
it reads the sitemap.

Run after a production deploy has gone live, from the site root:

    python3 tools/indexnow.py                 # every URL in sitemap.xml
    python3 tools/indexnow.py /pricing /      # just these

The key is public by design: IndexNow checks ownership by fetching /<key>.txt from the site.
Submit a URL when its content changed, not on every deploy.
"""
import json
import re
import sys
import urllib.request

HOST = "www.quantifyterminal.com"
KEY = "ff2f5a991e21df65f619f45eba839677"

if len(sys.argv) > 1:
    urls = ["https://" + HOST + (p if p.startswith("/") else "/" + p) for p in sys.argv[1:]]
else:
    urls = re.findall(r"<loc>([^<]+)</loc>", open("sitemap.xml", encoding="utf-8").read())

body = json.dumps({"host": HOST, "key": KEY,
                   "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls}).encode()
request = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
try:
    with urllib.request.urlopen(request, timeout=30) as response:
        print(f"IndexNow: {response.status} for {len(urls)} urls")
except urllib.error.HTTPError as error:
    sys.exit(f"IndexNow refused: {error.code} {error.read().decode(errors='replace')[:200]}")
