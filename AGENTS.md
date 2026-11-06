<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MHG Cruise (Summer Cruise) Engineering & Dynamic Wiring Rules

## 1. Zero Design Changes — Dynamic Data Only
- **Strict Rule:** NEVER alter the visual design, layouts, typography, design tokens, Tailwind utility classes, or Framer Motion transitions.
- All pages and components (`vessels`, `packages`, `rooms`, `itinerary`, `booking`, `gallery`, `reviews`, `offers`) MUST maintain 100% layout and visual fidelity.
- Only the data-fetching and mapping layer (`src/lib/api/*.ts` + `src/lib/navora/`) is refactored from static mock fixtures to dynamic Navora public API data.
- Graceful local fallback: if `NAVORA_API_KEY` or `NAVORA_BASE_URL` is missing, smoothly fall back to typed local data with a developer notice so local preview never breaks.

## 2. Isolated Documentation
- All integration logs, mapper notes, and environment configurations must be documented strictly in `mhgcruise/docs/` (e.g. `mhgcruise/docs/DYNAMIC_DATA_INTEGRATION.md`).
- NEVER document MHGCruise changes in Navora.

