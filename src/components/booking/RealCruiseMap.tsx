"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { MapWaypoint } from "@/types";
import { Maximize2, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealCruiseMapProps {
  waypoints: MapWaypoint[];
  activeWaypointIndex: number;
  onSelectWaypoint: (index: number) => void;
  navigationPath?: [number, number][];
  className?: string;
}

type LayerMode = "voyager" | "satellite" | "topo";

const TILE_PROVIDERS: Record<LayerMode, { url: string; attribution: string; label: string }> = {
  voyager: {
    label: "Nautical Chart",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, DeLorme, HERE, and others",
  },
  satellite: {
    label: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
  },
  topo: {
    label: "Topographic",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
  },
};

/**
 * Catmull-Rom spline interpolation so the route drawn between hand-plotted
 * fairway waypoints reads as a single continuous curve hugging the water
 * rather than a jagged dot-to-dot line. `segments` points are inserted
 * between every pair of source points; the original points are preserved.
 */
function smoothPolyline(points: [number, number][], segments = 10): [number, number][] {
  if (points.length < 3) return points;
  const out: [number, number][] = [];
  const get = (i: number) => points[Math.min(Math.max(i, 0), points.length - 1)];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);

    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const t2 = t * t;
      const t3 = t2 * t;
      const lat =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
      const lng =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out.push([lat, lng]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

export default function RealCruiseMap({
  waypoints,
  activeWaypointIndex,
  onSelectWaypoint,
  navigationPath,
  className,
}: RealCruiseMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const onSelectWaypointRef = useRef(onSelectWaypoint);

  useEffect(() => {
    onSelectWaypointRef.current = onSelectWaypoint;
  }, [onSelectWaypoint]);

  const [activeLayer, setActiveLayer] = useState<LayerMode>("voyager");

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialized

    // Center around Lake Kenyir (Tasik Kenyir)
    const initialCenter: [number, number] = [5.0500, 102.7900];
    const initialZoom = 11;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    // Add zoom controls to bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial Tile Layer
    const tileProvider = TILE_PROVIDERS.voyager;
    const tileLayer = L.tileLayer(tileProvider.url, {
      maxZoom: 18,
      attribution: tileProvider.attribution,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Tile Layer when layer mode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const provider = TILE_PROVIDERS[activeLayer];
    const newLayer = L.tileLayer(provider.url, {
      maxZoom: 18,
      attribution: provider.attribution,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [activeLayer]);

  // Update Route Polyline & Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || waypoints.length === 0) return;

    // 1. Remove previous markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // 2. Remove previous route
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    // 3. Draw Water Navigation Polyline (following lake water channels),
    // smoothed into a continuous curve so it reads as one flowing route
    // rather than dot-to-dot segments between the plotted fairway points.
    const rawCoords: [number, number][] =
      navigationPath && navigationPath.length > 0
        ? navigationPath
        : waypoints.map((wp) => [wp.lat, wp.lng]);
    const polylineCoords = smoothPolyline(rawCoords);

    if (polylineCoords.length > 1) {
      // Glow underlayer
      L.polyline(polylineCoords, {
        color: activeLayer === "satellite" ? "#38bdf8" : "#0e7490",
        weight: 6,
        opacity: 0.35,
      }).addTo(map);

      // Dash route layer
      const polyline = L.polyline(polylineCoords, {
        color: activeLayer === "satellite" ? "#ffffff" : "#164e63",
        weight: 3.5,
        opacity: 0.95,
        dashArray: "6, 8",
        lineCap: "round",
      }).addTo(map);

      // Subtle marching-dash animation so the route reads as a direction of
      // travel rather than a static line — a common nautical-chart touch.
      const pathEl = polyline.getElement();
      if (pathEl) {
        pathEl.classList.add("cruise-route-flow");
      }

      routePolylineRef.current = polyline;
    }

    // 4. Create Custom Pulsing Markers for each Waypoint
    const newMarkers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    waypoints.forEach((wp, idx) => {
      const isActive = idx === activeWaypointIndex;
      const latLng: [number, number] = [wp.lat, wp.lng];
      bounds.extend(latLng);

      const markerHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110">
          ${
            isActive
              ? `<div class="absolute size-12 rounded-full bg-amber-400/40 animate-ping"></div>
                 <div class="absolute size-8 rounded-full bg-teal-500/30"></div>`
              : ""
          }
          <div class="relative flex size-7 items-center justify-center rounded-full border-2 ${
            isActive
              ? "border-amber-400 bg-teal-900 text-amber-300 shadow-lg scale-110 ring-2 ring-amber-300/60"
              : "border-white bg-teal-800 text-white shadow-md hover:bg-teal-700"
          } text-[11px] font-bold tracking-tight">
            ${wp.dayNumber ? `D${wp.dayNumber}` : idx + 1}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-obsidian/90 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm backdrop-blur-sm pointer-events-none">
            ${wp.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-cruise-marker",
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);
      marker.on("click", () => {
        onSelectWaypointRef.current(idx);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    // Fit map bounds initially
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [waypoints, navigationPath, activeLayer, activeWaypointIndex]);

  // Pan to active waypoint when selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const activeWp = waypoints[activeWaypointIndex];
    if (activeWp && activeWp.lat && activeWp.lng) {
      map.flyTo([activeWp.lat, activeWp.lng], 12.5, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [activeWaypointIndex, waypoints]);

  const fitAllBounds = () => {
    const map = mapRef.current;
    if (!map || waypoints.length === 0) return;
    const bounds = L.latLngBounds(waypoints.map((wp) => [wp.lat, wp.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45] });
    }
  };

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      {/* Marching-dash route animation (respects reduced-motion) */}
      <style jsx global>{`
        .cruise-route-flow {
          animation: cruise-route-dash 1.4s linear infinite;
        }
        @keyframes cruise-route-dash {
          to {
            stroke-dashoffset: -28;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cruise-route-flow {
            animation: none;
          }
        }
      `}</style>

      {/* Real Map Leaflet Container */}
      <div ref={mapContainerRef} className="size-full z-0 bg-[#c9e1e8]" />

      {/* Top Floating Controls: Real Layer Switcher & Re-center */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-2xl bg-white/90 p-1 shadow-lg backdrop-blur-md border border-ink/10 text-xs">
          {(["voyager", "satellite", "topo"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setActiveLayer(mode)}
              className={cn(
                "rounded-xl px-3 py-1.5 font-medium transition-all",
                activeLayer === mode
                  ? "bg-obsidian text-white shadow-sm"
                  : "text-text-muted hover:text-ink hover:bg-black/5"
              )}
            >
              {TILE_PROVIDERS[mode].label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={fitAllBounds}
          title="Fit full route in view"
          className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-lg backdrop-blur-md border border-ink/10 hover:bg-white transition-all"
        >
          <Maximize2 className="size-3.5 text-teal-deep" />
          <span className="hidden sm:inline">Fit Route</span>
        </button>
      </div>

      {/* Lake Kenyir Geographic Badge */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 rounded-xl bg-obsidian/85 px-3 py-1.5 text-[11px] font-medium text-white shadow-md backdrop-blur-sm">
        <Navigation className="size-3 text-gold-bright" />
        <span>Tasik Kenyir, Terengganu · 5.06° N, 102.80° E</span>
      </div>
    </div>
  );
}
