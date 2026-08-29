"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media queries as an external store rather than state-in-an-effect: the
 * server snapshot is always false, so markup matches, and React reads the real
 * value on the first client render instead of after a second one.
 */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True once the viewport is at least `px` wide. */
export const useMinWidth = (px: number) =>
  useMediaQuery(`(min-width: ${px}px)`);

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
