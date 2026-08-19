"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-triggered reveal. IntersectionObserver only — no animation library
 * and no layout thrash. Reduced-motion is handled globally in globals.css,
 * and a <noscript> rule in the root layout forces content visible when
 * JavaScript is unavailable (the text is always in the DOM either way, so
 * crawlers see it regardless).
 */
export function Reveal({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      className={`transition-[opacity,transform] duration-700 ease-(--ease-out-soft) ${
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
