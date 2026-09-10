import Image from "next/image";
import { useTranslations } from "next-intl";
import { Waves } from "lucide-react";

import type { MediaAsset } from "@/types";

import { cn } from "@/lib/utils";

interface Props {
  asset: MediaAsset;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * The single media-rendering vocabulary for the whole site: real image when
 * `src` exists, branded placeholder otherwise — never stretched stock.
 */
export function PlaceholderMedia({ asset, className, imgClassName, sizes, priority }: Props) {
  const t = useTranslations("common");

  if (asset.src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={asset.alt}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gold/12 via-sage/15 to-charcoal/25",
        className,
      )}
    >
      <Waves aria-hidden className="size-8 text-gold-bright/50" />
      <span className="absolute bottom-2.5 left-0 right-0 text-center text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-text-muted">
        {t("photoComingSoon")}
      </span>
    </div>
  );
}
