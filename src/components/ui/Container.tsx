import type { ElementType, ReactNode } from "react";

type Width = "default" | "wide" | "prose";

const widths: Record<Width, string> = {
  default: "max-w-[1240px]",
  wide: "max-w-[1480px]",
  prose: "max-w-[68ch]",
};

export function Container({
  as: Tag = "div",
  width = "default",
  className = "",
  children,
}: {
  as?: ElementType;
  width?: Width;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`mx-auto w-full px-6 md:px-10 ${widths[width]} ${className}`}>
      {children}
    </Tag>
  );
}

/** Vertical rhythm wrapper — one place to change section spacing globally. */
export function Section({
  id,
  className = "",
  muted = false,
  children,
}: {
  id?: string;
  className?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-(--spacing-section-sm) md:py-(--spacing-section) ${
        muted ? "bg-muted" : ""
      } ${className}`}
    >
      {children}
    </section>
  );
}
