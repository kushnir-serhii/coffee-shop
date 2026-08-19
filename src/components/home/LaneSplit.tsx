import { Container, Section } from "@/components/ui/Container";
import { ArrowLink } from "@/components/ui/Button";
import { Label, ProductStub } from "@/components/ui/Primitives";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The structural idea of the whole store, stated once on the homepage: two
 * product lanes, one brand. Everything downstream inherits this split.
 */
const lanes = [
  {
    accent: "roast",
    eyebrow: "Lane one",
    title: "The coffee",
    body: "Single lots and blends, roasted to order. Every bag carries origin, producer, altitude, process and a flavour profile you can actually compare.",
    points: ["24 producer partners", "Roasted weekly", "Grind to your method"],
    href: "/coffee",
    cta: "Shop all coffee",
    stub: ["#EDDCC4", "#B4804A"] as [string, string],
  },
  {
    accent: "origin",
    eyebrow: "Lane two",
    title: "The equipment",
    body: "Grinders, machines, kettles and scales chosen for one reason — they measurably improve the cup. Full specifications, no marketing numbers.",
    points: ["Serviced in-house", "5-year warranty", "Trade-in programme"],
    href: "/equipment",
    cta: "Browse equipment",
    stub: ["#E6E0D6", "#8A8078"] as [string, string],
  },
] as const;

export function LaneSplit() {
  return (
    <Section muted>
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {lanes.map((lane, i) => (
            <Reveal key={lane.title} delay={i * 100}>
              <article className="flex h-full flex-col rounded-(--radius-card) border border-line bg-surface p-6 md:p-8">
                <ProductStub
                  stub={lane.stub}
                  ratio="16 / 10"
                  label={lane.title}
                />

                <Label
                  tone={lane.accent === "roast" ? "roast" : "origin"}
                  className="mt-7"
                >
                  {lane.eyebrow}
                </Label>
                <h2 className="mt-3 font-display text-2xl md:text-3xl">
                  {lane.title}
                </h2>
                <p className="mt-4 text-base text-ink-body">{lane.body}</p>

                <ul className="mt-7 grid gap-2.5 border-t border-line pt-6">
                  {lane.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-3 text-sm text-ink-body"
                    >
                      <span
                        aria-hidden
                        className={`size-1.5 shrink-0 rounded-full ${
                          lane.accent === "roast" ? "bg-roast" : "bg-origin"
                        }`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-2">
                  <ArrowLink href={lane.href}>{lane.cta}</ArrowLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
