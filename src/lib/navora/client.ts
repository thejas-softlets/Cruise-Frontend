/**
 * Resilient Navora Storefront API Client.
 *
 * Connects the MHG Cruise website to the Navora SaaS backend API.
 * In development or when the Navora API key is unconfigured, methods
 * gracefully return `null` to let call sites fall back to static data
 * with zero UI interruption.
 */

import type { NavoraSiteConfig, NavoraMarketingContent } from './types';
import type { MediaAsset } from '@/types';

export interface NavoraRemoteVessel {
  id?: string;
  name?: string;
  tagline?: string;
  heroImage?: MediaAsset;
  gallery?: MediaAsset[];
  capacity?: number;
  crewCount?: number;
  roomCount?: number;
  statLine?: string;
  highlights?: string[];
  packageSlugs?: string[];
}

export interface NavoraRemotePackage {
  id?: string;
  slug?: string;
  name?: string;
  categoryName?: string;
  title?: string;
  vesselId?: string;
  durationNights?: number;
  durationLabel?: string;
  fromPriceMYR?: number;
  packageCost?: number | string;
  customPriceLabel?: string;
  heroImage?: MediaAsset;
  overview?: string;
  shortDescription?: string;
  highlights?: string[];
  inclusionsList?: string[];
  exclusionsList?: string[];
  inclusions?: string[];
  exclusions?: string[];
  brochurePdfUrl?: string;
  pdfUrl?: string;
  itinerary?: any[];
  seasonalItineraries?: any;
  roomCategoryIds?: string[];
  experienceSlugs?: string[];
}

export interface NavoraRemoteRoom {
  id?: string;
  vesselId?: string;
  name?: string;
  categoryName?: string;
  description?: string;
  shortDescription?: string;
  amenities?: string[];
  occupancy?: number;
  maxOccupancy?: number;
  indicativePriceMYR?: number;
  baseCostPricePerRoomNight?: number | string;
  image?: MediaAsset;
}

const API_BASE = process.env.NAVORA_API_URL || 'http://localhost:4000/api/public/v1';
const API_KEY = process.env.NAVORA_API_KEY || '';
const REQUEST_TIMEOUT_MS = 6000;

export async function navoraFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  if (!API_KEY) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `${API_BASE.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Navora-Key': API_KEY,
        ...options.headers,
      },
      next: { revalidate: 60 }, // Cache on Next.js Data Cache for 60 seconds
    });

    if (!res.ok) {
      console.warn(`[Navora Storefront] API ${endpoint} responded with status ${res.status}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn(`[Navora Storefront] Request to ${endpoint} timed out after ${REQUEST_TIMEOUT_MS}ms`);
    } else {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Navora Storefront] Connection error on ${endpoint}:`, msg);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch tenant public brand config, contact phones, embarkation coordinates.
 */
export async function getNavoraSiteConfig(): Promise<NavoraSiteConfig | null> {
  return navoraFetch<NavoraSiteConfig>('/site/config');
}

/**
 * Fetch marketing content (FAQs, guest reviews, Lake Kenyir destination overview).
 */
export async function getNavoraMarketingContent(): Promise<NavoraMarketingContent | null> {
  return navoraFetch<NavoraMarketingContent>('/site/content');
}

/**
 * Fetch public fleet vessels from Navora Storefront API.
 */
export async function getNavoraVessels(): Promise<NavoraRemoteVessel[] | null> {
  return navoraFetch<NavoraRemoteVessel[]>('/vessels');
}

/**
 * Fetch public packages catalog from Navora Storefront API.
 */
export async function getNavoraPackages(): Promise<NavoraRemotePackage[] | null> {
  return navoraFetch<NavoraRemotePackage[]>('/packages');
}

/**
 * Fetch cabin rooms / categories from Navora Storefront API.
 */
export async function getNavoraRooms(vesselId?: string): Promise<NavoraRemoteRoom[] | null> {
  const query = vesselId ? `?vesselId=${encodeURIComponent(vesselId)}` : '';
  return navoraFetch<NavoraRemoteRoom[]>(`/rooms${query}`);
}

/**
 * Fetch interactive deck plan with floor spots from Navora Storefront API.
 */
export async function getNavoraDeckPlan(vesselId: string): Promise<Record<string, unknown> | null> {
  return navoraFetch<Record<string, unknown>>(`/vessels/${encodeURIComponent(vesselId)}/deck-plan`);
}

/**
 * Submit guest enquiry directly into Navora CRM (`/commercial/enquiries`).
 */
export async function submitNavoraEnquiry(payload: {
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  pax?: number;
  packageSlug?: string;
  vesselId?: string;
  notes?: string;
  source?: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!API_KEY) {
    // Mock simulation in local development
    return { ok: true, id: `enq-mock-${Date.now()}` };
  }

  try {
    const url = `${API_BASE.replace(/\/$/, '')}/enquiries`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Navora-Key': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = (await res.json().catch(() => ({}))) as { message?: string };
      return { ok: false, error: errBody.message || `HTTP ${res.status}` };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    return { ok: false, error: errorMsg };
  }
}
