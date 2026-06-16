"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Archive, Plus, Trash2, Play, Upload } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createVaultItem,
  deleteVaultItem,
  fetchProjects,
  fetchVaultItems,
  type MusicProject,
  type VaultItem,
  studioUnavailable,
} from "@/lib/studio";
import { deleteVaultFile, formatFileSize, uploadVaultFile } from "@/lib/storage";

const KINDS = ["demo", "stem", "recording", "mix"] as const;

export default function VaultPanel() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");

  const [items, setItems] = useState<VaultItem[]>([]);
  const [projects, setProjects] = useState<MusicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!projectParam);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    kind: "demo" as string,
    notes: "",
    project_id: projectParam ?? "",
  });
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    const [vault, projs] = await Promise.all([fetchVaultItems(user.id), fetchProjects(user.id)]);
    setItems(vault);
    setProjects(projs);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setError(null);
    setUploading(true);
    try {
      let fileMeta = {};
      if (file) {
        const uploaded = await uploadVaultFile(user.id, file);
        fileMeta = {
          file_url: uploaded.url,
          file_size: uploaded.size,
          mime_type: uploaded.mime,
        };
      }
      await createVaultItem(user.id, {
        ...form,
        project_id: form.project_id || undefined,
        ...fileMeta,
      });
      setShowForm(false);
      setForm({ title: "", kind: "demo", notes: "", project_id: projectParam ?? "" });
      setFile(null);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: VaultItem) => {
    if (!user?.id || !confirm(`Delete "${item.title}"?`)) return;
    if (item.file_url) await deleteVaultFile(item.file_url);
    await deleteVaultItem(item.id, user.id);
    load();
  };

  return (
    <FeatureShell
      title="Audio Vault"
      icon={Archive}
      badge="Studio"
      heading={
        <>
          Your Private / <span className="text-cj-gold-bright">Audio Vault.</span>
        </>
      }
      subtitle="Upload recordings, demos, and stems. Link files to projects. Only you decide what gets shared."
      headerRight={
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-1 h-4 w-4" /> Upload
        </Button>
      }
      maxWidth="xl"
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div>
          {showForm && (
            <form onSubmit={handleAdd} className="cj-card mb-8 space-y-4">
              <input
                required
                placeholder="Track title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="cj-input !pl-4"
              />
              <div className="flex flex-wrap gap-3">
                <select
                  value={form.kind}
                  onChange={(e) => setForm({ ...form, kind: e.target.value })}
                  className="cj-input !pl-4 !w-auto"
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                {projects.length > 0 && (
                  <select
                    value={form.project_id}
                    onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                    className="cj-input !pl-4 flex-1"
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-cj-gold-border px-4 py-6 hover:border-cj-gold/50">
                <Upload className="h-5 w-5 text-cj-gold-muted" />
                <span className="text-sm text-cj-gold-muted">
                  {file ? `${file.name} (${formatFileSize(file.size)})` : "Choose audio file (mp3, wav, ogg, max 50MB)"}
                </span>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.webm,.m4a,.flac"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <input
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="cj-input !pl-4"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={uploading}>
                  {uploading ? "Uploading..." : "Save to Vault"}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {loading ? (
            <p className="text-center text-cj-gold-muted">Loading...</p>
          ) : items.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="Vault Empty"
              description="Upload your first demo, stem, or recording."
              actionLabel="Upload File"
              onAction={() => setShowForm(true)}
            />
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="cj-card py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark">
                      {item.file_url ? (
                        <Play className="h-4 w-4 text-cj-gold" />
                      ) : (
                        <span className="text-lg">🎵</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display uppercase text-cj-gold">{item.title}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                        {item.kind}
                        {item.file_size ? ` · ${formatFileSize(item.file_size)}` : ""}
                        {" · "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      {item.notes && <p className="mt-1 text-xs text-cj-gold-muted">{item.notes}</p>}
                      {item.file_url && (
                        <audio controls src={item.file_url} className="mt-3 w-full max-w-md" preload="metadata" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-cj-gold-muted hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FeatureShell>
  );
}
