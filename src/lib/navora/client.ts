/**
 * Resilient Navora Storefront API Client.
 *
 * Connects the MHG Cruise website to the Navora SaaS backend API.
 * In development or when the Navora API key is unconfigured, methods
 * gracefully return `null` to let call sites fall back to static data
 * with zero UI interruption.
 */

import type { NavoraSiteConfig, NavoraMarketingContent } from './types';

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
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn(`[Navora Storefront] Request to ${endpoint} timed out after ${REQUEST_TIMEOUT_MS}ms`);
    } else {
      console.warn(`[Navora Storefront] Connection error on ${endpoint}:`, err.message || err);
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
export async function getNavoraVessels(): Promise<any[] | null> {
  return navoraFetch<any[]>('/vessels');
}

/**
 * Fetch public packages catalog from Navora Storefront API.
 */
export async function getNavoraPackages(): Promise<any[] | null> {
  return navoraFetch<any[]>('/packages');
}

/**
 * Fetch cabin rooms / categories from Navora Storefront API.
 */
export async function getNavoraRooms(vesselId?: string): Promise<any[] | null> {
  const query = vesselId ? `?vesselId=${encodeURIComponent(vesselId)}` : '';
  return navoraFetch<any[]>(`/rooms${query}`);
}

/**
 * Fetch interactive deck plan with floor spots from Navora Storefront API.
 */
export async function getNavoraDeckPlan(vesselId: string): Promise<any | null> {
  return navoraFetch<any>(`/vessels/${encodeURIComponent(vesselId)}/deck-plan`);
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
      const errBody = await res.json().catch(() => ({}));
      return { ok: false, error: errBody.message || `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, id: data.id };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Network error' };
  }
}
