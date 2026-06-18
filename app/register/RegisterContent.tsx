"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AuthCard from "@/components/AuthCard";
import { STOCK } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, googleLogin } = useAuth();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleSubmit = (data: {
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    register(data.email, data.password);
    router.push(returnUrl);
  };

  const handleGoogle = () => {
    googleLogin();
    router.push(returnUrl);
  };

  return (
    <div className="min-h-[100dvh] bg-cj-purple lg:flex lg:flex-row">
      <div className="relative h-44 shrink-0 sm:h-52 lg:hidden">
        <Image
          src={STOCK.community}
          alt={STOCK.communityAlt}
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cj-purple via-cj-purple/40 to-transparent" />
      </div>

      <div className="relative hidden min-h-[100dvh] flex-1 lg:block">
        <Image
          src={STOCK.community}
          alt={STOCK.communityAlt}
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-cj-purple/70" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12 lg:py-12">
        <div className="w-full max-w-md text-center">
          <BrandLogo size={120} className="mb-6 justify-center sm:mb-8" />
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
