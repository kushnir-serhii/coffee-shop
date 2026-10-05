import Image from "next/image";
import { ProductStub } from "@/components/ui/Primitives";

/**
 * A photograph at a fixed aspect ratio, or the gradient placeholder when the
 * file does not exist yet (`src` undefined). Both render the same box, so the
 * layout is identical either way.
 *
 * `sizes` is required: every slot is a fraction of the viewport, and without
 * it the browser downloads the full-width variant for a 64px thumbnail.
 */
export function ProductImage({
  src,
  alt,
  stub,
  ratio = "4 / 5",
  sizes,
  preload = false,
  className = "",
}: {
  src: string | undefined;
  alt: string;
  stub: [string, string];
  ratio?: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <ProductStub stub={stub} ratio={ratio} label={alt} className={className} />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-card bg-surface ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </div>
  );
}
