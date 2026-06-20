"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AuthCard from "@/components/AuthCard";
import { STOCK } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";
import { resetPasswordForEmail } from "@/lib/supabase/auth";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, oauthLogin, error } = useAuth();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-[100dvh] bg-cj-purple-dark lg:flex lg:flex-row">
      <div className="relative h-44 shrink-0 sm:h-52 lg:hidden">
        <Image src={STOCK.auth} alt={STOCK.phoneJamAlt} fill className="object-cover object-top cj-grain-photo" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-cj-purple-dark via-cj-purple-dark/40 to-transparent" />
      </div>
      <div className="relative hidden min-h-[100dvh] flex-1 lg:block">
        <Image src={STOCK.auth} alt={STOCK.phoneJamAlt} fill className="object-cover cj-grain-photo" sizes="50vw" />
        <div className="absolute inset-0 bg-cj-purple-dark/75" />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-12">
        <div className="w-full max-w-md text-center">
          <BrandLogo size={128} className="mb-6 justify-center sm:mb-8" priority />
          <h1 className="cj-heading-display text-3xl sm:text-4xl md:text-5xl">Welcome Back</h1>
          <p className="mt-2 text-sm text-cj-gold-muted">One account for web and app</p>
          <div className="mt-8 sm:mt-10">
            <AuthCard
              mode="login"
              onSubmit={handleSubmit}
              onOAuth={handleOAuth}
              onForgotPassword={handleForgotPassword}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
