"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { equipmentImage } from "@/lib/images";
import { GrinderViewer } from "@/components/three/GrinderViewer";
import { formatPrice, type Equipment } from "@/lib/types";
import { useCart } from "@/lib/cart";

/**
 * Lane B buy box, paired with the visual so the finish switcher updates the
 * image. When the 3D canvas lands (see HeroMachine), this same `active.hex`
 * drives the model's material — the control does not change.
 */
export function EquipmentPurchase({ item }: { item: Equipment }) {
  const [active, setActive] = useState(item.colourways[0]);
  const [warranty, setWarranty] = useState(false);
  const { add } = useCart();

  const warrantyCents = Math.round(item.priceCents * 0.08);
  const total = warranty ? item.priceCents + warrantyCents : item.priceCents;

  // undefined when this finish has no photo; the finish-coloured stub shows
  const image = equipmentImage(item.slug, active.name);
  const stub: [string, string] = [
    `color-mix(in srgb, ${active.hex} 22%, #FFFFFF)`,
    active.hex,
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
      {/* Visual */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -m-8 rounded-full opacity-70 blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(closest-side, ${active.hex}22, transparent)`,
            }}
          />
          {item.hero ? (
            <GrinderViewer
              name={item.name}
              finishHex={active.hex}
              finishName={active.name}
            />
          ) : (
            /* Half the 1160px container from lg up, full width below; `key`
               remounts per finish so the photo swaps cleanly */
            <ProductImage
              key={active.name}
              src={image}
              alt={`${item.name} in ${active.name}`}
              stub={stub}
              ratio="1 / 1"
              sizes="(min-width: 1024px) 560px, 100vw"
              preload
              className="relative transition-all duration-700 ease-(--ease-out-soft)"
            />
          )}
        </div>
      </div>

      {/* Detail */}
      <div>
        <Label tone="origin">Equipment</Label>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">{item.name}</h1>
        <p className="mt-5 max-w-[52ch] text-lg text-ink-body">
          {item.tagline}
        </p>

        {/* Finish */}
        <fieldset className="mt-10">
          <legend className="label mb-3 text-ink-muted">
            Finish · {active.name}
          </legend>
          <div className="flex gap-2.5" role="radiogroup" aria-label="Finish">
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
                  className={`size-10 rounded-full transition-transform duration-200 ease-(--ease-out-soft) hover:scale-110 ${
                    selected
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                      : "ring-1 ring-line ring-inset"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </fieldset>

        {/* Extended warranty */}
        <label className="mt-9 flex cursor-pointer items-start gap-4 rounded-(--radius-card) border border-line p-4 transition-colors hover:border-ink-muted">
          <input
            type="checkbox"
            checked={warranty}
            onChange={(e) => setWarranty(e.target.checked)}
            className="mt-0.5 size-4 accent-[var(--color-origin)]"
          />
          <span className="flex-1">
            <span className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-ink">Extended cover, +2 years</span>
              <span className="font-mono text-sm text-ink tabular-nums">
                +{formatPrice(warrantyCents)}
              </span>
            </span>
            <span className="mt-1 block text-xs text-ink-muted">
              Parts, labour and return shipping. Serviced in-house, not sent
              back to the manufacturer.
            </span>
          </span>
        </label>

        {/* Price + action */}
        <div className="mt-9 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-7">
          <div>
            <Label as="p">Total</Label>
            <p className="mt-1.5 font-display text-3xl text-ink tabular-nums">
              {formatPrice(total)}
            </p>
          </div>
          <Button
            size="lg"
            variant="origin"
            className="min-w-52 flex-1 sm:flex-none"
            onClick={() =>
              add({
                kind: "equipment",
                slug: item.slug,
                name: item.name,
                href: `/equipment/${item.slug}`,
                unitPriceCents: total,
                options: warranty
                  ? [active.name, "Extended cover, +2 years"]
                  : [active.name],
                stub,
                image,
              })
            }
          >
            Add to cart
          </Button>
        </div>

        <p className="mt-4 text-xs text-ink-muted">
          In stock · free shipping · 30-day return
        </p>

        {/* Specs */}
        <div className="mt-14">
          <Label as="h2" tone="ink">
            Specification
          </Label>
          <dl className="mt-5 border-t border-line">
            {item.specs.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line py-3.5"
              >
                <dt className="text-sm text-ink-muted">{s.label}</dt>
                <dd className="font-mono text-sm text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
