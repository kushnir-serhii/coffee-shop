import type { ReactNode } from "react";
import type { Bean, RoastLevel } from "@/lib/types";

/* -------------------------------------------------------------------------
 * Small shared primitives. Kept in one file while the system is young —
 * split into separate modules once any of them grows past ~40 lines.
 * ---------------------------------------------------------------------- */

export function Label({
  as: Tag = "span",
  tone = "muted",
  className = "",
  children,
}: {
  as?: "span" | "p" | "h2" | "h3";
  tone?: "muted" | "roast" | "origin" | "ink";
  className?: string;
  children: ReactNode;
}) {
  const tones = {
    muted: "text-ink-muted",
    roast: "text-roast",
    origin: "text-origin",
    ink: "text-ink",
  } as const;
  return <Tag className={`label ${tones[tone]} ${className}`}>{children}</Tag>;
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "roast" | "origin";
  children: ReactNode;
}) {
  const tones = {
    neutral: "border-line bg-surface text-ink-body",
    roast: "border-transparent bg-roast/10 text-roast",
    origin: "border-transparent bg-origin/10 text-origin",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-(--radius-pill) border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const centred = align === "center";
  return (
    <div
      className={`flex flex-col gap-6 ${
        centred
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centred ? "max-w-[52ch]" : "max-w-[46ch]"}>
        <Label tone="roast">{eyebrow}</Label>
        <h2 className="mt-4 font-display text-3xl md:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-base text-ink-body">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Hairline divider that matches the token, not an arbitrary border. */
export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-line ${className}`} />;
}

/* -------------------------------------------------------------------------
 * Lane A primitives — sensory data for beans
 * ---------------------------------------------------------------------- */

const roastCopy: Record<RoastLevel, { label: string; step: number }> = {
  light: { label: "Light", step: 1 },
  medium: { label: "Medium", step: 2 },
  dark: { label: "Dark", step: 3 },
};

export function RoastMeter({ roast }: { roast: RoastLevel }) {
  const { label, step } = roastCopy[roast];
  const swatches = ["bg-roast-light", "bg-roast-medium", "bg-roast-dark"];
  return (
    <div className="flex items-center gap-2" aria-label={`Roast: ${label}`}>
      <span className="flex gap-1" aria-hidden>
        {swatches.map((bg, i) => (
          <span
            key={bg}
            className={`h-1.5 w-5 rounded-(--radius-pill) ${bg} ${
              i + 1 <= step ? "opacity-100" : "opacity-20"
            }`}
          />
        ))}
      </span>
      <span className="text-xs text-ink-muted">{label}</span>
    </div>
  );
}

export function FlavourProfile({ profile }: { profile: Bean["profile"] }) {
  const rows = [
    ["Acidity", profile.acidity],
    ["Body", profile.body],
    ["Sweetness", profile.sweetness],
    ["Bitterness", profile.bitterness],
  ] as const;

  return (
    <dl className="grid gap-3">
      {rows.map(([name, value]) => (
        <div key={name} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3">
          <dt className="text-xs text-ink-muted">{name}</dt>
          <dd
            className="h-1 rounded-(--radius-pill) bg-line"
            role="img"
            aria-label={`${name} ${value} out of 100`}
          >
            <span
              className="block h-full rounded-(--radius-pill) bg-roast"
              style={{ width: `${value}%` }}
            />
          </dd>
          <dd className="text-right font-mono text-xs text-ink-body tabular-nums">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------
 * Placeholder imagery
 * ---------------------------------------------------------------------- */

/**
 * Stands in for product photography. Deliberately abstract rather than a
 * broken-image box: the layout reads as finished while assets are missing.
 * Replace with next/image and delete this component — nothing else changes.
 */
export function ProductStub({
  stub,
  ratio = "4 / 5",
  label,
  className = "",
}: {
  stub: [string, string];
  ratio?: string;
  label?: string;
  className?: string;
}) {
  const [from, to] = stub;
  return (
    <div
      className={`grain relative overflow-hidden rounded-(--radius-card) ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={label ? `${label} — placeholder image` : "Placeholder image"}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 90% at 50% 8%, ${from} 0%, ${to} 100%)`,
        }}
      />
      {/* soft directional light, so flat colour reads as a lit object */}
      <div className="absolute inset-0 bg-linear-to-b from-white/25 via-transparent to-black/12" />
    </div>
  );
}
