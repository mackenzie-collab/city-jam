"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AuthCard from "@/components/AuthCard";
import { STOCK } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, googleLogin, error } = useAuth();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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
    setLoading(true);
    try {
      await register(data.email, data.password, data.displayName);
      router.push(returnUrl);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const u = await googleLogin();
      if (u) router.push(returnUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-cj-purple-dark lg:flex lg:flex-row">
      <div className="relative h-44 shrink-0 sm:h-52 lg:hidden">
        <Image
          src={STOCK.community}
          alt={STOCK.communityAlt}
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cj-purple-dark via-cj-purple-dark/40 to-transparent" />
      </div>

      <div className="relative hidden min-h-[100dvh] flex-1 lg:block">
        <Image
          src={STOCK.community}
          alt={STOCK.communityAlt}
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-cj-purple-dark/75" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-12">
        <div className="w-full max-w-md text-center">
          <BrandLogo size={128} className="mb-6 justify-center sm:mb-8" priority />
          <h1 className="cj-heading-display text-3xl sm:text-4xl md:text-5xl">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-cj-gold-muted">
            Join the rebellion. No photos required.
          </p>
          <div className="mt-8 sm:mt-10">
            <AuthCard
              mode="register"
              onSubmit={handleSubmit}
              onGoogle={handleGoogle}
              loading={loading}
              error={localError ?? error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
