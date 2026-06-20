import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AccountRole = "member" | "producer" | "artist" | "moderator" | "admin";

export interface AccountMembership {
  user_id: string;
  account_role: AccountRole;
  mfa_required: boolean;
  created_at: string;
}

const ROLE_MFA: AccountRole[] = ["producer", "admin", "moderator"];

export function roleRequiresMfa(role: AccountRole): boolean {
  return ROLE_MFA.includes(role);
}

export async function fetchAccountRole(userId: string): Promise<AccountMembership | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("account_memberships")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return null;
  return data as AccountMembership | null;
}

export async function upsertAccountRole(userId: string, role: AccountRole): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.from("account_memberships").upsert({
    user_id: userId,
    account_role: role,
    mfa_required: roleRequiresMfa(role),
  });
}

export function canModerate(role: AccountRole | null | undefined): boolean {
  return role === "moderator" || role === "admin";
}

export function canAdmin(role: AccountRole | null | undefined): boolean {
  return role === "admin";
}
