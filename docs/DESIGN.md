# Design system

Everything here is defined once in `src/app/globals.css` under `@theme`.
Tailwind v4 generates the utilities from those tokens, so `bg-canvas`,
`text-ink-body` and `border-line` are real classes — there is no `tailwind.config`.

---

## Colour

Warm neutrals, not grey. Grey reads as tech; warm reads as coffee.

| Token | Value | Use |
|---|---|---|
| `canvas` | `#FAF8F5` | Page background — warm, never pure white |
| `surface` | `#FFFFFF` | Cards, elevated panels |
| `muted` | `#F2EDE6` | Alternating sections, chips, insets |
| `line` | `#E2DAD0` | Hairlines, dividers, input outlines |
| `ink` | `#1A1714` | Headings, prices |
| `ink-body` | `#6B6259` | Paragraphs, descriptions |
| `ink-muted` | `#9C9187` | Labels, meta, placeholders |
| `roast` | `#B4532A` | Lane A accent — primary CTA, links, active |
| `roast-deep` | `#8E3F1F` | Hover for `roast` |
| `origin` | `#3F5A46` | Lane B accent — subscription, equipment CTA |
| `origin-deep` | `#2F4434` | Hover for `origin` |
| `roast-light/medium/dark` | `#D9B382` / `#B4804A` / `#6F4425` | Roast-level meter |

**Rules**

- One accent per lane, and each is used sparingly — CTA, link, active state.
  Two accents competing in one viewport dilutes both.
- Never `#000` on `#FFF`. Body text sits at `ink-body`, not `ink`.
- Contrast: `ink` on `canvas` ≈ 15.6:1, `ink-body` on `canvas` ≈ 5.9:1,
  `roast` on `canvas` ≈ 4.9:1 — all pass WCAG AA for their sizes.

---

## Type

| Role | Family | Token |
|---|---|---|
| Display | Fraunces | `font-display` |
| UI / body | Inter | `font-sans` |
| Numerals, specs | JetBrains Mono | `font-mono` |

Fraunces carries the editorial voice; Inter does the work; JetBrains exists
because spec tables and prices need tabular figures. **Every number in the UI
is `font-mono` with `tabular-nums`** — that single rule is most of what makes
the equipment lane feel technical.

### Scale

`micro` 11px · `xs` 12 · `sm` 14 · `base` 16 · `lg` 18 · `xl` 22 · `2xl` 28 ·
`3xl` 36 · `4xl` 48 · `5xl` 64 · `6xl` 88

The range matters more than the ratio: 11px uppercase labels against 64px
display headings is what creates hierarchy without a third typeface.

- Headings: weight 500, `-0.03em` tracking, `1.04` line-height, `text-wrap: balance`
- Body: `1.6` line-height, max `68ch`
- `.label` utility: 11px, `0.14em` tracking, uppercase, weight 600

---

## Space

`--spacing-section` is `120px` desktop / `64px` mobile, applied through the
`<Section>` component. Change it there, not in individual sections.

Generous section padding is the cheapest luxury signal available — most
amateur storefronts read as amateur because everything sits 40px apart.

Container widths: `default` 1240px · `wide` 1480px · `prose` 68ch.

---

## Motion

| Token | Value |
|---|---|
| `--ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Reveal | 700ms, 20px rise, staggered 80–120ms |
| Hover (colour) | 200ms |
| Hover (image scale) | 700ms, `1.03` |

`prefers-reduced-motion: reduce` collapses every animation and transition to
0.01ms globally in the base layer. `<Reveal>` uses IntersectionObserver only —
no animation library — and a `<noscript>` rule forces content visible without
JavaScript.

---

## Components

| Component | Notes |
|---|---|
| `Container` / `Section` | Layout rhythm. Nothing else sets page padding. |
| `Button` / `ButtonLink` | `primary` · `secondary` · `ghost` · `origin`; `sm/md/lg` |
| `ArrowLink` | Text link with an arrow that steps forward on hover |
| `Label` | The `.label` micro-type, tone-aware |
| `Badge` | `neutral` · `roast` · `origin` |
| `SectionHeading` | Eyebrow + title + intro + optional action |
| `RoastMeter` | Three-step roast indicator (lane A) |
| `FlavourProfile` | Acidity / body / sweetness / bitterness bars (lane A) |
| `ProductStub` | Photography placeholder — see README |
| `Reveal` | Scroll-triggered entrance |
| `BeanCard` | Sensory-first card (lane A) |
| `EquipmentCard` | Spec-first card (lane B) |

---

## Accessibility

- Skip link to `#main`
- Visible focus ring on every interactive element (`roast`, 2px, 3px offset)
- Placeholder images carry `role="img"` and a descriptive label
- Finish switcher is a real `radiogroup`; size/frequency options use `aria-pressed`
- Meters expose their values to assistive tech rather than relying on colour
- Colour is never the only carrier of meaning — the roast meter is labelled,
  finishes are titled

---

## Extending it

1. New colour or size → add a token in `@theme`, never a hardcoded value.
2. New product attribute → extend the model in `lib/types.ts` first.
3. New lane B page → lead with specification, use `font-mono` for values,
   accent with `origin`.
4. New lane A page → lead with sensory language, accent with `roast`.
