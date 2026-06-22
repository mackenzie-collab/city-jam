"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[City Jam]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-gold">Something went wrong</p>
      <h1 className="mt-3 font-display text-2xl uppercase text-brand-parchment">Application error</h1>
      <p className="mt-3 max-w-md font-body text-sm text-cj-text-muted">
        A client-side error occurred. You can try again — if it keeps happening, hard-refresh the page.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="cj-carousel-nav-btn mt-8 px-6 py-2 font-mono text-xs uppercase tracking-widest"
      >
        Try again
      </button>
    </div>
  );
}
