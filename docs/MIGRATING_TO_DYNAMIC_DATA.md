# Complete Guide: Migrating MHG Cruise to 100% Dynamic Navora Data

**Target Audience:** Sole Frontend Engineer (`mhgcruise`)  
**Objective:** Step-by-step instructions for safely removing all hardcoded mock datasets in `src/lib/api/mock/*` and switching the entire website to live dynamic database records from Navora SaaS.

---

## 1. Migration Overview & Philosophy

Currently, `mhgcruise` operates in **hybrid mode**:
- It attempts to fetch live data from Navora via `src/lib/navora/client.ts`.
- If the backend is unreachable or `NAVORA_API_KEY` is empty, it silently falls back to `src/lib/api/mock/*.ts`.

Once the Navora backend developer deploys the database schema and public API endpoints, you will transition the site to **100% dynamic mode** by:
1. Activating your tenant `NAVORA_API_KEY`.
2. Verifying each endpoint with real database payloads.
3. Deleting the fallback branches in `src/lib/api/*.ts`.
4. Removing the `src/lib/api/mock/` folder entirely.

---

## 2. Step 1: Environment Variables Setup

Create or update `.env.local` in the root of `mhgcruise`:

```bash
# Navora Public Storefront API URL
# Development (Local API):
NAVORA_API_URL="http://localhost:4000/api/public/v1"

# Production (when deployed):
# NAVORA_API_URL="https://api.navora.app/api/public/v1"

# Your Tenant Storefront API Key
# Generated in Navora Admin -> Company Settings -> Storefront API Keys
NAVORA_API_KEY="nvr_live_sc_9a8b7c6d5e4f3a2b1c0d"
```

> **Testing Connection:**
> Once set, restart your dev server (`pnpm dev`). Open your browser console or terminal. If the key is valid, requests to `navoraFetch` will start receiving HTTP `200` responses instead of `null`.

---

## 3. Step 2: Endpoint-by-Endpoint Cutover

Here is the exact code change for every file in `src/lib/api/` to cut over completely to dynamic data:

---

### 3.1 Packages & Itineraries (`src/lib/api/packages.ts`)
- **Navora Endpoint:** `GET /api/public/v1/packages` and `GET /api/public/v1/packages/:slug`
- **Mock File to Retire:** `src/lib/api/mock/packages.ts`

#### Current Code (Hybrid with fallback):
```ts
export async function getAllPackages(): Promise<Package[]> {
  try {
    const remote = await getNavoraPackages();
    if (remote && Array.isArray(remote) && remote.length > 0) {
      return remote.map(...);
    }
  } catch (err) { ... }
  return MOCK_PACKAGES; // <--- Hardcoded fallback
}
```

#### Final Dynamic Code:
```ts
import type { Package } from "@/types";
import { getNavoraPackages } from "@/lib/navora/client";

export async function getAllPackages(): Promise<Package[]> {
  const remote = await getNavoraPackages();
  if (!remote || remote.length === 0) {
    return [];
  }

  return remote.map((p) => ({
    slug: p.slug || 'package',
    title: p.title || p.categoryName || 'Kenyir Lake Cruise',
    vesselId: p.vesselId || 'summer-cruise',
    durationNights: p.durationNights || 2,
    durationLabel: p.durationLabel || '3 Days 2 Nights',
    fromPriceMYR: typeof p.fromPriceMYR === 'number' ? p.fromPriceMYR : Number(p.packageCost) || 0,
    customPriceLabel: p.customPriceLabel,
    heroImage: p.heroImage || { src: null, alt: p.title || 'Package', width: 1920, height: 1080 },
    overview: p.overview || p.shortDescription || '',
    highlights: p.highlights || [],
    itinerary: p.itinerary || [],
    seasonalItineraries: p.seasonalItineraries,
    pdfUrl: p.brochurePdfUrl || p.pdfUrl,
    inclusions: p.inclusions || p.inclusionsList || [],
    exclusions: p.exclusions || p.exclusionsList || [],
    roomCategoryIds: p.roomCategoryIds || [],
    experienceSlugs: p.experienceSlugs || [],
  }));
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  const all = await getAllPackages();
  return all.find((p) => p.slug === slug);
}
```

---

