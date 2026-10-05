/**
 * Which photographs exist under `public/images/`. Slots whose file is not
 * listed here keep rendering the `ProductStub` placeholder, so images can be
 * added one at a time: drop the file in, add its path below, done.
 *
 * Naming and sizes are documented in `docs/IMAGES.md`.
 */
const available = new Set<string>([
  // coffee — bag (4:5) plus beans · origin · brewed gallery (1:1)
  ...[
    "kirinyaga-ab",
    "finca-la-soledad",
    "sitio-boa-vista",
    "gesha-village",
    "el-diviso",
    "house-blend-no-4",
  ].flatMap((slug) =>
    ["bag", "beans", "origin", "brewed"].map((v) => `coffee/${slug}-${v}.webp`),
  ),

  // equipment — one file per finish (1:1)
  "equipment/atlas-e1-grinder-graphite.webp",
  "equipment/atlas-e1-grinder-bone.webp",
  "equipment/atlas-e1-grinder-roast.webp",
  "equipment/atlas-h1-hand-grinder-graphite.webp",
  "equipment/atlas-h1-hand-grinder-bone.webp",
  "equipment/gram-scale-02-graphite.webp",
  "equipment/gram-scale-02-bone.webp",
  "equipment/meridian-dripper-bone.webp",
  "equipment/meridian-dripper-origin.webp",
  "equipment/meridian-dripper-roast.webp",
  "equipment/meridian-one-espresso-bone.webp",
  "equipment/meridian-one-espresso-graphite.webp",
  "equipment/pour-kettle-900-bone.webp",
  "equipment/pour-kettle-900-graphite.webp",
  "equipment/pour-kettle-900-origin.webp",

  // editorial
  "editorial/home-hero.webp",
  "editorial/lane-coffee.webp",
  "editorial/lane-equipment.webp",
  "editorial/sourcing-at-origin.webp",
  "editorial/about-roastery.webp",
  "editorial/about-roasting-floor.webp",
]);

const resolve = (path: string) =>
  available.has(path) ? `/images/${path}` : undefined;

export type BeanView = "bag" | "beans" | "origin" | "brewed";

export const beanImage = (slug: string, view: BeanView = "bag") =>
  resolve(`coffee/${slug}-${view}.webp`);

/**
 * `finish` is the colourway name from products.ts ("Graphite", "Bone", …);
 * pass `colourways[0].name` for the default. A finish with no
 * photograph returns undefined rather than another finish's photo — showing
 * Graphite when the customer picked Origin would be worse than the stub.
 */
export const equipmentImage = (slug: string, finish: string) =>
  resolve(`equipment/${slug}-${finish.toLowerCase()}.webp`);

export type EditorialImage =
  | "home-hero"
  | "lane-coffee"
  | "lane-equipment"
  | "sourcing-at-origin"
  | "about-roastery"
  | "about-roasting-floor";

export const editorialImage = (name: EditorialImage) =>
  resolve(`editorial/${name}.webp`);
