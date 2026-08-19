"use client";

import { useState } from "react";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Label, ProductStub } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/types";
import { heroMachine } from "@/lib/products";

/**
 * The equipment lane's showcase — and the designated slot for the 3D hero.
 *
 * 3D INTEGRATION POINT
 * Replace <ProductStub> below with a <Canvas> from @react-three/fiber:
 *   - one compressed .glb (< 2 MB), lazy-loaded via next/dynamic ssr:false
 *   - keep this ProductStub as the poster/fallback and the mobile fallback
 *   - drive the model's material colour from `active.hex`, so the finish
 *     switcher below already works against the real model with no UI change
 * Everything else in this section stays exactly as it is.
 */
export function HeroMachine() {
  const item = heroMachine;
  const [active, setActive] = useState(item.colourways[0]);

  return (
    <Section className="overflow-hidden bg-ink/[0.02]">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -m-10 rounded-full opacity-70 blur-3xl transition-colors duration-700"
                style={{ background: `radial-gradient(closest-side, ${active.hex}22, transparent)` }}
              />
              <ProductStub
                stub={[
                  `color-mix(in srgb, ${active.hex} 22%, #FFFFFF)`,
                  active.hex,
                ]}
                ratio="1 / 1"
                label={`${item.name} in ${active.name}`}
                className="relative transition-all duration-700 ease-(--ease-out-soft)"
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-(--radius-pill) border border-line bg-surface/90 px-3 py-1.5 font-mono text-[10px] tracking-wider text-ink-muted uppercase backdrop-blur-sm">
                Drag to rotate · 3D slot
              </p>
            </div>
          </Reveal>

          {/* Detail */}
          <div>
            <Label tone="origin">Equipment · flagship</Label>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">
              {item.name}
            </h2>
            <p className="mt-5 max-w-[48ch] text-base text-ink-body">
              {item.tagline}
            </p>

            {/* Finish switcher — already wired to drive the future 3D material */}
            <div className="mt-9">
              <Label as="p">Finish · {active.name}</Label>
              <div className="mt-3 flex gap-2.5" role="radiogroup" aria-label="Finish">
                {item.colourways.map((c) => {
                  const selected = c.name === active.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={c.name}
                      onClick={() => setActive(c)}
                      className={`size-9 rounded-full transition-transform duration-200 ease-(--ease-out-soft) hover:scale-110 ${
                        selected
                          ? "ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                          : "ring-1 ring-line ring-inset"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Spec table — the lane B signature element */}
            <dl className="mt-10 border-t border-line">
              {item.specs.slice(0, 5).map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[10rem_1fr] gap-4 border-b border-line py-3.5"
                >
                  <dt className="text-sm text-ink-muted">{s.label}</dt>
                  <dd className="font-mono text-sm text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <ButtonLink
                href={`/equipment/${item.slug}`}
                size="lg"
                variant="origin"
              >
                View the {item.name}
              </ButtonLink>
              <p className="font-mono text-sm text-ink tabular-nums">
                {formatPrice(item.priceCents)}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
