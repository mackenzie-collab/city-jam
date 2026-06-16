import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function studioUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

// ─── Project Needs ───────────────────────────────────────────

export interface ProjectNeed {
  id: string;
  author_id: string;
  title: string;
  role: string;
  genre: string;
  status: string;
  created_at: string;
}

export async function fetchProjectNeeds(role?: string): Promise<ProjectNeed[]> {
  let q = db().from("project_needs").select("*").order("created_at", { ascending: false });
  if (role && role !== "ALL") q = q.eq("role", role);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function createProjectNeed(
  authorId: string,
  input: { title: string; role: string; genre: string }
): Promise<ProjectNeed> {
  const { data, error } = await db()
    .from("project_needs")
    .insert({ author_id: authorId, ...input, status: "open" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Music Projects ──────────────────────────────────────────

export interface MusicProject {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  genre: string;
  status: string;
  created_at: string;
}

export async function fetchProjects(ownerId?: string): Promise<MusicProject[]> {
  let q = db().from("music_projects").select("*").order("updated_at", { ascending: false });
  if (ownerId) q = q.eq("owner_id", ownerId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function createProject(
  ownerId: string,
  input: { title: string; description?: string; genre?: string }
): Promise<MusicProject> {
  const { data, error } = await db()
    .from("music_projects")
    .insert({ owner_id: ownerId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Vault ───────────────────────────────────────────────────

export interface VaultItem {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  kind: string;
  notes: string;
  created_at: string;
}

export async function fetchVaultItems(userId: string): Promise<VaultItem[]> {
  const { data, error } = await db()
    .from("vault_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createVaultItem(
  userId: string,
  input: { title: string; kind: string; notes?: string; project_id?: string }
): Promise<VaultItem> {
  const { data, error } = await db()
    .from("vault_items")
    .insert({ user_id: userId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVaultItem(id: string, userId: string): Promise<void> {
  const { error } = await db().from("vault_items").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
}

// ─── Collab ──────────────────────────────────────────────────

export interface CollabWorkspace {
  id: string;
  project_id: string | null;
  owner_id: string;
  title: string;
  created_at: string;
}

export interface CollabTask {
  id: string;
  workspace_id: string;
  title: string;
  done: boolean;
  sort_order: number;
}

export async function fetchWorkspaces(ownerId: string): Promise<CollabWorkspace[]> {
  const { data, error } = await db()
    .from("collab_workspaces")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createWorkspace(
  ownerId: string,
  input: { title: string; project_id?: string }
): Promise<CollabWorkspace> {
  const { data, error } = await db()
    .from("collab_workspaces")
    .insert({ owner_id: ownerId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchTasks(workspaceId: string): Promise<CollabTask[]> {
  const { data, error } = await db()
    .from("collab_tasks")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function createTask(workspaceId: string, title: string): Promise<CollabTask> {
  const { data, error } = await db()
    .from("collab_tasks")
    .insert({ workspace_id: workspaceId, title })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function toggleTask(id: string, done: boolean): Promise<void> {
  const { error } = await db().from("collab_tasks").update({ done }).eq("id", id);
  if (error) throw error;
}

// ─── Circles ─────────────────────────────────────────────────

export interface Circle {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  invite_code: string;
  created_at: string;
}

export async function fetchMyCircles(userId: string): Promise<Circle[]> {
  const { data: memberships } = await db()
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", userId);
  const ids = memberships?.map((m) => m.circle_id) ?? [];
  if (ids.length === 0) {
    const { data: owned } = await db().from("circles").select("*").eq("owner_id", userId);
    return owned ?? [];
  }
  const { data, error } = await db().from("circles").select("*").in("id", ids);
  if (error) throw error;
  return data ?? [];
}

export async function createCircle(
  ownerId: string,
  input: { name: string; description?: string }
): Promise<Circle> {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data, error } = await db()
    .from("circles")
    .insert({ owner_id: ownerId, invite_code: code, ...input })
    .select()
    .single();
  if (error) throw error;
  await db().from("circle_members").insert({ circle_id: data.id, user_id: ownerId });
  return data;
}

export async function joinCircle(userId: string, inviteCode: string): Promise<Circle> {
  const { data: circle, error } = await db()
    .from("circles")
    .select("*")
    .eq("invite_code", inviteCode.toUpperCase())
    .single();
  if (error || !circle) throw new Error("Invalid invite code");
  await db()
    .from("circle_members")
    .upsert({ circle_id: circle.id, user_id: userId });
  return circle;
}

export async function fetchCircleMemberCount(circleId: string): Promise<number> {
  const { count, error } = await db()
    .from("circle_members")
    .select("*", { count: "exact", head: true })
    .eq("circle_id", circleId);
  if (error) return 0;
  return count ?? 0;
}

// ─── Listening Rooms ─────────────────────────────────────────

export interface ListeningRoom {
  id: string;
  creator_id: string;
  title: string;
  artist: string;
  album: string;
  created_at: string;
}

export async function fetchListeningRooms(query?: string): Promise<ListeningRoom[]> {
  let q = db().from("listening_rooms").select("*").order("created_at", { ascending: false });
  if (query) q = q.or(`title.ilike.%${query}%,artist.ilike.%${query}%,album.ilike.%${query}%`);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function createListeningRoom(
  creatorId: string,
  input: { title: string; artist?: string; album?: string }
): Promise<ListeningRoom> {
  const { data, error } = await db()
    .from("listening_rooms")
    .insert({ creator_id: creatorId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export const FILTER_OPTIONS = [
  "ALL", "VOCALIST", "GUITARIST", "BASSIST", "DRUMMER", "KEYBOARDIST",
  "PRODUCER", "SONGWRITER", "SAXOPHONIST", "VIOLINIST", "TRUMPET", "OTHER",
] as const;

export type FilterOption = (typeof FILTER_OPTIONS)[number];

export const ROLE_ICONS: Record<string, string> = {
  VOCALIST: "🎤", GUITARIST: "🎸", BASSIST: "🎵", DRUMMER: "🥁",
  KEYBOARDIST: "🎹", PRODUCER: "🎛️", SONGWRITER: "✍️", DEFAULT: "🎶",
};
