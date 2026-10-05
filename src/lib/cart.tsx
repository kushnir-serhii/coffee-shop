"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useHydrated } from "./hydration";

/**
 * Cart state for both lanes.
 *
 * A line is a *configured* product, not a product: the same bean at 250 g /
 * espresso grind is a different line from the same bean at 1 kg / whole bean.
 * `options` carries that configuration as display strings, and also forms the
 * line identity — which keeps this file free of lane-specific branching.
 */

export interface CartLine {
  id: string;
  kind: "bean" | "equipment";
  slug: string;
  name: string;
  href: string;
  unitPriceCents: number;
  qty: number;
  /** Human-readable configuration, e.g. ["250 g", "Espresso"]. */
  options: string[];
  stub: [string, string];
  /** Photo path, when one exists; carts saved before this field have none. */
  image?: string;
  recurring?: boolean;
}

export type CartLineInput = Omit<CartLine, "id" | "qty"> & { qty?: number };

/** Free over this, flat rate below it — mirrored in PDP copy. */
export const FREE_SHIPPING_CENTS = 4000;
export const SHIPPING_FLAT_CENTS = 590;
export const MAX_QTY = 12;

const STORAGE_KEY = "meridian.cart.v1";

export function lineId(input: CartLineInput): string {
  return [input.kind, input.slug, ...input.options, input.recurring ? "sub" : "once"]
    .join("~")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function cartTotals(lines: CartLine[]) {
  const subtotalCents = lines.reduce((n, l) => n + l.unitPriceCents * l.qty, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const freeShipping = subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_CENTS;
  const shippingCents = freeShipping ? 0 : SHIPPING_FLAT_CENTS;
  return {
    count,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShipping,
    remainingForFreeCents: Math.max(0, FREE_SHIPPING_CENTS - subtotalCents),
  };
}

export type CartTotals = ReturnType<typeof cartTotals>;

/* ------------------------------------------------------------------------ */

interface State {
  lines: CartLine[];
}

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: CartLine }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };

    case "add": {
      const found = state.lines.some((l) => l.id === action.line.id);
      if (!found) return { lines: [...state.lines, action.line] };
      return {
        lines: state.lines.map((l) =>
          l.id === action.line.id
            ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) }
            : l,
        ),
      };
    }

    case "setQty":
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.id !== action.id) };
      }
      return {
        lines: state.lines.map((l) =>
          l.id === action.id ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l,
        ),
      };

    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };

    case "clear":
      return { lines: [] };
  }
}

/** Stored carts are untrusted input — a stale schema must not crash the app. */
function parseStored(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l): l is CartLine => {
      if (typeof l !== "object" || l === null) return false;
      const c = l as Partial<CartLine>;
      return (
        typeof c.id === "string" &&
        typeof c.slug === "string" &&
        typeof c.name === "string" &&
        typeof c.href === "string" &&
        typeof c.unitPriceCents === "number" &&
        typeof c.qty === "number" &&
        Array.isArray(c.options) &&
        Array.isArray(c.stub) &&
        (c.image === undefined || typeof c.image === "string")
      );
    });
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  totals: CartTotals;
  /** False until localStorage has been read — guards against hydration drift. */
  ready: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (input: CartLineInput) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);
  const ready = useHydrated();
  const restoring = useRef(true);

  // Read once on mount. Server and first client render both start empty, so
  // markup matches; the restored cart lands on the next paint.
  useEffect(() => {
    dispatch({
      type: "hydrate",
      lines: parseStored(window.localStorage.getItem(STORAGE_KEY)),
    });
    restoring.current = false;
  }, []);

  useEffect(() => {
    if (restoring.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Private mode or a full quota — the cart still works for this session.
    }
  }, [state.lines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const add = useCallback((input: CartLineInput) => {
    dispatch({
      type: "add",
      line: { ...input, id: lineId(input), qty: input.qty ?? 1 },
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback(
    (id: string, qty: number) => dispatch({ type: "setQty", id, qty }),
    [],
  );
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: state.lines,
      totals: cartTotals(state.lines),
      ready,
      isOpen,
      openCart,
      closeCart,
      add,
      setQty,
      remove,
      clear,
    }),
    [state.lines, ready, isOpen, openCart, closeCart, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
