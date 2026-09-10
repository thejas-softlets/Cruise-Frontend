/**
 * Canonical route list (plan §6.1). Single source of truth — the XML sitemap
 * (`app/sitemap.ts`) and the human-readable `/sitemap` page are both generated
 * from this list so they can never drift out of sync (plan §14).
 */

export interface RouteEntry {
  path: string;
  group:
    | "main"
    | "vessels"
    | "packages"
    | "offers"
    | "experiences"
    | "about"
    | "journal"
    | "help"
    | "legal";
}

export const ROUTE_GROUPS: {
  id: RouteEntry["group"];
  titleKey: string;
  routes: RouteEntry[];
}[] = [
  {
    id: "main",
    titleKey: "sitemap.groups.main",
    routes: [
      { path: "/", group: "main" },
      { path: "/how-it-works", group: "main" },
      { path: "/the-lake", group: "main" },
      { path: "/private-charter", group: "main" },
      { path: "/gallery", group: "main" },
    ],
  },
  {
    id: "vessels",
    titleKey: "sitemap.groups.vessels",
    routes: [
      { path: "/vessels", group: "vessels" },
      { path: "/vessels/summer-cruise", group: "vessels" },
      { path: "/vessels/green-horizon", group: "vessels" },
    ],
  },
  {
    id: "packages",
    titleKey: "sitemap.groups.packages",
    routes: [
      { path: "/packages", group: "packages" },
      { path: "/packages/3d2n-kenyir-explorer", group: "packages" },
      { path: "/packages/4d3n-kenyir-grand-voyage", group: "packages" },
    ],
  },
  {
    id: "offers",
    titleKey: "sitemap.groups.offers",
    routes: [
      { path: "/offers", group: "offers" },
      { path: "/offers/early-bird", group: "offers" },
      { path: "/offers/family-getaway", group: "offers" },
      { path: "/offers/honeymoon-and-romantic", group: "offers" },
      { path: "/offers/corporate-and-team-building", group: "offers" },
      { path: "/offers/festive-and-school-holiday", group: "offers" },
      { path: "/offers/local-resident-discount", group: "offers" },
      { path: "/offers/group-booking-discount", group: "offers" },
      { path: "/offers/returning-guest-perks", group: "offers" },
    ],
  },
  {
    id: "experiences",
    titleKey: "sitemap.groups.experiences",
    routes: [
      { path: "/experiences", group: "experiences" },
      { path: "/experiences/excursions", group: "experiences" },
      { path: "/experiences/activities", group: "experiences" },
    ],
  },
  {
    id: "about",
    titleKey: "sitemap.groups.about",
    routes: [
      { path: "/about", group: "about" },
      { path: "/about/our-story", group: "about" },
      { path: "/about/sustainability", group: "about" },
      { path: "/about/safety-and-wellbeing", group: "about" },
      { path: "/about/dining-and-cuisine", group: "about" },
    ],
  },
  {
    id: "journal",
    titleKey: "sitemap.groups.journal",
    routes: [
      { path: "/journal", group: "journal" },
      { path: "/reviews", group: "journal" },
      { path: "/brochure", group: "journal" },
    ],
  },
  {
    id: "help",
    titleKey: "sitemap.groups.help",
    routes: [
      { path: "/contact", group: "help" },
      { path: "/check-in", group: "help" },
      { path: "/faqs", group: "help" },
      { path: "/gift-vouchers", group: "help" },
      { path: "/sitemap", group: "help" },
    ],
  },
  {
    id: "legal",
    titleKey: "sitemap.groups.legal",
    routes: [
      { path: "/privacy-policy", group: "legal" },
      { path: "/terms-and-conditions", group: "legal" },
    ],
  },
];

export const ALL_ROUTES: RouteEntry[] = ROUTE_GROUPS.flatMap((g) => g.routes);

/** Old WordPress URL → new route 301 map (§6.2). Deployed with the site. */
export const REDIRECTS: { from: string; to: string }[] = [
  { from: "/packages/summer-cruise-package", to: "/packages/3d2n-kenyir-explorer" },
  { from: "/kenyir-lake", to: "/the-lake" },
  { from: "/travel-guide", to: "/journal" },
  { from: "/contact-us", to: "/contact" },
];
