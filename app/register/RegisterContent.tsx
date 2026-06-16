"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus } from "lucide-react";
import AuthCard from "@/components/AuthCard";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-cj-purple px-6 py-12">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-cj-gold">
        <UserPlus className="h-7 w-7 text-cj-purple-card" />
      </div>
      <h1 className="cj-heading-display text-4xl md:text-5xl">
        Create Your Account
      </h1>
      <p className="mt-2 text-sm text-cj-gold-muted">
        Join the rebellion. No photos required.
      </p>
      <div className="mt-10 w-full max-w-md">
        <AuthCard
          mode="register"
          onSubmit={handleSubmit}
          onGoogle={handleGoogle}
        />
      </div>
    </div>
  );
}
