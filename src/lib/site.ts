export const SITE = {
  name: "Summer Cruise",
  domain: "https://summercruise.com.my",
  companyName: "Summer Cruise Sdn Bhd",
  companyNo: "200401007510 (646014-X)",
  tagline: {
    en: "Luxury houseboat cruises on Kenyir Lake, Terengganu.",
    ms: "Pelayaran houseboat mewah di Tasik Kenyir, Terengganu.",
  },
  phone: "+6019-912 9966",
  phoneSecondary: "+60 17 981 9827",
  phoneHref: "tel:+60199129966",
  email: "enquiry@summercruise.com.my",
  address: "219-E, Hotel Ming Paragon, Jalan Sultan Zainal Abidin, 20000 Kuala Terengganu, Terengganu, Malaysia",
  jettyAddress: "Pengkalan Gawi Jetty, Tasik Kenyir, 21700 Kuala Berang, Terengganu",
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
