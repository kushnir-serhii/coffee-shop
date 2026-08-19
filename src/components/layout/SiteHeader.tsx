"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/layout/Wordmark";

const nav = [
  { href: "/coffee", label: "Coffee" },
  { href: "/equipment", label: "Equipment" },
  { href: "/subscription", label: "Subscription" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-line bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-8 md:h-20">
        <Link href="/" aria-label="Meridian — home" className="shrink-0">
          <Wordmark className="text-[15px] text-ink md:text-base" />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-sm text-ink-body transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-roast after:transition-[width] after:duration-300 after:ease-(--ease-out-soft) hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="hidden size-10 items-center justify-center rounded-(--radius-pill) text-ink transition-colors hover:bg-muted md:inline-flex"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-(--radius-pill) px-3 text-ink transition-colors hover:bg-muted"
            aria-label="Cart, 2 items"
          >
            <BagIcon />
            <span className="font-mono text-xs tabular-nums">2</span>
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-10 items-center justify-center rounded-(--radius-pill) text-ink transition-colors hover:bg-muted md:hidden"
          >
            <span className="sr-only">Menu</span>
            <MenuIcon open={open} />
          </button>
        </div>
      </Container>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-canvas md:hidden"
      >
        <Container className="py-4">
          <ul className="grid gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-lg text-ink transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="m12.2 12.2 3.05 3.05" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M3.75 5.75h10.5l-.8 9a1.2 1.2 0 0 1-1.2 1.1H5.75a1.2 1.2 0 0 1-1.2-1.1l-.8-9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d={open ? "M4 4l10 10" : "M2.5 6h13"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d={open ? "M14 4L4 14" : "M2.5 12h13"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
