export const SITE = {
  name: "Summer Cruise",
  domain: "https://summercruise.example",
  tagline: {
    en: "Luxury houseboat cruises on Kenyir Lake, Terengganu.",
    ms: "Pelayaran houseboat mewah di Tasik Kenyir, Terengganu.",
  },
  phone: "+60 12-345 6789",
  phoneHref: "tel:+60123456789",
  email: "hello@summercruise.example",
  address: "Pengkalan Gawi Jetty, Tasik Kenyir, 21700 Kuala Berang, Terengganu",
} as const;

/** §7.1: the two help channels are never hidden behind a hamburger menu. */
export const HELP_CHANNELS = {
  whatsapp: {
    hrefKey: "common.whatsappHref",
  },
  call: {
    href: SITE.phoneHref,
    labelKey: "common.callUs",
  },
} as const;
