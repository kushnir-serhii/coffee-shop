#!/usr/bin/env python3
"""
Turn AI-generated images (jfif / jpg / png / webp) into the files the site expects.

    1. Drop the generated files in public/images/_generated/
    2. Make sure each filename contains a keyword for the product (see the
       table printed by `--help-names`), e.g.  kirinyaga.jfif,
       kettle-graphite.jfif, h1 bone (2).jfif, og.jfif
    3. python scripts/prepare-generated.py --dry-run   # check the matching
       python scripts/prepare-generated.py             # write the files

Each image is centre-cropped to the right ratio, resized and saved as WebP
(the social card as JPG, because some networks still ignore WebP previews)
under the correct name in coffee/, equipment/ or og/.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing.  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "_generated"
IMAGES = ROOT / "public" / "images"
EXTS = {".jfif", ".jpg", ".jpeg", ".png", ".webp"}

# slug -> keywords that identify it in a filename (checked in order)
BEANS = {
    "kirinyaga-ab":     ["kirinyaga", "kenya"],
    "finca-la-soledad": ["soledad", "guatemala"],
    "sitio-boa-vista":  ["boa vista", "boavista", "sitio", "brazil"],
    "gesha-village":    ["gesha", "ethiopia"],
    "el-diviso":        ["diviso", "colombia"],
    "house-blend-no-4": ["house blend", "blend", "house"],
}

# slug -> (keywords, default finish, all finishes)
EQUIPMENT = {
    "atlas-h1-hand-grinder": (["atlas h1", "h1", "hand grinder"], "graphite", ["graphite", "bone"]),
    "atlas-e1-grinder":      (["atlas e1", "e1", "grinder"], "graphite", ["graphite", "bone", "roast"]),
    "meridian-one-espresso": (["meridian one", "espresso", "machine"], "bone", ["bone", "graphite"]),
    "pour-kettle-900":       (["kettle"], "bone", ["bone", "graphite", "origin"]),
    "gram-scale-02":         (["scale", "gram"], "graphite", ["graphite", "bone"]),
    "meridian-dripper":      (["dripper"], "bone", ["bone", "origin", "roast"]),
}
FINISHES = ["graphite", "bone", "roast", "origin"]

# keyword -> editorial file (checked before products, so "lane coffee" wins over "coffee")
EDITORIAL = [
    ("hero",           "home-hero",            1400, 1750),
    ("lane equipment", "lane-equipment",       1600, 1000),
    ("lane coffee",    "lane-coffee",          1600, 1000),
    ("sourcing",       "sourcing-at-origin",   1200, 1500),
    ("roasting floor", "about-roasting-floor", 1200, 1500),
    ("roastery",       "about-roastery",       1200, 1500),
]


def norm(name: str) -> str:
    return " " + re.sub(r"[^a-z0-9]+", " ", name.lower()).strip() + " "


def has(text: str, kw: str) -> bool:
    return f" {kw} " in text


def match(stem: str) -> tuple[str, int, int, str] | str:
    """Return (output path, w, h, format) or an error string."""
    t = norm(stem)

    if has(t, "og") or has(t, "social") or has(t, "meridian og"):
        return ("og/meridian-og.jpg", 1200, 630, "JPEG")

    for kw, out, w, h in EDITORIAL:
        if has(t, kw):
            return (f"editorial/{out}.webp", w, h, "WEBP")

    for slug, (kws, default, finishes) in EQUIPMENT.items():
        if any(has(t, k) for k in kws):
            found = [f for f in FINISHES if has(t, f)]
            finish = found[0] if found else default
            if finish not in finishes:
                return f"{slug} has no '{finish}' finish (has: {', '.join(finishes)})"
            return (f"equipment/{slug}-{finish}.webp", 1400, 1400, "WEBP")

    for slug, kws in BEANS.items():
        if any(has(t, k) for k in kws):
            return (f"coffee/{slug}-bag.webp", 1200, 1500, "WEBP")

    return "no product keyword in the filename"


def crop_to(img: Image.Image, w: int, h: int) -> Image.Image:
    target, src = w / h, img.width / img.height
    if src > target:
        nw = round(img.height * target)
        left = (img.width - nw) // 2
        box = (left, 0, left + nw, img.height)
    else:
        nh = round(img.width / target)
        top = (img.height - nh) // 2
        box = (0, top, img.width, top + nh)
    return img.crop(box).resize((w, h), Image.LANCZOS)


def help_names() -> None:
    print("Coffee bags   (1200x1500 -> coffee/<slug>-bag.webp)")
    for s, k in BEANS.items():
        print(f"  {s:<22} keywords: {', '.join(k)}")
    print("\nEquipment     (1400x1400 -> equipment/<slug>-<finish>.webp)")
    for s, (k, d, f) in EQUIPMENT.items():
        print(f"  {s:<22} keywords: {', '.join(k):<34} finishes: {', '.join(f)} (default {d})")
    print("\nEditorial")
    for kw, out, w, h in EDITORIAL:
        print(f"  {out:<22} keyword: {kw:<16} ({w}x{h})")
    print("\nSocial card   (1200x630  -> og/meridian-og.jpg)   keywords: og, social")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--help-names", action="store_true", help="show the filename keywords")
    ap.add_argument("--src", type=Path, default=SRC)
    args = ap.parse_args()

    if args.help_names:
        help_names()
        return 0

    files = [p for p in sorted(args.src.iterdir()) if p.suffix.lower() in EXTS] if args.src.exists() else []
    if not files:
        print(f"Nothing to do — put the generated images in {args.src}")
        return 0

    taken: dict[str, str] = {}
    problems, small, written = [], [], 0

    for f in files:
        res = match(f.stem)
        if isinstance(res, str):
            problems.append(f"{f.name}: {res}")
            continue
        rel, w, h, fmt = res
        if rel in taken:
            problems.append(f"{f.name}: same target as {taken[rel]} ({rel}) — skipped")
            continue
        taken[rel] = f.name

        with Image.open(f) as img:
            img = img.convert("RGB")
            if img.width < w or img.height < h:
                small.append(f"{f.name} is {img.width}x{img.height}, {rel} wants {w}x{h}")
            print(f"{'would write' if args.dry_run else 'wrote'}  {rel:<46} from {f.name}")
            if not args.dry_run:
                out = IMAGES / rel
                out.parent.mkdir(parents=True, exist_ok=True)
                im = crop_to(img, w, h)
                if fmt == "WEBP":
                    im.save(out, "WEBP", quality=82, method=6)
                else:
                    im.save(out, "JPEG", quality=88, optimize=True, progressive=True)
            written += 1

    print(f"\n{written} file(s) {'planned' if args.dry_run else 'written'}.")
    if small:
        print("\nSmaller than the slot, will look soft — generate at a higher resolution:")
        for s in small:
            print(f"  ! {s}")
    if problems:
        print("\nSkipped:")
        for p in problems:
            print(f"  - {p}")
        print("  Run with --help-names to see the keywords.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
