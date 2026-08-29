"use client";

import { MAX_QTY } from "@/lib/cart";

/** Minus / value / plus. The value is mono + tabular so the row never shifts. */
export function QuantityStepper({
  qty,
  label,
  onChange,
}: {
  qty: number;
  label: string;
  onChange: (qty: number) => void;
}) {
  const step =
    "flex size-8 items-center justify-center text-ink-body transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="inline-flex items-center rounded-(--radius-pill) border border-line">
      <button
        type="button"
        className={step}
        onClick={() => onChange(qty - 1)}
        aria-label={qty === 1 ? `Remove ${label}` : `Decrease quantity of ${label}`}
      >
        <span aria-hidden>−</span>
      </button>
      <span className="w-6 text-center font-mono text-xs text-ink tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        className={step}
        onClick={() => onChange(qty + 1)}
        disabled={qty >= MAX_QTY}
        aria-label={`Increase quantity of ${label}`}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
