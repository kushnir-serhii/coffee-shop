import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { EquipmentCatalog } from "@/components/catalog/EquipmentCatalog";
import { equipment } from "@/lib/products";

export const metadata: Metadata = {
  title: "Equipment",
  description:
    "Grinders, espresso machines, kettles and scales — chosen because they measurably improve the cup. Full specifications, no marketing numbers.",
};

export default function EquipmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="The setup"
        title="Equipment"
        intro="Grind, temperature, pressure and weight are the four variables that decide the cup. Everything here exists to control one of them."
        trail={[{ href: "/", label: "Home" }, { label: "Equipment" }]}
        aside={
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm sm:grid-cols-3">
            {[
              ["Serviced", "In-house"],
              ["Warranty", "Up to 5 yr"],
              ["Trade-in", "Available"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 font-mono text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />
      <EquipmentCatalog items={equipment} />
    </>
  );
}
