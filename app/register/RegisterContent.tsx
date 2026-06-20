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
  const { register, oauthLogin, error } = useAuth();
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

  const handleOAuth = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    try {
      await oauthLogin(provider, returnUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-cj-purple-dark lg:flex lg:flex-row">
      <div className="relative h-44 shrink-0 sm:h-52 lg:hidden">
        <Image src={STOCK.community} alt={STOCK.communityAlt} fill className="object-cover object-top cj-grain-photo" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-cj-purple-dark via-cj-purple-dark/40 to-transparent" />
      </div>
      <div className="relative hidden min-h-[100dvh] flex-1 lg:block">
        <Image src={STOCK.community} alt={STOCK.communityAlt} fill className="object-cover cj-grain-photo" sizes="50vw" />
        <div className="absolute inset-0 bg-cj-purple-dark/75" />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-12">
        <div className="w-full max-w-md text-center">
          <BrandLogo size={128} className="mb-6 justify-center sm:mb-8" priority />
          <h1 className="cj-heading-display text-3xl sm:text-4xl md:text-5xl">Create Your Account</h1>
          <p className="mt-2 text-sm text-cj-gold-muted">Cover art over selfies. Music speaks first.</p>
          <div className="mt-8 sm:mt-10">
            {pendingEmail ? (
              <div className="rounded-2xl border border-cj-gold-border bg-cj-dark/80 p-6 text-left">
                <h2 className="text-lg font-semibold text-cj-gold">Check your email</h2>
                <p className="mt-2 text-sm text-cj-gold-muted">
                  We sent a confirmation link to <span className="text-cj-gold">{pendingEmail}</span>.
                  Open it to activate your account, then{" "}
                  <Link href="/login" className="text-cj-gold hover:underline">log in</Link>.
                </p>
                <button
                  type="button"
                  disabled={loading || resendSent}
                  className="mt-4 text-sm text-cj-gold hover:underline disabled:opacity-50"
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
                  {resendSent ? "Confirmation email sent again" : "Resend confirmation email"}
                </button>
              </div>
            ) : (
              <AuthCard mode="register" onSubmit={handleSubmit} onOAuth={handleOAuth} loading={loading} error={localError ?? error} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
