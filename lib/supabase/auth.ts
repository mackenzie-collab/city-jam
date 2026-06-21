import { AuthChangeEvent, Provider, Session, User } from "@supabase/supabase-js";
import { authCallbackUrl } from "@/lib/site-url";
import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type OAuthProvider = "google" | "facebook" | "apple";

export function supabaseAuthAvailable(): boolean {
  return isSupabaseConfigured() && !!getSupabase();
}

function authRedirectUrl(returnPath = "/profile"): string {
  return authCallbackUrl(returnPath);
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authCallbackUrl("/profile"),
    },
  });
  if (error) throw error;
  return data;
}

export async function resendSignupConfirmation(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: authCallbackUrl("/profile"),
    },
  });
  if (error) throw error;
}

export async function signInWithOAuth(
  provider: OAuthProvider,
  returnPath = "/profile"
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const options: {
    redirectTo: string;
    queryParams?: Record<string, string>;
    scopes?: string;
  } = {
    redirectTo: authRedirectUrl(returnPath),
  };

  if (provider === "google") {
    options.queryParams = { access_type: "offline", prompt: "consent" };
  }
  if (provider === "apple") {
    options.scopes = "name email";
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as Provider,
    options,
  });
  if (error) throw error;
  if (data.url && typeof window !== "undefined") {
    window.location.assign(data.url);
  }
  return data;
}

export async function signInWithGoogle(returnPath?: string) {
  return signInWithOAuth("google", returnPath);
}

export async function signInWithFacebook(returnPath?: string) {
  return signInWithOAuth("facebook", returnPath);
}

export async function signInWithApple(returnPath?: string) {
  return signInWithOAuth("apple", returnPath);
}

export async function resetPasswordForEmail(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authCallbackUrl("/settings/security"),
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const supabase = getSupabase();
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

export async function getLinkedIdentities() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.auth.getUserIdentities();
  if (error) throw error;
  return data?.identities ?? [];
}

export async function linkOAuthProvider(provider: OAuthProvider) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.auth.linkIdentity({ provider: provider as Provider });
  if (error) throw error;
}

export async function unlinkIdentity(identityId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { data } = await supabase.auth.getUserIdentities();
  const identity = data?.identities?.find((i) => i.id === identityId);
  if (!identity) throw new Error("Identity not found");
  const { error } = await supabase.auth.unlinkIdentity(identity);
  if (error) throw error;
}

export async function enrollMfa() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
  if (error) throw error;
  return data;
}

export async function verifyMfaEnrollment(factorId: string, code: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const challenge = await supabase.auth.mfa.challenge({ factorId });
  if (challenge.error) throw challenge.error;
  const { data, error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.data.id,
    code,
  });
  if (error) throw error;
  return data;
}

export async function listMfaFactors() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data?.totp ?? [];
}

export function mapSupabaseUser(user: User) {
  const meta = user.user_metadata ?? {};
  const name =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    (meta.display_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Musician";
  return {
    id: user.id,
    email: user.email ?? "",
    name,
  };
}
