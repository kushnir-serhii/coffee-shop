import { brand } from "./brand";

/**
 * Two product lanes share one catalog. They differ in the data they carry —
 * beans are consumables with sensory attributes, equipment is a considered
 * purchase with specifications — but both render inside one design system.
 */

export type RoastLevel = "light" | "medium" | "dark";

export type Process = "washed" | "natural" | "honey" | "anaerobic";

export interface BeanVariant {
  /** e.g. "250 g" */
  size: string;
  priceCents: number;
}

export interface Bean {
  kind: "bean";
  slug: string;
  name: string;
  origin: string;
  region: string;
  altitudeMasl: [number, number];
  producer: string;
  /** What we paid the producer, per kg of green coffee (FOB), in cents. */
  paidPerKgCents: number;
  varietal: string;
  process: Process;
  roast: RoastLevel;
  /** Three tasting notes, in descending prominence. */
  notes: [string, string, string];
  /** 0–100 sensory profile, drives the flavour meter. */
  profile: {
    acidity: number;
    body: number;
    sweetness: number;
    bitterness: number;
  };
  brewMethods: string[];
  variants: BeanVariant[];
  /** Placeholder gradient stops until real photography exists. */
  stub: [string, string];
  featured?: boolean;
  subscription?: boolean;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Colourway {
  name: string;
  hex: string;
}

export interface Equipment {
  kind: "equipment";
  slug: string;
  name: string;
  category: "grinder" | "espresso" | "kettle" | "scale" | "brewer";
  tagline: string;
  priceCents: number;
  specs: Spec[];
  colourways: Colourway[];
  /** Set on the single product that gets the 3D hero treatment. */
  hero?: boolean;
  stub: [string, string];
}

export type Product = Bean | Equipment;

/** Re-exported so presentational components import one module, not two. */
export type { CartLine } from "./cart";

export const isBean = (p: Product): p is Bean => p.kind === "bean";
export const isEquipment = (p: Product): p is Equipment =>
  p.kind === "equipment";

export function formatPrice(
  cents: number,
  currency: string = brand.currency,
  locale: string = brand.locale,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
