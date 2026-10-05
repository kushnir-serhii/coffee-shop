"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { beans, equipment } from "@/lib/products";

type Hit = { href: string; title: string; meta: string; haystack: string };

const catalog: Hit[] = [
  ...beans.map((b) => ({
    href: `/coffee/${b.slug}`,
    title: b.name,
    meta: `Coffee · ${b.origin} · ${b.notes.join(", ")}`,
    haystack: [b.name, b.origin, b.region, b.producer, b.process, ...b.notes]
      .join(" ")
      .toLowerCase(),
  })),
  ...equipment.map((e) => ({
    href: `/equipment/${e.slug}`,
    title: e.name,
    meta: `Equipment · ${e.category}`,
    haystack: [e.name, e.category, e.tagline].join(" ").toLowerCase(),
  })),
];

/**
 * Client-side catalog search. Mounted only while open, so the input is
 * focused and the query reset on every open. Rendered in a portal because the
 * header's backdrop-filter would otherwise trap a fixed overlay inside it.
 */
export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const inputId = useId();

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = useMemo(
    () =>
      terms.length
        ? catalog.filter((h) => terms.every((t) => h.haystack.includes(t)))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      "input, a[href], button",
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/40 px-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl overflow-hidden rounded-(--radius-card) border border-line bg-canvas shadow-[0_24px_64px_-24px_rgb(0_0_0/0.35)]"
      >
        <div className="border-b border-line p-4">
          <h2 id={titleId} className="sr-only">
            Search coffee and equipment
          </h2>
          <label htmlFor={inputId} className="sr-only">
            Search coffee and equipment
          </label>
          <input
            ref={inputRef}
            id={inputId}
            type="search"
            autoComplete="off"
            placeholder="Search coffee, origin, notes, equipment"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-(--radius-card) border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-muted focus:border-roast focus:outline-none"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2" aria-live="polite">
          {terms.length === 0 ? (
            <p className="px-3 py-6 text-sm text-ink-muted">
              Try “Kenya”, “chocolate” or “grinder”.
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-sm text-ink-muted">
              Nothing matches “{query.trim()}”.
            </p>
          ) : (
            <ul>
              {results.map((h) => (
                <li key={h.href}>
                  <Link
                    href={h.href}
                    onClick={onClose}
                    className="block rounded-lg px-3 py-3 transition-colors hover:bg-muted focus-visible:bg-muted"
                  >
                    <span className="block text-sm text-ink">{h.title}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">
                      {h.meta}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end border-t border-line px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ink-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
