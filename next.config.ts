import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { REDIRECTS } from "./src/lib/routes";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async redirects() {
    // §6.2: old WordPress URLs 301 to the new routes, deployed with the site.
    return REDIRECTS.map((r) => ({
      source: r.from,
      destination: r.to,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
