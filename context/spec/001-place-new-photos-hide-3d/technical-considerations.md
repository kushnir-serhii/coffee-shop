# Technical Specification: Place New Photos and Hide the 3D Grinder

- **Functional Specification:** [functional-spec.md](./functional-spec.md) · decisions: [decisions.md](./decisions.md)
- **Status:** Completed
- **Author(s):** Serhii Kushnir

---

## 1. High-Level Technical Approach

This is a content-and-config change. It adds no new UI components and no new runtime dependencies.

1. **Process the 10 new raw photos** with the existing `scripts/prepare-generated.py`. The script already knows every target name, so its keyword matching produces the right files. Only the new files are fed to it (see 2.1).
2. **Register the new files** in the `available` set in `src/lib/images.ts`. Every slot (PDP, cards, cart drawer, order summary) already resolves through `equipmentImage()` / `editorialImage()`, so placeholders become photos with no component edits. The hero and equipment-lane files overwrite paths that are already registered.
3. **Hide 3D** with one module-level constant in `GrinderViewer`. When it is off, the viewer always returns the existing photo poster, on every screen size.
4. **Share previews:** add a site-wide `openGraph.images` in the root layout, and per-product `openGraph.images` in the coffee and equipment `generateMetadata`. Remove the placeholder `metadataBase` so Next falls back to Vercel's production URL automatically.
5. **Keep raw sources off the deploy** by moving them out of `public/` (see 2.5).
6. **Update `docs/IMAGES.md`** (the shot list) so it shows what is done and what is still missing.

---

## 2. Proposed Solution & Implementation Plan (The "How")

### 2.1 Image processing (FR 2.1, 2.2, 2.3, 2.4)

Source → output mapping. The script's keywords produce these targets; I traced each filename through `match()`:

| Source (raw) | Output under `public/images/` | Size / format |
|---|---|---|
| `e1 bone.jfif` | `equipment/atlas-e1-grinder-bone.webp` | 1400×1400 WebP |
| `espresso graphite.jfif` | `equipment/meridian-one-espresso-graphite.webp` | 1400×1400 WebP |
| `kettle graphite.jfif` | `equipment/pour-kettle-900-graphite.webp` | 1400×1400 WebP |
| `kettle origin.jfif` | `equipment/pour-kettle-900-origin.webp` | 1400×1400 WebP |
| `scale bone.jfif` | `equipment/gram-scale-02-bone.webp` | 1400×1400 WebP |
| `dripper origin.jfif` | `equipment/meridian-dripper-origin.webp` | 1400×1400 WebP |
| `dripper roast.jfif` | `equipment/meridian-dripper-roast.webp` | 1400×1400 WebP |
| `hero.jfif` | `editorial/home-hero.webp` (overwrite) | 1400×1750 WebP (same 4:5 as today) |
| `lane-equipment.jfif` | `editorial/lane-equipment.webp` (overwrite) | 1600×1000 WebP (same 16:10 as today) |
| `og.jfif` | `og/meridian-og.jpg` | 1200×630 **JPEG** |

- **Run method:** copy only these 10 files into a staging folder and run `python scripts/prepare-generated.py --src <staging> --dry-run`, then run it again without `--dry-run`. Do **not** point `--src` at the whole raw folder. It would also re-process `e1.jfif`, `kettle.jfif`, the bag shots and so on, overwriting live images. It would also send `lane-equipment-old.jfif` and `lane-equipment.jfif` to the same target, and the sort order makes the *old* file win.
- **OG format correction:** the decisions log hints at `og/meridian-og.webp`, but the script writes `og/meridian-og.jpg` on purpose, because some networks ignore WebP previews. This spec uses `.jpg`. **Assumption.**
- Check the "smaller than the slot" warnings the script prints. Any listed file will look soft and should be re-sourced.

### 2.2 Image manifest — `src/lib/images.ts`

- Add the 7 new `equipment/...` paths to `available`. `editorial/home-hero.webp` and `editorial/lane-equipment.webp` are already listed, so nothing changes for them.
- The OG image is **not** added to `available` (it is not rendered by `ProductImage`). It is referenced directly as a constant path in metadata.
- No API change: `equipmentImage(slug, finish)`, `beanImage(slug, view)` and `editorialImage(name)` stay as they are. All 13 finishes now resolve to a path, so `ProductStub` is no longer reached for equipment. It stays in place as the fallback.

### 2.3 Hide the 3D grinder — `src/components/three/GrinderViewer.tsx` (FR 2.5)

