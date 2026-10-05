# System Architecture Overview: Meridian — Coffee & Equipment

> Meridian is a portfolio demo with no backend: a statically generated Next.js storefront whose only state lives in the visitor's browser. Choices marked _(existing)_ are already in the codebase. Choices marked _(confirmed)_ were approved by the user. Choices marked _(assumption)_ are proposed defaults that are not yet confirmed. Alternatives are listed so they can be revisited.

---

## 1. Application & Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack) _(existing)_. Read `node_modules/next/dist/docs/` before writing code, because this version has breaking changes.
- **UI Library:** React 19 _(existing)_. Server Components are the default; client components only where there is interaction (cart, filters, configurators, 3D).
- **Language:** TypeScript 5 in strict mode, with the `@/*` alias for `src/` _(existing)_.
- **Styling:** Tailwind CSS v4 through `@tailwindcss/postcss`; design tokens live in `src/app/globals.css` _(existing)_. The shared palette, type scale and spacing serve both lanes (see `docs/DESIGN.md`).
- **Typography:** Fraunces (display), Inter (UI and body) and JetBrains Mono (numerals and specs) through `next/font/google` _(existing)_.
- **3D Rendering:** three.js with @react-three/fiber and @react-three/drei. The hand-built Atlas E1 model loads lazily, on desktop only, and falls back to an image _(existing)_. 3D is currently disabled by the `SHOW_3D` flag in `src/components/three/GrinderViewer.tsx`, so the Atlas E1 page shows its photo on all screen sizes _(existing)_. Phase 3 "Photoreal 3D Grinder": load a compressed glTF/GLB (Draco or Meshopt) with drei's `useGLTF` _(assumption; alternative: replace the 3D view with a photo turntable)_.
- **Internationalisation (Phase 3):** locale-prefixed routes (`/uk/...`) using the App Router's built-in i18n pattern (middleware/proxy plus dictionaries) _(confirmed)_. Product copy is translated in the typed catalog modules. UAH prices are stored as fixed per-product values rather than converted live, so the demo stays deterministic.

---

## 2. Data & Persistence

- **Product Catalog:** typed TypeScript modules (`src/lib/products.ts`, `src/lib/legal.ts`, `src/lib/brand.ts`) bundled at build time _(existing)_. No database and no CMS: this is a deliberate non-goal.
- **Image Manifest:** `src/lib/images.ts` maps products, finishes and gallery slots to files under `public/images/{coffee,equipment,editorial}`. Missing slots fall back to `ProductStub` _(existing)_.
- **Cart State:** React context persisted to `localStorage` under `meridian.cart.v1`, and validated field by field on load _(existing)_.
- **Order Hand-off:** the placed order passes from checkout to the confirmation page through `sessionStorage` under `meridian.order.v1` _(existing)_. Nothing is sent to a server.
- **Hydration Safety:** browser-only state is read after hydration through `useSyncExternalStore` / `src/lib/hydration.ts` _(existing)_.
- **Caching:** none needed beyond static generation and the hosting CDN.

---

## 3. Infrastructure & Deployment

- **Rendering Strategy:** static generation for every route, with `generateStaticParams` and `notFound()` for product and legal slugs _(existing)_. Phase 2 adds `not-found.tsx`, `error.tsx` and `loading.tsx` _(assumption: App Router file conventions)_.
- **Hosting:** Vercel, Hobby tier, with an automatic preview deployment for each branch and production deploys from `main` _(confirmed)_.
- **Domain & Metadata:** `metadataBase` is unset, so on Vercel it resolves to `VERCEL_PROJECT_PRODUCTION_URL` _(existing)_.
- **Social Share Card:** site-wide card set in `src/app/layout.tsx` as `openGraph.images` (`/images/og/meridian-og.webp`) with `twitter.card = summary_large_image` _(existing)_. Coffee pages use their bag photo and equipment pages use their default-finish photo, both set per route's `generateMetadata` _(existing)_. The `opengraph-image` file convention is deliberately not used, since file-based metadata would override the per-product images _(existing)_.
- **Image Pipeline:** Python scripts (`scripts/prepare-images.py`, `scripts/prepare-generated.py`) read originals from `assets/images/` and crop and convert them to WebP in `public/images/`. `next/image` serves AVIF/WebP _(existing)_. Stock photos for `prepare-images.py` are in `assets/images/_downloads/`, raw photos for `prepare-generated.py` are in `assets/images/_generated/`, keeping them out of `public/` so they are not deployed _(existing)_.
- **CI/CD:** a GitHub Actions workflow that runs lint, type-check, build and end-to-end tests on each pull request _(confirmed)_.
- **Package Manager:** npm, with `package-lock.json` _(existing)_.

---

## 4. External Services & APIs

- **Authentication:** none. Accounts are out of scope _(confirmed non-goal)_.
- **Payments:** none. Checkout is a demo and only keeps the card's last four digits on the device _(confirmed non-goal)_.
- **Order Fulfilment / Email:** none _(confirmed non-goal)_.
- **Fonts:** Google Fonts, self-hosted at build time by `next/font` (no request reaches Google at runtime) _(existing)_.
- **Analytics:** none. The user confirmed that analytics and a sitemap are not needed for a link-shared portfolio piece _(confirmed)_.
- **Crawler blocking:** to stay inside the Vercel Hobby limits, `src/app/robots.ts` disallows every crawler except link-preview bots (so share cards still work), and `next.config.ts` sends `X-Robots-Tag: noindex, nofollow` on every response _(confirmed)_. Bots that ignore robots.txt are left to the Vercel Firewall (Bot Protection and AI Bots managed rules, set in the dashboard) _(confirmed)_.

---

## 5. Quality, Testing & Observability

- **Linting:** ESLint 9 flat config with `eslint-config-next` (core-web-vitals and typescript) _(existing)_.
- **Formatting:** Prettier with `prettier-plugin-tailwindcss`. The config already exists; install both packages and add a `format` script _(assumption)_.
- **End-to-End Tests (Phase 3 "Key-Journey Checks"):** Playwright, covering the coffee path, equipment path, subscription and checkout _(confirmed)_.
- **Unit Tests:** Vitest for pure logic such as cart parsing, pricing and subscription discounts _(confirmed)_.
- **Accessibility Checks:** `@axe-core/playwright` inside the end-to-end suite, against WCAG 2.1 AA _(confirmed)_.
- **Performance:** Lighthouse CI (or PageSpeed Insights), with a mobile Performance budget of 90+ _(assumption)_.
- **Error Monitoring & Logging:** none in production; the App Router's `error.tsx` boundaries handle failures gracefully. Vercel's built-in runtime logs are enough _(assumption; alternative: Sentry free tier)_.
