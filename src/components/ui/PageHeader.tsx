import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Primitives";

export function Breadcrumbs({
  trail,
}: {
  trail: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        {trail.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-ink"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-body">
                {crumb.label}
              </span>
            )}
            {i < trail.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Catalog page masthead. Editorial rather than a coloured banner. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  trail,
  aside,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  trail?: { href?: string; label: string }[];
  aside?: ReactNode;
}) {
  return (
    <div className="border-b border-line pt-8 pb-12 md:pt-12 md:pb-16">
      <Container>
        {trail && <Breadcrumbs trail={trail} />}
        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[46ch]">
            <Label tone="roast">{eyebrow}</Label>
            <h1 className="mt-4 font-display text-4xl md:text-5xl">{title}</h1>
            {intro && <p className="mt-5 text-base text-ink-body">{intro}</p>}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      </Container>
    </div>
  );
}
