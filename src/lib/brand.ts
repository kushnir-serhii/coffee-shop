/**
 * Single source of truth for brand and locale facts that appear in copy.
 * Anything region-specific belongs here, not inline in a component — so
 * moving the roastery or switching currency is a one-file change.
 */
export const brand = {
  name: "Meridian",
  descriptor: "Coffee & Equipment",

  /** Where the roastery is. Used in hero copy, footer, and future contact page. */
  city: "Lviv",
  country: "Ukraine",

  /** Dispatch promise, kept as data so hero and PDP copy can't drift apart. */
  dispatchHours: 48,

  /**
   * Pricing. `locale` drives Intl number formatting, not site language.
   * Left in EUR because the sample catalog is priced in euros — switching to
   * `UAH` / `uk-UA` means repricing `products.ts`, not just flipping this.
   */
  currency: "EUR",
  locale: "en-IE",
} as const;

/** "Roasted in Lviv · shipped in 48 h" */
export const roastedLine = `Roasted in ${brand.city} · shipped in ${brand.dispatchHours} h`;
