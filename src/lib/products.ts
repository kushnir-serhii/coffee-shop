import type { Bean, Equipment, Product } from "./types";

/* --------------------------------------------------------------------------
 * Sample catalog. Local and typed on purpose — a portfolio demo should never
 * fail because a hosted CMS is down. Swap the module for a fetch layer later;
 * the component API stays identical.
 * ----------------------------------------------------------------------- */

export const beans: Bean[] = [
  {
    kind: "bean",
    slug: "kirinyaga-ab",
    name: "Kirinyaga AB",
    origin: "Kenya",
    region: "Kirinyaga County",
    altitudeMasl: [1700, 1850],
    producer: "Kiangoi Factory",
    varietal: "SL28 · SL34 · Ruiru 11",
    process: "washed",
    roast: "light",
    notes: ["Blackcurrant", "Grapefruit", "Cane sugar"],
    profile: { acidity: 92, body: 58, sweetness: 74, bitterness: 22 },
    brewMethods: ["Filter", "Aeropress", "Chemex"],
    variants: [
      { size: "250 g", priceCents: 1650 },
      { size: "1 kg", priceCents: 5600 },
    ],
    stub: ["#E8D9C4", "#C48F63"],
    featured: true,
    subscription: true,
  },
  {
    kind: "bean",
    slug: "finca-la-soledad",
    name: "Finca La Soledad",
    origin: "Guatemala",
    region: "Acatenango",
    altitudeMasl: [1500, 1700],
    producer: "Familia Zelaya",
    varietal: "Caturra · Bourbon",
    process: "washed",
    roast: "medium",
    notes: ["Milk chocolate", "Roasted almond", "Black plum"],
    profile: { acidity: 58, body: 80, sweetness: 84, bitterness: 42 },
    brewMethods: ["Espresso", "Filter", "Moka"],
    variants: [
      { size: "250 g", priceCents: 1450 },
      { size: "1 kg", priceCents: 4900 },
    ],
    stub: ["#E4D3C0", "#A5713F"],
    featured: true,
    subscription: true,
  },
  {
    kind: "bean",
    slug: "sitio-boa-vista",
    name: "Sítio Boa Vista",
    origin: "Brazil",
    region: "Mantiqueira de Minas",
    altitudeMasl: [1100, 1300],
    producer: "Luiz Paulo Dias",
    varietal: "Yellow Bourbon",
    process: "natural",
    roast: "dark",
    notes: ["Dark cocoa", "Hazelnut", "Dried fig"],
    profile: { acidity: 34, body: 92, sweetness: 78, bitterness: 66 },
    brewMethods: ["Espresso", "Moka"],
    variants: [
      { size: "250 g", priceCents: 1250 },
      { size: "1 kg", priceCents: 4200 },
    ],
    stub: ["#DCC7B2", "#6F4425"],
    featured: true,
  },
  {
    kind: "bean",
    slug: "gesha-village",
    name: "Gesha Village Lot 7",
    origin: "Ethiopia",
    region: "Bench Maji",
    altitudeMasl: [1900, 2000],
    producer: "Gesha Village Estate",
    varietal: "Gesha 1931",
    process: "anaerobic",
    roast: "light",
    notes: ["Jasmine", "Bergamot", "White peach"],
    profile: { acidity: 88, body: 46, sweetness: 90, bitterness: 16 },
    brewMethods: ["Filter", "V60"],
    variants: [
      { size: "150 g", priceCents: 3200 },
      { size: "250 g", priceCents: 4800 },
    ],
    stub: ["#EFE3CE", "#D2A86B"],
    featured: true,
    subscription: true,
  },
  {
    kind: "bean",
    slug: "el-diviso",
    name: "El Diviso",
    origin: "Colombia",
    region: "Huila",
    altitudeMasl: [1750, 1850],
    producer: "Nestor Lasso",
    varietal: "Pink Bourbon",
    process: "honey",
    roast: "medium",
    notes: ["Red apple", "Panela", "Orange blossom"],
    profile: { acidity: 76, body: 66, sweetness: 88, bitterness: 28 },
    brewMethods: ["Filter", "Espresso"],
    variants: [
      { size: "250 g", priceCents: 1950 },
      { size: "1 kg", priceCents: 6800 },
    ],
    stub: ["#EADCC7", "#B8734A"],
    subscription: true,
  },
  {
    kind: "bean",
    slug: "house-blend-no-4",
    name: "House Blend No. 4",
    origin: "Blend",
    region: "Brazil · Colombia · Ethiopia",
    altitudeMasl: [1200, 1900],
    producer: "Multiple",
    varietal: "Mixed",
    process: "washed",
    roast: "medium",
    notes: ["Toffee", "Cocoa nib", "Baked apple"],
    profile: { acidity: 54, body: 76, sweetness: 82, bitterness: 46 },
    brewMethods: ["Espresso", "Filter", "Moka"],
    variants: [
      { size: "250 g", priceCents: 1150 },
      { size: "1 kg", priceCents: 3800 },
    ],
    stub: ["#E6D6C1", "#96663C"],
    subscription: true,
  },
];

