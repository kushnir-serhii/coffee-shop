import Link from "next/link";
import type { Equipment } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { ProductImage } from "@/components/ui/ProductImage";
import { equipmentImage } from "@/lib/images";

const categoryLabel: Record<Equipment["category"], string> = {
  grinder: "Grinder",
  espresso: "Espresso machine",
  kettle: "Kettle",
  scale: "Scale",
  brewer: "Brewer",
};

/**
 * Lane B card. Specification-first: the buyer is comparing, so the card leads
 * with category and a hard number rather than sensory language.
 */
export function EquipmentCard({ item }: { item: Equipment }) {
  const headline = item.specs[0];

  return (
    <article className="group flex h-full flex-col rounded-(--radius-card) border border-line bg-surface p-4 transition-colors duration-300 hover:border-ink-muted">
      <Link href={`/equipment/${item.slug}`} className="flex h-full flex-col">
        {/* Widest slot is the 3-up grid at full container width; narrower
            grids and the single-column mobile layout are covered by the rest */}
        <ProductImage
          src={equipmentImage(item.slug, item.colourways[0].name)}
          alt={`${item.name} in ${item.colourways[0].name}`}
          stub={item.stub}
          ratio="1 / 1"
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03]"
        />

        <div className="mt-5 flex flex-1 flex-col">
          <p className="label text-ink-muted">{categoryLabel[item.category]}</p>
          <h3 className="mt-1.5 font-display text-xl text-ink">{item.name}</h3>

          {headline && (
            <p className="mt-3 font-mono text-xs text-ink-body">
              {headline.label}: {headline.value}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="flex gap-1.5" aria-label="Available finishes">
              {item.colourways.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="size-3.5 rounded-full ring-1 ring-line ring-inset"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </span>
            <span className="font-mono text-sm text-ink tabular-nums">
              {formatPrice(item.priceCents)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
