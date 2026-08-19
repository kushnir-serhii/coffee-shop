import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CoffeeCatalog } from "@/components/catalog/CoffeeCatalog";
import { beans } from "@/lib/products";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Coffee",
  description:
    "Single lots and blends, roasted to order in small batches. Filter by roast, process and brew method.",
};

export default function CoffeePage() {
  return (
    <>
      <PageHeader
        eyebrow="The shelf"
        title="Coffee"
        intro="Every lot on this page was bought from a producer we have visited. Roasted Monday and Thursday, dispatched the same day."
        trail={[{ href: "/", label: "Home" }, { label: "Coffee" }]}
        aside={
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm sm:grid-cols-3">
            {[
              ["Lots on the shelf", String(beans.length)],
              ["Roasted in", brand.city],
              ["Dispatch", `${brand.dispatchHours} h`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 font-mono text-ink tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <CoffeeCatalog beans={beans} />
    </>
  );
}
