import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { deleteVaultFile } from "@/lib/storage";

export interface AccountDeletionResult {
  clearedLocal: boolean;
  remoteDeleted: string[];
  remoteErrors: string[];
}

async function deleteWhere(
  table: string,
  column: string,
  userId: string,
  remoteDeleted: string[],
  remoteErrors: string[]
) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from(table).delete().eq(column, userId);
  if (error) remoteErrors.push(`${table}: ${error.message}`);
  else remoteDeleted.push(table);
}

export function clearLocalUserData(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("city-jam-auth");
  localStorage.removeItem("city-jam-user-id");
  localStorage.removeItem(`city-jam-streak:${userId}`);
  sessionStorage.removeItem("cj-map-hidden");
  sessionStorage.removeItem("cj-mic-consent");
  sessionStorage.removeItem("cj-geo-consent");
}

export async function deleteUserAccount(userId: string): Promise<AccountDeletionResult> {
  const remoteDeleted: string[] = [];
  const remoteErrors: string[] = [];

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      const { data: vaultItems } = await supabase
        .from("vault_items")
        .select("file_url")
        .eq("user_id", userId);
      for (const item of vaultItems ?? []) {
        if (item.file_url) {
          await deleteVaultFile(item.file_url).catch(() => undefined);
        }
      }

      await deleteWhere("match_queue", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("map_presence", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("session_decisions", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("community_posts", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("jam_streaks", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("user_profiles", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("vault_items", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("project_needs", "author_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("project_applications", "applicant_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("circle_members", "user_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("circle_posts", "author_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere(
        "listening_room_reactions",
        "user_id",
        userId,
        remoteDeleted,
        remoteErrors
      );
      await deleteWhere("listening_rooms", "creator_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("music_projects", "owner_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("collab_workspaces", "owner_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("circles", "owner_id", userId, remoteDeleted, remoteErrors);
      await deleteWhere("content_reports", "reporter_id", userId, remoteDeleted, remoteErrors);
    }
  }

  clearLocalUserData(userId);

  return {
    clearedLocal: true,
    remoteDeleted,
    remoteErrors,
  };
}
