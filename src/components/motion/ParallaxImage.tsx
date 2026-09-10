"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";
import type { MediaAsset } from "@/types";

/**
 * Hero parallax with scale headroom (1.15) so the moving image never exposes
 * an edge gap; motion drifts the image down from a bottom anchor. Disabled
 * under reduced motion.
 */
export function ParallaxImage({
  asset,
  className,
  priority,
}: {
  asset: MediaAsset;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduce ? undefined : { y, scale: 1.15 }}
        className="h-full w-full will-change-transform"
      >
        <PlaceholderMedia asset={asset} className="h-full w-full" priority={priority} />
      </motion.div>
    </div>
  );
}
