"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Label } from "@/components/ui/Primitives";
import { EquipmentCard } from "@/components/product/EquipmentCard";
import type { Equipment } from "@/lib/types";
import { formatPrice } from "@/lib/types";

type Category = Equipment["category"] | "all";

const labels: Record<Equipment["category"], string> = {
  grinder: "Grinders",
  espresso: "Espresso machines",
  kettle: "Kettles",
  scale: "Scales",
  brewer: "Brewers",
};

/**
 * Lane B catalog. Fewer products than lane A and a rational buyer, so the
 * controls are a single category tab bar plus price sort — no facet stack.
 */
export function EquipmentCatalog({ items }: { items: Equipment[] }) {
  const [category, setCategory] = useState<Category>("all");
  const [ascending, setAscending] = useState(true);

  const categories = useMemo(() => {
    const present = [...new Set(items.map((i) => i.category))];
    return [
      { value: "all" as const, label: "Everything", count: items.length },
      ...present.map((c) => ({
        value: c,
        label: labels[c],
        count: items.filter((i) => i.category === c).length,
      })),
    ];
  }, [items]);

  const results = useMemo(() => {
    const filtered =
      category === "all"
        ? items
        : items.filter((i) => i.category === category);
    return [...filtered].sort((a, b) =>
      ascending
        ? a.priceCents - b.priceCents
        : b.priceCents - a.priceCents,
    );
  }, [items, category, ascending]);

  const cheapest = Math.min(...results.map((r) => r.priceCents));

  return (
    <Container className="py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-6">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Equipment category"
        >
          {categories.map((c) => {
            const on = c.value === category;
            return (
              <button
                key={c.value}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setCategory(c.value)}
                className={`inline-flex items-center gap-2 rounded-(--radius-pill) border px-4 py-2 text-sm transition-colors duration-200 ${
                  on
                    ? "border-origin bg-origin text-canvas"
                    : "border-line bg-surface text-ink-body hover:border-ink-muted"
                }`}
              >
                {c.label}
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    on ? "opacity-70" : "text-ink-muted"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setAscending((v) => !v)}
          className="inline-flex items-center gap-2 text-sm text-ink-body transition-colors hover:text-ink"
        >
          <span className="label text-ink-muted">Price</span>
          <span aria-hidden>{ascending ? "↑" : "↓"}</span>
          <span className="sr-only">
            Sorted {ascending ? "low to high" : "high to low"} — click to
            reverse
          </span>
        </button>
      </div>

      <div className="mt-6 flex items-center gap-6">
        <Label as="p">
          {results.length} {results.length === 1 ? "product" : "products"}
        </Label>
        <Label as="p">From {formatPrice(cheapest)}</Label>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((item) => (
          <li key={item.slug} className="h-full">
            <EquipmentCard item={item} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
