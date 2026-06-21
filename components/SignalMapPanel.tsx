"use client";

import Link from "next/link";
import PermissionNotice, { GEO_CONSENT_KEY, storeConsent } from "@/components/PermissionNotice";
import { Button } from "@/components/ui/button";
import type { CityOnlineSummary } from "@/lib/matchmaking";

export interface SignalMapPanelProps {
  cities: CityOnlineSummary[];
  selectedCity: string | null;
  onSelectCity: (slug: string | null) => void;
  yourCity: CityOnlineSummary | null;
  totalOnline: number;
  visible: boolean;
  geoError: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  needsGeoConsent: boolean;
  onAppear: () => void;
  onHide: () => void;
  onDismissConsent: () => void;
  /** compact = homepage sidebar; full = page footer bar */
  layout?: "sidebar" | "footer";
  loginReturnUrl?: string;
}

export default function SignalMapPanel({
  cities,
  selectedCity,
  onSelectCity,
  yourCity,
  totalOnline,
  visible,
  geoError,
  loading,
  isAuthenticated,
  needsGeoConsent,
  onAppear,
  onHide,
  onDismissConsent,
  layout = "sidebar",
  loginReturnUrl = "/signal-map",
}: SignalMapPanelProps) {
  const onlineCities = cities.filter((c) => c.onlineCount > 0);

  if (layout === "footer") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cj-gold-border bg-cj-purple-card/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        {needsGeoConsent && (
          <div className="mb-3 w-full">
            <PermissionNotice
              title="Show your city on the map"
              learnMoreHref="/privacy"
              onAccept={() => {
                storeConsent(GEO_CONSENT_KEY);
                onDismissConsent();
                onAppear();
              }}
              onDecline={onDismissConsent}
              acceptLabel="Allow city-level location"
              body={
                <>
                  <p>City Jam uses your location only to place you in the nearest city — never your exact address.</p>
                  <p>You can hide yourself anytime with &ldquo;Hide Me.&rdquo;</p>
                </>
              }
            />
          </div>
        )}
        <div className="text-xs text-cj-gold-muted">
          <span className="font-mono text-brand-gold">
            {totalOnline === 1 ? "1 musician live" : `${totalOnline} musicians live`}
          </span>
          {visible && yourCity ? (
            <p className="mt-1">
              Visible in {yourCity.name} · {yourCity.onlineCount} nearby
            </p>
          ) : loading ? (
            <p className="mt-1">Locating…</p>
          ) : (
            <p className="mt-1">Neighborhood-level only</p>
          )}
          {geoError && <p className="mt-1 text-cj-gold-bright/80">{geoError}</p>}
        </div>
        <div className="flex gap-2">
          {isAuthenticated ? (
            visible ? (
              <Button variant="secondary" size="sm" onClick={onHide}>
                Hide Me
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onAppear} disabled={loading}>
                {loading ? "Locating…" : "Show on Map"}
              </Button>
            )
          ) : (
            <Link href={`/login?returnUrl=${encodeURIComponent(loginReturnUrl)}`}>
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <aside className="flex h-full flex-col border border-cj-gold-border bg-cj-purple-card/95 backdrop-blur-sm">
      <div className="border-b border-cj-gold-border px-4 py-3">
        <p className="font-display text-sm uppercase tracking-widest text-cj-gold">Signal Map</p>
        <p className="font-mono text-[10px] text-cj-gold-muted">
          {totalOnline === 1 ? "1 musician live" : `${totalOnline} musicians live`}
        </p>
      </div>

      {needsGeoConsent && (
        <div className="border-b border-cj-gold-border p-3">
          <PermissionNotice
            title="Show your city"
            learnMoreHref="/privacy"
            onAccept={() => {
              storeConsent(GEO_CONSENT_KEY);
              onDismissConsent();
              onAppear();
            }}
            onDecline={onDismissConsent}
            acceptLabel="Allow location"
            body={<p>Nearest city only — never your exact address.</p>}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">Online by city</p>
        <ul className="space-y-1">
          {onlineCities.length === 0 ? (
            <li className="text-[10px] text-cj-gold-muted">No drifters yet — be first</li>
          ) : (
            onlineCities.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => onSelectCity(selectedCity === c.slug ? null : c.slug)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[10px] uppercase tracking-wider hover:bg-cj-purple/40 ${
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
          <div className="mt-4 border-t border-cj-gold-border pt-3">
            {cities
              .filter((c) => c.slug === selectedCity && c.drifters.length > 0)
              .map((c) => (
                <div key={c.slug}>
                  <p className="text-[9px] uppercase tracking-widest text-cj-gold-muted">In {c.name}</p>
                  <p className="mt-1 text-[10px] text-cj-gold">{c.drifters.join(" · ")}</p>
                  <Link
                    href="/scene"
                    className="cj-link-groove mt-2 inline-block text-[10px] uppercase"
                  >
                    Browse scene →
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="border-t border-cj-gold-border p-3">
        {visible && yourCity ? (
          <p className="text-[10px] text-cj-gold-muted">
            <span className="text-cj-gold-bright">You&apos;re visible</span> in {yourCity.name}
          </p>
        ) : geoError ? (
          <p className="text-[10px] text-cj-gold-bright/80">{geoError}</p>
        ) : null}
        <div className="mt-2 flex gap-2">
          {isAuthenticated ? (
            visible ? (
              <Button variant="secondary" size="sm" className="flex-1" onClick={onHide}>
                Hide Me
              </Button>
            ) : (
              <Button variant="primary" size="sm" className="flex-1" onClick={onAppear} disabled={loading}>
                {loading ? "…" : "Show on Map"}
              </Button>
            )
          ) : (
            <Link href={`/login?returnUrl=${encodeURIComponent(loginReturnUrl)}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
