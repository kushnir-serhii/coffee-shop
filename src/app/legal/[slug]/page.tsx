import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink } from "@/components/ui/Button";
import { legalDocs, getLegalDoc } from "@/lib/legal";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Not found" };
  return {
    title: doc.title,
    description: doc.summary,
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: Params) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  const others = legalDocs.filter((d) => d.slug !== doc.slug);

  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={doc.title}
        intro={doc.summary}
        trail={[{ href: "/", label: "Home" }, { label: doc.title }]}
      />

      <Section>
        <Container width="prose">
          <div className="grid gap-12">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl text-ink">
                  {section.heading}
                </h2>
                <div className="mt-4 grid gap-4">
                  {section.body.map((p) => (
                    <p key={p} className="text-base text-ink-body">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <nav
            aria-label="Other documents"
            className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-line pt-8"
          >
            {others.map((d) => (
              <ArrowLink key={d.slug} href={`/legal/${d.slug}`}>
                {d.title}
              </ArrowLink>
            ))}
          </nav>
        </Container>
      </Section>
    </>
  );
}
