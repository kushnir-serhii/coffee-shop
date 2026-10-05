"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option<T extends string> = { value: T; label: string };

/**
 * Styled single-select listbox. Replaces the native `<select>`, whose option
 * list is drawn by the OS and can be neither styled nor animated.
 * Keyboard: ↑/↓, Home/End, Enter/Space to pick, Esc to close.
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  labelledBy,
  className = "",
}: {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  labelledBy?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const pick = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        pick(active);
        break;
      case "Escape":
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={`flex h-9 w-full items-center justify-between gap-3 rounded-(--radius-pill) border bg-surface pr-3 pl-4 text-sm text-ink transition-colors duration-200 focus:outline-none ${
          open
            ? "border-roast"
            : "border-line hover:border-ink-muted focus-visible:border-roast"
        }`}
      >
        <span className="truncate">{options[selectedIndex]?.label}</span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={`size-3.5 shrink-0 text-ink-muted transition-transform duration-300 ease-(--ease-out-soft) ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={labelledBy}
        className={`absolute right-0 z-20 mt-2 min-w-full origin-top overflow-hidden rounded-(--radius-card) border border-line bg-surface p-1.5 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.18)] transition-[opacity,transform,visibility] duration-200 ease-(--ease-out-soft) motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-[0.97] opacity-0"
        }`}
      >
        {options.map((o, i) => {
          const selected = i === selectedIndex;
          return (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={selected}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(i)}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-[calc(var(--radius-card)-0.375rem)] px-3 py-2 text-sm whitespace-nowrap transition-colors duration-150 ${
                selected ? "text-roast" : "text-ink"
              } ${i === active ? "bg-muted" : ""}`}
            >
              {o.label}
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className={`size-3.5 transition-opacity ${selected ? "opacity-100" : "opacity-0"}`}
              >
                <path
                  d="M3.5 8.5l3 3 6-6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
