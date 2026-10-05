import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Primitives";
import { Wordmark } from "@/components/layout/Wordmark";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { brand } from "@/lib/brand";

const columns = [
  {
    title: "Coffee",
    links: [
      ["All coffee", "/coffee"],
      ["Subscription", "/subscription"],
      ["Wholesale", "/about#contact"],
    ],
  },
  {
    title: "Equipment",
    links: [
      ["All equipment", "/equipment"],
      ["Atlas E1 grinder", "/equipment/atlas-e1-grinder"],
      ["Servicing", "/about#contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Our sourcing", "/about#sourcing"],
      ["Contact", "/about#contact"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-muted">
      <Container className="py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand + newsletter */}
          <div className="max-w-[42ch]">
            <Wordmark className="text-lg text-ink" />
            <p className="mt-5 text-sm text-ink-body">
              Coffee sourced at origin and the equipment to do it justice. Roasted
              in small batches in {brand.city}, shipped within {brand.dispatchHours}{" "}
              hours of roast.
            </p>
            <NewsletterForm />
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <Label as="h2">{col.title}</Label>
                <ul className="mt-5 grid gap-3">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-ink-body transition-colors hover:text-roast"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name} Coffee. A portfolio concept —
            not a real store.
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link href="/legal/terms" className="transition-colors hover:text-ink">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="transition-colors hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/legal/shipping" className="transition-colors hover:text-ink">
                Shipping
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
