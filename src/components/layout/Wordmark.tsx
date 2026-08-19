/**
 * Wordmark. Set as text rather than an SVG path so it stays crisp, selectable
 * and swappable — the "logo" is the type treatment, which suits an editorial
 * brand better than a bespoke mark.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline gap-[0.4em] font-display leading-none tracking-[-0.02em] ${className}`}
      style={{ fontSize: "inherit" }}
    >
      <span className="text-[1.15em] font-medium">Meridian</span>
      <span className="label hidden text-[0.62em] font-semibold text-ink-muted sm:inline">
        Coffee&nbsp;&amp;&nbsp;Equipment
      </span>
    </span>
  );
}
