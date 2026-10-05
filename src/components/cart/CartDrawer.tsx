"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/types";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Slide-over cart. Mounted once in the root layout; opens on add-to-cart and
 * from the header. A drawer rather than a /cart route because the two-lane
 * catalog rewards staying on the page you were browsing.
 */
export function CartDrawer() {
  const { isOpen, closeCart, lines, totals, setQty, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = bodyOverflow;
      previous?.focus();
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const empty = lines.length === 0;

  return (
    <div className="fixed inset-0 z-100">
      <button
        type="button"
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 animate-fade cursor-default bg-ink/25 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className="absolute inset-y-0 right-0 flex w-full max-w-[27rem] animate-slide-in flex-col bg-canvas shadow-[-24px_0_60px_-30px_rgba(26,23,20,0.35)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <h2 className="font-display text-xl text-ink">
            Cart{" "}
            <span className="font-mono text-sm text-ink-muted tabular-nums">
              {totals.count}
            </span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-(--radius-pill) text-ink transition-colors hover:bg-muted"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3.5 3.5l9 9m0-9l-9 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-display text-2xl text-ink">Nothing in the cart</p>
            <p className="max-w-[28ch] text-sm text-ink-body">
              Single-lot coffee, and the equipment to do it justice.
            </p>
            <div className="flex gap-3">
              <ButtonLink href="/coffee" size="sm" onClick={closeCart}>
                Shop coffee
              </ButtonLink>
              <ButtonLink
                href="/equipment"
                size="sm"
                variant="secondary"
                onClick={closeCart}
              >
                Equipment
              </ButtonLink>
            </div>
          </div>
        ) : (
          <>
            {!totals.freeShipping && (
              <div className="border-b border-line px-6 py-4">
                <p className="text-xs text-ink-body">
                  {formatPrice(totals.remainingForFreeCents)} away from free
                  shipping
                </p>
                <div
                  className="mt-2 h-1 rounded-(--radius-pill) bg-line"
                  role="img"
                  aria-label={`${formatPrice(totals.remainingForFreeCents)} remaining for free shipping`}
                >
                  <span
                    className="block h-full rounded-(--radius-pill) bg-roast transition-[width] duration-500 ease-(--ease-out-soft)"
                    style={{
                      width: `${Math.min(100, (totals.subtotalCents / 4000) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  <Link
                    href={line.href}
                    onClick={closeCart}
                    className="w-20 shrink-0"
                    tabIndex={-1}
                  >
                    {/* Fixed w-20 thumbnail */}
                    <ProductImage
                      src={line.image}
                      alt={line.name}
                      stub={line.stub}
                      ratio="4 / 5"
                      sizes="80px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={line.href}
                        onClick={closeCart}
                        className="text-sm text-ink transition-colors hover:text-roast"
                      >
                        {line.name}
                      </Link>
                      <span className="font-mono text-sm text-ink tabular-nums">
                        {formatPrice(line.unitPriceCents * line.qty)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-ink-muted">
                      {line.options.join(" · ")}
                      {line.recurring && " · Subscription"}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QuantityStepper
                        qty={line.qty}
                        label={line.name}
                        onChange={(qty) => setQty(line.id, qty)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        className="text-xs text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
                      >
                        Remove
                        <span className="sr-only"> {line.name}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line px-6 py-5">
              <dl className="grid gap-2" aria-live="polite">
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-ink-body">Subtotal</dt>
                  <dd className="font-mono text-sm text-ink tabular-nums">
                    {formatPrice(totals.subtotalCents)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-ink-body">Shipping</dt>
                  <dd className="font-mono text-sm text-ink tabular-nums">
                    {totals.freeShipping
                      ? "Free"
                      : formatPrice(totals.shippingCents)}
                  </dd>
                </div>
                <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
                  <dt>
                    <Label as="span" tone="ink">
                      Total
                    </Label>
                  </dt>
                  <dd className="font-display text-2xl text-ink tabular-nums">
                    {formatPrice(totals.totalCents)}
                  </dd>
                </div>
              </dl>

              <ButtonLink
                href="/checkout"
                size="lg"
                onClick={closeCart}
                className="mt-5 w-full"
              >
                Checkout
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-ink-muted">
                Taxes included · 30-day returns
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
