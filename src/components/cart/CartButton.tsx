"use client";

import { useCart } from "@/lib/cart";

/** Header trigger. Renders 0 until the stored cart is read, so SSR matches. */
export function CartButton() {
  const { totals, openCart, ready } = useCart();
  const count = ready ? totals.count : 0;

  return (
    <button
      type="button"
      onClick={openCart}
      className="inline-flex h-10 items-center gap-2 rounded-(--radius-pill) px-3 text-ink transition-colors hover:bg-muted"
      aria-label={
        count === 1 ? "Cart, 1 item" : `Cart, ${count} items`
      }
      aria-haspopup="dialog"
    >
      <BagIcon />
      <span className="font-mono text-xs tabular-nums" aria-hidden>
        {count}
      </span>
    </button>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3.75 5.75h10.5l-.8 9a1.2 1.2 0 0 1-1.2 1.1H5.75a1.2 1.2 0 0 1-1.2-1.1l-.8-9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
