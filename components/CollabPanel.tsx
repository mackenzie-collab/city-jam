"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Plus, Check, Square } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createTask,
  createWorkspace,
  fetchTasks,
  fetchWorkspaces,
  toggleTask,
  type CollabTask,
  type CollabWorkspace,
  studioUnavailable,
} from "@/lib/studio";

export default function CollabPanel() {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<CollabWorkspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<CollabTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWs, setNewWs] = useState("");
  const [newTask, setNewTask] = useState("");

  const loadWs = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    const ws = await fetchWorkspaces(user.id);
    setWorkspaces(ws);
    if (ws.length && !activeId) setActiveId(ws[0].id);
    setLoading(false);
  }, [user?.id, activeId]);

  const loadTasks = useCallback(async () => {
    if (!activeId) return;
    setTasks(await fetchTasks(activeId));
  }, [activeId]);

  useEffect(() => {
    loadWs();
  }, [loadWs]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newWs.trim()) return;
    const ws = await createWorkspace(user.id, { title: newWs.trim() });
    setNewWs("");
    setActiveId(ws.id);
    loadWs();
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !newTask.trim()) return;
    await createTask(activeId, newTask.trim());
    setNewTask("");
    loadTasks();
  };

  return (
    <FeatureShell
      title="Collab Workspace"
      icon={Users}
      badge="Studio"
      heading={
        <>
          Build Together / <span className="text-cj-gold-bright">In Sync.</span>
        </>
      }
      subtitle="Project boards with tasks for your band's next track."
      maxWidth="xl"
    >
      {loading ? (
        <p className="text-center text-cj-gold-muted">Loading...</p>
      ) : workspaces.length === 0 ? (
        <>
          <EmptyState
            icon={Users}
            title="No Projects Yet"
            description="Start a collab workspace for your next track."
          />
          <form onSubmit={addWorkspace} className="mx-auto mt-4 flex max-w-md gap-2">
            <input
              required
              placeholder="Project name"
              value={newWs}
              onChange={(e) => setNewWs(e.target.value)}
              className="cj-input !pl-4 flex-1"
            />
            <Button type="submit" variant="primary">
              Create
            </Button>
          </form>
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Workspaces</p>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => setActiveId(ws.id)}
                className={`block w-full rounded-lg border px-3 py-2 text-left text-sm uppercase tracking-wide transition-colors ${
                  activeId === ws.id
                    ? "border-cj-gold bg-cj-purple-card text-cj-gold"
                    : "border-cj-gold-border text-cj-gold-muted hover:border-cj-gold/50"
                }`}
              >
                {ws.title}
              </button>
            ))}
            <form onSubmit={addWorkspace} className="flex gap-1 pt-2">
              <input
                placeholder="+ New"
                value={newWs}
                onChange={(e) => setNewWs(e.target.value)}
                className="cj-input !py-2 !pl-3 flex-1 text-xs"
              />
            </form>
          </aside>

          <div className="cj-card min-h-[320px]">
            <form onSubmit={addTask} className="mb-6 flex gap-2">
              <input
                placeholder="Add task…"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="cj-input !pl-4 flex-1"
              />
              <Button type="submit" variant="secondary" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </form>
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggleTask(t.id, !t.done).then(loadTasks)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-cj-purple/30"
                  >
                    {t.done ? (
                      <Check className="h-4 w-4 shrink-0 text-cj-gold-bright" />
                    ) : (
                      <Square className="h-4 w-4 shrink-0 text-cj-gold-muted" />
                    )}
                    <span
                      className={`text-sm ${t.done ? "text-cj-gold-muted line-through" : "text-cj-gold"}`}
                    >
                      {t.title}
                    </span>
                  </button>
                </li>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-cj-gold-muted">No tasks yet — add chord charts, file uploads, etc.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </FeatureShell>
  );
}
