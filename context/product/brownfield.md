# Brownfield Findings

## Product

### Purpose & positioning
- **Meridian — Coffee & Equipment**: a concept storefront selling single-lot specialty coffee *and* brewing equipment under one brand. Built as a portfolio piece; "Not a real store." (`README.md`)
- The core design problem is selling two very different product types in one shop: coffee (low price, repeat, emotional purchase) and equipment (high price, researched, rational purchase). Both share one palette, type scale and spacing rhythm. (`README.md` "The idea", `docs/DESIGN.md`)
- Brand facts: roastery in Lviv, Ukraine; "Roasted in Lviv · shipped in 48 h"; prices in EUR (`en-IE` formatting). (`src/lib/brand.ts`)
- Reference brands: Aesop, Alchemist, Onyx Coffee Lab (coffee); Bang & Olufsen, Fellow, Weber Workshops (equipment). (`README.md`)

### Target audience signals
- Specialty-coffee home brewers: copy covers origin, altitude, producer, varietal, process, tasting notes, flavour profile and brew methods. (`src/lib/products.ts`)
- Home-espresso and gear enthusiasts: spec-led equipment pages, finish switcher, comparison table, premium price points (€48 to €2,890). (`src/lib/products.ts`, `src/app/equipment/[slug]/page.tsx`)
- Secondary audience: portfolio reviewers (hiring managers, clients) judging design and engineering quality. (`README.md`)

### Main features
- Homepage: editorial hero, lane split, featured beans, equipment row, sourcing section, subscription CTA. (`src/app/page.tsx`, `src/components/home/*`)
- Coffee catalog with roast / process / brew-method filters and sorting; bean product page with roast meter, flavour profile, grind and size variants. (`src/app/coffee/*`, `src/components/catalog/CoffeeCatalog.tsx`, `src/components/product/BeanPurchase.tsx`)
- Equipment catalog with category tabs and price sort; spec-led product page with finish switcher and comparison table. (`src/app/equipment/*`, `src/components/product/EquipmentPurchase.tsx`)
- Interactive 3D model of the flagship Atlas E1 grinder (desktop only, lazy-loaded, falls back to an image). (`src/components/three/*`)
- Subscription configurator: weekly, every 2 weeks or monthly, at 10–15% off. (`src/components/subscription/Plan.tsx`, `src/app/subscription/page.tsx`)
- Cart drawer (saved in localStorage) and a three-step checkout with a confirmation page. No payment is taken and no order is sent anywhere. (`src/lib/cart.tsx`, `src/components/checkout/*`, `src/lib/order.ts`)
- About page (story, sourcing report, roastery, contact) and legal pages (terms, privacy, shipping). (`src/app/about/page.tsx`, `src/app/legal/[slug]/page.tsx`, `src/lib/legal.ts`)
- Accessibility and motion: WCAG AA contrast, reduced-motion support, focus-trapped cart drawer. (`docs/DESIGN.md`)

### Catalog
- 6 coffees (Kenya, Guatemala, Brazil, Ethiopia Gesha, Colombia El Diviso, House Blend No. 4), €11.50–€48 per bag. (`src/lib/products.ts`)
- 6 equipment items: Atlas E1 grinder (€1,490), Atlas H1 hand grinder, Meridian One espresso machine (€2,890), Pour Kettle 900, Gram 0.2 scale, Meridian Dripper. (`src/lib/products.ts`)
- Catalog data is local and typed on purpose; no CMS or backend. (`src/lib/products.ts` header comment)

### User journey
- Home → pick a lane (coffee or equipment) → catalog with filters → product page (configure grind/size or finish) → add to cart → cart drawer → three-step checkout → confirmation. Alternative path: Home or a coffee product page → subscription configurator → checkout. (`src/app/*`)

### Current state
- Every roadmap item in the README is done except the **real photography pass**, which is in progress: new images under `public/images/{coffee,equipment,editorial}`, plus `src/lib/images.ts`, `src/components/ui/ProductImage.tsx` and `docs/IMAGES.md`. (`README.md` Roadmap, git status)

## Capabilities

### Fully implemented
- **Static product and legal routes:** `generateStaticParams` plus `notFound()` for unknown slugs; each route has its own metadata. (`src/app/coffee/[slug]/page.tsx`, `src/app/equipment/[slug]/page.tsx`, `src/app/legal/[slug]/page.tsx`)
- **Site-wide SEO basics:** title template, description, basic Open Graph, favicon and app icons. `metadataBase` is still a placeholder domain. (`src/app/layout.tsx`)
- **Skip-to-content link.** (`src/app/layout.tsx`)
- **Hardened saved cart:** localStorage data is validated field by field; older carts without `image` still load. (`src/lib/cart.tsx`)
- **Modern image formats:** AVIF/WebP via `next/image`. (`next.config.ts`)
- **SSR-safe media-query hooks** driving desktop-only 3D and reduced motion. (`src/lib/media.ts`)

