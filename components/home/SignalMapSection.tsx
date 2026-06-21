"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import GrainOverlay from "@/components/GrainOverlay";
import SignalMapPanel from "@/components/SignalMapPanel";
import { useAuth } from "@/hooks/useAuth";
import { useMapPresence } from "@/hooks/useMapPresence";

const SignalMapWorld = dynamic(() => import("@/components/SignalMapWorld"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[400px] items-center justify-center bg-brand-black">
      <p className="font-mono text-sm text-brand-gold animate-pulse">Scanning signals…</p>
    </div>
  ),
});

export default function SignalMapSection() {
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
    <section id="signal-map" className="cj-section relative overflow-hidden bg-brand-purple py-12 sm:py-16">
      <GrainOverlay warm intensity={0.03} />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="cj-badge mb-3">Global frequency</span>
            <h2 className="cj-headline text-3xl sm:text-4xl">
              Find your people.{" "}
              <span className="text-brand-gold">Anywhere.</span>
            </h2>
            <p className="mt-3 max-w-xl font-body text-sm text-cj-text-muted sm:text-base">
              Musicians live on the map by city — not exact address. Click a hub. Show your signal.
            </p>
          </div>
          <Link href="/signal-map" className="cj-link-groove shrink-0 text-sm uppercase">
            Full map view →
          </Link>
        </div>

        <div className="cj-zine-border grid min-h-[480px] overflow-hidden bg-brand-black lg:grid-cols-[1fr_280px]">
          <div className="relative min-h-[400px] h-[min(52vh,480px)] lg:h-[480px] lg:min-h-[480px]">
            <SignalMapWorld
              cities={cities}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
              yourCitySlug={yourCity?.slug ?? null}
              decorative={false}
            />
          </div>
          <div className="hidden min-h-[480px] lg:block">
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
              loginReturnUrl="/#signal-map"
            />
          </div>
        </div>

        <div className="cj-zine-border mt-0 border-t-0 lg:hidden">
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
            layout="footer"
            loginReturnUrl="/#signal-map"
          />
        </div>
      </div>
    </section>
  );
}
