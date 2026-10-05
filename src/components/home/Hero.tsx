import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { ProductImage } from "@/components/ui/ProductImage";
import { Reveal } from "@/components/ui/Reveal";
import { roastedLine } from "@/lib/brand";
import { editorialImage } from "@/lib/images";

/**
 * Editorial hero. Asymmetric two-column: type carries the left, a single
 * large product image the right. No slider — one message, one image.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
      {/* warm light bloom behind the composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-140 w-225 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(180,83,42,0.14), transparent)",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-rise">
            <Label tone="roast">{roastedLine}</Label>

            <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl">
              Coffee worth
              <br />
              the equipment.
            </h1>

            <p className="mt-7 max-w-[46ch] text-lg text-ink-body">
              We source single lots from producers we visit, roast them in small
              batches, and sell the grinders and machines that let you get the
              most out of them. Two halves of the same craft.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="/coffee" size="lg">
                Shop coffee
              </ButtonLink>
              <ButtonLink href="/equipment" size="lg" variant="secondary">
                Browse equipment
              </ButtonLink>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-8">
              {[
                ["24", "Producer partners"],
                ["48 h", "Roast to dispatch"],
                ["5 yr", "Equipment warranty"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl text-ink">{value}</dt>
                  <dd className="mt-1 text-xs text-ink-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Reveal delay={120}>
            <div className="relative">
              {/* Right column of the 1.05fr/0.95fr grid: ~521px at the 1240px
                  container cap, ~42vw down to lg, full width below. Above the
                  fold, so it is preloaded. */}
              <ProductImage
                src={editorialImage("home-hero")}
                alt="A vintage alarm clock beside a hand coffee grinder and scattered roasted beans, in low warm light"
                stub={["#EFE2CD", "#B07A4C"]}
                ratio="4 / 5"
                sizes="(min-width: 1240px) 521px, (min-width: 1024px) 42vw, 100vw"
                preload
              />
              {/* floating spec card — hints at the equipment lane from the hero */}
              <div className="absolute -bottom-6 -left-4 hidden w-56 rounded-card border border-line bg-surface/95 p-4 backdrop-blur-sm sm:block md:-left-8">
                <Label>Now brewing</Label>
                <p className="mt-2 font-display text-lg text-ink">
                  Kirinyaga AB
                </p>
                <p className="mt-1 text-xs text-ink-body">
                  Blackcurrant · Grapefruit
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-ink-muted">
                  <span>18 g in</span>
                  <span>36 g out</span>
                  <span>28 s</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
