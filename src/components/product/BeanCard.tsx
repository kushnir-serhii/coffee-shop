import Link from "next/link";
import type { Bean } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { Badge, RoastMeter } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { beanImage } from "@/lib/images";

/**
 * Lane A card. Sensory-first: tasting notes read before the price, because
 * that is how people actually choose a bag of coffee.
 */
export function BeanCard({ bean }: { bean: Bean }) {
  const from = bean.variants[0];

  return (
    <article className="group h-full">
      <Link href={`/coffee/${bean.slug}`} className="flex h-full flex-col">
        <div className="relative overflow-hidden rounded-(--radius-card)">
          {/* Widest slot is the 3-up related grid at full container width
              (1160px content / 3); every other grid is narrower */}
          <ProductImage
            src={beanImage(bean.slug, "bag")}
            alt={`${bean.name} coffee bag`}
            stub={bean.stub}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03]"
          />
          {bean.subscription && (
            <div className="absolute left-3 top-3">
              <Badge tone="origin">Subscription</Badge>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="label text-ink-muted">{bean.origin}</p>
            <h3 className="mt-1.5 truncate font-display text-xl text-ink">
              {bean.name}
            </h3>
          </div>
          <p className="shrink-0 font-mono text-sm text-ink tabular-nums">
            {formatPrice(from.priceCents)}
          </p>
        </div>

        <p className="mt-2.5 text-sm text-ink-body">
          {bean.notes.join(" · ")}
        </p>

        {/* mt-auto keeps the meter row on one baseline across the grid, even
            when tasting notes wrap onto a second line */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <RoastMeter roast={bean.roast} />
          <span className="font-mono text-xs text-ink-muted">{from.size}</span>
        </div>
      </Link>
    </article>
  );
}
