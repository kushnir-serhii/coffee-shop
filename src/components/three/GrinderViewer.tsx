"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ProductStub } from "@/components/ui/Primitives";
import { useMinWidth } from "@/lib/media";

/**
 * The 3D hero, and the only place that decides whether 3D runs at all.
 *
 * Below the lg breakpoint it never loads: three.js is not worth the download on
 * a phone for a decorative rotate. Above it, the ProductStub shows immediately
 * and cross-fades out once the canvas reports it is live, so there is no empty
 * box while the chunk downloads — and the same stub is the WebGL fallback.
 */
const GrinderScene = dynamic(() => import("@/components/three/GrinderScene"), {
  ssr: false,
});

export function GrinderViewer({
  name,
  finishHex,
  finishName,
}: {
  name: string;
  finishHex: string;
  finishName: string;
}) {
  const wide = useMinWidth(1024);
  const [live, setLive] = useState(false);

  const poster = (
    <ProductStub
      stub={[`color-mix(in srgb, ${finishHex} 22%, #FFFFFF)`, finishHex]}
      ratio="1 / 1"
      label={`${name} in ${finishName}`}
      className="size-full transition-all duration-700 ease-(--ease-out-soft)"
    />
  );

  if (!wide) return poster;

  return (
    <div className="relative aspect-square">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-(--ease-out-soft) ${
          live ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={live}
      >
        {poster}
      </div>

      <GrinderScene
        finish={finishHex}
        label={`${name} in ${finishName}`}
        poster={poster}
        onReady={() => setLive(true)}
      />

      <p
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-(--radius-pill) border border-line bg-surface/90 px-3 py-1.5 font-mono text-[10px] tracking-wider text-ink-muted uppercase backdrop-blur-sm transition-opacity duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
      >
        Drag to rotate
      </p>
    </div>
  );
}
