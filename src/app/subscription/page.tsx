import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";
import { Plan } from "@/components/subscription/Plan";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Subscription",
  description:
    "Pick a size and a rhythm. Roasted the morning it ships, up to 15% off every bag, pause or swap from the email itself.",
};

const steps = [
  {
    n: "01",
    title: "Choose the shape, not the coffee",
    body: "Size, grind and rhythm. Which lot goes in the bag is our problem — that is the part you are outsourcing.",
  },
  {
    n: "02",
    title: "Roasted the morning it ships",
    body: `Your bag is roasted on dispatch day, not pulled off a shelf. Out of ${brand.city} within ${brand.dispatchHours} hours.`,
  },
  {
    n: "03",
    title: "Change it from the email",
    body: "Every dispatch email carries pause, skip, swap and cancel as plain links. No account, no phone call, no retention flow.",
  },
];

const faqs = [
  {
    q: "Can I skip a delivery?",
    a: "Yes, from the link in any dispatch email, up to the moment it is roasted. Skipping does not shorten or restart anything.",
  },
  {
    q: "What if I do not like a lot?",
    a: "Tell us and we replace the next bag free, and note it against your plan so the same profile does not come round again.",
  },
  {
    q: "Is the discount worse if I go monthly?",
    a: "Slightly — 10% instead of 15%. Weekly saves us a roast slot and a box, and that gets passed on rather than kept.",
  },
  {
    q: "Do you lock me in?",
    a: "No minimum, no term, no cancellation fee. A subscription you have to argue your way out of is a bad product.",
  },
];

export default function SubscriptionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Subscription"
        title="Never run out, never drink it stale"
        intro="Pick a size and a rhythm. We roast the morning it ships, rotate the lot each delivery, and you can pause, skip or swap from the email itself."
        trail={[{ href: "/", label: "Home" }, { label: "Subscription" }]}
        aside={
          <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm sm:grid-cols-3">
            {[
              ["Off every bag", "up to 15%"],
              ["Shipping", "Free"],
              ["Minimum term", "None"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-ink-muted">{label}</dt>
                <dd className="mt-1 font-mono text-ink tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section>
        <Container>
          <Plan />
        </Container>
      </Section>

      <Section muted>
        <Container>
          <Label tone="roast">How it works</Label>
          <h2 className="mt-4 max-w-[20ch] font-display text-3xl md:text-4xl">
            Three decisions, then none.
          </h2>

          <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <li className="border-t border-line pt-6">
                  <span className="font-mono text-sm text-roast">{s.n}</span>
                  <h3 className="mt-3 text-lg text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-body">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Label tone="roast">Questions</Label>
              <h2 className="mt-4 max-w-[16ch] font-display text-3xl md:text-4xl">
                The awkward ones first.
              </h2>
              <p className="mt-5 max-w-[46ch] text-base text-ink-body">
                Anything not covered here, ask us directly.
              </p>
              <div className="mt-7">
                <ArrowLink href="/about#contact">Talk to a human</ArrowLink>
              </div>
            </div>

            <dl className="border-t border-line">
              {faqs.map((f) => (
                <div key={f.q} className="border-b border-line py-6">
                  <dt className="text-lg text-ink">{f.q}</dt>
                  <dd className="mt-2 max-w-[62ch] text-sm text-ink-body">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>
    </>
  );
}
