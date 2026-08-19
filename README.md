# Meridian — Coffee & Equipment

A concept storefront built as a portfolio piece: single-lot coffee and the
brewing equipment to go with it, in one brand.

**Stack** — Next.js 16 (App Router, Turbopack) · React 19 · TypeScript ·
Tailwind CSS v4 · local typed product data.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

Requires Node 20.9+ and network access on first build (fonts are fetched by
`next/font/google` at build time).

## The idea

Most portfolio shops sell one kind of thing, which means one kind of product
page. This one deliberately sells two, because that is the actual design
problem worth solving:

| | Lane A — coffee | Lane B — equipment |
|---|---|---|
| Purchase | Low price, repeat, emotional | High price, researched, rational |
| Leads with | Tasting notes, origin, roast | Category, specification, price |
| Key UI | Flavour profile, roast meter, grind/size variants | Spec table, finish switcher, comparison |
| Accent | `--color-roast` | `--color-origin` |
| Reference | Aesop, Alchemist, Onyx Coffee Lab | Bang & Olufsen, Fellow, Weber Workshops |

Both lanes share one palette, one type scale and one spacing rhythm. Holding
them together *is* the design system.

## Structure

```
src/
  app/
    layout.tsx          root layout, fonts, header/footer
    globals.css         design tokens + base layer + utilities
    page.tsx            homepage composition
    coffee/             catalog + [slug] bean PDP
    equipment/          catalog + [slug] equipment PDP
  components/
    layout/             SiteHeader, SiteFooter, Wordmark
    ui/                 Container/Section, Button, Primitives, Reveal, PageHeader
    catalog/            CoffeeCatalog, EquipmentCatalog, FilterGroup
    product/            BeanCard + BeanPurchase (lane A)
                        EquipmentCard + EquipmentPurchase (lane B)
    home/               homepage sections, in page order
  lib/
    brand.ts            brand and locale facts used in copy
    types.ts            Bean / Equipment models, price formatting
    products.ts         sample catalog
```

## Design tokens

All tokens live in `src/app/globals.css` under `@theme`. Nothing in the
components hardcodes a colour or a font size — change a token there and it
propagates. See [`docs/DESIGN.md`](docs/DESIGN.md) for the full reference.

## Placeholder imagery

There is no product photography yet. `<ProductStub>` renders a lit gradient
surface with a grain overlay in place of each image, at the correct aspect
ratio. It is intentionally abstract rather than a broken-image box, so the
layout reads as finished.

To swap in real assets: replace `ProductStub` with `next/image`, keep the
`ratio` values, and delete the component. No layout changes are needed.

## 3D

One product — the Atlas E1 grinder — is the designated 3D hero. The mount
point is marked in `src/components/home/HeroMachine.tsx`. The finish switcher
in that section is already wired to a colour value, so it will drive the
model's material once the canvas is in place.

```bash
npm install three @react-three/fiber @react-three/drei
```

Keep it to one compressed `.glb` under ~2 MB, lazy-loaded with
`next/dynamic({ ssr: false })`, with `ProductStub` as the poster and the
mobile fallback.

## Roadmap

- [x] Design tokens and base component set
- [x] Homepage
- [x] `/coffee` — catalog with roast / process / brew-method filters and sort
- [x] `/coffee/[slug]` — bean PDP with flavour profile, grind and size selectors
- [x] `/equipment` — catalog with category tabs and price sort
- [x] `/equipment/[slug]` — spec-led PDP with finish switcher and comparison table
- [ ] Cart drawer and checkout
- [ ] 3D hero on the Atlas E1
- [ ] Real photography pass

---

Not a real store. Built as a portfolio project.
