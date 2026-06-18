"use client";

import { useCallback, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createAudioPost, sceneUnavailable } from "@/lib/scene";
import { fetchVaultItems, type VaultItem } from "@/lib/studio";
import { uploadVaultFile } from "@/lib/storage";

const GENRES = ["ELECTRONIC", "JAZZ", "HIP-HOP", "ROCK", "FOLK", "CLASSICAL", "OTHER"];

export default function SceneComposer() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [genre, setGenre] = useState("");
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [selectedVaultId, setSelectedVaultId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadVault = useCallback(async () => {
    if (!user?.id || sceneUnavailable()) return;
    try {
      const items = await fetchVaultItems(user.id);
      setVaultItems(items.filter((i) => i.file_url));
    } catch {
      setVaultItems([]);
    }
  }, [user?.id]);

  useEffect(() => {
    loadVault();
  }, [loadVault]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadVaultFile(user.id, file);
      setSelectedVaultId("");
      setVaultItems((prev) => [
        { id: "upload", title: file.name, file_url: url, user_id: user.id } as VaultItem,
        ...prev,
      ]);
      setSelectedVaultId("upload");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !title.trim()) return;

    const vaultItem = vaultItems.find((v) => v.id === selectedVaultId);
    const audioUrl = vaultItem?.file_url;
    if (!audioUrl) {
      setError("Select or upload an audio file");
      return;
    }

    setPosting(true);
    setError(null);
    try {
      await createAudioPost(user.id, {
        title: title.trim(),
        caption: caption.trim(),
        genre,
        audio_url: audioUrl,
      });
      setTitle("");
      setCaption("");
      setGenre("");
      setSelectedVaultId("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="cj-card text-sm text-cj-gold-muted">
        Sign in to drop a track on the scene.
      </div>
    );
  }

  if (sceneUnavailable()) {
    return (
      <div className="cj-card text-sm text-cj-gold-muted">
        Scene posting requires Supabase. Browse demo posts below.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="cj-card space-y-4">
      <p className="text-xs uppercase tracking-widest text-cj-gold-muted">Drop a track</p>

      <div>
        <label className="text-[10px] uppercase text-cj-gold-muted">From vault or upload</label>
        <select
          value={selectedVaultId}
          onChange={(e) => setSelectedVaultId(e.target.value)}
          className="cj-input !pl-4 !w-full mt-1"
        >
          <option value="">Select audio...</option>
          {vaultItems.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-cj-gold-muted hover:text-cj-gold">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload new file"}
          <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      <div>
        <label className="text-[10px] uppercase text-cj-gold-muted">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="cj-input !pl-4 mt-1"
          placeholder="Track title"
        />
      </div>

      <div>
        <label className="text-[10px] uppercase text-cj-gold-muted">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="cj-input !pl-4 mt-1 min-h-[80px]"
          placeholder="What's the story?"
        />
      </div>

      <div>
        <label className="text-[10px] uppercase text-cj-gold-muted">Genre</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="cj-input !pl-4 !w-full mt-1">
          <option value="">Select genre...</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-cj-gold-bright">Posted to the scene!</p>}

      <Button type="submit" variant="primary" disabled={posting || uploading}>
        {posting ? "Posting..." : "Post to Scene"}
      </Button>
    </form>
  );
}
