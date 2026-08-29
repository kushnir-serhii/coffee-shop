# Image shot list

Every image the site needs, and where it goes. Today each slot renders
`<ProductStub>` — a gradient placeholder built to the correct aspect ratio, so
dropping real files in is a swap, not a layout change.

Everything lives under `public/images/`, referenced in code as
`/images/<folder>/<file>`.

## Naming

```
coffee/<product-slug>-<view>.jpg        view: bag · beans · origin · brewed
equipment/<product-slug>-<finish>.jpg   finish: the colourway name from products.ts, lowercased
editorial/<place>.jpg                   named for where it appears, not what is in it
og/meridian-og.jpg                      social card
```

The slugs are the real ones from `src/lib/products.ts`. Keep them exact and
wiring the images up is a find-and-replace.

## Format

Supply JPG (PNG only if you need transparency). `next/image` generates WebP and
AVIF at build time — do not pre-convert. Sizes below are 2× the largest rendered
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
| `coffee/kirinyaga-ab-bag.jpg` | Kirinyaga AB — Kenya, light roast |
| `coffee/finca-la-soledad-bag.jpg` | Finca La Soledad — Guatemala, medium |
| `coffee/sitio-boa-vista-bag.jpg` | Sítio Boa Vista — Brazil, dark |
| `coffee/gesha-village-bag.jpg` | Gesha Village Lot 7 — Ethiopia, light |
| `coffee/el-diviso-bag.jpg` | El Diviso — Colombia, medium |
| `coffee/house-blend-no-4-bag.jpg` | House Blend No. 4 — blend, medium |

### Equipment packshots, default finish · 1:1 · 1400 × 1400

Used on the equipment card and the PDP.

| File | Product |
|---|---|
| `equipment/atlas-e1-grinder-graphite.jpg` | Atlas E1 — see the note below |
| `equipment/atlas-h1-hand-grinder-graphite.jpg` | Atlas H1 hand grinder |
| `equipment/meridian-one-espresso-bone.jpg` | Meridian One espresso machine |
| `equipment/pour-kettle-900-bone.jpg` | Pour Kettle 900 |
| `equipment/gram-scale-02-graphite.jpg` | Gram 0.2 scale |
| `equipment/meridian-dripper-bone.jpg` | Meridian Dripper |

### Editorial

| File | Ratio | Size | Where |
|---|---|---|---|
| `editorial/home-hero.jpg` | 4:5 | 1400 × 1750 | Homepage hero |
| `editorial/lane-coffee.jpg` | 16:10 | 1600 × 1000 | Homepage two-lane split, lane A |
| `editorial/lane-equipment.jpg` | 16:10 | 1600 × 1000 | Homepage two-lane split, lane B |
| `editorial/sourcing-at-origin.jpg` | 4:5 | 1200 × 1500 | Homepage sourcing section |
| `editorial/about-roastery.jpg` | 4:5 | 1200 × 1500 | `/about`, story section |
| `editorial/about-roasting-floor.jpg` | 4:5 | 1200 × 1500 | `/about`, roastery section |

---

## P2 — nice to have, not blocking a deploy (28)

### Coffee gallery thumbnails · 1:1 · 800 × 800

Three per bean, shown under the PDP main image:
`-beans.jpg` (macro of the roasted beans), `-origin.jpg` (farm or drying beds),
`-brewed.jpg` (the cup). 18 files across the six lots.

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

`og/meridian-og.jpg` · 1200 × 630. Not wired up yet — add it to `openGraph.images`
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

## Swapping placeholders for real files

1. Add an `image` field to `Bean` and `Equipment` in `src/lib/types.ts`, fill it in `src/lib/products.ts`.
2. Replace `<ProductStub stub={…} ratio="4 / 5" />` with `<Image src={…} width height alt />`, keeping the ratio.
3. Delete `ProductStub` from `src/components/ui/Primitives.tsx` once nothing imports it.

The layout does not change. That was the point of building the placeholder to
the right ratios.
