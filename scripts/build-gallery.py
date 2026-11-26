#!/usr/bin/env python3
"""Generate public sample cards from the explicitly approved inventory."""
import argparse
import json
import re
from html import escape
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = {"manufacturing", "restaurant", "shop", "event", "character"}
START = "        <!-- gallery:generated:start -->"
END = "        <!-- gallery:generated:end -->"
SLUG = re.compile(r"[a-z0-9][a-z0-9-]*")

def render():
    cfg = json.loads((ROOT / "gallery-catalog.json").read_text())
    entries = cfg["listed"]
    unlisted = cfg["unlisted"]
    all_slugs = [x["slug"] for x in entries + unlisted]
    if any(not SLUG.fullmatch(x) for x in all_slugs) or len(set(all_slugs)) != len(all_slugs):
        raise ValueError("Invalid or duplicate gallery slug")
    actual = {x.name for x in (ROOT / "sites").iterdir() if x.is_dir() and (x / "index.html").is_file()}
    if actual != set(all_slugs):
        raise ValueError(f"Unclassified sites: {sorted(actual - set(all_slugs))}; missing sites: {sorted(set(all_slugs) - actual)}")
    if any(not x.get("reason", "").strip() for x in unlisted):
        raise ValueError("Unlisted sites require a reason")
    template = (ROOT / "index.html").read_text()
    if template.count(START) != 1 or template.count(END) != 1:
        raise ValueError("Gallery HTML markers are missing or duplicated")
    head, tail = template.split(START, 1)
    _, foot = tail.split(END, 1)
    if any(f'data-filter="{category}"' not in head for category in {x["category"] for x in entries}):
        raise ValueError("A gallery category has no filter button")
    cards = []
    for item in entries:
        slug, kind = item["slug"], item["category"]
        path = PurePosixPath(item["image"])
        if kind not in CATEGORIES or path.is_absolute() or ".." in path.parts or path.parts[0] not in {"assets", "sites"}:
            raise ValueError(f"Invalid category or image path for {slug}")
        if not (ROOT / path).is_file() or path.suffix.lower() not in {".webp", ".png", ".jpg", ".jpeg", ".svg"}:
            raise ValueError(f"Missing or unsupported thumbnail for {slug}: {path}")
        if not all(type(item[k]) is int and item[k] > 0 for k in ("width", "height")):
            raise ValueError(f"Missing image dimensions for {slug}")
        if any(not item[k].strip() for k in ("title", "caption", "alt")):
            raise ValueError(f"Missing text for {slug}")
        title, cap, alt = (escape(item[k], quote=True) for k in ("title", "caption", "alt"))
        cards.append(f'''        <article class="sample-card gallery-card" data-category="{kind}">
          <a href="sites/{slug}/" class="gallery-card__link">
            <div class="gallery-card__image">
              <img src="{escape(str(path), quote=True)}" width="{item['width']}" height="{item['height']}" alt="{alt}" loading="lazy">
            </div>
            <div class="gallery-card__caption">
              <h2>{title}</h2>
              <p>{cap}</p>
            </div>
          </a>
        </article>''')
    return head + START + "\n" + "\n".join(cards) + "\n" + END + foot

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Require the checked-in HTML to match the registry")
    args = parser.parse_args()
    try:
        final = render()
    except (OSError, KeyError, TypeError, ValueError) as exc:
        raise SystemExit(f"Gallery: {exc}")
    path = ROOT / "index.html"
    if args.check:
        if final != path.read_text():
            raise SystemExit("Gallery is stale. Run: python3 scripts/build-gallery.py")
    else:
        path.write_text(final)
    print("Gallery inventory verified")
