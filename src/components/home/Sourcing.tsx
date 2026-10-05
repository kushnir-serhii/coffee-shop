import { Container, Section } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { editorialImage } from "@/lib/images";

const steps = [
  {
    n: "01",
    title: "Sourced in person",
    body: "We buy from 24 producers we have visited, at prices published on every bag. No unnamed lots, no broker blends.",
  },
  {
    n: "02",
    title: "Roasted to the lot",
    body: "Each lot gets its own profile, developed over three test roasts and cupped blind before it goes on sale.",
  },
  {
    n: "03",
    title: "Shipped within 48 hours",
    body: "Roast date printed, not best-before. If it has been on the shelf longer than three weeks, we take it off.",
  },
];

/** Editorial break between the two commercial sections — the brand story. */
export function Sourcing() {
  return (
    <Section muted>
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            {/* Left column of the 0.9fr/1.1fr grid from lg: ~486px at the
                1240px container cap; full width of the gutters below lg */}
            <ProductImage
              src={editorialImage("sourcing-at-origin")}
              alt="Hands sorting freshly picked red and yellow coffee cherries in a harvest bucket"
              stub={["#E5D6BF", "#8A6136"]}
              ratio="4 / 5"
              sizes="(min-width: 1240px) 486px, (min-width: 1024px) 40vw, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
            />
          </Reveal>

          <div className="flex flex-col justify-center">
            <Label tone="roast">How we work</Label>
            <h2 className="mt-4 max-w-[20ch] font-display text-3xl md:text-4xl">
              Transparency is a number, not a word.
            </h2>
            <p className="mt-5 max-w-[52ch] text-base text-ink-body">
              Every bag lists what we paid the producer, the export date and the
              roast date. It is the least interesting thing we could put on the
              packaging, and the most useful.
            </p>

            <ol className="mt-12 grid gap-8">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <li className="grid grid-cols-[3rem_1fr] gap-5 border-t border-line pt-6">
                    <span className="font-mono text-sm text-roast">{s.n}</span>
                    <div>
                      <h3 className="text-lg text-ink">{s.title}</h3>
                      <p className="mt-2 max-w-[52ch] text-sm text-ink-body">
                        {s.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>

            <div className="mt-10">
              <ArrowLink href="/about#sourcing">Read the sourcing report</ArrowLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
