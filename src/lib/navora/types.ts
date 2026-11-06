/**
 * Type definitions for Navora Storefront API responses.
 *
 * Sourced from Navora's Public Storefront API contracts (`/api/public/v1/*`).
 */

export interface NavoraSiteConfig {
  companyName: string;
  registration: string;
  tagline?: {
    en?: string;
    ms?: string;
  };
  contact: {
    phone: string;
    secondaryPhone?: string;
    whatsappNumber?: string;
    email: string;
  };
  embarkation: {
    jettyAddress: string;
    gps?: {
      lat: number;
      lng: number;
    };
    mapUrl?: string;
    checkInInstructions?: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  seo: {
    siteTitle?: string;
    metaDescription?: string;
    ogImageUrl?: string;
  };
  legal: {
    termsUrl?: string;
    privacyUrl?: string;
  };
}

export interface NavoraFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface NavoraReviewItem {
  id: string;
  guestName: string;
  location: string;
  rating: number;
  quote: string;
  vesselId?: string;
  packageSlug?: string;
}

export interface NavoraDestinationInfo {
  overview: string;
  bestTimeToVisit: string;
  gettingThereRoad: string;
  gettingThereAirport: string;
  gettingThereJetty: string;
  heroImageUrls?: string[];
}

export interface NavoraMarketingContent {
  faqs?: NavoraFaqItem[];
  reviews?: NavoraReviewItem[];
  destination?: NavoraDestinationInfo;
  offers?: any[];
  articles?: any[];
}

export interface NavoraExperienceItem {
  id: string;
  slug: string;
  kind?: string;
  title: string;
  heroImageUrl?: string;
  shortTag?: string;
  tags?: string[];
  lines?: string[];
  includedInPackageSlugs?: string[];
}

