import { brand } from "./brand";

/**
 * The three documents a storefront is expected to have. Written short and
 * honest rather than padded with boilerplate that would be false anyway —
 * this store takes no payments and ships nothing.
 */

export interface LegalDoc {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

export const legalDocs: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms",
    summary:
      "What this site is, and what it is not. Read the first line and you have read the document.",
    sections: [
      {
        heading: "This is a concept store",
        body: [
          `${brand.name} is a portfolio project. The roastery, the producers, the prices and the equipment are invented. No order placed here is fulfilled, no payment is taken, and no card details are transmitted or stored — the checkout is an interface exercise.`,
          "If you have arrived here expecting to buy coffee, we are flattered and sorry in roughly equal measure.",
        ],
      },
      {
        heading: "What you can do with it",
        body: [
          "Look at it, click everything, break it if you can. The design and the code exist to be judged.",
          "The written copy, the brand and the visual system are the author's work. Reuse the ideas freely; please do not lift the whole thing and put a different name on it.",
        ],
      },
      {
        heading: "No warranty",
        body: [
          "The site is provided as is. It may go down, change without notice, or disappear entirely when the portfolio is next reorganised.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary:
      "There is no server collecting anything. Your cart lives in your own browser.",
    sections: [
      {
        heading: "What is stored",
        body: [
          "Your cart is kept in this browser's localStorage under `meridian.cart.v1`, and a placed order in sessionStorage under `meridian.order.v1`. Both stay on your device. Neither is transmitted anywhere.",
          "Clearing your browser data removes both. Nothing else is written.",
        ],
      },
      {
        heading: "What is not collected",
        body: [
          "No account, no analytics, no advertising or tracking pixels, no cookies, no email list. The checkout form's contents are held in memory for the length of the visit and are never sent off the device.",
          "Because nothing is collected, there is nothing to request, correct or delete — but if that changes, this page changes with it.",
        ],
      },
      {
        heading: "Third parties",
        body: [
          "Typefaces are served through the site's own build rather than fetched from a font CDN at runtime. There are no embedded third-party scripts.",
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping & returns",
    summary:
      "The policy the interface is built around — accurate as a design, fictional as a service.",
    sections: [
      {
        heading: "Dispatch",
        body: [
          `Coffee is roasted on dispatch day and leaves ${brand.city} within ${brand.dispatchHours} hours. Equipment ships the next working day.`,
          "Standard delivery is 3–5 working days and free over €40, otherwise €5.90. Express is next working day at €12.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Equipment can be returned unused within 30 days for a full refund, return shipping included. Grinders that have been through a kilo of coffee are not unused, and we will say so.",
          "Coffee cannot be returned once opened, for reasons that should not need explaining. If a bag is stale, damaged or simply not what the notes promised, tell us and the next one is free.",
        ],
      },
      {
        heading: "Subscriptions",
        body: [
          "Pause, skip, swap or cancel from the link in any dispatch email, up to the moment the bag is roasted. No minimum term and no cancellation fee.",
        ],
      },
    ],
  },
];

export const getLegalDoc = (slug: string) =>
  legalDocs.find((d) => d.slug === slug);
