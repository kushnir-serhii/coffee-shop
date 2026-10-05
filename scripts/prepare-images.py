#!/usr/bin/env python3
"""
Turn raw Pixabay downloads into the files the site expects.

You do not rename anything. Pixabay's own download filenames contain the photo
id — `coffee-grinder-8289194_1280.jpg` — and this script matches on that id,
crops to the right aspect ratio and writes the correctly named WebP file
into the right folder.

    1. Download the photos from the links in the spreadsheet (the "Download"
       button on each Pixabay page). Pick the largest size offered.
    2. Drop them, untouched, in assets/images/_downloads/
    3. python scripts/prepare-images.py

Run it as many times as you like — it only rewrites what it finds.
Add `--dry-run` to see what would happen without writing anything.
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
DOWNLOADS = ROOT / "assets" / "images" / "_downloads"
IMAGES = ROOT / "public" / "images"

BEANS = [
    "kirinyaga-ab",
    "finca-la-soledad",
    "sitio-boa-vista",
    "gesha-village",
    "el-diviso",
    "house-blend-no-4",
]

# Pixabay photo id -> list of (output path, target width, height, crop focus)
JOBS: dict[str, list[tuple[str, int, int, str]]] = {
    # --- editorial ------------------------------------------------------
    "867036":  [("editorial/about-roastery.webp", 1200, 1500, "center")],
    "867034":  [("editorial/about-roasting-floor.webp", 1200, 1500, "center")],
    "6959629": [("editorial/sourcing-at-origin.webp", 1200, 1500, "center")],
    "9135194": [("editorial/lane-coffee.webp", 1600, 1000, "center")],
    "7830087": [("editorial/home-hero.webp", 1400, 1750, "center")],
    # one file, two jobs — see the note this prints at the end
    "8289194": [
        ("editorial/lane-equipment.webp", 1600, 1000, "center"),
        ("equipment/atlas-e1-grinder-graphite.webp", 1400, 1400, "center"),
    ],
    # --- coffee gallery, reused across the lots --------------------------
    "3392168": [(f"coffee/{s}-beans.webp", 800, 800, "center") for s in BEANS],
    "1868462": [(f"coffee/{s}-brewed.webp", 800, 800, "center") for s in BEANS],
    "662737":  [(f"coffee/{s}-origin.webp", 800, 800, "center") for s in BEANS[:3]],
    "1548766": [(f"coffee/{s}-origin.webp", 800, 800, "center") for s in BEANS[3:]],
}

ID_IN_NAME = re.compile(r"(\d{5,9})")


def crop_to(img: Image.Image, w: int, h: int, focus: str) -> Image.Image:
    """Centre-crop to the target ratio, then resize. Never distorts."""
    target = w / h
    src = img.width / img.height

    if src > target:  # too wide — trim the sides
        new_w = round(img.height * target)
        left = (img.width - new_w) // 2
        box = (left, 0, left + new_w, img.height)
    else:  # too tall — trim top and bottom
        new_h = round(img.width / target)
        top = 0 if focus == "top" else (img.height - new_h) // 2
        box = (0, top, img.width, top + new_h)

    return img.crop(box).resize((w, h), Image.LANCZOS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not DOWNLOADS.exists():
        sys.exit(f"No such folder: {DOWNLOADS}")

    sources = [
        p for p in sorted(DOWNLOADS.iterdir())
        if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    ]
    if not sources:
        print(f"Nothing to do — {DOWNLOADS} is empty.")
        print("Download the photos from the links in the image list and drop them here.")
        return 0

    written, skipped, small = 0, [], []

    for src in sources:
        ids = [i for i in ID_IN_NAME.findall(src.name) if i in JOBS]
        if not ids:
            skipped.append(src.name)
            continue

        photo_id = ids[0]
        with Image.open(src) as img:
            img = img.convert("RGB")
            for rel, w, h, focus in JOBS[photo_id]:
                if img.width < w or img.height < h:
                    small.append(f"{src.name} is {img.width}×{img.height}, "
                                 f"{rel} wants {w}×{h} — download a larger size")
                out = IMAGES / rel
                print(f"{'would write' if args.dry_run else 'wrote'}  {rel:<44} "
                      f"({w}×{h})  from {src.name}")
                if not args.dry_run:
                    out.parent.mkdir(parents=True, exist_ok=True)
                    crop_to(img, w, h, focus).save(out, "WEBP", quality=82, method=6)
                written += 1

    print()
    print(f"{written} file(s) {'planned' if args.dry_run else 'written'}.")

    if small:
        print("\nToo small:")
        for line in small:
            print(f"  ! {line}")

    if skipped:
        print("\nNo matching photo id in the filename, so ignored:")
        for name in skipped:
            print(f"  - {name}")
        print("  Keep Pixabay's original filename — the id in it is how this script matches.")

    print("\nStill missing after this: the 11 product packshots. Pixabay has no")
    print("unbranded coffee bags, no gooseneck kettles and no brewing scales.")
    print("See docs/IMAGES.md for the full list and the generation prompts.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
