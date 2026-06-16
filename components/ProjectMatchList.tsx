"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Plus, MessageSquare, X } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import StudioNav from "@/components/StudioNav";
import AuthBanner from "@/components/AuthBanner";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { displayName, fetchProfile, fetchProfiles } from "@/lib/profiles";
import {
  FILTER_OPTIONS,
  ROLE_ICONS,
  applyToNeed,
  closeProjectNeed,
  createProjectNeed,
  fetchApplications,
  fetchProjectNeeds,
  updateApplicationStatus,
  type FilterOption,
  type ProjectApplication,
  type ProjectNeed,
  studioUnavailable,
} from "@/lib/studio";

export default function ProjectMatchList() {
  const { user, isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("ALL");
  const [listings, setListings] = useState<ProjectNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", role: "VOCALIST", genre: "" });
  const [error, setError] = useState<string | null>(null);
  const [applyNeed, setApplyNeed] = useState<ProjectNeed | null>(null);
  const [applyMsg, setApplyMsg] = useState("");
  const [viewApps, setViewApps] = useState<ProjectNeed | null>(null);
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [applicantNames, setApplicantNames] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchProjectNeeds(activeFilter === "ALL" ? undefined : activeFilter);
      setListings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    try {
      await createProjectNeed(user.id, form);
      setShowForm(false);
      setForm({ title: "", role: "VOCALIST", genre: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post failed");
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !applyNeed) return;
    try {
      await applyToNeed(applyNeed.id, user.id, applyMsg);
      setApplyNeed(null);
      setApplyMsg("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apply failed");
    }
  };

  const openApplications = async (need: ProjectNeed) => {
    setViewApps(need);
    const apps = await fetchApplications(need.id);
    setApplications(apps);
    const profiles = await fetchProfiles(apps.map((a) => a.applicant_id));
    const names: Record<string, string> = {};
    for (const a of apps) names[a.applicant_id] = displayName(profiles[a.applicant_id], "Musician");
    setApplicantNames(names);
  };

  const handleClose = async (need: ProjectNeed) => {
    if (!user?.id) return;
    await closeProjectNeed(need.id, user.id);
    load();
  };

  return (
    <FeatureShell
      title="Project Match"
      icon={Briefcase}
      badge="Studio"
      heading={
        <>
          Match On / <span className="text-cj-gold-bright">Project Need.</span>
        </>
      }
      subtitle="Post what your track needs. Apply to open calls. Get matched with musicians looking for exactly that."
      headerRight={
        <div className="flex gap-2">
          <Link href="/studio">
            <Button variant="secondary" size="sm">
              Studio
            </Button>
          </Link>
          {isAuthenticated && (
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="mr-1 h-4 w-4" /> Post
            </Button>
          )}
        </div>
      }
      maxWidth="xl"
      footer={
        !isAuthenticated ? (
          <AuthBanner message="Sign in to post or apply to project needs." returnUrl="/project-match" />
        ) : undefined
      }
    >
      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <StudioNav />

        <div>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`cj-pill ${activeFilter === filter ? "cj-pill-active" : ""}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {showForm && isAuthenticated && (
            <form onSubmit={handlePost} className="cj-card mt-6 space-y-4">
              <p className="text-xs uppercase tracking-widest text-cj-gold-muted">New project need</p>
              <input
                required
                placeholder="e.g. Rock vocalist in need"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="cj-input !pl-4"
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="cj-input !pl-4 !w-auto"
                >
                  {FILTER_OPTIONS.filter((f) => f !== "ALL").map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Genre (ROCK, JAZZ…)"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value.toUpperCase() })}
                  className="cj-input !pl-4 flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  Publish
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {applyNeed && (
            <form onSubmit={handleApply} className="cj-card mt-6 space-y-4 border-cj-gold/40">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-cj-gold">
                  Apply: {applyNeed.title}
                </p>
                <button type="button" onClick={() => setApplyNeed(null)}>
                  <X className="h-4 w-4 text-cj-gold-muted" />
                </button>
              </div>
              <textarea
                required
                placeholder="Introduce yourself — role, experience, link to demos..."
                value={applyMsg}
                onChange={(e) => setApplyMsg(e.target.value)}
                className="cj-input !pl-4 min-h-[100px]"
              />
              <Button type="submit" variant="primary">
                Send Application
              </Button>
            </form>
          )}

          {viewApps && (
            <div className="cj-card mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-cj-gold">
                  Applications: {viewApps.title}
                </p>
                <button type="button" onClick={() => setViewApps(null)}>
                  <X className="h-4 w-4 text-cj-gold-muted" />
                </button>
              </div>
              {applications.length === 0 ? (
                <p className="text-sm text-cj-gold-muted">No applications yet.</p>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="rounded-lg border border-cj-gold-border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-cj-gold">{applicantNames[app.applicant_id]}</span>
                      <span className="cj-tag">{app.status}</span>
                    </div>
                    <p className="mt-2 text-xs text-cj-gold-muted">{app.message}</p>
                    {viewApps.author_id === user?.id && app.status === "pending" && (
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => updateApplicationStatus(app.id, "accepted").then(() => openApplications(viewApps))}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateApplicationStatus(app.id, "declined").then(() => openApplications(viewApps))}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {error && <p className="mt-4 text-sm text-cj-gold-bright/90">{error}</p>}

          <div className="mt-8 space-y-3">
            {loading ? (
              <p className="text-center text-cj-gold-muted">Loading...</p>
            ) : listings.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No Projects Yet"
                description="Post the first need or widen your filter."
                actionLabel={isAuthenticated ? "Post a Need" : undefined}
                onAction={isAuthenticated ? () => setShowForm(true) : undefined}
              />
            ) : (
              listings.map((project) => (
                <div key={project.id} className="cj-card flex flex-wrap items-center gap-4 py-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark text-xl">
                    {ROLE_ICONS[project.role] ?? ROLE_ICONS.DEFAULT}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg uppercase text-cj-gold">{project.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="cj-tag">{project.role}</span>
                      {project.genre && <span className="cj-tag">{project.genre}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`cj-status-open ${project.status === "closed" ? "opacity-50" : ""}`}>
                      {project.status}
                    </span>
                    {project.status === "open" && isAuthenticated && project.author_id !== user?.id && (
                      <Button variant="primary" size="sm" onClick={() => setApplyNeed(project)}>
                        <MessageSquare className="mr-1 h-3 w-3" /> Apply
                      </Button>
                    )}
                    {project.author_id === user?.id && (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => openApplications(project)}>
                          View Apps
                        </Button>
                        {project.status === "open" && (
                          <Button variant="ghost" size="sm" onClick={() => handleClose(project)}>
                            Close
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </FeatureShell>
  );
}
