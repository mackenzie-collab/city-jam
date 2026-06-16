"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, FolderKanban, Music, Trash2, Plus } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createWorkspace,
  deleteProject,
  fetchProject,
  fetchVaultItemsByProject,
  fetchWorkspacesByProject,
  fetchTasks,
  updateProject,
  type CollabTask,
  type CollabWorkspace,
  type MusicProject,
  type VaultItem,
  studioUnavailable,
} from "@/lib/studio";

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<MusicProject | null>(null);
  const [vault, setVault] = useState<VaultItem[]>([]);
  const [workspaces, setWorkspaces] = useState<(CollabWorkspace & { openTasks: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", genre: "" });

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    const p = await fetchProject(projectId);
    if (!p) {
      setLoading(false);
      return;
    }
    setProject(p);
    setForm({ title: p.title, description: p.description, genre: p.genre });
    const [v, ws] = await Promise.all([
      fetchVaultItemsByProject(projectId),
      fetchWorkspacesByProject(projectId),
    ]);
    setVault(v);
    const withTasks = await Promise.all(
      ws.map(async (w) => {
        const tasks: CollabTask[] = await fetchTasks(w.id);
        return { ...w, openTasks: tasks.filter((t) => !t.done).length };
      })
    );
    setWorkspaces(withTasks);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !project) return;
    await updateProject(project.id, user.id, form);
    setEditing(false);
    load();
  };

  const handleDelete = async () => {
    if (!user?.id || !project || !confirm("Delete this project?")) return;
    await deleteProject(project.id, user.id);
    router.push("/studio");
  };

  const addWorkspace = async () => {
    if (!user?.id || !project) return;
    await createWorkspace(user.id, { title: `${project.title} Board`, project_id: project.id });
    load();
  };

  if (loading) {
    return (
      <FeatureShell title="Project" icon={Music} heading="Loading..." maxWidth="xl">
        <p className="text-cj-gold-muted">Loading project...</p>
      </FeatureShell>
    );
  }

  if (!project) {
    return (
      <FeatureShell title="Project" icon={Music} heading="Not Found" maxWidth="xl">
        <p className="text-cj-gold-muted">Project not found.</p>
        <Link href="/studio" className="mt-4 inline-block text-cj-gold underline">
          Back to Studio
        </Link>
      </FeatureShell>
    );
  }

  const isOwner = user?.id === project.owner_id;

  return (
    <FeatureShell
      title={project.title}
      icon={Music}
      badge={project.genre || "Project"}
      heading={project.title}
      subtitle={project.description || "Manage vault files and collab boards for this track."}
      maxWidth="xl"
      headerRight={
        isOwner ? (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : undefined
      }
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div className="space-y-8">
          {editing && isOwner && (
            <form onSubmit={handleSave} className="cj-card space-y-4">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="cj-input !pl-4"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="cj-input !pl-4 min-h-[80px]"
              />
              <input
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="cj-input !pl-4"
              />
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          )}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg uppercase text-cj-gold">
                <Archive className="h-5 w-5" /> Vault Files
              </h2>
              <Link href={`/vault?project=${projectId}`}>
                <Button variant="secondary" size="sm">
                  <Plus className="mr-1 h-3 w-3" /> Upload
                </Button>
              </Link>
            </div>
            {vault.length === 0 ? (
              <p className="text-sm text-cj-gold-muted">No files linked to this project yet.</p>
            ) : (
              <div className="space-y-2">
                {vault.map((item) => (
                  <div key={item.id} className="cj-card flex items-center gap-3 py-3">
                    <span className="text-lg">🎵</span>
                    <div className="flex-1">
                      <p className="text-sm text-cj-gold">{item.title}</p>
                      <p className="text-[10px] uppercase text-cj-gold-muted">{item.kind}</p>
                    </div>
                    {item.file_url && (
                      <audio controls src={item.file_url} className="h-8 max-w-[200px]" preload="none" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg uppercase text-cj-gold">
                <FolderKanban className="h-5 w-5" /> Collab Boards
              </h2>
              {isOwner && (
                <Button variant="secondary" size="sm" onClick={addWorkspace}>
                  <Plus className="mr-1 h-3 w-3" /> Add Board
                </Button>
              )}
            </div>
            {workspaces.length === 0 ? (
              <p className="text-sm text-cj-gold-muted">No collab boards yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {workspaces.map((ws) => (
                  <Link
                    key={ws.id}
                    href="/collab"
                    className="cj-card block py-4 no-underline hover:border-cj-gold/50"
                  >
                    <p className="font-display uppercase text-cj-gold">{ws.title}</p>
                    <p className="mt-1 text-xs text-cj-gold-muted">{ws.openTasks} open tasks</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href="/project-match">
              <Button variant="primary">Post a Need</Button>
            </Link>
            <Link href="/studio">
              <Button variant="secondary">Back to Studio</Button>
            </Link>
          </div>
        </div>
      </div>
    </FeatureShell>
  );
}
