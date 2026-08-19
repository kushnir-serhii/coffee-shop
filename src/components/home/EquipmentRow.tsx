import { Container, Section } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { EquipmentCard } from "@/components/product/EquipmentCard";
import { equipment } from "@/lib/products";

export function EquipmentRow() {
  return (
    <Section id="equipment">
      <Container>
        <SectionHeading
          eyebrow="The rest of the setup"
          title="Everything downstream of the bean"
          intro="Grind, temperature, pressure and weight — the four variables that decide the cup. These are the tools we trust for each of them."
          action={<ArrowLink href="/equipment">All equipment</ArrowLink>}
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {equipment.map((item, i) => (
            <li key={item.slug} className="h-full">
              <Reveal delay={(i % 4) * 80} className="h-full">
                <EquipmentCard item={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
