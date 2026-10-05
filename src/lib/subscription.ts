/** Delivery rhythms and their discounts — shared by every subscription UI. */
export const frequencies = [
  { key: "1w", label: "Weekly", weeks: 1, discount: 0.15 },
  { key: "2w", label: "Every 2 weeks", weeks: 2, discount: 0.12 },
  { key: "4w", label: "Monthly", weeks: 4, discount: 0.1 },
] as const;

export type Frequency = (typeof frequencies)[number];

/** The rhythm pre-selected wherever a subscription is configured. */
export const defaultFrequency: Frequency = frequencies[1];
