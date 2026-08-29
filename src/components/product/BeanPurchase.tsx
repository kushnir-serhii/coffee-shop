"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { formatPrice, type Bean } from "@/lib/types";
import { useCart } from "@/lib/cart";

const grinds = [
  { key: "whole", label: "Whole bean", hint: "Grind it yourself" },
  { key: "espresso", label: "Espresso", hint: "Fine" },
  { key: "filter", label: "Filter", hint: "Medium" },
  { key: "french", label: "French press", hint: "Coarse" },
] as const;

const SUBSCRIPTION_DISCOUNT = 0.12;

/**
 * The buy box. Three decisions — size, grind, one-off or subscription — kept
 * on one screen, with the price updating in place rather than on a next step.
 */
export function BeanPurchase({ bean }: { bean: Bean }) {
  const [variant, setVariant] = useState(bean.variants[0]);
  const [grind, setGrind] = useState<(typeof grinds)[number]>(grinds[0]);
  const [recurring, setRecurring] = useState(false);
  const { add } = useCart();

  const price = recurring
    ? Math.round(variant.priceCents * (1 - SUBSCRIPTION_DISCOUNT))
    : variant.priceCents;

  return (
    <div>
      {/* Size */}
      <fieldset>
        <legend className="label mb-3 text-ink-muted">Size</legend>
        <div className="flex flex-wrap gap-2">
          {bean.variants.map((v) => {
            const on = v.size === variant.size;
            return (
              <button
                key={v.size}
                type="button"
                onClick={() => setVariant(v)}
                aria-pressed={on}
                className={`flex h-11 items-center gap-3 rounded-(--radius-pill) border px-4 text-sm transition-colors duration-200 ${
                  on
                    ? "border-ink bg-surface text-ink"
                    : "border-line text-ink-body hover:border-ink-muted"
                }`}
              >
                <span>{v.size}</span>
                <span className="font-mono text-xs text-ink-muted tabular-nums">
                  {formatPrice(v.priceCents)}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Grind */}
      <fieldset className="mt-8">
        <legend className="label mb-3 text-ink-muted">Grind</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {grinds.map((g) => {
            const on = g.key === grind.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setGrind(g)}
                aria-pressed={on}
                className={`rounded-(--radius-card) border px-3 py-3 text-left transition-colors duration-200 ${
                  on
                    ? "border-ink bg-surface"
                    : "border-line hover:border-ink-muted"
                }`}
              >
                <span className="block text-sm text-ink">{g.label}</span>
                <span className="mt-0.5 block text-xs text-ink-muted">
                  {g.hint}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Purchase mode */}
      {bean.subscription && (
        <fieldset className="mt-8">
          <legend className="label mb-3 text-ink-muted">Frequency</legend>
          <div className="grid gap-2">
            {[
              { on: false, title: "One-off", sub: "Ships within 48 hours" },
              {
                on: true,
                title: "Subscribe",
                sub: `Save ${Math.round(SUBSCRIPTION_DISCOUNT * 100)}% · pause any time`,
              },
            ].map((mode) => {
              const selected = recurring === mode.on;
              return (
                <button
                  key={mode.title}
                  type="button"
                  onClick={() => setRecurring(mode.on)}
                  aria-pressed={selected}
                  className={`flex items-center justify-between gap-4 rounded-(--radius-card) border px-4 py-3.5 text-left transition-colors duration-200 ${
                    selected
                      ? "border-origin bg-origin/5"
                      : "border-line hover:border-ink-muted"
                  }`}
                >
                  <span>
                    <span className="block text-sm text-ink">{mode.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {mode.sub}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`size-4 shrink-0 rounded-full border transition-colors ${
                      selected
                        ? "border-origin bg-origin ring-2 ring-origin/25"
                        : "border-line"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Price + action */}
      <div className="mt-9 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-7">
        <div>
          <Label as="p">{recurring ? "Per delivery" : "Total"}</Label>
          <p className="mt-1.5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink tabular-nums">
              {formatPrice(price)}
            </span>
            {recurring && (
              <span className="font-mono text-sm text-ink-muted line-through tabular-nums">
                {formatPrice(variant.priceCents)}
              </span>
            )}
          </p>
        </div>
        <Button
          size="lg"
          className="min-w-52 flex-1 sm:flex-none"
          onClick={() =>
            add({
              kind: "bean",
              slug: bean.slug,
              name: bean.name,
              href: `/coffee/${bean.slug}`,
              unitPriceCents: price,
              options: [variant.size, grind.label],
              stub: bean.stub,
              recurring,
            })
          }
        >
          {recurring ? "Start subscription" : "Add to cart"}
        </Button>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        {variant.size} · {grind.label.toLowerCase()} · free shipping over{" "}
        {formatPrice(4000)}
      </p>
    </div>
  );
}
