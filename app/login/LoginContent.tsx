"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AuthCard from "@/components/AuthCard";
import { STOCK } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";
import { resetPasswordForEmail } from "@/lib/supabase/auth";
import { friendlyAuthError } from "@/lib/supabase/auth-errors";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, oauthLogin, error } = useAuth();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [loading, setLoading] = useState(false);

  const callbackError = useMemo(() => {
    const raw = searchParams.get("error_description") ?? searchParams.get("error");
    if (!raw) return null;
    return friendlyAuthError(decodeURIComponent(raw.replace(/\+/g, " ")));
  }, [searchParams]);

  const handleForgotPassword = async (email: string) => {
    await resetPasswordForEmail(email);
  };

  const handleSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      router.push(returnUrl);
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
    <div className="min-h-[100dvh] bg-brand-purple-deep lg:flex lg:flex-row">
      <div className="relative h-44 shrink-0 bg-brand-purple sm:h-52 lg:hidden">
        <Image src={STOCK.auth} alt={STOCK.phoneJamAlt} fill className="object-cover object-top cj-grain-photo" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-purple-deep via-brand-purple-deep/40 to-transparent" />
      </div>
      <div className="relative hidden min-h-[100dvh] flex-1 bg-brand-purple lg:block">
        <Image src={STOCK.auth} alt={STOCK.phoneJamAlt} fill className="object-cover cj-grain-photo" sizes="50vw" priority />
        <div className="absolute inset-0 bg-brand-purple-deep/75" />
      </div>
      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:items-center sm:px-6 sm:py-10 lg:min-h-[100dvh] lg:py-12">
        <div className="w-full max-w-md text-center">
          <BrandLogo size={96} className="mb-5 justify-center sm:mb-6" priority />
          <h1 className="cj-heading-auth">Welcome back</h1>
          <p className="mt-3 text-sm leading-normal text-cj-gold-muted">Sign in to your City Jam account</p>
          <div className="mt-6 sm:mt-8">
            <AuthCard
              mode="login"
              onSubmit={handleSubmit}
              onOAuth={handleOAuth}
              onForgotPassword={handleForgotPassword}
              loading={loading}
              error={callbackError ?? error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
