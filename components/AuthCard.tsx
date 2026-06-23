"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VinylCard from "@/components/analog/VinylCard";
import VinylDisc from "@/components/analog/VinylDisc";

interface AuthCardProps {
  mode: "login" | "register";
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
  }) => void | Promise<void>;
  onForgotPassword?: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  returnUrl?: string;
}

export default function AuthCard({
  mode,
  onSubmit,
  onForgotPassword,
  loading = false,
  error,
}: AuthCardProps) {
  const isLogin = mode === "login";
  const [localError, setLocalError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    const form = new FormData(e.currentTarget);
    try {
      await onSubmit({
        email: form.get("email") as string,
        password: form.get("password") as string,
        confirmPassword: form.get("confirmPassword") as string | undefined,
        displayName: form.get("displayName") as string | undefined,
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const displayError = error ?? localError;

  return (
    <VinylCard showDisc className="cj-auth-card w-full max-w-md !p-5 sm:!p-8">
      <div className="mb-5 flex justify-center sm:mb-6">
        <VinylDisc size={48} />
      </div>

      {displayError && (
        <p className="cj-auth-error mb-4" role="alert">
          {displayError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <input
            name="email"
            type="email"
            required
            disabled={loading}
            autoComplete="email"
            placeholder="Email address"
            className="cj-input cj-input-with-icon"
          />
        </div>

        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            name="password"
            type="password"
            required
            disabled={loading}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="Password"
            className="cj-input cj-input-with-icon"
          />
        </div>

        {!isLogin && (
          <input
            name="confirmPassword"
            type="password"
            required
            disabled={loading}
            autoComplete="new-password"
            placeholder="Confirm password"
            className="cj-input"
          />
        )}

        {!isLogin && (
          <input
            name="displayName"
            type="text"
            required
            disabled={loading}
            autoComplete="nickname"
            placeholder="Display name or artist name"
            className="cj-input"
          />
        )}

        {isLogin && (
          <div className="pt-1">
            {showForgot ? (
              <div className="space-y-3 text-left">
                <input
                  name="forgotEmail"
                  type="email"
                  required
                  disabled={loading}
                  autoComplete="email"
                  placeholder="Email address"
                  className="cj-input"
                />
                {forgotSent ? (
                  <p className="text-sm leading-normal text-cj-gold-bright">
                    Check your inbox for a password reset link.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={loading || !onForgotPassword}
                      onClick={async () => {
                        const input = document.querySelector<HTMLInputElement>('input[name="forgotEmail"]');
                        const email = input?.value?.trim();
                        if (!email || !onForgotPassword) return;
                        setLocalError(null);
                        try {
                          await onForgotPassword(email);
                          setForgotSent(true);
                        } catch (err) {
                          setLocalError(err instanceof Error ? err.message : "Could not send reset email");
                        }
                      }}
                    >
                      Send reset link
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowForgot(false);
                        setForgotSent(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-cj-gold-muted hover:text-cj-gold"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full min-h-11" disabled={loading}>
          {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm leading-normal text-cj-gold-muted">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-cj-gold hover:underline">
              Create account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-cj-gold hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>

      <p className="mt-4 text-center text-xs leading-relaxed text-cj-gold-muted">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="text-cj-gold hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-cj-gold hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </VinylCard>
  );
}
