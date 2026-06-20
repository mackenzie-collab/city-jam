"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeatureShell from "@/components/FeatureShell";
import { Button } from "@/components/ui/button";
import VinylCard from "@/components/analog/VinylCard";
import { useAuth } from "@/hooks/useAuth";
import { fetchAccountRole, roleRequiresMfa } from "@/lib/account";
import { enrollMfa, listMfaFactors, verifyMfaEnrollment } from "@/lib/supabase/auth";

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const [factors, setFactors] = useState<{ id: string; friendly_name?: string }[]>([]);
  const [enroll, setEnroll] = useState<{ id: string; totp: { qr_code: string } } | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [mfaRequired, setMfaRequired] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setFactors(await listMfaFactors());
    const membership = await fetchAccountRole(user.id);
    setMfaRequired(roleRequiresMfa(membership?.account_role ?? "member"));
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const startEnroll = async () => {
    setMsg(null);
    try {
      const data = await enrollMfa();
      if (data?.id && data.totp) setEnroll({ id: data.id, totp: data.totp });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "MFA enrollment failed");
    }
  };

  const confirmEnroll = async () => {
    if (!enroll) return;
    setMsg(null);
    try {
      await verifyMfaEnrollment(enroll.id, code);
      setEnroll(null);
      setCode("");
      await load();
      setMsg("Authenticator enabled.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Invalid code");
    }
  };

  return (
    <ProtectedRoute returnUrl="/settings/security">
      <FeatureShell
        title="Security"
        badge="Settings"
        heading="Security & MFA"
        subtitle="Required for producer, moderator, and admin roles."
        maxWidth="md"
      >
        <VinylCard className="mb-6">
          {mfaRequired ? (
            <p className="text-sm text-cj-gold-bright">
              Your role requires two-factor authentication.
            </p>
          ) : (
            <p className="text-sm text-cj-gold-muted">
              Optional for members — recommended if you publish or moderate.
            </p>
          )}
        </VinylCard>

        {factors.length === 0 ? (
          <Button variant="primary" onClick={startEnroll}>
            Set up authenticator app
          </Button>
        ) : (
          <p className="text-sm text-cj-gold">TOTP factor active: {factors[0]?.friendly_name ?? "Authenticator"}</p>
        )}

        {enroll && (
          <VinylCard className="mt-6 space-y-4">
            <p className="text-xs uppercase tracking-widest text-cj-gold-muted">Scan QR in your app</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={enroll.totp.qr_code} alt="MFA QR code" className="mx-auto h-40 w-40 rounded-lg bg-white p-2" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              className="cj-input !pl-4"
            />
            <Button variant="primary" onClick={confirmEnroll}>
              Verify & enable
            </Button>
          </VinylCard>
        )}

        {msg && <p className="mt-4 text-sm text-cj-gold-bright">{msg}</p>}

        <Link href="/settings/account" className="mt-8 inline-block text-xs uppercase tracking-widest text-cj-gold-muted hover:text-cj-gold">
          ← Connected accounts
        </Link>
      </FeatureShell>
    </ProtectedRoute>
  );
}
