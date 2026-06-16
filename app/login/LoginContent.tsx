"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthCard from "@/components/AuthCard";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cj-purple px-6 py-12">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-cj-gold">
        <ArrowRight className="h-7 w-7 text-cj-purple-card" />
      </div>
      <h1 className="cj-heading-display text-4xl md:text-5xl">Welcome Back</h1>
      <p className="mt-2 text-sm text-cj-gold-muted">Log in to your account</p>
      <div className="mt-10 w-full max-w-md">
        <AuthCard mode="login" onSubmit={handleSubmit} onGoogle={handleGoogle} />
      </div>
    </div>
  );
}
