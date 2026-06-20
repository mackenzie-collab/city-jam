"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeatureShell from "@/components/FeatureShell";
import { Button } from "@/components/ui/button";
import VinylCard from "@/components/analog/VinylCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccountRole, type AccountRole } from "@/lib/account";
import {
  getLinkedIdentities,
  linkOAuthProvider,
  unlinkIdentity,
  type OAuthProvider,
} from "@/lib/supabase/auth";

const PROVIDERS: { id: OAuthProvider; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "facebook", label: "Facebook" },
  { id: "apple", label: "Apple" },
];

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [identities, setIdentities] = useState<{ provider: string; id: string }[]>([]);
  const [role, setRole] = useState<AccountRole | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const ids = await getLinkedIdentities();
      setIdentities(
        ids.map((i) => ({ provider: i.provider, id: i.id }))
      );
      const membership = await fetchAccountRole(user.id);
      setRole(membership?.account_role ?? "member");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleLink = async (provider: OAuthProvider) => {
    setMsg(null);
    try {
      await linkOAuthProvider(provider);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not link provider");
    }
  };

  const handleUnlink = async (identityId: string) => {
    setMsg(null);
    try {
      await unlinkIdentity(identityId);
      await load();
      setMsg("Provider unlinked.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not unlink");
    }
  };

  return (
    <ProtectedRoute returnUrl="/settings/account">
      <FeatureShell
        title="Account"
        badge="Settings"
        heading="Connected accounts"
        subtitle="Link Google, Facebook, and Apple to one City Jam identity."
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

            <div className="space-y-3">
              {PROVIDERS.map(({ id, label }) => {
                const linked = identities.find((i) => i.provider === id);
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-2xl border border-cj-gold-border bg-cj-purple-card px-4 py-3"
                  >
                    <span className="text-sm uppercase tracking-widest text-cj-gold">{label}</span>
                    {linked ? (
                      <Button variant="secondary" size="sm" onClick={() => handleUnlink(linked.id)}>
                        Unlink
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => handleLink(id)}>
                        Link
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {msg && <p className="text-sm text-cj-gold-bright">{msg}</p>}

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
