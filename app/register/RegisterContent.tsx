"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AuthCard from "@/components/AuthCard";
import { STOCK } from "@/lib/brand-assets";
import { EmailConfirmationRequiredError } from "@/lib/auth";
import { resendSignupConfirmation } from "@/lib/supabase/auth";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, error } = useAuth();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [resendSent, setResendSent] = useState(false);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      setLocalError("Passwords do not match");
      throw new Error("Passwords do not match");
    }
    setLocalError(null);
    setPendingEmail(null);
    setLoading(true);
    try {
      await register(data.email, data.password, data.displayName);
      router.push(returnUrl);
    } catch (err) {
      if (err instanceof EmailConfirmationRequiredError) {
        setPendingEmail(err.email);
        return;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-brand-purple-deep lg:flex lg:flex-row">
      <div className="relative h-44 shrink-0 bg-brand-purple sm:h-52 lg:hidden">
        <Image src={STOCK.community} alt={STOCK.communityAlt} fill className="object-cover object-top cj-grain-photo" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/40 to-transparent" />
      </div>
      <div className="relative hidden min-h-[100dvh] flex-1 bg-brand-purple lg:block">
        <Image src={STOCK.community} alt={STOCK.communityAlt} fill className="object-cover cj-grain-photo" sizes="50vw" priority />
        <div className="absolute inset-0 bg-brand-purple-deep/75" />
      </div>
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:items-center sm:px-6 sm:py-10 lg:min-h-[100dvh] lg:py-12">
        <div className="w-full max-w-md text-center">
          <BrandLogo size={96} className="mb-5 justify-center sm:mb-6" priority />
          <h1 className="cj-heading-auth">Join City Jam</h1>
          <p className="mt-3 text-sm leading-normal text-cj-gold-muted">Create an account to jam, connect, and share</p>
          <div className="mt-6 sm:mt-8">
            {pendingEmail ? (
              <div className="cj-auth-card p-6 text-left">
                <h2 className="text-lg font-semibold leading-snug text-cj-gold">Check your email</h2>
                <p className="mt-3 text-sm leading-normal text-cj-gold-muted">
                  We sent a confirmation link to{" "}
                  <span className="break-all text-cj-gold">{pendingEmail}</span>.
                  Open the link to activate your account, then{" "}
                  <Link href="/login" className="text-cj-gold hover:underline">sign in</Link>.
                </p>
                <button
                  type="button"
                  disabled={loading || resendSent}
                  className="mt-4 text-sm leading-normal text-cj-gold hover:underline disabled:opacity-50"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await resendSignupConfirmation(pendingEmail);
                      setResendSent(true);
                    } catch (err) {
                      setLocalError(err instanceof Error ? err.message : "Could not resend email");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {resendSent ? "Confirmation email sent" : "Resend confirmation email"}
                </button>
              </div>
            ) : (
              <AuthCard mode="register" onSubmit={handleSubmit} loading={loading} error={localError ?? error} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