### 3.2 Fleet Vessels (`src/lib/api/vessels.ts`)
- **Navora Endpoint:** `GET /api/public/v1/vessels`
- **Mock File to Retire:** `src/lib/api/mock/vessels.ts`

#### Final Dynamic Code:
```ts
import type { Vessel } from "@/types";
import { getNavoraVessels } from "@/lib/navora/client";

export async function getAllVessels(): Promise<Vessel[]> {
  const remote = await getNavoraVessels();
  if (!remote || remote.length === 0) return [];

  return remote.map((v) => ({
    id: v.id || 'vessel',
    name: v.name || 'Luxury Lake Cruise',
    tagline: v.tagline || '',
    heroImage: v.heroImage || { src: null, alt: v.name || 'Vessel', width: 1920, height: 1080 },
    gallery: v.gallery || [],
    capacity: v.capacity || 40,
    crewCount: v.crewCount || 10,
    roomCount: v.roomCount || 12,
    statLine: v.statLine || '',
    highlights: v.highlights || [],
    packageSlugs: v.packageSlugs || [],
  }));
}

export async function getVesselById(id: string): Promise<Vessel | undefined> {
  const all = await getAllVessels();
  return all.find((v) => v.id === id);
}
```

---

### 3.3 Staterooms & Cabin Categories (`src/lib/api/rooms.ts`)
- **Navora Endpoint:** `GET /api/public/v1/rooms?vesselId=:vesselId`
- **Mock File to Retire:** `src/lib/api/mock/rooms.ts`

#### Final Dynamic Code:
```ts
import type { RoomCategory } from "@/types";
import { getNavoraRooms } from "@/lib/navora/client";

export async function getRoomsByVessel(vesselId: string): Promise<RoomCategory[]> {
  const remote = await getNavoraRooms(vesselId);
  if (!remote || remote.length === 0) return [];

  return remote.map((r) => ({
    id: r.id || 'room',
    vesselId: r.vesselId || vesselId,
    name: r.name || r.categoryName || 'Stateroom',
    description: r.description || r.shortDescription || '',
    amenities: r.amenities || [],
    occupancy: r.occupancy || r.maxOccupancy || 2,
    indicativePriceMYR: typeof r.indicativePriceMYR === 'number' ? r.indicativePriceMYR : Number(r.baseCostPricePerRoomNight) || 0,
    image: r.image || { src: null, alt: r.name || 'Room', width: 1448, height: 1086 },
  }));
}

export async function getRoomsByIds(ids: string[]): Promise<RoomCategory[]> {
  const all = await getRoomsByVessel('');
  return all.filter((r) => ids.includes(r.id));
}
```

---

### 3.4 Excursions & Activity Catalog (`src/lib/api/experiences.ts`)
- **Navora Endpoint:** `GET /api/public/storefront/experiences`
- **Mock File to Retire:** `src/lib/api/mock/experiences.ts`

#### Final Dynamic Code:
```ts
import type { Experience, ExperienceKind } from "@/types";
import { navoraFetch } from "@/lib/navora/client";
import { mapNavoraExperienceToDomain } from "@/lib/navora/mappers";
import type { NavoraExperienceItem } from "@/lib/navora/types";

export async function getAllExperiences(): Promise<Experience[]> {
  const dynamic = await navoraFetch<NavoraExperienceItem[]>("/api/public/storefront/experiences");
  if (dynamic && dynamic.length > 0) {
    return dynamic.map(mapNavoraExperienceToDomain);
  }
  return [];
}

export async function getExperiencesByKind(kind: ExperienceKind): Promise<Experience[]> {
  const all = await getAllExperiences();
  return all.filter((e) => e.kind === kind);
}

export async function getExperienceBySlug(
  slug: string,
  kind?: ExperienceKind,
): Promise<Experience | undefined> {
  const all = await getAllExperiences();
  return all.find((e) => e.slug === slug && (!kind || e.kind === kind));
}
```

---

### 3.5 Departure Dates & Sailing Calendar (`src/lib/departure-dates.ts`)
- **Navora Endpoint:** `GET /api/public/storefront/departures`
- **Change:** Remove deterministic generator algorithm once live schedule is maintained in Navora Admin -> *Trips & Scheduling* -> *Departures*.

