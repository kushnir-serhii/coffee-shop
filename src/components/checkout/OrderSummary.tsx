import { ProductImage } from "@/components/ui/ProductImage";
import { formatPrice, type CartLine } from "@/lib/types";

/**
 * Read-only mirror of the cart. Used sticky beside the checkout form and again
 * on the confirmation page, so the numbers cannot drift between the two.
 */
export function OrderSummary({
  lines,
  subtotalCents,
  shippingCents,
  totalCents,
  shippingLabel,
  heading = "Order",
}: {
  lines: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  shippingLabel: string;
  heading?: string;
}) {
  return (
    <div className="rounded-(--radius-card) border border-line bg-surface p-6">
      <h2 className="label text-ink-muted">{heading}</h2>

      <ul className="mt-5 divide-y divide-line">
        {lines.map((line) => (
          <li key={line.id} className="flex gap-4 py-4 first:pt-0">
            <div className="w-14 shrink-0">
              {/* Fixed w-14 thumbnail */}
              <ProductImage
                src={line.image}
                alt={line.name}
                stub={line.stub}
                ratio="4 / 5"
                sizes="56px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-ink">{line.name}</span>
                <span className="font-mono text-sm text-ink tabular-nums">
                  {formatPrice(line.unitPriceCents * line.qty)}
                </span>
              </div>
              <span className="mt-1 text-xs text-ink-muted">
                {line.options.join(" · ")}
                {line.recurring && " · Subscription"} · ×{line.qty}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-5 grid gap-2 border-t border-line pt-5">
        <div className="flex items-baseline justify-between">
          <dt className="text-sm text-ink-body">Subtotal</dt>
          <dd className="font-mono text-sm text-ink tabular-nums">
            {formatPrice(subtotalCents)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-ink-body">{shippingLabel}</dt>
          <dd className="font-mono text-sm text-ink tabular-nums">
            {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
          </dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
          <dt className="label text-ink">Total</dt>
          <dd className="font-display text-2xl text-ink tabular-nums">
            {formatPrice(totalCents)}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-ink-muted">
        Taxes included. Prices in euro.
      </p>
    </div>
  );
}
