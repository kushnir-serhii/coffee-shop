"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { Select } from "@/components/ui/Select";
import { FilterGroup } from "@/components/catalog/FilterGroup";
import { BeanCard } from "@/components/product/BeanCard";
import type { Bean, Process, RoastLevel } from "@/lib/types";

type Sort = "featured" | "price-asc" | "price-desc" | "acidity";

const roastOptions: { value: RoastLevel; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "dark", label: "Dark" },
];

const processOptions: { value: Process; label: string }[] = [
  { value: "washed", label: "Washed" },
  { value: "natural", label: "Natural" },
  { value: "honey", label: "Honey" },
  { value: "anaerobic", label: "Anaerobic" },
];

const sorts: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "acidity", label: "Most acidity" },
];

/**
 * Client-side catalog. The dataset is small and local, so filtering in the
 * browser is instant and needs no round trip. Swap the `useMemo` for a server
 * query when the catalog outgrows a single page — the UI does not change.
 */
export function CoffeeCatalog({ beans }: { beans: Bean[] }) {
  const [roasts, setRoasts] = useState<RoastLevel[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [methods, setMethods] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("featured");

  const methodOptions = useMemo(() => {
    const all = [...new Set(beans.flatMap((b) => b.brewMethods))].sort();
    return all.map((m) => ({ value: m, label: m }));
  }, [beans]);

  const results = useMemo(() => {
    const filtered = beans.filter(
      (b) =>
        (roasts.length === 0 || roasts.includes(b.roast)) &&
        (processes.length === 0 || processes.includes(b.process)) &&
        (methods.length === 0 ||
          methods.some((m) => b.brewMethods.includes(m))),
    );

    const price = (b: Bean) => b.variants[0].priceCents;

    switch (sort) {
      case "price-asc":
        return [...filtered].sort((a, b) => price(a) - price(b));
      case "price-desc":
        return [...filtered].sort((a, b) => price(b) - price(a));
      case "acidity":
        return [...filtered].sort(
          (a, b) => b.profile.acidity - a.profile.acidity,
        );
      default:
        return [...filtered].sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured),
        );
    }
  }, [beans, roasts, processes, methods, sort]);

  /** Counts reflect the other active facets, so a filter never leads to zero. */
  const countBy = <T,>(predicate: (b: Bean) => T, value: T) =>
    beans.filter(
      (b) =>
        predicate(b) === value &&
        (processes.length === 0 || processes.includes(b.process)) &&
        (methods.length === 0 ||
          methods.some((m) => b.brewMethods.includes(m))),
    ).length;

  const activeCount = roasts.length + processes.length + methods.length;

  const toggle =
    <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
    (value: T) =>
      setter((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value],
      );

  return (
    <Container className="py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        {/* Facets */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center justify-between">
            <Label as="h2" tone="ink">
              Filter
            </Label>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setRoasts([]);
                  setProcesses([]);
                  setMethods([]);
                }}
                className="text-xs text-roast transition-colors hover:text-roast-deep"
              >
                Clear ({activeCount})
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-7">
            <FilterGroup
              legend="Roast"
              options={roastOptions.map((o) => ({
                ...o,
                count: countBy((b) => b.roast, o.value),
              }))}
              selected={roasts}
              onToggle={toggle(setRoasts)}
            />
            <FilterGroup
              legend="Process"
              options={processOptions}
              selected={processes}
              onToggle={toggle(setProcesses)}
            />
            <FilterGroup
              legend="Brew method"
              options={methodOptions}
              selected={methods}
              onToggle={toggle(setMethods)}
              tone="origin"
            />
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
            <p className="font-mono text-xs text-ink-muted tabular-nums">
              {results.length} {results.length === 1 ? "coffee" : "coffees"}
            </p>
            <div className="flex items-center gap-3">
              <span id="sort-label" className="label text-ink-muted">
                Sort
              </span>
              <Select
                value={sort}
                options={sorts}
                onChange={setSort}
                labelledBy="sort-label"
                className="w-48"
              />
            </div>
          </div>

          {results.length > 0 ? (
            <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((bean) => (
                <li key={bean.slug} className="h-full">
                  <BeanCard bean={bean} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-16 rounded-(--radius-card) border border-dashed border-line py-20 text-center">
              <p className="font-display text-xl text-ink">
                Nothing matches that combination
              </p>
              <p className="mt-2.5 text-sm text-ink-body">
                Try loosening one of the filters — our lots rotate every few
                weeks, so the shelf is deliberately small.
              </p>
              <Button
                variant="secondary"
                className="mt-7"
                onClick={() => {
                  setRoasts([]);
                  setProcesses([]);
                  setMethods([]);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
