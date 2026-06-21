"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
  Sphere,
  Graticule,
} from "react-simple-maps";
import {
  CITY_DOTS,
  CLUSTERS,
  SIGNAL_PATHS,
  WORLD_GEO_URL,
} from "@/lib/signal-map-data";
import type { CityOnlineSummary } from "@/lib/matchmaking";

interface SignalMapWorldProps {
  cities: CityOnlineSummary[];
  selectedCity?: string | null;
  onSelectCity?: (slug: string | null) => void;
  yourCitySlug?: string | null;
  /** Non-interactive ambient mode — hub pulses only, no tooltips or clicks. */
  decorative?: boolean;
}

export default function SignalMapWorld({
  cities,
  selectedCity,
  onSelectCity,
  yourCitySlug,
  decorative = false,
}: SignalMapWorldProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const countBySlug = Object.fromEntries(cities.map((c) => [c.slug, c.onlineCount]));

  const updateTooltip = (e: React.MouseEvent, slug: string) => {
    setHovered(slug);
    const rect = (e.currentTarget as Element).closest("svg")?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const activeSlug = decorative ? null : (hovered ?? selectedCity);
  const activeCity = decorative ? null : cities.find((c) => c.slug === activeSlug);

  return (
    <div className={decorative ? "relative h-full w-full pointer-events-none" : "relative h-full w-full"}>
      {activeCity && (
        <div
          className="pointer-events-none absolute z-30 min-w-[140px] rounded border border-cj-gold-border bg-cj-purple-card px-3 py-2 shadow-lg"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translate(-50%, -120%)",
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-cj-gold">
            {activeCity.name}
          </p>
          <p className="mt-1 font-display text-lg text-cj-gold-bright">
            {activeCity.onlineCount} online
          </p>
          {activeCity.drifters.length > 0 && (
            <p className="mt-1 text-[9px] text-cj-gold-muted">
              {activeCity.drifters.slice(0, 4).join(" · ")}
              {activeCity.drifters.length > 4 ? " …" : ""}
            </p>
          )}
        </div>
      )}

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 165, center: [10, 5] }}
        width={980}
        height={520}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <filter id="cluster-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="cluster-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(90, 0, 144, 0.85)" />
            <stop offset="45%" stopColor="rgba(90, 0, 144, 0.35)" />
            <stop offset="100%" stopColor="rgba(90, 0, 144, 0)" />
          </radialGradient>
        </defs>

        <Sphere fill="#0A0010" stroke="rgba(201,168,0,0.08)" strokeWidth={0.5} />
        <Graticule stroke="rgba(201, 168, 0, 0.04)" strokeWidth={0.4} />

        <Geographies geography={WORLD_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2A0050"
                stroke="rgba(201, 168, 0, 0.12)"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: {
                    fill: "#3D0066",
                    stroke: "rgba(201, 168, 0, 0.35)",
                    outline: "none",
                  },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {SIGNAL_PATHS.map((path, i) => (
          <Line
            key={i}
            from={path[0]}
            to={path[1]}
            stroke="rgba(201, 168, 0, 0.2)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        ))}

        {CLUSTERS.map((cluster, i) => (
          <Marker key={i} coordinates={cluster.coordinates}>
            <circle
              r={cluster.radius}
              fill="url(#cluster-fill)"
              filter="url(#cluster-glow)"
              opacity={0.85}
            />
          </Marker>
        ))}

        {CITY_DOTS.map((city) => {
          const online = decorative ? (city.hub ? 1 : 0) : (countBySlug[city.slug] ?? 0);
          const isYou = !decorative && yourCitySlug === city.slug;
          const isActive = !decorative && activeSlug === city.slug;
          const r = city.hub ? 6 : 4;
          const pulse = decorative ? city.hub : online > 0 || city.hub;
          const showGlow = decorative ? city.hub : online > 0;

          return (
            <Marker key={city.slug} coordinates={city.coordinates}>
              <g
                onMouseEnter={decorative ? undefined : (e) => updateTooltip(e, city.slug)}
                onMouseMove={decorative ? undefined : (e) => updateTooltip(e, city.slug)}
                onMouseLeave={decorative ? undefined : () => setHovered(null)}
                onClick={
                  decorative
                    ? undefined
                    : (e) => {
                        e.stopPropagation();
                        onSelectCity?.(selectedCity === city.slug ? null : city.slug);
                      }
                }
                style={decorative ? undefined : { cursor: "pointer" }}
              >
                {!decorative && <circle r={18} fill="transparent" />}
                {pulse && (
                  <circle
                    r={decorative ? 14 : online > 0 ? 12 + online * 2 : 10}
                    fill="#D4A000"
                    opacity={decorative ? 0.18 : online > 0 ? 0.2 : 0.1}
                    className={showGlow ? "animate-pulse-glow" : undefined}
                  />
                )}
                <circle
                  r={r}
                  fill={isYou ? "#D4A017" : "#D4A000"}
                  stroke={isActive || isYou ? "#D4A017" : "transparent"}
                  strokeWidth={isYou ? 2 : 0}
                  filter={showGlow ? "url(#dot-glow)" : undefined}
                  opacity={decorative ? (city.hub ? 0.85 : 0.3) : online > 0 ? 1 : 0.45}
                />
                {!decorative && online > 0 && (
                  <text
                    y={-14}
                    textAnchor="middle"
                    fill="#B3A200"
                    fontSize={9}
                    fontFamily="var(--font-headline), sans-serif"
                    letterSpacing="0.1em"
                  >
                    {online}
                  </text>
                )}
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
