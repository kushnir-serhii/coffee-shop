"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/types";
import { beans } from "@/lib/products";

/**
 * The subscription configurator as a real buy box rather than the homepage
 * teaser: it adds a recurring line to the cart, so the flow ends in the same
 * checkout as everything else.
 */

const frequencies = [
  { key: "1w", label: "Weekly", weeks: 1, discount: 0.15 },
  { key: "2w", label: "Every 2 weeks", weeks: 2, discount: 0.12 },
  { key: "4w", label: "Monthly", weeks: 4, discount: 0.1 },
] as const;

const sizes = [
  { key: "250", label: "250 g", base: 1550 },
  { key: "500", label: "500 g", base: 2800 },
  { key: "1000", label: "1 kg", base: 5200 },
] as const;

const grinds = ["Whole bean", "Espresso", "Filter", "Cafetière"] as const;

const plans = [
  {
    key: "rotating",
    label: "Rotating single lot",
    body: "A different producer each delivery, chosen by whoever is on the cupping table that week.",
  },
  {
    key: "house",
    label: "House blend, always",
    body: "The same cup every time. Components shift with the season; the profile does not.",
  },
  {
    key: "decaf",
    label: "Decaf",
    body: "Sugarcane process, single lot. The one people apologise for ordering and then reorder.",
  },
] as const;

export function Plan() {
  const { add } = useCart();
  const [freq, setFreq] = useState<(typeof frequencies)[number]>(frequencies[1]);
  const [size, setSize] = useState<(typeof sizes)[number]>(sizes[0]);
  const [grind, setGrind] = useState<(typeof grinds)[number]>(grinds[0]);
  const [plan, setPlan] = useState<(typeof plans)[number]>(plans[0]);

  const perDelivery = Math.round(size.base * (1 - freq.discount));
  const perMonth = Math.round((perDelivery * 4) / freq.weeks);
  const saved = size.base - perDelivery;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_23rem] lg:gap-16">
      <div className="grid gap-10">
        <fieldset>
          <legend className="label text-ink-muted">What arrives</legend>
          <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Coffee">
            {plans.map((p) => (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={p.key === plan.key}
                onClick={() => setPlan(p)}
                className={`rounded-(--radius-card) border px-5 py-4 text-left transition-colors duration-200 ${
                  p.key === plan.key
                    ? "border-ink bg-surface"
                    : "border-line hover:border-ink-muted"
                }`}
              >
                <span className="block text-sm text-ink">{p.label}</span>
                <span className="mt-1 block max-w-[58ch] text-xs text-ink-muted">
                  {p.body}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-10 sm:grid-cols-2">
          <fieldset>
            <legend className="label text-ink-muted">Bag size</legend>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <Chip
                  key={s.key}
                  selected={s.key === size.key}
                  onClick={() => setSize(s)}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label text-ink-muted">Ground for</legend>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {grinds.map((g) => (
                <Chip key={g} selected={g === grind} onClick={() => setGrind(g)}>
                  {g}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="label text-ink-muted">Rhythm</legend>
          <div
            className="mt-4 grid gap-2 sm:grid-cols-3"
            role="radiogroup"
            aria-label="Delivery rhythm"
          >
            {frequencies.map((f) => (
              <button
                key={f.key}
                type="button"
                role="radio"
                aria-checked={f.key === freq.key}
                onClick={() => setFreq(f)}
                className={`flex items-center justify-between gap-3 rounded-(--radius-card) border px-4 py-3.5 transition-colors duration-200 ${
                  f.key === freq.key
                    ? "border-ink bg-surface"
                    : "border-line hover:border-ink-muted"
                }`}
              >
                <span className="text-sm text-ink">{f.label}</span>
                <span className="font-mono text-xs text-origin tabular-nums">
                  −{Math.round(f.discount * 100)}%
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-(--radius-card) border border-line bg-surface p-6">
          <Label tone="origin">Your plan</Label>

          <dl className="mt-5 grid gap-2.5">
            {[
              ["Coffee", plan.label],
              ["Size", size.label],
              ["Grind", grind],
              ["Delivery", freq.label],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-ink-muted">{k}</dt>
                <dd className="text-right text-sm text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-line pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-body">Per delivery</span>
              <span className="font-display text-2xl text-ink tabular-nums">
                {formatPrice(perDelivery)}
              </span>
            </div>
            <p className="mt-1.5 flex items-baseline justify-between font-mono text-xs text-ink-muted tabular-nums">
              <span>≈ {formatPrice(perMonth)} / month</span>
              <span className="text-origin">saving {formatPrice(saved)}</span>
            </p>
          </div>

          <Button
            variant="origin"
            size="lg"
            className="mt-6 w-full"
            onClick={() =>
              add({
                kind: "bean",
                slug: `subscription-${plan.key}`,
                name: `${plan.label} subscription`,
                href: "/subscription",
                unitPriceCents: perDelivery,
                options: [size.label, grind, freq.label],
                stub: beans[0].stub,
                recurring: true,
              })
            }
          >
            Start subscription
          </Button>

          <p className="mt-3 text-center text-xs text-ink-muted">
            First bag ships within 48 hours · pause any time
          </p>
        </div>
      </aside>
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-11 items-center justify-center rounded-(--radius-pill) border px-4 text-sm transition-colors duration-200 ${
        selected
          ? "border-ink bg-surface text-ink"
          : "border-line text-ink-body hover:border-ink-muted"
      }`}
    >
      {children}
    </button>
  );
}