#### Final Dynamic Code:
```ts
import { navoraFetch } from "./navora/client";
import type { AvailabilityStatus, DepartureDate, VesselAvailability, NavoraDepartureItem } from "./departure-dates";

export async function getLiveDepartureDates(options?: {
  includeFull?: boolean;
  limit?: number;
}): Promise<DepartureDate[]> {
  const departures = await navoraFetch<NavoraDepartureItem[]>("/api/public/storefront/departures");
  if (!departures || departures.length === 0) {
    return [];
  }

  const dateMap = new Map<string, DepartureDate>();
  for (const dep of departures) {
    const d = new Date(dep.departureDate);
    const iso = dep.departureDate.slice(0, 10);
    const vesselKey = dep.vesselId.toLowerCase().includes("green") ? "green-horizon" : "summer-cruise";

    const vesselAvailability: VesselAvailability = {
      availableCabins: dep.remainingCapacityRooms,
      totalCabins: dep.totalCapacityRooms || 12,
      status: dep.availabilityTone || "green",
      statusLabel:
        dep.remainingCapacityRooms === 0
          ? "Sold Out"
          : dep.remainingCapacityRooms <= 2
          ? "Last Cabins"
          : dep.remainingCapacityRooms <= 5
          ? "Filling Fast"
          : "Available",
      canCharter: dep.canCharter,
    };

    if (!dateMap.has(iso)) {
      dateMap.set(iso, {
        date: d,
        iso,
        label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }),
        dayName: d.getDay() === 1 ? "Monday" : "Friday",
        demand: dep.remainingCapacityRooms === 0 ? "full" : dep.remainingCapacityRooms <= 4 ? "selling-fast" : "open",
        vessels: {
          "summer-cruise": { availableCabins: 12, totalCabins: 12, status: "green", statusLabel: "Available", canCharter: true },
          "green-horizon": { availableCabins: 12, totalCabins: 12, status: "green", statusLabel: "Available", canCharter: true },
        },
      });
    }

    dateMap.get(iso)!.vessels[vesselKey] = vesselAvailability;
  }

  const result = Array.from(dateMap.values());
  return options?.limit ? result.slice(0, options.limit) : result;
}
```

---

### 3.6 FAQs, Verified Reviews & Destination Guide (`src/lib/api/faqs.ts`, `reviews.ts`, `lake.ts`)
- **Navora Endpoint:** `GET /api/public/v1/site/content`
- **Mock Files to Retire:** `src/lib/api/mock/reviews.ts`, `src/lib/api/mock/lake.ts`

Simply replace the fallback arrays (`FAQ_CATEGORIES`, `MOCK_REVIEWS`, `MOCK_LAKE`) with empty states or throw Next.js `notFound()` if content is unpopulated.

---

### 3.7 Online Booking Checkout Dispatch (`src/lib/api/booking.ts`)
- **Navora Endpoint:** `POST /api/public/storefront/bookings`
- When live, delete the mock reference simulation (`SC-YYYY-XXXX`) and throw an error banner if the server returns non-200.

---

## 4. Step 3: Deleting the Mock Folder

Once all endpoints in Step 2 return live data:

1. Delete the mock directory:
   ```powershell
   Remove-Item -Recurse -Force "src/lib/api/mock"
   ```
2. Verify that no file in `src/` imports from `./mock/` or `@/lib/api/mock`:
   ```powershell
   Select-String -Path "src/**/*.ts", "src/**/*.tsx" -Pattern "mock"
   ```
3. Run the TypeScript typecheck:
   ```powershell
   pnpm run typecheck
   ```
4. Run the production build test:
   ```powershell
   pnpm run build
   ```

---

## 5. Summary Checklist for When Real Data Arrives

- [ ] Backend developer confirms all 6 branches are merged and deployed to Navora API.
- [ ] You generate a live Storefront API Key from Navora Admin -> Company Settings -> Storefront API Keys.
- [ ] Add `NAVORA_API_URL` and `NAVORA_API_KEY` to `.env.local`.
- [ ] Verify homepage loads real vessel names and Lake Kenyir destination copy.
- [ ] Verify packages list shows packages created in Navora Admin.
- [ ] Submit a test booking via `/book` and verify it appears in Navora Admin -> *Reservations & Bookings* (`/bookings`).
- [ ] Delete `src/lib/api/mock/` folder and run `pnpm run build`.
