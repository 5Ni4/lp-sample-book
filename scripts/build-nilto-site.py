#!/usr/bin/env python3
"""Build the public site from published NILTO restaurant articles."""

import argparse
from datetime import datetime
from html import escape
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import shutil
from string import Template
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
API_URL = "https://cms-api.nilto.com/v1/contents"
MODEL = "restaurant_journal"
CATEGORIES = {
    "seasonal": "季節の料理",
    "people": "お店の話",
    "ingredients": "仕入れの話",
    "news": "お知らせ",
}
STORES = {
    "koyori-chuo": ("こより 中央通り店", "こより", "koyori-meal.jpg"),
    "koyori-ekimae": ("こより 駅前店", "こより", "koyori-meal.jpg"),
    "koyori-koen": ("こより 公園前店", "こより", "koyori-meal.jpg"),
    "minamo-east": ("みなも 東口店", "みなも", "minamo-noodles.jpg"),
    "minamo-south": ("みなも 南町店", "みなも", "minamo-noodles.jpg"),
    "tsumugi-west": ("つむぎ 西口店", "つむぎ", "tsumugi-grill.jpg"),
}


def safe_url(value):
    parsed = urlsplit(value.strip())
    if parsed.scheme in ("http", "https") and parsed.hostname and not parsed.username and not parsed.password:
        return value.strip()
    return ""


class ArticleHTML(HTMLParser):
    """Keep article formatting while excluding executable HTML and unsafe URLs."""

    tags = {
        "p", "h2", "h3", "h4", "h5", "h6", "strong", "em", "u", "s", "del",
        "blockquote", "ul", "ol", "li", "br", "hr", "a", "img", "figure",
        "figcaption", "table", "thead", "tbody", "tr", "th", "td", "pre", "code",
        "sub", "sup", "mark",
    }
    blocked = {"script", "style", "iframe", "object", "svg", "math", "template"}
    void = {"br", "hr", "img"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.output = []
        self.block_depth = 0

    def handle_starttag(self, tag, attributes):
        if tag in self.blocked:
            self.block_depth += 1
            return
        if self.block_depth:
            return
        tag = "h2" if tag == "h1" else tag
        if tag not in self.tags:
            return
        attributes = dict(attributes)
        kept = {}
        if tag == "a":
            value = attributes.get("href", "").strip()
            if safe_url(value) or value.startswith("#"):
                kept["href"] = value
        if tag == "img":
            value = safe_url(attributes.get("src", ""))
            if not value:
                return
            kept = {"src": value, "alt": attributes.get("alt", ""), "loading": "lazy"}
        attrs = "".join(f' {key}="{escape(value, quote=True)}"' for key, value in kept.items())
        self.output.append(f"<{tag}{attrs}>")

    def handle_endtag(self, tag):
        if tag in self.blocked:
            self.block_depth = max(0, self.block_depth - 1)
            return
        if self.block_depth:
            return
        tag = "h2" if tag == "h1" else tag
        if tag in self.tags and tag not in self.void:
            self.output.append(f"</{tag}>")

    def handle_data(self, text):
        if not self.block_depth:
            self.output.append(escape(text))


def get_page(api_key, offset):
    query = urlencode({"model": MODEL, "limit": 100, "offset": offset, "body[format]": "html"})
    request = Request(API_URL + "?" + query, headers={"X-NILTO-API-KEY": api_key})
    for attempt in range(3):
        try:
            with urlopen(request, timeout=30) as response:
                return json.load(response)
        except HTTPError as error:
            if error.code in (429, 500, 502, 503, 504) and attempt < 2:
                time.sleep(min(10, int(error.headers.get("Retry-After", "2"))))
                continue
            raise RuntimeError(f"NILTO returned HTTP {error.code}.") from None
        except (URLError, TimeoutError):
            if attempt == 2:
                raise RuntimeError("NILTO could not be reached.") from None
            time.sleep(2)
    raise RuntimeError("NILTO request failed.")


def fetch_posts(api_key):
    posts = []
    offset = 0
    total = None
    while total is None or offset < total:
        page = get_page(api_key, offset)
        if not isinstance(page.get("data"), list) or not isinstance(page.get("total"), int):
            raise ValueError("NILTO returned an invalid content list.")
        if total is None:
            total = page["total"]
        elif page["total"] != total:
            raise ValueError("NILTO content changed during pagination. Run the build again.")
        batch = page["data"]
        if not batch and offset < total:
            raise ValueError("NILTO returned an incomplete content list.")
        posts.extend(batch)
        offset += len(batch)
    if len(posts) != total:
        raise ValueError("NILTO content count does not match the response.")
    return posts


def normalize_posts(records):
    posts = []
    slugs = set()
    for record in records:
        if record.get("_model") != MODEL or record.get("_status") != "published":
            raise ValueError("The API key must return published restaurant articles only.")
        slug = record.get("slug", "")
        if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:[-_][a-z0-9]+)*", slug) or len(slug) > 80:
            raise ValueError("An article has a missing or invalid URL name.")
        if slug in slugs:
            raise ValueError("Two articles have the same URL name.")
        slugs.add(slug)
        for field in ("title", "lead", "body", "published_at"):
            if not isinstance(record.get(field), str) or not record[field].strip():
                raise ValueError(f"Article {slug} is missing {field}.")
        category = record.get("category")
        stores = record.get("stores")
        if category not in CATEGORIES:
            raise ValueError(f"Article {slug} has an invalid category.")
        if not isinstance(stores, list) or not stores or any(store not in STORES for store in stores):
            raise ValueError(f"Article {slug} has missing or invalid stores.")
        date = datetime.fromisoformat(record["published_at"].replace("Z", "+00:00"))
        if date.tzinfo is None:
            raise ValueError(f"Article {slug} has a date without a timezone.")
        sanitizer = ArticleHTML()
        sanitizer.feed(record["body"])
        sanitizer.close()
        body = "".join(sanitizer.output)
        if not re.sub("<[^>]*>", "", body).strip():
            raise ValueError(f"Article {slug} has no readable body.")
        cover = record.get("cover") or {}
        if not isinstance(cover, dict):
            raise ValueError(f"Article {slug} has an invalid cover.")
        if cover and not safe_url(cover.get("url", "")):
            raise ValueError(f"Article {slug} has an invalid image URL.")
        posts.append({
            "slug": slug,
            "title": record["title"],
            "lead": record["lead"],
            "date": date.astimezone(ZoneInfo("Asia/Tokyo")).date().isoformat(),
            "category": category,
            "stores": list(dict.fromkeys(stores)),
            "body": body,
            "cover": cover.get("url"),
            "alt": cover.get("alt") or record["title"],
        })
    return sorted(posts, key=lambda post: (post["date"], post["slug"]), reverse=True)


