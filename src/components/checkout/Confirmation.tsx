"use client";

import { useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { readOrder, type PlacedOrder } from "@/lib/order";
import { useHydrated } from "@/lib/hydration";
import { brand } from "@/lib/brand";

/* sessionStorage is read once and cached: useSyncExternalStore needs a stable
   snapshot, and the order cannot change while this page is open. */
let cached: PlacedOrder | null | undefined;
const noopSubscribe = () => () => {};
const orderSnapshot = () => (cached === undefined ? (cached = readOrder()) : cached);

export function Confirmation() {
  const ready = useHydrated();
  const order = useSyncExternalStore(noopSubscribe, orderSnapshot, () => null);

  if (!ready) {
    return <p className="py-24 text-center text-sm text-ink-muted">One moment…</p>;
  }

  // Direct hit on the URL, or a new tab — there is nothing to show.
  if (!order) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">No recent order</h1>
        <p className="max-w-[36ch] text-base text-ink-body">
          Confirmations are only shown right after checkout. If you have just
          ordered, the details are in your email.
        </p>
        <ButtonLink href="/">Back to the shop</ButtonLink>
      </div>
    );
  }

  const placed = new Date(order.placedAt);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
      <div className="max-w-[46rem]">
        <Label tone="roast">Order {order.reference}</Label>
        <h1 className="mt-4 font-display text-4xl md:text-5xl">
          Thank you, {order.recipient.split(" ")[0]}
        </h1>
        <p className="mt-5 max-w-[52ch] text-lg text-ink-body">
          We have sent a confirmation to{" "}
          <span className="text-ink">{order.email}</span>. Everything ships from{" "}
          {brand.city} within {brand.dispatchHours} hours.
        </p>

        <dl className="mt-12 grid gap-px overflow-hidden rounded-(--radius-card) border border-line bg-line sm:grid-cols-2">
          <Cell label="Reference">
            <span className="font-mono text-sm text-ink">{order.reference}</span>
          </Cell>
          <Cell label="Placed">
            <span className="font-mono text-sm text-ink tabular-nums">
              {placed.toLocaleDateString(brand.locale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </Cell>
          <Cell label="Delivering to">
            <span className="text-sm text-ink">{order.recipient}</span>
            {order.address.map((line) => (
              <span key={line} className="block text-sm text-ink-body">
                {line}
              </span>
            ))}
          </Cell>
          <Cell label="Shipping">
            <span className="text-sm text-ink">{order.shippingLabel}</span>
            <span className="block text-sm text-ink-body">
              {order.shippingEta}
            </span>
          </Cell>
          <Cell label="Paid with">
            <span className="font-mono text-sm text-ink tabular-nums">
              •••• {order.cardLast4}
            </span>
          </Cell>
          <Cell label="Questions">
            <a
              href={`mailto:hello@meridian.example?subject=Order ${order.reference}`}
              className="text-sm text-ink underline underline-offset-4 transition-colors hover:text-roast"
            >
              hello@meridian.example
            </a>
          </Cell>
        </dl>

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/coffee">Keep shopping</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Back to home
          </ButtonLink>
        </div>

        <p className="mt-10 text-xs text-ink-muted">
          This is a portfolio concept store. No payment was taken and no order
          will be shipped.
        </p>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary
          heading="What you ordered"
          lines={order.lines}
          subtotalCents={order.subtotalCents}
          shippingCents={order.shippingCents}
          totalCents={order.totalCents}
          shippingLabel={`Shipping · ${order.shippingLabel}`}
        />
      </aside>
    </div>
  );
}

function Cell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-canvas p-5">
      <dt className="label text-ink-muted">{label}</dt>
      <dd className="mt-2">{children}</dd>
    </div>
  );
}
