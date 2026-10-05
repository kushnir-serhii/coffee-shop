# Tasks: Place New Photos and Hide the 3D Grinder

Spec: [functional-spec.md](./functional-spec.md) · [technical-considerations.md](./technical-considerations.md) · [decisions.md](./decisions.md)

No new components are created. Every UI task is `reuse:` or `extend:` per the tech spec's Component Breakdown.

---

- [x] **Slice 1: Raw source photos are no longer published (FR 2.6)**

  > After this slice `/images/_downloads/*` returns 404 and both image scripts read from the new location.
  - [x] Check the current state of `public/images/_downloads/` and `public/images/_generated/` (git shows the `.jfif` files as deleted and `_generated/` as untracked). Move both folders to `assets/images/_downloads/` and `assets/images/_generated/` so the raw files stay versioned but sit outside `public/`. Do not delete any file. **[Agent: vercel-infra]** **[Model: haiku]**
  - [x] Update the source-folder constants and docstrings: `DOWNLOADS` in `scripts/prepare-images.py` and `SRC` in `scripts/prepare-generated.py`. The output folder (`public/images/...`) stays unchanged. **[Agent: vercel-infra]** **[Model: haiku]**
  - [x] Verify (smoke): `npm run lint` and `npm run build` pass. Run `python scripts/prepare-generated.py --dry-run --src <empty staging dir>` to confirm the script still runs. Confirm `public/images/_downloads/` no longer exists. **[Agent: vercel-infra]** **[Model: sonnet]**

- [x] **Slice 2: All 13 equipment finishes, the light hero and the new lane photo show real photos (FR 2.1, 2.2, 2.3)**

  > After this slice no equipment finish shows a coloured placeholder, and the homepage uses the new hero and lane photos.
  - [x] Stage only the 10 new raw files (`e1 bone`, `espresso graphite`, `kettle graphite`, `kettle origin`, `scale bone`, `dripper origin`, `dripper roast`, `hero`, `lane-equipment`, `og`) from `assets/images/_downloads/` into a scratchpad staging folder. Never stage `lane-equipment-old.jfif` or any already-live file. **[Agent: vercel-infra]** **[Model: haiku]**
  - [x] Run `python scripts/prepare-generated.py --src <staging> --dry-run`, check that the target names match the tech spec table (section 2.1), then run it without `--dry-run`. Read the "smaller than the slot" report. Check that `git status` shows only the expected outputs: 7 files under `public/images/equipment/`, overwritten `editorial/home-hero.webp` and `editorial/lane-equipment.webp`, and `og/meridian-og.jpg`. **[Agent: vercel-infra]** **[Model: sonnet]**
  - [x] Add the 7 new `equipment/...` paths to the `available` set in `src/lib/images.ts`. `home-hero` and `lane-equipment` are already registered. Do not add the OG image. `extend: src/lib/images.ts` (the manifest). `reuse: src/components/ui/ProductImage.tsx`, `src/components/product/EquipmentPurchase.tsx`, `src/components/product/EquipmentCard.tsx`, `src/components/cart/CartDrawer.tsx`, `src/components/checkout/OrderSummary.tsx`, `src/components/home/Hero.tsx`, `src/components/home/LaneSplit.tsx` (no edits). **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Verify (smoke): `npm run lint` and `npm run build` pass. Start the app. In the browser, open `/equipment/pour-kettle-900`, pick Graphite and check that a photo shows. Open `/` and check the hero and the equipment lane. Delete the stale `.next/cache/images` if the old hero shows. Stop the server by its PID and delete any screenshots. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 3: Atlas E1 shows a photo instead of the 3D model (FR 2.5)**

  > After this slice the Atlas E1 page shows the still photo on every screen size, and the finish switcher changes it.
  - [x] Add a module-level constant `SHOW_3D = false` with a comment pointing to the Phase 3 "Photoreal 3D Grinder" item. Change the render guard to `if (!SHOW_3D || !wide) return poster;`. Leave the canvas branch, the cross-fade and the "Drag to rotate" pill untouched. `extend: src/components/three/GrinderViewer.tsx` (module constant, no new prop). `HeroMachine` stays commented out in `src/app/page.tsx`. **[Agent: nextjs-frontend]** **[Model: haiku]**
  - [x] Verify (smoke): `npm run lint` and `npm run build` pass. Start the app. On `/equipment/atlas-e1-grinder` at 1280px check that there is no `<canvas>`, then switch Graphite → Roast → Bone and check that the image changes. Stop the server by its PID and delete any screenshots. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 4: Shared links show a preview image (FR 2.4)**

  > After this slice every page has the branded share card, and coffee and equipment pages use their own photo.
  - [x] In `src/app/layout.tsx`, remove the placeholder `metadataBase`. Add `openGraph.images: [{ url: "/images/og/meridian-og.jpg", width: 1200, height: 630, alt }]` and `twitter: { card: "summary_large_image" }`. `extend: src/app/layout.tsx` metadata. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] In `generateMetadata` of `src/app/coffee/[slug]/page.tsx`, add `openGraph: { title: bean.name, description, images: [beanImage(slug, "bag")] }`. In `src/app/equipment/[slug]/page.tsx`, add `openGraph: { title: item.name, description: item.tagline, images: [equipmentImage(slug, item.colourways[0].name)] }`. Omit `images` if the image resolves to `undefined`. Do not use the `opengraph-image` file convention. **[Agent: nextjs-frontend]** **[Model: sonnet]**
  - [x] Verify (smoke): `npm run lint` and `npm run build` pass. Start the app and read the `og:image` and `og:title` tags (`curl` + grep) for `/`, `/about`, `/coffee/kirinyaga-ab` and `/equipment/pour-kettle-900`. Stop the server by its PID and delete any temporary output. **[Agent: nextjs-frontend]** **[Model: sonnet]**

- [x] **Slice 5: Documentation matches the new state**

  > After this slice the shot list and the architecture notes describe what is done and what is still missing.
  - [x] Update `docs/IMAGES.md`. Move the 7 finishes, the light hero, the new lane photo and the OG card to Done. Change the OG entry to `og/meridian-og.jpg`. Keep `editorial/about-roastery.webp` and the per-coffee gallery shots under Still missing. Update the source folder paths to `assets/images/`. **[Agent: vercel-infra]** **[Model: haiku]**
  - [x] Update `context/product/architecture.md`. The image pipeline line points to `assets/images/_downloads/`. The social share card is config-based (`openGraph.images`). The 3D line notes that 3D is currently disabled by the `SHOW_3D` flag. **[Agent: vercel-infra]** **[Model: haiku]**

- [x] **Slice 6: Feature Testing & Regression**

  > Verifies the whole feature end-to-end against functional-spec.md, run after all implementation slices are complete.
  - [x] Read functional-spec.md acceptance criteria in full. Generate acceptance-level tests that verify the entire feature as a whole — not individual slices. Cover applicable layers (unit for pure logic, integration for service interactions, e2e for user flows) based on the project's testing stack. Write tests with RED validation (must fail before implementation is confirmed done). Annotate each test with `@spec: 001-place-new-photos-hide-3d` and `@regression` if suitable for long-term regression. **[Agent: testing-expert]** **[Model: sonnet]**
  - [x] Run all generated tests. All must pass. Fix any failures before proceeding. **[Agent: testing-expert]** **[Model: sonnet]**
