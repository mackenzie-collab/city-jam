"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthCardProps {
  mode: "login" | "register";
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword?: string;
    displayName?: string;
  }) => void | Promise<void>;
  onGoogle: () => void | Promise<void>;
  onForgotPassword?: (email: string) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function AuthCard({
  mode,
  onSubmit,
  onGoogle,
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

  const handleGoogle = async () => {
    setLocalError(null);
    try {
      await onGoogle();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  };

  const displayError = error ?? localError;

  return (
    <div className="cj-auth-card w-full max-w-md">
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-cj-gold-border bg-cj-dark py-3 text-sm text-cj-gold transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-cj-gold-border" />
        <span className="text-xs uppercase tracking-widest text-cj-gold-muted">Or</span>
        <div className="h-px flex-1 bg-cj-gold-border" />
      </div>

      {displayError && (
        <p className="mb-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {displayError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <input
            name="email"
            type="email"
            required
            disabled={loading}
            placeholder="Email"
            className="cj-input"
          />
        </div>

        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <input
            name="password"
            type="password"
            required
            disabled={loading}
            placeholder="Password"
            className="cj-input"
          />
        </div>

        {!isLogin && (
          <div className="relative">
            <input
              name="displayName"
              type="text"
              required
              disabled={loading}
              placeholder="Display name / artist name"
              className="cj-input !pl-4"
            />
          </div>
        )}

        {!isLogin && (
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cj-gold-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              name="confirmPassword"
              type="password"
              required
              disabled={loading}
              placeholder="Confirm Password"
              className="cj-input"
            />
          </div>
        )}

        {isLogin && (
          <div className="text-right">
            {showForgot ? (
              <div className="space-y-2 text-left">
                <input
                  name="forgotEmail"
                  type="email"
                  form="forgot-form"
                  required
                  disabled={loading}
                  placeholder="Your email"
                  className="cj-input !pl-4"
                />
                {forgotSent ? (
                  <p className="text-xs text-cj-gold-bright">Check your inbox for a reset link.</p>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={loading || !onForgotPassword}
                      onClick={async () => {
                        const input = document.querySelector<HTMLInputElement>(
                          'input[name="forgotEmail"]'
                        );
                        const email = input?.value?.trim();
                        if (!email || !onForgotPassword) return;
                        setLocalError(null);
                        try {
                          await onForgotPassword(email);
                          setForgotSent(true);
                        } catch (err) {
                          setLocalError(
                            err instanceof Error ? err.message : "Could not send reset email"
                          );
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
              <button
                type="button"
                className="text-xs text-cj-gold-muted hover:text-cj-gold"
                onClick={() => setShowForgot(true)}
              >
                Forgot password?
              </button>
            )}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-cj-gold-muted">
        {isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-cj-gold hover:underline">
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-cj-gold hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>

      <p className="mt-4 text-center text-[10px] leading-relaxed text-cj-gold-muted">
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
    </div>
  );
}