- Add a module-level flag, e.g. `const SHOW_3D = false`, with a comment pointing to the Phase 3 "Photoreal 3D Grinder" item.
- Render logic: `if (!SHOW_3D || !wide) return poster;`. The canvas branch, the cross-fade and the "Drag to rotate" pill stay in the file unchanged, so turning 3D back on is a one-character change.
- With the flag off, `GrinderScene` is never rendered. Its `next/dynamic` chunk (three.js, R3F, drei) is therefore never requested, which also gives a desktop performance win.
- Mobile: no change. The `!wide` path already returns this same poster. The desktop poster renders through the same `ProductImage` with `ratio="1 / 1"`, so the frame size matches the old `aspect-square` wrapper.
- The finish switcher keeps working: `EquipmentPurchase` passes `active.name` → `finishName`, and the poster `key={finishName}` remounts and swaps the photo. Bone now resolves because of 2.2.
- `three/` components, `HeroMachine` and the npm deps stay in the repo (per decisions). `HeroMachine` stays commented out in `src/app/page.tsx`.

### 2.4 Share preview metadata (FR 2.4)

| File | Change |
|---|---|
| `src/app/layout.tsx` | Remove the placeholder `metadataBase` (`https://meridian-coffee.example`). With it unset, Next 16 resolves relative social image URLs against `VERCEL_PROJECT_PRODUCTION_URL` (or `VERCEL_BRANCH_URL` / `VERCEL_URL` on previews; `localhost` locally). This is verified in `next/dist/lib/metadata/resolvers/resolve-url.js`. Add `openGraph.images: [{ url: "/images/og/meridian-og.jpg", width: 1200, height: 630, alt }]` and `twitter: { card: "summary_large_image" }`. |
| `src/app/coffee/[slug]/page.tsx` → `generateMetadata` | Add `openGraph: { title: bean.name, description, images: [beanImage(slug, "bag")] }`. |
| `src/app/equipment/[slug]/page.tsx` → `generateMetadata` | Add `openGraph: { title: item.name, description: item.tagline, images: [equipmentImage(slug, item.colourways[0].name)] }`. |

- **Merge rule:** Next merges metadata objects **shallowly**, so a child `openGraph` replaces the parent's whole `openGraph` object. Product pages must therefore set `title` and `description` inside `openGraph` themselves. Other pages (About, catalogs, legal, checkout, subscription) do not define `openGraph`, so they inherit the brand card. If any of them later adds its own `openGraph`, it must repeat the brand `images`.
- If a product image resolves to `undefined`, omit `images` so the brand card is inherited. This keeps the fallback rule intact for a future product without a photo.
- **Not** using the `opengraph-image.*` file convention: file-based metadata takes priority over config, so a root `opengraph-image.jpg` would override the per-product images.
- The site-wide card (and only that card) is converted to JPEG for compatibility. Product previews are WebP (see Risks).

### 2.5 Raw sources off the live site (FR 2.6)

- **Move** `public/images/_downloads/` → `assets/images/_downloads/` (outside `public/`, still versioned in git). Move the empty `public/images/_generated/` → `assets/images/_generated/` too. _(confirmed)_
- Update the source-folder constants in `scripts/prepare-images.py` (`DOWNLOADS`) and `scripts/prepare-generated.py` (`SRC`), plus the docstrings and `docs/IMAGES.md`. The output folder (`public/images/...`) is unchanged.
- Result: `/images/_downloads/hero.jfif` returns 404 under `next start`, on Vercel and on any other host, with no ignore-file subtleties.
- Alternative (not chosen): keep the files in place and add `.vercelignore`. That only protects Vercel deploys, and the files stay servable locally and on any other host.

### 2.6 Component Breakdown

| UI item | Tag | Notes |
|---|---|---|
| Equipment finish photo on the PDP | `reuse: src/components/ui/ProductImage.tsx` | Via `EquipmentPurchase`. The source of truth is the manifest. |
| Atlas E1 visual (PDP; homepage showcase stays hidden) | `extend: src/components/three/GrinderViewer.tsx` | Add the `SHOW_3D` flag (module constant, not a prop, so callers stay unchanged). |
| Equipment card / cart line / order summary thumbnails | `reuse: src/components/product/EquipmentCard.tsx`, `src/components/cart/CartDrawer.tsx`, `src/components/checkout/OrderSummary.tsx` | These already call `equipmentImage()`, so no edits are needed. |
| Homepage hero | `reuse: src/components/home/Hero.tsx` | The file is overwritten at the same path. |
| Homepage lanes | `reuse: src/components/home/LaneSplit.tsx` | This file already renders the lanes from a data array with `.map()` (`lane.image`), so only the file changes. |
| Finish switcher | `reuse: src/components/product/EquipmentPurchase.tsx` | The swatches are already `.map()` over `item.colourways`. |

