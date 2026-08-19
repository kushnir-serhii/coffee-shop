import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/PageHeader";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Primitives";
import { EquipmentPurchase } from "@/components/product/EquipmentPurchase";
import { EquipmentCard } from "@/components/product/EquipmentCard";
import { equipment, getEquipment } from "@/lib/products";
import { formatPrice, type Equipment } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };

const categoryNoun: Record<Equipment["category"], string> = {
  grinder: "grinder",
  espresso: "espresso machine",
  kettle: "kettle",
  scale: "scale",
  brewer: "brewer",
};

export function generateStaticParams() {
  return equipment.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = getEquipment(slug);
  if (!item) return { title: "Not found" };
  return { title: item.name, description: item.tagline };
}

export default async function EquipmentDetailPage({ params }: Params) {
  const { slug } = await params;
  const item = getEquipment(slug);
  if (!item) notFound();

  const others = equipment.filter((e) => e.slug !== item.slug);

  /**
   * Comparison only makes sense inside a category — a grinder and a kettle
   * share no specification lines, so a cross-category table is all em-dashes.
   * When there is nothing to compare against, the section is skipped entirely
   * rather than rendered empty.
   */
  const rivals = others.filter((e) => e.category === item.category).slice(0, 2);
  const comparison = [item, ...rivals];
  const specLabels =
    rivals.length > 0
      ? [...new Set(comparison.flatMap((c) => c.specs.map((s) => s.label)))]
      : [];

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Home" },
            { href: "/equipment", label: "Equipment" },
            { label: item.name },
          ]}
        />
      </Container>

      <Container className="py-12 md:py-16">
        <EquipmentPurchase item={item} />
      </Container>

      {/* Comparison — only when there is a same-category product to compare */}
      {specLabels.length > 0 && (
      <Section muted>
        <Container>
          <SectionHeading
            eyebrow="Side by side"
            title="How it compares"
            intro={`Every ${categoryNoun[item.category]} we sell, line for line, so you can tell what the price difference actually buys.`}
          />

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col" className="w-44 py-4 pr-4 align-bottom">
                    <span className="label text-ink-muted">Specification</span>
                  </th>
                  {comparison.map((c) => (
                    <th
                      key={c.slug}
                      scope="col"
                      className="border-b-2 border-line py-4 pr-6 align-bottom"
                    >
                      <span
                        className={`block font-display text-lg ${
                          c.slug === item.slug ? "text-ink" : "text-ink-body"
                        }`}
                      >
                        {c.name}
                      </span>
                      <span className="mt-1 block font-mono text-xs text-ink-muted tabular-nums">
                        {formatPrice(c.priceCents)}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specLabels.map((label) => (
                  <tr key={label}>
                    <th
                      scope="row"
                      className="border-b border-line py-3.5 pr-4 text-sm font-normal text-ink-muted"
                    >
                      {label}
                    </th>
                    {comparison.map((c) => {
                      const spec = c.specs.find((s) => s.label === label);
                      return (
                        <td
                          key={c.slug}
                          className={`border-b border-line py-3.5 pr-6 font-mono text-sm ${
                            spec ? "text-ink" : "text-ink-muted"
                          }`}
                        >
                          {spec ? spec.value : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>
      )}

      {/* Rest of the range */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="The rest of the range"
            title="Complete the setup"
            action={<ArrowLink href="/equipment">All equipment</ArrowLink>}
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((e) => (
              <li key={e.slug} className="h-full">
                <EquipmentCard item={e} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
