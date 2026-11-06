# MHG Cruise (Summer Cruise) — Navora Data Integration

**Repository:** `mhgcruise`  
**Purpose:** Connect public tenant website to Navora SaaS backend API while preserving 100% existing design, styles, animations, and tokens.  
**Date:** November 2026  

---

## 1. Architecture Overview

The integration introduces a zero-breaking-change data fetching layer under `src/lib/navora/`:
- **`src/lib/navora/types.ts`:** TypeScript interfaces for Navora Storefront API payloads.
- **`src/lib/navora/client.ts`:** Resilient HTTP client communicating with Navora's `/api/public/v1/*` endpoints using `X-Navora-Key` authentication and 60-second Next.js Data Cache revalidation.
- **`src/lib/navora/mappers.ts`:** Pure functional mappers converting Navora API structures into the exact `types/index.ts` formats consumed by existing view components.

```
┌────────────────────────────┐
│   MHG Cruise Frontend UI   │ (100% untouched layout & design tokens)
└─────────────▲──────────────┘
              │
┌─────────────┴──────────────┐
│      src/lib/api/*.ts      │ (Async repository functions)
└──────▲──────────────▲──────┘
       │              │
[Navora Available]  [Fallback / Offline]
       │              │
┌──────┴───────────┐ ┌┴────────────────────────┐
│ src/lib/navora/  │ │ src/lib/api/mock/*.ts   │
│ Storefront Client│ │ (Local static dataset)  │
└──────▲───────────┘ └─────────────────────────┘
       │
┌──────┴───────────┐
│ Navora Public API│
│ (Storefront Keys)│
└──────────────────┘
```

---

## 2. Environment Variables

Configure the following variables in `.env.local` or deployment platform (Vercel):

```bash
# Navora Storefront API Base URL
NAVORA_API_URL="http://localhost:4000/api/public/v1"

# Storefront API Key generated from Navora Admin -> Company Settings -> Storefront API Keys
NAVORA_API_KEY="nvr_live_sc_••••••••••••••••••••••••"
```

### Graceful Fallback Behavior
- If `NAVORA_API_KEY` is not set or empty, all API client functions immediately return `null`.
- When `null` is returned or an HTTP error occurs, repository methods (`getFaqCategories()`, `getAllReviews()`, `getLakeInfo()`) automatically fall back to the built-in mock datasets (`FAQ_CATEGORIES`, `MOCK_REVIEWS`, `MOCK_LAKE`).
- Operators can run and preview the website locally with zero external network dependencies.

---

## 3. Integrated Endpoints & Data Mappings

### 3.1 FAQs (`/api/public/v1/site/content?type=faqs`)
- **Consumer:** `src/lib/api/faqs.ts` -> `getFaqCategories()`
- **Mapping:** Flattens categories and questions into `FaqCategory[]` with IDs `about`, `packages`, `getting_there`, `life_onboard`, `dining`, `booking`.

### 3.2 Guest Reviews (`/api/public/v1/site/content?type=reviews`)
- **Consumer:** `src/lib/api/reviews.ts` -> `getAllReviews()`, `getReviewsByVessel()`, `getReviewsByPackage()`
- **Mapping:** Maps `{ id, guestName, location, rating, quote, vesselId, packageSlug }` directly to `Review[]`.

### 3.3 Destination & Lake Logistics (`/api/public/v1/site/content?type=destination`)
- **Consumer:** `src/lib/api/lake.ts` -> `getLakeInfo()`
- **Mapping:** Maps `{ overview, bestTimeToVisit, gettingThereRoad, gettingThereAirport, gettingThereJetty }` to `LakeInfo`.

### 3.4 Packages & Itineraries (`/api/public/v1/packages`)
- **Consumer:** `src/lib/api/packages.ts` -> `getAllPackages()`, `getPackageBySlug()`, `getFilteredPackages()`
- **Mapping:** Maps package title, duration nights/label, fromPriceMYR, brochure PDF URL, attraction highlights, inclusions, and exclusions into `Package`.

### 3.5 Fleet Vessels & Stateroom Categories (`/api/public/v1/vessels` & `/api/public/v1/rooms`)
- **Consumer:** `src/lib/api/vessels.ts` -> `getAllVessels()`, `getVesselById()`; `src/lib/api/rooms.ts` -> `getRoomsByVessel()`
- **Mapping:** Maps vessel names, passenger capacities (34 PAX for Summer Cruise, 60 PAX for Green Horizon), deck numbers, and cabin categories with ensuite bathroom specs directly into `Vessel` and `RoomCategory`.

### 3.5 Interactive Deck Plan Hotspots (`/api/public/v1/vessels/:id/deck-plan`)
- **Consumer:** `<VesselCabinPicker>` via `getNavoraDeckPlan()`
- **Mapping:** Returns floor plan blueprints and SVG rectangle hotspot coordinates `{ x, y, w, h }` for cabin selection.

### 3.6 Direct Enquiry Dispatch (`POST /api/public/v1/enquiries`)
- **Consumer:** `src/lib/api/enquiry.ts` -> `submitEnquiry()`
- **Behavior:** In addition to sending email via Resend / console logger, submissions are automatically forwarded to Navora's CRM (`/commercial/enquiries`) with guest name, phone, email, preferred date, party size, package slug, and notes.

### 3.7 Experiences & Activity Catalog (`/api/public/storefront/experiences`)
- **Consumer:** `src/lib/api/experiences.ts` -> `getAllExperiences()`, `getExperiencesByKind()`, `getExperienceBySlug()`, `getExperiencesBySlugs()`
- **Mapping:** Maps dynamic Navora catalog activities (elephant village, Kelah sanctuary fish spa, Bewah prehistoric caves, Melunak rainforest hike) into `Experience` records with hero images, category tags, and package associations.


---

## 4. Verification & Quality Gates

- `pnpm run typecheck`: Passed with 0 errors.
- Design preservation: 100% of Tailwind tokens, typography, CSS modules, animations, and image aspect ratios are preserved.