No new component files. The multi-component files in the index are not touched.

### 2.7 Documentation

- `docs/IMAGES.md` (the shot list): move the 7 finishes, the light hero, the new lane photo and the OG card to **Done**. Change the OG entry to `og/meridian-og.jpg`. Keep `editorial/about-roastery.webp` (another brand's sign) and the per-coffee gallery shots under **Still missing / To revisit**. Update the source folder paths after 2.5.
- `context/product/architecture.md`: the image pipeline line now points to `assets/images/_downloads/`. The social share card is config-based (`openGraph.images`), not the `opengraph-image` file convention. The 3D line notes that 3D is currently disabled by a flag.

---

## 3. Impact and Risk Analysis

- **System Dependencies:** `src/lib/images.ts` (the manifest) is read by `EquipmentPurchase`, `EquipmentCard`, `CartDrawer`, `OrderSummary`, `Hero`, `LaneSplit` and the two product routes' metadata. Cart state stores only slug and finish name, so existing carts in `localStorage` pick up the new photos with no migration.

| Risk | Mitigation |
|---|---|
| Running the script on the whole raw folder overwrites live images, and the `lane-equipment-old` file wins over the new lane photo. | Stage only the 10 new files, run `--dry-run` first, and check `git status` shows only the expected outputs. |
| A stale image cache shows the old dark hero after the file is overwritten at the same path. | Vercel's image cache is per deployment, so a new deploy serves the new file. Locally, delete `.next/cache/images` if the old hero still shows. |
| No `metadataBase` → local `next build` warns and resolves OG URLs to `localhost`. | Expected locally. Verify previews on the Vercel preview or production URL. If a custom domain is added later, set `metadataBase` to it explicitly. |
| Product previews are WebP; some crawlers (older LinkedIn, some email clients) skip WebP `og:image`. | Telegram, Slack, X and Facebook render WebP. If LinkedIn fails in testing, add JPEG share copies (`og/products/<slug>.jpg`) generated by the script. This is a follow-up, not part of this scope. |
| Source photos smaller than their slot look soft (especially the 1400×1750 hero). | Read the script's "smaller than the slot" report and re-source any file it flags before merge. |
| Moving `_downloads/` breaks someone's muscle memory or an existing doc link. | Update both scripts, their docstrings and `docs/IMAGES.md` in the same change. |
| Disabling 3D leaves the three.js deps installed but unused. | Intentional (decisions: keep for Phase 3). Tree-shaking plus the never-rendered dynamic import keeps them out of the client bundle. |

---

## 4. Testing Strategy

There is no test runner in the repo yet (Vitest and Playwright are Phase 3 items), so this feature is verified with **one consolidated acceptance pass** plus build checks. No per-slice tests.

- **Static checks:** `npm run lint` and `npm run build` pass. The build must statically generate all coffee and equipment slugs with their new metadata.
- **Consolidated UI pass (`verify-ui` skill, one session against `next start` or the Vercel preview):**
  - Go through every finish of all 6 equipment products. Each main image is an `<img>` whose `src` contains `/images/equipment/<slug>-<finish>`, and no `ProductStub` gradient is present (FR 2.1, all criteria).
  - Add Pour Kettle 900 Graphite to the cart, then open the cart drawer and `/checkout`. The graphite photo shows on that line in both (FR 2.1).
  - On a 1280px viewport, the Atlas E1 PDP shows no `<canvas>`, no "Drag to rotate" text, and no requests for the three.js chunk. Switching Graphite → Roast → Bone changes the image `src`. Repeat at 390px (FR 2.5).
  - The homepage hero `src` is the new `home-hero`, its frame ratio is unchanged at 390px and 1280px, and the lane-split equipment image is the new file (FR 2.2, 2.3). The `HeroMachine` section is absent (FR 2.5).
  - `curl -I <url>/images/_downloads/hero.jfif` returns 404 (FR 2.6).
- **Metadata check:** on the deployed preview, read the `og:image` / `og:title` tags (`curl` + grep) for `/`, `/about`, `/coffee`, a legal page, `/coffee/kirinyaga-ab` and `/equipment/pour-kettle-900`. Then paste two URLs into a link-preview checker (e.g. opengraph.xyz) and into Telegram (FR 2.4).
- **Regression:** with Playwright arriving in Phase 3, the "Key-Journey Checks" suite should include one equipment-finish-photo assertion. That case is recorded there, not built here.
