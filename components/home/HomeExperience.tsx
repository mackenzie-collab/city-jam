"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeView = "app" | "affiliates";

/** Hashes that keep the Affiliates tab active (subsection anchors included). */
const AFFILIATE_HASHES = new Set([
  "#affiliates",
  "#signup",
  "#signup-individual",
  "#signup-band",
  "#how-it-works",
  "#earnings",
  "#faq",
]);

function isAffiliateHash(hash: string): boolean {
  return AFFILIATE_HASHES.has(hash);
}

function readView(): HomeView {
  if (typeof window === "undefined") return "app";
  return isAffiliateHash(window.location.hash) ? "affiliates" : "app";
}

function scrollToAffiliateHash(hash: string) {
  if (!hash || hash === "#affiliates") return;
  const id = hash.slice(1);
  const target = document.getElementById(id);
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

interface HomeExperienceProps {
  appContent: ReactNode;
  affiliateContent: ReactNode;
}

export default function HomeExperience({ appContent, affiliateContent }: HomeExperienceProps) {
  const [view, setView] = useState<HomeView>("app");
  const [hash, setHash] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const syncFromHash = () => {
      const nextHash = window.location.hash;
      setHash(nextHash);
      setView(readView());
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    if (!mounted || view !== "affiliates") return;
    scrollToAffiliateHash(hash);
  }, [mounted, view, hash]);

  const selectView = useCallback((next: HomeView) => {
    setView(next);
    if (next === "affiliates") {
      window.history.replaceState(null, "", "/#affiliates");
      setHash("#affiliates");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.history.replaceState(null, "", "/");
    setHash("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="cj-home-experience">
      <div
        className="cj-home-tabs sticky top-[var(--cj-header-offset,0px)] z-40 border-b border-[rgba(179,162,0,0.2)] bg-[rgba(10,10,10,0.92)] backdrop-blur-md"
        role="tablist"
        aria-label="Homepage sections"
      >
        <div className="mx-auto flex max-w-6xl gap-0 px-4 sm:px-6 md:px-8">
          <button
            type="button"
            role="tab"
            id="cj-home-tab-app"
            aria-selected={view === "app"}
            aria-controls="cj-home-panel-app"
            className={cn("cj-home-tab", view === "app" && "cj-home-tab--active")}
            onClick={() => selectView("app")}
          >
            The app
          </button>
          <button
            type="button"
            role="tab"
            id="cj-home-tab-affiliates"
            aria-selected={view === "affiliates"}
            aria-controls="cj-home-panel-affiliates"
            className={cn("cj-home-tab", view === "affiliates" && "cj-home-tab--active")}
            onClick={() => selectView("affiliates")}
          >
            Affiliates
            <span className="cj-home-tab__pill">Waitlist</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          id="cj-home-panel-app"
          role="tabpanel"
          aria-labelledby="cj-home-tab-app"
          hidden={mounted && view !== "app"}
          className={cn(
            "cj-home-panel",
            view === "app" ? "cj-home-panel--active" : "cj-home-panel--inactive"
          )}
        >
          {appContent}
        </div>

        <div
          id="cj-home-panel-affiliates"
          role="tabpanel"
          aria-labelledby="cj-home-tab-affiliates"
          hidden={mounted && view !== "affiliates"}
          className={cn(
            "cj-home-panel",
            view === "affiliates" ? "cj-home-panel--active" : "cj-home-panel--inactive"
          )}
        >
          {affiliateContent}
        </div>
      </div>
    </div>
  );
}
