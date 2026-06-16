"use client";

import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LiveConfigBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
      Demo mode — live matching &amp; map presence need Supabase. See{" "}
      <code className="rounded bg-black/30 px-1">DEPLOY.md</code> in the project
      folder.
    </div>
  );
}
