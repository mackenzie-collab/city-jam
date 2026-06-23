"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeView = "app" | "affiliates";

interface HomeExperienceProps {
  appContent: ReactNode;
  affiliateContent: ReactNode;
}

function readView(): HomeView {
  if (typeof window === "undefined") return "app";
  return window.location.hash === "#affiliates" ? "affiliates" : "app";
}

export default function HomeExperience({ appContent, affiliateContent }: HomeExperienceProps) {
  const [view, setView] = useState<HomeView>("app");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setView(readView());

    const onHashChange = () => setView(readView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const selectView = useCallback((next: HomeView) => {
    setView(next);
    const url = next === "affiliates" ? "/#affiliates" : "/";
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="cj-home-experience">
      <div
        className="cj-home-tabs sticky top-[var(--cj-header-offset,0px)] z-40 border-b border-[var(--cj-zine-border)] bg-cj-bg/95 backdrop-blur-md"
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
