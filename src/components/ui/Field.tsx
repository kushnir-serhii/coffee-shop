import type { ComponentProps } from "react";

/**
 * The only text input in the system. Errors are text, not colour alone, and
 * the message is wired to the field with aria-describedby.
 */
export function TextField({
  id,
  label,
  hint,
  error,
  className = "",
  ...rest
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
} & ComponentProps<"input">) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="label block text-ink-muted">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 h-12 w-full rounded-(--radius-card) border bg-surface px-4 text-sm text-ink transition-colors duration-200 placeholder:text-ink-muted ${
          error ? "border-roast" : "border-line hover:border-ink-muted"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-roast">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
