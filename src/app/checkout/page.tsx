import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { Label } from "@/components/ui/Primitives";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Meridian order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Section>
      <Container>
        <div className="mb-12 max-w-[46rem]">
          <Label tone="roast">Checkout</Label>
          <h1 className="mt-4 font-display text-4xl md:text-5xl">
            Almost brewed
          </h1>
        </div>
        <CheckoutFlow />
      </Container>
    </Section>
  );
}
