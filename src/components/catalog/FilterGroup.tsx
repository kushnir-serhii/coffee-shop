"use client";

import { Label } from "@/components/ui/Primitives";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

/**
 * A single filter facet. Toggle buttons rather than checkboxes because the
 * option count is small and known — a dropdown would hide the taxonomy, which
 * is half of what makes a specialty catalog interesting to browse.
 */
export function FilterGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
  tone = "roast",
}: {
  legend: string;
  options: FilterOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
  tone?: "roast" | "origin";
}) {
  const active =
    tone === "roast"
      ? "border-roast bg-roast text-canvas"
      : "border-origin bg-origin text-canvas";

  return (
    <fieldset className="border-t border-line pt-5">
      <legend className="sr-only">{legend}</legend>
      <Label as="p" className="mb-3.5">
        {legend}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              aria-pressed={on}
              disabled={opt.count === 0 && !on}
              className={`inline-flex items-center gap-2 rounded-(--radius-pill) border px-3.5 py-1.5 text-sm transition-colors duration-200 disabled:opacity-35 ${
                on
                  ? active
                  : "border-line bg-surface text-ink-body hover:border-ink-muted"
              }`}
            >
              {opt.label}
              {typeof opt.count === "number" && (
                <span
                  className={`font-mono text-[10px] tabular-nums ${
                    on ? "opacity-70" : "text-ink-muted"
                  }`}
                >
                  {opt.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