export const equipment: Equipment[] = [
  {
    kind: "equipment",
    slug: "atlas-e1-grinder",
    name: "Atlas E1",
    category: "grinder",
    tagline:
      "A single-dose grinder machined from one billet. 83 mm flat burrs, zero retention, and a stepless collar you can read to a quarter micron.",
    priceCents: 149000,
    specs: [
      { label: "Burr set", value: "83 mm flat, tungsten-coated" },
      { label: "Adjustment", value: "Stepless, 0.25 µm per detent" },
      { label: "Motor", value: "DC brushless, 1400 rpm" },
      { label: "Retention", value: "< 0.1 g" },
      { label: "Body", value: "Anodised 6061 aluminium" },
      { label: "Dimensions", value: "128 × 196 × 390 mm" },
      { label: "Weight", value: "6.4 kg" },
      { label: "Warranty", value: "5 years" },
    ],
    colourways: [
      { name: "Graphite", hex: "#3A3733" },
      { name: "Bone", hex: "#E8E1D6" },
      { name: "Roast", hex: "#8E3F1F" },
    ],
    hero: true,
    stub: ["#EDE7DE", "#8A8078"],
  },
  {
    kind: "equipment",
    slug: "atlas-h1-hand-grinder",
    name: "Atlas H1",
    category: "grinder",
    tagline:
      "The same burr geometry as the E1 in a hand grinder that fits in a jacket pocket. Built for travel, good enough for the counter.",
    priceCents: 39000,
    specs: [
      { label: "Burr set", value: "48 mm conical, hardened steel" },
      { label: "Adjustment", value: "Stepped, 30 clicks / rotation" },
      { label: "Motor", value: "None — hand crank" },
      { label: "Retention", value: "< 0.3 g" },
      { label: "Body", value: "Anodised 6061 aluminium" },
      { label: "Dimensions", value: "52 × 52 × 180 mm" },
      { label: "Weight", value: "0.6 kg" },
      { label: "Warranty", value: "3 years" },
    ],
    colourways: [
      { name: "Graphite", hex: "#3A3733" },
      { name: "Bone", hex: "#E8E1D6" },
    ],
    stub: ["#EBE5DC", "#7E756C"],
  },
  {
    kind: "equipment",
    slug: "meridian-one-espresso",
    name: "Meridian One",
    category: "espresso",
    tagline:
      "Dual boiler, PID on both circuits, and a flow-profiling paddle that logs every shot.",
    priceCents: 289000,
    specs: [
      { label: "Boilers", value: "Dual, 1.4 L brew / 2.2 L steam" },
      { label: "Control", value: "PID ±0.2 °C" },
      { label: "Profiling", value: "Manual paddle + saved curves" },
      { label: "Pump", value: "Rotary, plumb or reservoir" },
      { label: "Warranty", value: "3 years" },
    ],
    colourways: [
      { name: "Bone", hex: "#E8E1D6" },
      { name: "Graphite", hex: "#3A3733" },
    ],
    stub: ["#EFE9E0", "#9A9088"],
  },
  {
    kind: "equipment",
    slug: "pour-kettle-900",
    name: "Pour Kettle 900",
    category: "kettle",
    tagline:
      "A gooseneck balanced for a slow spiral. Variable temperature to the degree, hold for sixty minutes.",
    priceCents: 16500,
    specs: [
      { label: "Capacity", value: "0.9 L" },
      { label: "Range", value: "40 – 100 °C, 1° steps" },
      { label: "Hold", value: "60 min" },
      { label: "Interior", value: "Stainless 304" },
      { label: "Warranty", value: "2 years" },
    ],
    colourways: [
      { name: "Bone", hex: "#E8E1D6" },
      { name: "Graphite", hex: "#3A3733" },
      { name: "Origin", hex: "#3F5A46" },
    ],
    stub: ["#EDE6DB", "#A79C92" ],
  },
  {
    kind: "equipment",
    slug: "gram-scale-02",
    name: "Gram 0.2",
    category: "scale",
    tagline:
      "Two-decimal resolution, 180 ms refresh, and flow-rate readout that actually keeps up with the shot.",
    priceCents: 21000,
    specs: [
      { label: "Resolution", value: "0.01 g" },
      { label: "Capacity", value: "2 kg" },
      { label: "Refresh", value: "180 ms" },
      { label: "Battery", value: "USB-C, 40 h" },
      { label: "Warranty", value: "2 years" },
    ],
    colourways: [
      { name: "Graphite", hex: "#3A3733" },
      { name: "Bone", hex: "#E8E1D6" },
    ],
    stub: ["#EAE3D9", "#8F857C"],
  },
  {
    kind: "equipment",
    slug: "meridian-dripper",
    name: "Meridian Dripper",
    category: "brewer",
    tagline:
      "A flat-bed dripper in glazed stoneware. Slower, more even extraction than a cone, and it forgives an uneven grind.",
    priceCents: 4800,
    specs: [
      { label: "Capacity", value: "1 – 4 cups" },
      { label: "Bed", value: "Flat, 3-hole" },
      { label: "Material", value: "Glazed stoneware" },
      { label: "Filters", value: "Standard 155 flat-bottom" },
      { label: "Warranty", value: "Lifetime on cracks" },
    ],
    colourways: [
      { name: "Bone", hex: "#E8E1D6" },
      { name: "Origin", hex: "#3F5A46" },
      { name: "Roast", hex: "#8E3F1F" },
    ],
    stub: ["#F0EAE0", "#B9AFA4"],
  },
];

export const products: Product[] = [...beans, ...equipment];

export const featuredBeans = beans.filter((b) => b.featured);
export const heroMachine = equipment.find((e) => e.hero) ?? equipment[0];

export const getBean = (slug: string) => beans.find((b) => b.slug === slug);
export const getEquipment = (slug: string) =>
  equipment.find((e) => e.slug === slug);
