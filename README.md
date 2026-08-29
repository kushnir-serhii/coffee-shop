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
    subscription/       plan configurator, how it works, FAQ
    about/              story, sourcing report (#sourcing), roastery, contact (#contact)
    checkout/           three-step checkout + confirmation
    legal/[slug]/       terms, privacy, shipping
  components/
    layout/             SiteHeader, SiteFooter, Wordmark
    ui/                 Container/Section, Button, Primitives, Reveal, PageHeader
    catalog/            CoffeeCatalog, EquipmentCatalog, FilterGroup
    product/            BeanCard + BeanPurchase (lane A)
                        EquipmentCard + EquipmentPurchase (lane B)
    home/               homepage sections, in page order
    cart/               drawer, header button, quantity stepper
    checkout/           flow, order summary, confirmation
    subscription/       plan configurator
    three/              AtlasE1 model, scene, viewer
  lib/
    brand.ts            brand and locale facts used in copy
    types.ts            Bean / Equipment models, price formatting
    products.ts         sample catalog
    cart.tsx            cart context + localStorage
    order.ts            placed order, handed to the confirmation page
    legal.ts            the three legal documents
    media.ts            breakpoint and reduced-motion hooks
    hydration.ts        useHydrated
```

## Cart and checkout

State lives in `src/lib/cart.tsx` — a reducer behind context, persisted to
`localStorage` under `meridian.cart.v1`. Server and first client render both
start from an empty cart, so markup matches; the stored cart lands on the next
paint and `ready` guards anything that would otherwise flash.

A cart line is a *configured* product, not a product. The same bean at 250 g /
espresso is a different line from the same bean at 1 kg / whole bean, and the
line id is derived from that configuration — which is why nothing in the cart
branches on lane.

`/checkout` is one page in three steps. Completed steps collapse to a summary
with an Edit link rather than disappearing, and the order summary stays in view
throughout. Placing an order writes a `PlacedOrder` to `sessionStorage`
(`src/lib/order.ts`), clears the cart and routes to `/checkout/confirmation`,
which is the demo's stand-in for reading an order back by reference. No payment
is taken and nothing is sent anywhere.

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

[`docs/IMAGES.md`](docs/IMAGES.md) is the full shot list — every file the site
needs, its slot, ratio and minimum size, under the naming scheme the swap
assumes.

## 3D

The Atlas E1 is modelled in \`src/components/three/AtlasE1.tsx\` from three.js
primitives rather than loaded from a .glb — the shape is a machined billet, so
boxes, cylinders and a cone cost a few kilobytes of code instead of a 2 MB
asset, and the finish is a real PBR material instead of a baked texture.
Proportions follow the spec sheet, 128 × 196 × 390 mm, at 1 unit = 100 mm.

\`GrinderScene\` builds its studio from drei lightformers, not an HDR file, so
nothing is fetched at runtime. \`GrinderViewer\` owns every decision about
whether 3D runs at all:

- below \`lg\` the chunk never loads — the ProductStub is the mobile experience
- above it, the stub renders immediately and cross-fades out once the canvas
  reports it is live, so there is no empty box while the chunk downloads
- the same stub is the WebGL-unavailable fallback
- the scene idles at a slow spin; the first drag stops it for good and drops
  the render loop to \`demand\`, so the GPU only works while the user is turning
  the machine. \`prefers-reduced-motion\` skips the spin entirely
- the finish switcher lerps the body material rather than snapping it

Cost: about 260 kB gzipped, lazy, desktop only, after first paint. To swap in a
real model, replace the body of \`AtlasE1\` with a \`useGLTF\` scene and keep the
\`finish\` prop — nothing outside that file changes.

## Roadmap

- [x] Design tokens and base component set
- [x] Homepage
- [x] `/coffee` — catalog with roast / process / brew-method filters and sort
- [x] `/coffee/[slug]` — bean PDP with flavour profile, grind and size selectors
- [x] `/equipment` — catalog with category tabs and price sort
- [x] `/equipment/[slug]` — spec-led PDP with finish switcher and comparison table
- [x] Cart drawer, three-step checkout and order confirmation
- [x] 3D hero on the Atlas E1
- [x] `/subscription`, `/about` and `/legal/*` — nothing in the header or footer 404s
- [ ] Real photography pass

---

Not a real store. Built as a portfolio project.
