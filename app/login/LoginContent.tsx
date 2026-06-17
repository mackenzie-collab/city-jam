"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BrandLogo from "@/components/BrandLogo";
import AuthCard from "@/components/AuthCard";
import { STOCK } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLogin } = useAuth();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleSubmit = (data: {
    email: string;
    password: string;
  }) => {
    login(data.email, data.password);
    router.push(returnUrl);
  };

  const handleGoogle = () => {
    googleLogin();
    router.push(returnUrl);
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="relative hidden min-h-screen flex-1 lg:block">
        <Image
          src={STOCK.auth}
          alt={STOCK.phoneJamAlt}
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-cj-purple/70" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center bg-cj-purple px-6 py-12">
        <BrandLogo showWordmark iconSize={48} className="mb-8" />
        <h1 className="cj-heading-display text-4xl md:text-5xl">Welcome Back</h1>
        <p className="mt-2 text-sm text-cj-gold-muted">Log in to your account</p>
        <div className="mt-10 w-full max-w-md">
          <AuthCard mode="login" onSubmit={handleSubmit} onGoogle={handleGoogle} />
        </div>
      </div>
    </div>
  );
}
