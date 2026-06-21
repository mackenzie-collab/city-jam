"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import AppChrome from "@/components/AppChrome";
import AppTrail from "@/components/AppTrail";
import PageHeader from "@/components/PageHeader";
import SignalMapPanel from "@/components/SignalMapPanel";
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
    needsGeoConsent,
    dismissGeoConsent,
  } = useMapPresence(user?.id, isAuthenticated);

  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <AppChrome>
      <div className="relative min-h-screen bg-cj-purple-map">
        <PageHeader
          title="Global Signal Map"
          backHref="/"
          showDot
          rightElement={
            <span className="rounded-full border border-cj-gold-border bg-cj-purple-card px-4 py-1.5 text-xs font-semibold text-cj-gold">
              {totalOnline} live
            </span>
          }
        />

        <div className="px-6 pt-4">
          <AppTrail />
        </div>

        <div className="relative grid h-[calc(100vh-120px)] w-full grid-rows-1 overflow-hidden pb-20 lg:grid-cols-[1fr_280px]">
          <div className="relative z-[15] h-full min-h-[300px] w-full px-2 py-2 md:px-4">
            <SignalMapWorld
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              yourCitySlug={yourCity?.slug ?? null}
              decorative={false}
            />
          </div>

          <aside className="absolute bottom-24 left-4 z-20 w-52 lg:static lg:bottom-auto lg:left-auto lg:w-auto lg:p-4">
            <SignalMapPanel
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              yourCity={yourCity}
              totalOnline={totalOnline}
              visible={visible}
              geoError={geoError}
              loading={loading}
              isAuthenticated={isAuthenticated}
              needsGeoConsent={needsGeoConsent}
              onAppear={appearOnMap}
              onHide={hideFromMap}
              onDismissConsent={dismissGeoConsent}
              layout="sidebar"
              loginReturnUrl="/signal-map"
            />
          </aside>
        </div>
      </div>
    </AppChrome>
  );
}
