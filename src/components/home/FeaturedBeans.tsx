import { Container, Section } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { BeanCard } from "@/components/product/BeanCard";
import { featuredBeans } from "@/lib/products";

export function FeaturedBeans() {
  return (
    <Section id="coffee">
      <Container>
        <SectionHeading
          eyebrow="This week's roast"
          title="Fresh on the roaster"
          intro="Roasted Monday and Thursday, dispatched the same day. Sold as whole bean or ground to your brew method."
          action={<ArrowLink href="/coffee">All coffee</ArrowLink>}
        />

        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBeans.map((bean, i) => (
            <li key={bean.slug} className="h-full">
              <Reveal delay={(i % 4) * 80} className="h-full">
                <BeanCard bean={bean} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
