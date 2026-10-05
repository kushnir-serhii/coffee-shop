# Image shot list

Every image the site needs, and where it goes. Each slot renders
`<ProductImage>`: the real photo when it exists, otherwise a gradient
placeholder at the same aspect ratio, so adding a file never changes the layout.

## Status

**Done:** all 6 coffee packshots and their 18 gallery thumbnails, all 6
editorial images, and these equipment finishes: Atlas E1 Graphite and Roast,
Atlas H1 Graphite and Bone, Meridian One Bone, Pour Kettle 900 Bone,
Gram 0.2 Graphite, Meridian Dripper Bone. These show on the cards, product
pages, cart drawer and checkout summary.

**Still missing** (these slots show the placeholder):

| File | Product |
|---|---|
| `equipment/atlas-e1-grinder-bone.webp` | Atlas E1, Bone |
| `equipment/meridian-one-espresso-graphite.webp` | Meridian One, Graphite |
| `equipment/pour-kettle-900-graphite.webp` | Pour Kettle 900, Graphite |
| `equipment/pour-kettle-900-origin.webp` | Pour Kettle 900, Origin |
| `equipment/gram-scale-02-bone.webp` | Gram 0.2, Bone |
| `equipment/meridian-dripper-origin.webp` | Meridian Dripper, Origin |
| `equipment/meridian-dripper-roast.webp` | Meridian Dripper, Roast |
| `og/meridian-og.webp` | Social card (also needs wiring in `layout.tsx`) |

**To revisit:** `editorial/about-roastery.webp` shows another roastery's sign
and logo, and `editorial/home-hero.webp` is a dark shot rather than the light
studio look described under Art direction.

Update this list when you add a file (see "Adding a photograph" at the end).

Everything lives under `public/images/`, referenced in code as
`/images/<folder>/<file>`.

## Naming

```
coffee/<product-slug>-<view>.webp        view: bag · beans · origin · brewed
equipment/<product-slug>-<finish>.webp   finish: the colourway name from products.ts, lowercased
editorial/<place>.webp                   named for where it appears, not what is in it
og/meridian-og.webp                      social card
```

The slugs are the real ones from `src/lib/products.ts`. Keep them exact and
wiring the images up is a find-and-replace.

## Format

Source files are WebP (`scripts/prepare-images.py` writes them at quality 82).
`next/image` additionally serves AVIF to browsers that support it, WebP to the rest
(`images.formats` in `next.config.ts`). Sizes below are 2× the largest rendered
box; bigger is fine, smaller goes soft on a retina screen. **Crop to the ratio
before dropping the file in** — the ratios are set in the `ProductStub` calls and
the layout assumes them.

---

## P1 — the site looks unfinished without these (18)

### Coffee packshots · 4:5 · 1200 × 1500

Used on the bean card in `/coffee`, as the PDP main image, and in the cart
drawer and order summary.

| File | Product |
|---|---|
| `coffee/kirinyaga-ab-bag.webp` | Kirinyaga AB — Kenya, light roast |
| `coffee/finca-la-soledad-bag.webp` | Finca La Soledad — Guatemala, medium |
| `coffee/sitio-boa-vista-bag.webp` | Sítio Boa Vista — Brazil, dark |
| `coffee/gesha-village-bag.webp` | Gesha Village Lot 7 — Ethiopia, light |
| `coffee/el-diviso-bag.webp` | El Diviso — Colombia, medium |
| `coffee/house-blend-no-4-bag.webp` | House Blend No. 4 — blend, medium |

### Equipment packshots, default finish · 1:1 · 1400 × 1400

Used on the equipment card and the PDP.

| File | Product |
|---|---|
| `equipment/atlas-e1-grinder-graphite.webp` | Atlas E1 — see the note below |
| `equipment/atlas-h1-hand-grinder-graphite.webp` | Atlas H1 hand grinder |
| `equipment/meridian-one-espresso-bone.webp` | Meridian One espresso machine |
| `equipment/pour-kettle-900-bone.webp` | Pour Kettle 900 |
| `equipment/gram-scale-02-graphite.webp` | Gram 0.2 scale |
| `equipment/meridian-dripper-bone.webp` | Meridian Dripper |

### Editorial

| File | Ratio | Size | Where |
|---|---|---|---|
| `editorial/home-hero.webp` | 4:5 | 1400 × 1750 | Homepage hero |
| `editorial/lane-coffee.webp` | 16:10 | 1600 × 1000 | Homepage two-lane split, lane A |
| `editorial/lane-equipment.webp` | 16:10 | 1600 × 1000 | Homepage two-lane split, lane B |
| `editorial/sourcing-at-origin.webp` | 4:5 | 1200 × 1500 | Homepage sourcing section |
| `editorial/about-roastery.webp` | 4:5 | 1200 × 1500 | `/about`, story section |
| `editorial/about-roasting-floor.webp` | 4:5 | 1200 × 1500 | `/about`, roastery section |

---

## P2 — nice to have, not blocking a deploy (28)

### Coffee gallery thumbnails · 1:1 · 800 × 800

Three per bean, shown under the PDP main image:
`-beans.webp` (macro of the roasted beans), `-origin.webp` (farm or drying beds),
`-brewed.webp` (the cup). 18 files across the six lots.

### Extra equipment finishes · 1:1 · 1400 × 1400

The finish switcher swaps the image, so each colourway wants its own file.

| Product | Extra finishes |
|---|---|
| Atlas E1 | `-bone`, `-roast` |
| Atlas H1 | `-bone` |
| Meridian One | `-graphite` |
| Pour Kettle 900 | `-graphite`, `-origin` |
| Gram 0.2 | `-bone` |
| Meridian Dripper | `-origin`, `-roast` |

### Social

`og/meridian-og.webp` · 1200 × 630. Not wired up yet — add it to `openGraph.images`
in `src/app/layout.tsx` when it exists.

---

## Art direction

Warm-neutral light studio on `#FAF8F5` — never pure white, never grey. Soft
directional key from the top left, gentle falloff, one soft shadow. Editorial
rather than catalogue: closer to Aesop and Bang & Olufsen than to a marketplace
listing. No props unless the shot calls for them, no text, no logos, no people
in focus.

Finish colours, for anything generated or retouched:

| Finish | Colour |
|---|---|
| Graphite | `#3A3733` warm near-black |
| Bone | `#E8E1D6` warm off-white |
| Roast | `#8E3F1F` burnt terracotta |
| Origin | `#3F5A46` deep forest green |

## The Atlas E1 is different

It is rendered in real 3D on desktop, so its photographs only appear as the
mobile view, the loading poster and the WebGL fallback. If you would rather shoot
it and drop the 3D, that is a one-line change in `GrinderViewer`.

## Generated images (packshots, extra finishes, social card)

Drop the files (jfif, jpg, png or webp) in `public/images/_generated/`. The
filename only needs a product keyword and, for equipment, optionally a finish:
`kirinyaga.jfif`, `kettle graphite.jfif`, `h1 bone.png`, `og.jfif`. Then:

```bash
python scripts/prepare-generated.py --help-names   # keywords per product
python scripts/prepare-generated.py --dry-run      # check the matching
python scripts/prepare-generated.py                # crop, resize, save as WebP
```

## Adding a photograph

Every slot renders `<ProductImage>` (`src/components/ui/ProductImage.tsx`): a
`next/image` at the slot's ratio, or the `ProductStub` placeholder when the file
does not exist yet. To light up a slot:

1. Put the WebP at its path above.
2. Add that path to the `available` set in `src/lib/images.ts`.

An equipment finish without its own photo keeps the stub in that finish's
colour rather than borrowing another finish's photo.