def card(post, depth, base, heading, filtered=False):
    cover = post["cover"] or "../" * depth + "assets/restaurant/" + STORES[post["stores"][0]][2]
    attrs = ""
    if filtered:
        attrs = f' data-journal-post data-category="{post["category"]}" data-stores="{" ".join(post["stores"])}"'
    brands = "・".join(dict.fromkeys(STORES[store][1] for store in post["stores"]))
    return f"""<article class="journal-card"{attrs}>
  <a href="{base}{post['slug']}/">
    <img src="{escape(cover, quote=True)}" width="760" height="570" loading="lazy" alt="{escape(post['alt'], quote=True)}">
    <div class="journal-meta"><time datetime="{post['date']}">{post['date'].replace('-', '.')}</time><span>{CATEGORIES[post['category']]}</span></div>
    <{heading}>{escape(post['title'])}</{heading}>
    <p class="journal-card__store">{brands}</p>
  </a>
</article>"""


def build(posts, output):
    output = output.resolve()
    if output == ROOT or ROOT in output.parents and output.parts[len(ROOT.parts)] != "dist":
        raise ValueError("Build output must be dist/ or a temporary directory outside the source.")
    if output.exists():
        raise ValueError("Build output already exists. Choose an empty output directory.")
    output.mkdir(parents=True)
    for folder in ("assets", "sites"):
        for path in (ROOT / folder).rglob("*"):
            if path.is_symlink():
                raise ValueError("Symbolic links cannot be included in the public site.")
        shutil.copytree(ROOT / folder, output / folder)
    for filename in ("index.html", "README.md", ".nojekyll"):
        shutil.copy2(ROOT / filename, output / filename)
    journal = output / "sites/restaurant/journal"
    shutil.rmtree(journal)
    journal.mkdir()
    templates = ROOT / "scripts/templates"
    listing = Template((templates / "journal-list.html").read_text())
    cards = "".join(card(post, 3, "./", "h2", True) for post in posts)
    rendered = listing.substitute(cards=cards)
    if not posts:
        rendered = rendered.replace('data-journal-empty hidden', 'data-journal-empty')
    (journal / "index.html").write_text(rendered)
    article = Template((templates / "journal-article.html").read_text())
    for post in posts:
        stores = "".join(f'<li><a href="../../#store-{store}">{STORES[store][0]}</a></li>' for store in post["stores"])
        cover = post["cover"] or "../../../../assets/restaurant/" + STORES[post["stores"][0]][2]
        html = article.substitute(
            description=escape(post["lead"], quote=True), title=escape(post["title"]),
            category=CATEGORIES[post["category"]], category_key=post["category"],
            date=post["date"], display_date=post["date"].replace("-", "."),
            lead=escape(post["lead"]), cover=escape(cover, quote=True),
            alt=escape(post["alt"], quote=True), body=post["body"], stores=stores,
        )
        directory = journal / post["slug"]
        directory.mkdir()
        (directory / "index.html").write_text(html)
    home = output / "sites/restaurant/index.html"
    latest = f"""<!-- journal:latest -->
    <section id="news" class="dining-section dining-section--tint" aria-labelledby="journal-title">
      <div class="page-wrap">
        <header class="dining-section__head"><h2 id="journal-title">読みもの</h2><a class="dining-link" href="journal/">すべての記事を見る</a></header>
        <div class="journal-grid">{''.join(card(post, 2, 'journal/', 'h3') for post in posts[:3])}</div>
      </div>
    </section>
    <!-- /journal:latest -->"""
    original = home.read_text()
    rendered, count = re.subn(r"<!-- journal:latest -->.*?<!-- /journal:latest -->", lambda match: latest, original, flags=re.S)
    if count != 1:
        raise ValueError("Restaurant home is missing its latest-article region.")
    home.write_text(rendered)
    print(f"Built {len(posts)} published NILTO articles.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    parser.add_argument("--snapshot", type=Path, help="Use an exported public API response for local verification.")
    args = parser.parse_args()
    if args.snapshot:
        records = json.loads(args.snapshot.read_text())["data"]
    else:
        api_key = os.environ.get("NILTO_PUBLIC_API_KEY")
        if not api_key:
            raise ValueError("Set NILTO_PUBLIC_API_KEY to a published-content-only key.")
        records = fetch_posts(api_key)
    build(normalize_posts(records), args.output)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError) as error:
        sys.exit(str(error))
