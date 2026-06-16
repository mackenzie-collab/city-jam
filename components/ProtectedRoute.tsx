"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  returnUrl: string;
}

export default function ProtectedRoute({
  children,
  returnUrl,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [loading, isAuthenticated, router, returnUrl]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cj-purple">
        <p className="font-display text-2xl uppercase tracking-widest text-cj-gold-muted">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
