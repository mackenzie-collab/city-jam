"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMapPresence } from "@/hooks/useMapPresence";

const SignalMapWorld = dynamic(() => import("@/components/SignalMapWorld"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="font-display text-sm uppercase tracking-widest text-cj-gold-muted animate-pulse">
        Scanning signals...
      </p>
    </div>
  ),
});

export default function SignalMap() {
  const { user, isAuthenticated } = useAuth();
  const {
    cities,
    yourCity,
    totalOnline,
    visible,
    geoError,
    loading,
    appearOnMap,
    hideFromMap,
  } = useMapPresence(user?.id, isAuthenticated);

  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const onlineCities = cities.filter((c) => c.onlineCount > 0);

  return (
    <div className="relative min-h-screen bg-cj-purple-map">
      <PageHeader
        title="Global Signal Map"
        showDot
        rightElement={
          <span className="rounded-full border border-cj-gold-border bg-cj-purple-card px-4 py-1.5 text-xs font-semibold text-cj-gold">
            {totalOnline} live
          </span>
        }
      />

      <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden pb-20">
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, rgba(201,168,0,0.5) 41px, transparent 42px)",
          }}
        />

        <div className="relative z-[5] h-full w-full px-2 py-2 md:px-4">
          <SignalMapWorld
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            yourCitySlug={yourCity?.slug ?? null}
          />
        </div>

        <aside className="absolute bottom-24 left-4 z-20 w-52 rounded-lg border border-cj-gold-border bg-cj-purple-card/95 p-3 backdrop-blur-sm">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
            Online by city
          </p>
          <ul className="max-h-36 space-y-1 overflow-y-auto">
            {onlineCities.length === 0 ? (
              <li className="text-[10px] text-cj-gold-muted">No drifters yet — be first</li>
            ) : (
              onlineCities.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => setSelectedCity(c.slug)}
                    className={`flex w-full items-center justify-between rounded px-2 py-1 text-left text-[10px] uppercase tracking-wider hover:bg-cj-purple/40 ${
                      selectedCity === c.slug ? "text-cj-gold-bright" : "text-cj-gold"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-display text-sm">{c.onlineCount}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          {selectedCity && (
            <div className="mt-3 border-t border-cj-gold-border pt-2">
              {cities
                .filter((c) => c.slug === selectedCity && c.drifters.length > 0)
                .map((c) => (
                  <div key={c.slug}>
                    <p className="text-[9px] uppercase tracking-widest text-cj-gold-muted">
                      In {c.name}
                    </p>
                    <p className="mt-1 text-[10px] text-cj-gold">{c.drifters.join(" · ")}</p>
                  </div>
                ))}
            </div>
          )}
        </aside>

        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-cj-gold-border bg-cj-purple-card/95 px-6 py-4 backdrop-blur-sm">
          <p className="text-xs text-cj-gold-muted">
            {visible && yourCity
              ? `You're in ${yourCity.name} · ${yourCity.onlineCount} nearby`
              : "Neighborhood-level only · no exact location"}
            {geoError && <span className="mt-1 block text-cj-gold-bright/80">{geoError}</span>}
          </p>
          <div className="flex gap-2">
            {isAuthenticated ? (
              visible ? (
                <Button variant="secondary" size="sm" onClick={hideFromMap}>
                  Hide Me
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={appearOnMap} disabled={loading}>
                  {loading ? "Locating..." : "Appear on Map"}
                </Button>
              )
            ) : (
              <Link href="/login?returnUrl=/signal-map">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
