import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "origin";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-pill) font-medium " +
  "transition-[background-color,color,border-color,transform] duration-200 ease-(--ease-out-soft) " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-45 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-roast text-canvas hover:bg-roast-deep",
  secondary:
    "border border-line bg-surface text-ink hover:border-ink-muted hover:bg-muted",
  ghost: "text-ink hover:bg-muted",
  origin: "bg-origin text-canvas hover:bg-origin-deep",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Common & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Understated text link with an arrow that steps forward on hover. */
export function ArrowLink({
  className = "",
  children,
  ...rest
}: { className?: string; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`group inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-roast ${className}`}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-200 ease-(--ease-out-soft) group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
