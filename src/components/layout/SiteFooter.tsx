import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/layout/Wordmark";
import { brand } from "@/lib/brand";

const columns = [
  {
    title: "Coffee",
    links: [
      ["Single origin", "/coffee?type=single-origin"],
      ["Blends", "/coffee?type=blend"],
      ["Subscription", "/subscription"],
      ["Wholesale", "/wholesale"],
    ],
  },
  {
    title: "Equipment",
    links: [
      ["Grinders", "/equipment?c=grinder"],
      ["Espresso machines", "/equipment?c=espresso"],
      ["Kettles & scales", "/equipment?c=kettle"],
      ["Servicing", "/service"],
    ],
  },
  {
    title: "Company",
    links: [
      ["Our sourcing", "/sourcing"],
      ["Roastery", "/about"],
      ["Journal", "/journal"],
      ["Contact", "/contact"],
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
            <form className="mt-8">
              <Label as="p" className="mb-3">
                Brewing notes, monthly
              </Label>
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 min-w-0 flex-1 rounded-(--radius-pill) border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-muted focus:border-roast focus:outline-none"
                />
                <Button type="submit" size="md">
                  Subscribe
                </Button>
              </div>
            </form>
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
