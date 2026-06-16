"use client";

import { useCallback, useEffect, useState } from "react";
import { Archive, Plus, Trash2 } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  createVaultItem,
  deleteVaultItem,
  fetchVaultItems,
  type VaultItem,
  studioUnavailable,
} from "@/lib/studio";

const KINDS = ["demo", "stem", "recording", "mix"] as const;

export default function VaultPanel() {
  const { user } = useAuth();
  const [items, setItems] = useState<VaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", kind: "demo" as string, notes: "" });

  const load = useCallback(async () => {
    if (!user?.id || studioUnavailable()) {
      setLoading(false);
      return;
    }
    setItems(await fetchVaultItems(user.id));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    await createVaultItem(user.id, form);
    setShowForm(false);
    setForm({ title: "", kind: "demo", notes: "" });
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
      subtitle="Store recordings, demos, and stems. Only you decide what gets shared."
      headerRight={
        <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="mr-1 h-4 w-4" /> Upload
        </Button>
      }
    >
      {showForm && (
        <form onSubmit={handleAdd} className="cj-card mb-8 space-y-4">
          <input
            required
            placeholder="Track title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="cj-input !pl-4"
          />
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
          <input
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="cj-input !pl-4"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              Save to Vault
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
          description="Add your first demo, stem, or recording."
          actionLabel="Add Item"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="cj-card flex items-center gap-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark text-lg">
                🎵
              </div>
              <div className="flex-1">
                <h3 className="font-display uppercase text-cj-gold">{item.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  {item.kind} · {new Date(item.created_at).toLocaleDateString()}
                </p>
                {item.notes && (
                  <p className="mt-1 text-xs text-cj-gold-muted">{item.notes}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => user?.id && deleteVaultItem(item.id, user.id).then(load)}
                className="text-cj-gold-muted hover:text-cj-gold"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FeatureShell>
  );
}
