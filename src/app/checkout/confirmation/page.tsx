import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { Confirmation } from "@/components/checkout/Confirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <Section>
      <Container>
        <Confirmation />
      </Container>
    </Section>
  );
}
