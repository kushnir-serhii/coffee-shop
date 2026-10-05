"use client";

import { useState } from "react";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { formatPrice } from "@/lib/types";
import { defaultFrequency, frequencies, type Frequency } from "@/lib/subscription";

const sizes = [
  { key: "250", label: "250 g", base: 1550 },
  { key: "500", label: "500 g", base: 2800 },
  { key: "1000", label: "1 kg", base: 5200 },
] as const;

/**
 * Subscription configurator. Lives on the homepage because a recurring order
 * is the highest-value action in a coffee store — and because it demonstrates
 * real state, not a static banner.
 */
export function SubscriptionCta() {
  const [freq, setFreq] = useState<Frequency>(defaultFrequency);
  const [size, setSize] = useState<(typeof sizes)[number]>(sizes[0]);

  const perDelivery = Math.round(size.base * (1 - freq.discount));
  const perMonth = Math.round((perDelivery * 4) / freq.weeks);

  return (
    <Section>
      <Container>
        <div className="grid gap-12 rounded-(--radius-card) border border-line bg-surface p-8 md:p-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:p-16">
          <div className="flex flex-col justify-center">
            <Label tone="origin">Subscription</Label>
            <h2 className="mt-4 max-w-[18ch] font-display text-3xl md:text-4xl">
              Never run out, never drink it stale.
            </h2>
            <p className="mt-5 max-w-[50ch] text-base text-ink-body">
              Pick a size and a rhythm. We roast the morning it ships, rotate
              the lot each delivery, and you can pause, skip or swap from the
              email itself.
            </p>

            <ul className="mt-9 grid gap-2.5">
              {[
                "Up to 15% off every bag",
                "Free shipping, always",
                "Pause or cancel in one click",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-ink-body">
                  <span aria-hidden className="size-1.5 rounded-full bg-origin" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Configurator */}
          <div className="rounded-(--radius-card) bg-muted p-6 md:p-8">
            <fieldset>
              <legend className="label text-ink-muted">Bag size</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {sizes.map((s) => (
                  <Option
                    key={s.key}
                    selected={s.key === size.key}
                    onClick={() => setSize(s)}
                    className="justify-center"
                  >
                    {s.label}
                  </Option>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="label text-ink-muted">Delivery</legend>
              <div className="mt-3 grid gap-2">
                {frequencies.map((f) => (
                  <Option
                    key={f.key}
                    selected={f.key === freq.key}
                    onClick={() => setFreq(f)}
                    className="justify-between"
                  >
                    <span>{f.label}</span>
                    <span className="font-mono text-xs text-origin">
                      −{Math.round(f.discount * 100)}%
                    </span>
                  </Option>
                ))}
              </div>
            </fieldset>

            <div className="mt-8 border-t border-line pt-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-body">Per delivery</span>
                <span className="font-display text-2xl text-ink tabular-nums">
                  {formatPrice(perDelivery)}
                </span>
              </div>
              <p className="mt-1.5 text-right font-mono text-xs text-ink-muted tabular-nums">
                ≈ {formatPrice(perMonth)} / month
              </p>

              <ButtonLink
                href="/subscription"
                variant="origin"
                size="lg"
                className="mt-6 w-full"
              >
                Start subscription
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function Option({
  selected,
  onClick,
  className = "",
  children,
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-11 items-center rounded-(--radius-pill) border px-4 text-sm transition-colors duration-200 ${
        selected
          ? "border-ink bg-surface text-ink"
          : "border-line bg-transparent text-ink-body hover:border-ink-muted"
      } ${className}`}
    >
      {children}
    </button>
  );
}
