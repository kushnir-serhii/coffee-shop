# Meridian — Coffee & Equipment

A concept storefront that sells single-lot specialty coffee and the brewing
equipment to go with it, under one brand. Built as a portfolio project with
Next.js 16 and React 19. It is **not a real store**: no payment is taken and
no order is sent anywhere.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind CSS v4 · three.js / React Three Fiber · typed local product data, no
backend.

## Contents

- [Features](#features)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [How it works](#how-it-works)
- [Images](#images)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Roadmap](#roadmap)

## Features

- **Two-lane catalog.** 6 coffees and 6 pieces of equipment. The coffee catalog
  filters by roast, process and brew method and can be sorted. The equipment
  catalog has category tabs and a price sort.
- **Sensory-first coffee pages.** Origin story, tasting notes, roast meter,
  flavour profile, grind and bag-size options.
- **Spec-first equipment pages.** Spec table, finish switcher with a photo for
  each finish, and a comparison table.
- **Subscription.** Weekly, fortnightly or monthly delivery at 15 / 12 / 10% off.
- **Cart and checkout.** One slide-over cart, kept between visits, and a
  three-step checkout that ends on an order confirmation page.
- **Brand and legal pages.** About (story, sourcing, roastery, contact), plus
  terms, privacy and shipping.
- **Share previews.** A branded social card, and each product page uses its own
  product photo as the preview image.

### The design idea

Most portfolio shops sell one kind of product, so they need one kind of product
page. Meridian sells two kinds on purpose, because making both work in one
store is the design problem:

|            | Lane A — coffee                   | Lane B — equipment                      |
| ---------- | --------------------------------- | --------------------------------------- |
| Purchase   | Low price, repeat, emotional      | High price, researched, rational        |
| Leads with | Tasting notes, origin, roast      | Category, specification, price          |
| Key UI     | Flavour profile, roast meter      | Spec table, finish switcher, comparison |
| Accent     | `--color-roast`                   | `--color-origin`                        |
| References | Aesop, Alchemist, Onyx Coffee Lab | Bang & Olufsen, Fellow, Weber Workshops |

Both lanes share one palette, one type scale and one spacing rhythm. That
shared system is what holds the store together.

## Getting started

### Prerequisites

- Node.js **20.9+** and npm
- Network access on the first build, because `next/font/google` downloads the
  fonts at build time
- _Optional:_ Python 3 with [Pillow](https://pypi.org/project/pillow/), only
  if you want to re-run the image scripts

### Install and run

```bash
npm install
npm run dev        # http://localhost:3000
```

There are no environment variables to set.

## Scripts

| Command                   | What it does                                        |
| ------------------------- | --------------------------------------------------- |
| `npm run dev`             | Starts the dev server (Turbopack)                   |
| `npm run build`           | Builds for production                               |
| `npm start`               | Serves the production build                         |
| `npm run lint`            | Runs ESLint (`eslint-config-next`)                  |
| `npm run test:acceptance` | Runs the acceptance tests (see [Testing](#testing)) |

Code is formatted with Prettier and `prettier-plugin-tailwindcss`. The editor
settings in `.vscode/` format on save.

## Project structure

```
.
├── src/
│   ├── app/                 routes (App Router)
│   │   ├── layout.tsx       root layout, fonts, header/footer, site metadata
│   │   ├── globals.css      design tokens (@theme), base layer, utilities
│   │   ├── page.tsx         homepage
│   │   ├── coffee/          catalog + [slug] coffee page
│   │   ├── equipment/       catalog + [slug] equipment page
│   │   ├── subscription/    plan configurator, how it works, FAQ
│   │   ├── about/           story, sourcing (#sourcing), roastery, contact (#contact)
│   │   ├── checkout/        three-step checkout + confirmation
│   │   └── legal/[slug]/    terms, privacy, shipping
│   ├── components/          one component per file, grouped by area
│   │   ├── layout/          header, footer, wordmark, search, newsletter
│   │   ├── ui/              Container, Button, Field, Select, ProductImage, …
│   │   ├── home/            homepage sections, in page order
│   │   ├── catalog/         coffee and equipment catalogs, filters
│   │   ├── product/         cards and purchase panels for both lanes
│   │   ├── cart/            drawer, header button, quantity stepper
│   │   ├── checkout/        flow, order summary, confirmation
│   │   ├── subscription/    plan configurator
│   │   └── three/           Atlas E1 model, scene, viewer (currently off)
│   └── lib/                 data and client state
│       ├── products.ts      the catalog
│       ├── types.ts         Bean / Equipment models, price formatting
│       ├── images.ts        which photo exists for which slot
│       ├── cart.tsx         cart context, saved to localStorage
│       ├── order.ts         placed order, passed to the confirmation page
│       ├── subscription.ts  delivery frequencies and discounts
│       ├── brand.ts, legal.ts, countries.ts
│       └── media.ts, hydration.ts   breakpoint, reduced-motion and hydration hooks
├── public/images/           every image the site serves (WebP)
├── assets/images/           source photos for the image scripts (not deployed)
├── scripts/                 Python image pipeline
├── tests/acceptance/        acceptance tests (node:test)
├── docs/                    design and image reference
├── context/                 product, architecture, roadmap and feature specs
└── .claude/, .awos/, .awos-tune/   AI-assistant config (agents, skills, commands)
```

The full component map is in
[`context/components-index.md`](context/components-index.md).

## How it works

### Data

There is no database, CMS or API. The catalog, legal pages and brand copy are
typed TypeScript modules in `src/lib/`, bundled at build time. Every route is
statically generated. Product and legal slugs use `generateStaticParams` and
return `notFound()` for unknown slugs.

### Cart and checkout

The cart is a reducer behind React context
([`src/lib/cart.tsx`](src/lib/cart.tsx)). It is saved to `localStorage` under
`meridian.cart.v1` and checked field by field when it loads. The server render
and the first client render both start from an empty cart, so the markup
matches. The saved cart appears on the next paint.

A cart line is a _configured_ product. The same coffee at 250 g / espresso and
at 1 kg / whole bean are two different lines. The line id comes from that
configuration, so the cart never needs to check which lane a product is from.

`/checkout` is one page with three steps. A finished step collapses to a
summary with an Edit link. Placing an order writes the order to
`sessionStorage` (`meridian.order.v1`), clears the cart and opens
`/checkout/confirmation`.

### Design tokens

All colours, type sizes and spacing are tokens under `@theme` in
[`src/app/globals.css`](src/app/globals.css). Components don't hardcode colours
or font sizes. Change a token there and it applies everywhere. See
[`docs/DESIGN.md`](docs/DESIGN.md).

### 3D grinder (switched off)

The Atlas E1 grinder has a hand-built three.js model
([`src/components/three/`](src/components/three/)). It is made from three.js
primitives with a PBR material and lit by drei lightformers, so the 3D view
doesn't download any model files. It loads lazily and only on desktop.

It is **currently switched off** with `SHOW_3D = false` in
[`GrinderViewer.tsx`](src/components/three/GrinderViewer.tsx), so the Atlas E1
shows its photo at every screen size. Set the flag to `true` to turn the 3D view
back on. A photoreal glTF model is planned for Phase 3.

## Images

Every image the site uses is a WebP file under `public/images/`
(`coffee/`, `equipment/`, `editorial/`, `og/`).
[`src/lib/images.ts`](src/lib/images.ts) lists which files exist. If a slot has
no file, `<ProductImage>` shows a placeholder at the same aspect ratio, so adding
a photo never changes the layout.

The source photos live in `assets/images/`, outside `public/`, so they are not
deployed. Two scripts crop and resize them and save them as WebP:

```bash
pip install Pillow
python scripts/prepare-images.py --dry-run      # stock photos from assets/images/_downloads/
python scripts/prepare-generated.py --dry-run   # generated photos from assets/images/_generated/
```

Run them without `--dry-run` to write the files. Then add any new path to
`src/lib/images.ts`. [`docs/IMAGES.md`](docs/IMAGES.md) has the shot list, the
naming rules and the slots that still need a photo.

## Testing

```bash
npm run test:acceptance
```

The acceptance tests use Node's built-in test runner and need no extra
dependencies. They build the app, start `next start` on a free port, and check
pages, images and metadata over HTTP and on disk. To reuse an existing `.next`
build, set `SKIP_BUILD=1`.

Each test is tagged with the spec it covers (`@spec`), and regression tests
are tagged `@regression`. Unit tests (Vitest), end-to-end tests (Playwright)
and CI are planned for Phase 3.

## Deployment

The site is built for [Vercel](https://vercel.com) and needs no configuration.
Every branch gets a preview deployment, and `main` deploys to production.
`metadataBase` is left unset on purpose, so on Vercel Next.js uses
`VERCEL_PROJECT_PRODUCTION_URL` for the absolute URLs in share previews. Local
builds use `http://localhost:3000`.

### Keeping bots out

The site runs on Vercel's free Hobby plan, so crawler traffic is blocked to
keep usage inside its limits:

- [`src/app/robots.ts`](src/app/robots.ts) serves a `robots.txt` that
  disallows every crawler. Link-preview bots (Telegram, LinkedIn, Slack, X,
  Facebook, WhatsApp, Discord) are still allowed, so shared links keep their
  preview card.
- [`next.config.ts`](next.config.ts) adds `X-Robots-Tag: noindex, nofollow` to
  every response, pages and images included.
- `robots.txt` only works for bots that obey it. Bots that ignore it are
  blocked by the Vercel Firewall. In the Vercel dashboard, go to
  **Project → Firewall → Bot Management** and turn on **Bot Protection**
  (challenge) and **AI Bots** (deny). Both are free on Hobby.

## Documentation

| File                                                                             | Contents                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------- |
| [`docs/DESIGN.md`](docs/DESIGN.md)                                               | Design tokens, type scale, colour reference |
| [`docs/IMAGES.md`](docs/IMAGES.md)                                               | Image shot list, naming rules, status       |
| [`context/product/product-definition.md`](context/product/product-definition.md) | Vision, audience, personas, features        |
| [`context/product/architecture.md`](context/product/architecture.md)             | Architecture and technology choices         |
| [`context/product/roadmap.md`](context/product/roadmap.md)                       | Phased roadmap                              |
| [`context/spec/`](context/spec/)                                                 | Feature specs, decisions and task lists     |
| [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md)                               | Rules for AI coding assistants              |

## Roadmap

- [x] **Phase 1:** two-lane storefront, coffee and equipment product pages,
      subscription, cart and checkout, About and legal pages
- [ ] **Phase 2:** real photography (mostly done), social share card (done),
      branded 404, error and loading pages
- [ ] **Phase 3:** accessibility and performance checks, automated tests and CI,
      Ukrainian language and UAH prices, photoreal 3D grinder

See [`context/product/roadmap.md`](context/product/roadmap.md) for details.

---

Not a real store. Built as a portfolio project.
