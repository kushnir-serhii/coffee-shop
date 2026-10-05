import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Label, Rule } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { brand } from "@/lib/brand";
import { editorialImage } from "@/lib/images";
import { beans } from "@/lib/products";
import { formatPrice } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who Meridian buys from, what we paid, and how the roastery works. A concept store built as a portfolio piece.",
};

/**
 * One page carrying three jobs the footer links to separately: the story,
 * the sourcing report (#sourcing) and contact (#contact). Splitting them into
 * three thin pages would have been three pages with nothing on them.
 */

/** ICE Arabica reference (€/kg green) behind the "over C-market" column. */
const C_MARKET_EUR_PER_KG = 2.05;

const producers = beans.map((b) => ({
  lot: b.name,
  producer: b.producer,
  country: b.origin,
  paid: `${formatPrice(b.paidPerKgCents)} / kg`,
  market: `${(b.paidPerKgCents / 100 / C_MARKET_EUR_PER_KG).toFixed(1)}×`,
}));

const numbers = [
  ["Producers bought from", "24"],
  ["Visited in person", "24"],
  ["Average over C-market", "3.2×"],
  ["Lots published with price", "100%"],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The roastery"
        title="A small roastery with a spreadsheet problem"
        intro={`We roast in ${brand.city}, buy from people we have met, and print what we paid on the bag. That last part is the whole company, really.`}
        trail={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      {/* Story */}
      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="flex flex-col justify-center">
              <p className="max-w-[54ch] font-display text-2xl text-ink md:text-3xl">
                Specialty coffee spent twenty years learning to describe flavour
                and almost no time learning to describe price.
              </p>
              <div className="mt-8 grid max-w-[58ch] gap-5 text-base text-ink-body">
                <p>
                  Meridian started because two of us kept asking importers the
                  same question — what did the farmer actually get — and kept
                  getting an answer about quality instead.
                </p>
                <p>
                  So we buy direct where we can, publish the number where we
                  cannot, and let people decide for themselves whether the
                  markup is earned. It has made us slower and smaller than the
                  business plan said. It has also made every bag defensible.
                </p>
                <p>
                  The equipment side came later, and for a boring reason:
                  people were brewing our coffee badly on grinders that could
                  not hold a setting. It is easier to sell a good grinder than
                  to explain, again, why the cup tastes flat.
                </p>
              </div>
              <div className="mt-9">
                <ArrowLink href="#sourcing">See what we paid</ArrowLink>
              </div>
            </div>

            <Reveal>
              {/* Right column of the 1.1fr/0.9fr grid from lg: ~486px at the
                  1240px container cap; full width of the gutters below lg */}
              <ProductImage
                src={editorialImage("about-roastery")}
                alt="The brick facade of a historic coffee roastery, a classic car parked outside"
                stub={["#E5D6BF", "#8A6136"]}
                ratio="4 / 5"
                sizes="(min-width: 1240px) 486px, (min-width: 1024px) 40vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Sourcing */}
      <Section id="sourcing" muted className="scroll-mt-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[46ch]">
              <Label tone="roast">Sourcing report</Label>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">
                Transparency is a number, not a word
              </h2>
              <p className="mt-5 text-base text-ink-body">
                Every lot we have on the shelf, what we paid the producer per
                kilo of green, and how that compares to the C-market price on
                the day of contract.
              </p>
            </div>
            <dl className="grid shrink-0 grid-cols-2 gap-x-10 gap-y-5">
              {numbers.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-ink-muted">{label}</dt>
                  <dd className="mt-1 font-mono text-lg text-ink tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <thead>
                <tr className="border-y border-line">
                  {["Lot", "Producer", "Origin", "Paid", "Over C-market"].map(
                    (h) => (
                      <th
                        key={h}
                        scope="col"
                        className="label py-3.5 pr-6 text-ink-muted last:pr-0 last:text-right"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {producers.map((p) => (
                  <tr key={p.lot} className="border-b border-line">
                    <td className="py-4 pr-6 text-sm text-ink">{p.lot}</td>
                    <td className="py-4 pr-6 text-sm text-ink-body">
                      {p.producer}
                    </td>
                    <td className="py-4 pr-6 text-sm text-ink-body">
                      {p.country}
                    </td>
                    <td className="py-4 pr-6 font-mono text-sm text-ink tabular-nums">
                      {p.paid}
                    </td>
                    <td className="py-4 text-right font-mono text-sm text-roast tabular-nums">
                      {p.market}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-[62ch] text-xs text-ink-muted">
            Figures are per kilo of green coffee, FOB, excluding freight and
            import duty. C-market comparison uses the ICE Arabica settlement on
            the day the contract was signed.
          </p>
        </Container>
      </Section>

      {/* Roastery */}
      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              {/* Left half of an even two-column grid from lg: 540px at the
                  1240px container cap; full width of the gutters below lg */}
              <ProductImage
                src={editorialImage("about-roasting-floor")}
                alt="Inside the roastery: stacked green coffee sacks, storage bins and roasting equipment"
                stub={["#EDE7DE", "#8A8078"]}
                ratio="4 / 5"
                sizes="(min-width: 1240px) 540px, (min-width: 1024px) 42vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
              />
            </Reveal>
            <div className="flex flex-col justify-center">
              <Label tone="origin">The roastery</Label>
              <h2 className="mt-4 max-w-[18ch] font-display text-3xl md:text-4xl">
                Two roast days, no warehouse
              </h2>
              <div className="mt-6 grid max-w-[54ch] gap-5 text-base text-ink-body">
                <p>
                  We roast Monday and Thursday on a 15 kg drum, to order. There
                  is no stock room, which is inconvenient for us and the entire
                  point for you: nothing sits.
                </p>
                <p>
                  Each lot gets its own profile, developed over three test
                  roasts and cupped blind before it goes on sale. If a lot is
                  more than three weeks off roast, it comes off the shelf and
                  goes to the café next door.
                </p>
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
                {[
                  ["Roast days", "Mon · Thu"],
                  ["Batch", "15 kg drum"],
                  ["Dispatch", `${brand.dispatchHours} h`],
                  ["Shelf limit", "3 weeks"],
                  ["Date printed", "Roast, not BB"],
                  ["Where", `${brand.city}, ${brand.country}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs text-ink-muted">{label}</dt>
                    <dd className="mt-1 font-mono text-sm text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact */}
      <Section id="contact" muted className="scroll-mt-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <Label tone="roast">Contact</Label>
              <h2 className="mt-4 max-w-[16ch] font-display text-3xl md:text-4xl">
                Talk to a human
              </h2>
              <p className="mt-5 max-w-[46ch] text-base text-ink-body">
                One inbox, read by the people who roast the coffee. Wholesale,
                servicing and press all land in the same place.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="mailto:hello@meridian.example">
                  hello@meridian.example
                </ButtonLink>
                <ButtonLink href="/subscription" variant="secondary">
                  Start a subscription
                </ButtonLink>
              </div>
            </div>

            <dl className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  k: "Wholesale",
                  v: "Cafés, offices and anyone buying over 5 kg a month. We quote per lot, not per pallet.",
                },
                {
                  k: "Equipment servicing",
                  v: "Burr replacement and calibration on anything we sell, in-house, whether or not you bought it here.",
                },
                {
                  k: "The roastery",
                  v: `${brand.city}, ${brand.country}. Open to visitors on roast days if you tell us you are coming.`,
                },
                {
                  k: "Press",
                  v: "Same inbox. We will send figures rather than adjectives.",
                },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="label text-ink">{item.k}</dt>
                  <dd className="mt-2 text-sm text-ink-body">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Rule className="mt-16" />
          <p className="mt-6 max-w-[62ch] text-xs text-ink-muted">
            Meridian is a concept store built as a portfolio piece. The
            producers, prices and the roastery are invented; the design problem
            is not.
          </p>
        </Container>
      </Section>
    </>
  );
}