### Partially implemented (photography pass, uncommitted)
- Real images in place: 6 coffee bags, 18 gallery thumbnails, 6 editorial images, 8 equipment finishes. Missing slots fall back to `ProductStub`. (`src/lib/images.ts`, `src/components/ui/ProductImage.tsx`)
- **7 equipment finishes still placeholders:** E1 bone, Meridian One graphite, Pour Kettle 900 graphite and origin, Gram 0.2 bone, Dripper origin and roast. (`docs/IMAGES.md`)
- **No social share card:** no OG image file; `openGraph.images` not set; script writes `.jpg` while docs expect `.webp`. (`src/app/layout.tsx`, `scripts/prepare-generated.py:79`, `docs/IMAGES.md`)
- **Subscription cart line has no image.** (`src/components/subscription/Plan.tsx:179-189`)
- **Gallery photos shared across coffees** rather than unique per lot. (`scripts/prepare-images.py`)
- **Placeholder gradient commented out** in `ProductStub`, so stubs lose their colour. (`src/components/ui/Primitives.tsx` ~179)
- **Image pipeline housekeeping:** `prepare-generated.py` reads a non-existent `_generated/` folder; ~25 raw source files sit in `public/images/_downloads/` and would be deployed.
- **Two images flagged for redo:** About roastery (shows another brand's sign) and the home hero (too dark). (`docs/IMAGES.md`)
- **Stale copy:** README "Placeholder imagery" section and comments in `HeroMachine.tsx:53`, `EquipmentPurchase.tsx:14` predate the photos and 3D.
- **Repo clutter:** `_to_delete/`, `payload/src-root/`, default create-next-app SVGs in `public/`.

### Planned / TODO
- No TODO/FIXME markers in code. Only open README item: real photography pass. (`README.md:149`)
- Optional: swap the hand-built 3D grinder for a `useGLTF` model, or drop it for a photo. (`docs/IMAGES.md`, `README.md`)

### Missing quality infrastructure
- No tests, test runner or CI. (`package.json`, no `.github/`)
- Prettier config exists but Prettier is not installed; no `format` script. (`.prettierrc.json`)
- No `not-found.tsx`, `error.tsx` or `loading.tsx`.
- No deploy config or `.env.example`.
- _Not needed (confirmed by the user):_ analytics, sitemap, robots and search discoverability. Meridian is a portfolio piece shared by direct link.

## Technology

- **Framework:** Next.js 16.3.1 (App Router, Turbopack), React 19.2.8, TypeScript 5 in strict mode, `@/*` path alias to `src/`. (`package.json`, `tsconfig.json`)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`; design tokens in `src/app/globals.css`. (`postcss.config.mjs`)
- **Fonts:** Fraunces, Inter and JetBrains Mono through `next/font/google`. (`src/app/layout.tsx`)
- **3D:** three 0.185, @react-three/fiber 9, @react-three/drei 10; hand-built Atlas E1 model, lazy-loaded on desktop. (`src/components/three/*`)
- **Images:** `next/image` with AVIF/WebP; Python scripts crop and convert source photos to WebP. (`next.config.ts`, `scripts/prepare-images.py`, `scripts/prepare-generated.py`)
- **State and data:** React context cart persisted to `localStorage` (`meridian.cart.v1`); placed order handed to confirmation via `sessionStorage` (`meridian.order.v1`); catalog and legal copy are typed TS modules. No database, no API routes. (`src/lib/cart.tsx`, `src/lib/order.ts`, `src/lib/products.ts`, `src/lib/legal.ts`)
- **Rendering:** product and legal routes statically generated via `generateStaticParams`; ~19 client components. (`src/app/**/[slug]/page.tsx`)
- **Lint/format:** ESLint 9 flat config with `eslint-config-next` core-web-vitals + typescript; Prettier config with Tailwind plugin, but Prettier not installed. (`eslint.config.mjs`, `.prettierrc.json`)
- **Deployment / CI / tests:** none configured — no hosting config, no `.github/`, no test runner. `metadataBase` is a placeholder (`https://meridian-coffee.example`). (`src/app/layout.tsx`)
- **External services:** none at runtime (no auth, payments, analytics, CMS).
