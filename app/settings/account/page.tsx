"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeatureShell from "@/components/FeatureShell";
import VinylCard from "@/components/analog/VinylCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccountRole, type AccountRole } from "@/lib/account";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [role, setRole] = useState<AccountRole | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const membership = await fetchAccountRole(user.id);
      setRole(membership?.account_role ?? "member");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProtectedRoute returnUrl="/settings/account">
      <FeatureShell
        title="Account"
        badge="Settings"
        heading="Your account"
        subtitle="Email sign-in details for your City Jam profile."
        maxWidth="md"
      >
        {loading ? (
          <p className="text-cj-gold-muted">Loading...</p>
        ) : (
          <div className="space-y-6">
            <VinylCard>
              <p className="text-xs uppercase tracking-widest text-cj-gold-muted">Signed in as</p>
              <p className="mt-1 font-display text-xl uppercase text-cj-gold">{user?.email}</p>
              <p className="mt-2 text-sm text-cj-gold-muted">
                Role: <span className="text-cj-gold">{role ?? "member"}</span>
              </p>
            </VinylCard>

            <Link href="/settings/security" className="cj-btn-secondary inline-block text-xs no-underline">
              Security & MFA →
            </Link>
            <Link href="/profile" className="ml-3 text-xs uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
              Back to profile
            </Link>
          </div>
        )}
      </FeatureShell>
    </ProtectedRoute>
  );
}
