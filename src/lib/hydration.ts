"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False while rendering on the server and through hydration, true afterwards.
 *
 * Anything that reads browser-only state — localStorage, sessionStorage — has
 * to render its empty shape first or hydration mismatches. This says "the
 * markup is now ours to change" without a setState-in-an-effect cascade.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
