import type { CartLine } from "./cart";

/**
 * A placed order, handed from /checkout to the confirmation page through
 * sessionStorage. There is no backend — this is the demo's stand-in for the
 * order record a real store would read back by reference.
 */
export interface PlacedOrder {
  reference: string;
  placedAt: string;
  email: string;
  recipient: string;
  address: string[];
  shippingLabel: string;
  shippingEta: string;
  cardLast4: string;
  lines: CartLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

const ORDER_KEY = "meridian.order.v1";

/** MER-7K2Q4X — readable aloud, no ambiguous characters. */
export function orderReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY3479";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `MER-${out}`;
}

export function saveOrder(order: PlacedOrder): void {
  try {
    window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    // Confirmation falls back to its "no order found" state.
  }
}

export function readOrder(): PlacedOrder | null {
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const o = parsed as Partial<PlacedOrder>;
    if (typeof o.reference !== "string" || !Array.isArray(o.lines)) return null;
    return o as PlacedOrder;
  } catch {
    return null;
  }
}
