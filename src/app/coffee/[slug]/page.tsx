import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { ArrowLink } from "@/components/ui/Button";
import {
  Badge,
  FlavourProfile,
  Label,
  RoastMeter,
  SectionHeading,
} from "@/components/ui/Primitives";
import { BeanPurchase } from "@/components/product/BeanPurchase";
import { BeanCard } from "@/components/product/BeanCard";
import { ProductImage } from "@/components/ui/ProductImage";
import { beanImage, type BeanView } from "@/lib/images";
import { beans, getBean } from "@/lib/products";
import { brand } from "@/lib/brand";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return beans.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const bean = getBean(slug);
  if (!bean) return { title: "Not found" };
  return {
    title: bean.name,
    description: `${bean.origin} · ${bean.process} · ${bean.notes.join(", ")}. Roasted in ${brand.city}.`,
  };
}

export default async function BeanPage({ params }: Params) {
  const { slug } = await params;
  const bean = getBean(slug);
  if (!bean) notFound();

  const related = beans.filter((b) => b.slug !== bean.slug).slice(0, 3);

  const gallery: { view: BeanView; alt: string }[] = [
    { view: "beans", alt: `Roasted ${bean.name} beans` },
    { view: "origin", alt: `${bean.name} origin, ${bean.region}, ${bean.origin}` },
    { view: "brewed", alt: `Brewed cup of ${bean.name}` },
  ];

  const origin: { label: string; value: string; capitalize?: boolean }[] = [
    { label: "Origin", value: bean.origin },
    { label: "Region", value: bean.region },
    { label: "Producer", value: bean.producer },
    { label: "Varietal", value: bean.varietal },
    { label: "Process", value: bean.process, capitalize: true },
    {
      label: "Altitude",
      value: `${bean.altitudeMasl[0]}–${bean.altitudeMasl[1]} masl`,
    },
  ];

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Home" },
            { href: "/coffee", label: "Coffee" },
            { label: bean.name },
          ]}
        />
      </Container>

      {/* Main */}
      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Column is half of the 1160px container content less the 80px
                gap: 540px at most, ~45vw from lg up */}
            <ProductImage
              src={beanImage(bean.slug, "bag")}
              alt={`${bean.name} coffee bag`}
              stub={bean.stub}
              ratio="4 / 5"
              sizes="(min-width: 1240px) 540px, (min-width: 1024px) 45vw, 100vw"
              preload
            />
            <div className="mt-3 grid grid-cols-3 gap-3">
              {gallery.map(({ view, alt }, i) => (
                <ProductImage
                  key={view}
                  src={beanImage(bean.slug, view)}
                  alt={alt}
                  stub={bean.stub}
                  ratio="1 / 1"
                  sizes="(min-width: 1240px) 172px, (min-width: 1024px) 15vw, 33vw"
                  className={i === 0 ? "ring-1 ring-ink ring-inset" : ""}
                />
              ))}
            </div>
          </div>

          {/* Detail */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="roast">{bean.origin}</Badge>
              {bean.subscription && <Badge tone="origin">Subscription</Badge>}
              <Badge>{bean.process}</Badge>
            </div>

            <h1 className="mt-5 font-display text-4xl md:text-5xl">
              {bean.name}
            </h1>

            <p className="mt-5 text-lg text-ink-body">
              {bean.notes[0]}, {bean.notes[1].toLowerCase()} and a finish of{" "}
              {bean.notes[2].toLowerCase()}. Grown by {bean.producer} in{" "}
              {bean.region} and {bean.process}-processed at origin.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
              <RoastMeter roast={bean.roast} />
              <p className="text-sm text-ink-muted">
                Best for {bean.brewMethods.join(", ").toLowerCase()}
              </p>
            </div>

            <div className="mt-10 border-t border-line pt-9">
              <BeanPurchase bean={bean} />
            </div>

            {/* Flavour */}
            <div className="mt-14 rounded-(--radius-card) bg-muted p-6 md:p-8">
              <Label as="h2" tone="ink">
                Flavour profile
              </Label>
              <p className="mt-2 mb-6 text-sm text-ink-body">
                Scored by our team on a blind cupping table, not by the
                producer.
              </p>
              <FlavourProfile profile={bean.profile} />
            </div>

            {/* Origin data */}
            <div className="mt-10">
              <Label as="h2" tone="ink">
                At origin
              </Label>
              <dl className="mt-5 border-t border-line">
                {origin.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[9rem_1fr] gap-4 border-b border-line py-3.5"
                  >
                    <dt className="text-sm text-ink-muted">{row.label}</dt>
                    <dd
                      className={`font-mono text-sm text-ink ${
                        row.capitalize ? "capitalize" : ""
                      }`}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6">
                <ArrowLink href="/about#sourcing">
                  What we paid for this lot
                </ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Related */}
      <Section muted>
        <Container>
          <SectionHeading
            eyebrow="Also on the shelf"
            title="You might also like"
            action={<ArrowLink href="/coffee">All coffee</ArrowLink>}
          />
          <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((b) => (
              <li key={b.slug} className="h-full">
                <BeanCard bean={b} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
