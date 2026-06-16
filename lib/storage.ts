import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const BUCKET = "vault";
const MAX_BYTES = 50 * 1024 * 1024;

const ALLOWED = new Set([
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/mp4",
  "audio/x-wav",
  "audio/flac",
]);

export function storageUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

export async function uploadVaultFile(
  userId: string,
  file: File
): Promise<{ url: string; size: number; mime: string }> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Storage not configured");

  if (file.size > MAX_BYTES) throw new Error("File too large (max 50MB)");
  const mime = file.type || "audio/mpeg";
  if (!ALLOWED.has(mime) && !file.name.match(/\.(mp3|wav|ogg|webm|m4a|flac)$/i)) {
    throw new Error("Audio files only (mp3, wav, ogg, webm, m4a, flac)");
  }

  const ext = file.name.split(".").pop() ?? "mp3";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: mime,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, size: file.size, mime };
}

export async function deleteVaultFile(fileUrl: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase || !fileUrl) return;
  const marker = `/object/public/${BUCKET}/`;
  const idx = fileUrl.indexOf(marker);
  if (idx === -1) return;
  const path = fileUrl.slice(idx + marker.length);
  await supabase.storage.from(BUCKET).remove([path]);
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
