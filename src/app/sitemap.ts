import type { MetadataRoute } from "next";

import { ALL_ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/** Generated from the canonical route list (§14); offers disabled for launch. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ALL_ROUTES.filter((r) => !r.path.startsWith("/offers")).map((route) => ({
    url: `${SITE.domain}${route.path === "/" ? "" : route.path}`,
    changeFrequency: route.group === "journal" ? "weekly" : "monthly",
    priority: route.path === "/" ? 1 : route.path.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
