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
  input: { title: string; role: string; genre: string; project_id?: string }
): Promise<ProjectNeed> {
  const { data, error } = await db()
    .from("project_needs")
    .insert({ author_id: authorId, ...input, status: "open" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function closeProjectNeed(id: string, authorId: string): Promise<void> {
  const { error } = await db()
    .from("project_needs")
    .update({ status: "closed" })
    .eq("id", id)
    .eq("author_id", authorId);
  if (error) throw error;
}

// ─── Project Applications ────────────────────────────────────

export interface ProjectApplication {
  id: string;
  need_id: string;
  applicant_id: string;
  message: string;
  status: string;
  created_at: string;
}

export async function applyToNeed(
  needId: string,
  applicantId: string,
  message: string
): Promise<ProjectApplication> {
  const { data, error } = await db()
    .from("project_applications")
    .upsert({ need_id: needId, applicant_id: applicantId, message, status: "pending" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchApplications(needId: string): Promise<ProjectApplication[]> {
  const { data, error } = await db()
    .from("project_applications")
    .select("*")
    .eq("need_id", needId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateApplicationStatus(
  id: string,
  status: "accepted" | "declined"
): Promise<void> {
  const { error } = await db().from("project_applications").update({ status }).eq("id", id);
  if (error) throw error;
}

// ─── Music Projects ──────────────────────────────────────────

export interface MusicProject {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  genre: string;
  status: string;
  stage?: string;
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

export async function fetchProject(id: string): Promise<MusicProject | null> {
  const { data, error } = await db().from("music_projects").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProject(
  id: string,
  ownerId: string,
  input: Partial<Pick<MusicProject, "title" | "description" | "genre" | "status" | "stage">>
): Promise<MusicProject> {
  const { data, error } = await db()
    .from("music_projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", ownerId)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Project not found or you are not the owner");
  return data;
}

export async function deleteProject(id: string, ownerId: string): Promise<void> {
  const { error } = await db().from("music_projects").delete().eq("id", id).eq("owner_id", ownerId);
  if (error) throw error;
}

// ─── Vault ───────────────────────────────────────────────────

export interface VaultItem {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  kind: string;
  notes: string;
  file_url?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
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
  input: {
    title: string;
    kind: string;
    notes?: string;
    project_id?: string;
    file_url?: string;
    file_size?: number;
    mime_type?: string;
  }
): Promise<VaultItem> {
  const { data, error } = await db()
    .from("vault_items")
    .insert({ user_id: userId, ...input })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVaultItem(id: string, userId: string): Promise<VaultItem | null> {
  const { data } = await db().from("vault_items").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  const { error } = await db().from("vault_items").delete().eq("id", id).eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function fetchVaultItemsByProject(projectId: string): Promise<VaultItem[]> {
  const { data, error } = await db()
    .from("vault_items")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
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

export async function deleteTask(id: string): Promise<void> {
  const { error } = await db().from("collab_tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteWorkspace(id: string, ownerId: string): Promise<void> {
  const { error } = await db().from("collab_workspaces").delete().eq("id", id).eq("owner_id", ownerId);
  if (error) throw error;
}

export async function fetchWorkspace(id: string): Promise<CollabWorkspace | null> {
  const { data, error } = await db().from("collab_workspaces").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchWorkspacesByProject(projectId: string): Promise<CollabWorkspace[]> {
  const { data, error } = await db()
    .from("collab_workspaces")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
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

export async function fetchCircle(id: string): Promise<Circle | null> {
  const { data, error } = await db().from("circles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export interface CirclePost {
  id: string;
  circle_id: string;
  author_id: string;
  display_name: string;
  body: string;
  created_at: string;
}

export async function fetchCirclePosts(circleId: string): Promise<CirclePost[]> {
  const { data, error } = await db()
    .from("circle_posts")
    .select("*")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCirclePost(
  circleId: string,
  authorId: string,
  displayName: string,
  body: string
): Promise<CirclePost> {
  const { data, error } = await db()
    .from("circle_posts")
    .insert({ circle_id: circleId, author_id: authorId, display_name: displayName, body })
    .select()
    .single();
  if (error) throw error;
  return data;
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

export async function fetchListeningRoom(id: string): Promise<ListeningRoom | null> {
  const { data, error } = await db().from("listening_rooms").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export interface RoomReaction {
  id: string;
  room_id: string;
  user_id: string;
  display_name: string;
  timestamp_sec: number;
  body: string;
  created_at: string;
}

export async function fetchRoomReactions(roomId: string): Promise<RoomReaction[]> {
  const { data, error } = await db()
    .from("listening_room_reactions")
    .select("*")
    .eq("room_id", roomId)
    .order("timestamp_sec");
  if (error) throw error;
  return data ?? [];
}

export async function addRoomReaction(
  roomId: string,
  userId: string,
  displayName: string,
  timestampSec: number,
  body: string
): Promise<RoomReaction> {
  const { data, error } = await db()
    .from("listening_room_reactions")
    .insert({
      room_id: roomId,
      user_id: userId,
      display_name: displayName,
      timestamp_sec: timestampSec,
      body,
    })
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
