"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Users, MessageSquare } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { displayName, fetchProfile } from "@/lib/profiles";
import {
  createCirclePost,
  fetchCircle,
  fetchCircleMemberCount,
  fetchCirclePosts,
  type Circle,
  type CirclePost,
  studioUnavailable,
} from "@/lib/studio";

export default function CircleDetail({ circleId }: { circleId: string }) {
  const { user, isAuthenticated } = useAuth();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [members, setMembers] = useState(0);
  const [body, setBody] = useState("");
  const [name, setName] = useState("Musician");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (studioUnavailable()) {
      setLoading(false);
      return;
    }
    const c = await fetchCircle(circleId);
    setCircle(c);
    if (c) {
      setPosts(await fetchCirclePosts(circleId));
      setMembers(await fetchCircleMemberCount(circleId));
    }
    setLoading(false);
  }, [circleId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!user?.id) return;
    fetchProfile(user.id).then((p) => setName(displayName(p, user.name ?? user.email)));
  }, [user]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !body.trim()) return;
    await createCirclePost(circleId, user.id, name, body.trim());
    setBody("");
    load();
  };

  const copyCode = () => {
    if (!circle) return;
    navigator.clipboard.writeText(circle.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <FeatureShell title="Circle" icon={Users} heading="Loading...">
        <p className="text-cj-gold-muted">Loading...</p>
      </FeatureShell>
    );
  }

  if (!circle) {
    return (
      <FeatureShell title="Circle" icon={Users} heading="Not Found">
        <Link href="/circles" className="text-cj-gold underline">
          Back to circles
        </Link>
      </FeatureShell>
    );
  }

  return (
    <FeatureShell
      title={circle.name}
      icon={Users}
      badge="Private Circle"
      heading={circle.name}
      subtitle={circle.description || "Invite-only group"}
      headerRight={
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1 text-xs uppercase tracking-widest text-cj-gold hover:opacity-80"
        >
          <Copy className="h-3 w-3" />
          {copied ? "Copied!" : circle.invite_code}
        </button>
      }
    >
      <div className="mb-6 flex gap-4 text-[10px] uppercase tracking-widest text-cj-gold-muted">
        <span>{members} members</span>
        <Link href="/circles" className="text-cj-gold hover:opacity-80">
          All Circles
        </Link>
      </div>

      {isAuthenticated && (
        <form onSubmit={handlePost} className="cj-card mb-8 space-y-3">
          <textarea
            required
            placeholder="Share an update, link, or session time..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="cj-input !pl-4 min-h-[80px]"
          />
          <Button type="submit" variant="primary" size="sm">
            Post to Circle
          </Button>
        </form>
      )}

      <h2 className="mb-4 flex items-center gap-2 font-display text-lg uppercase text-cj-gold">
        <MessageSquare className="h-5 w-5" /> Feed
      </h2>

      {posts.length === 0 ? (
        <p className="text-sm text-cj-gold-muted">No posts yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li key={p.id} className="cj-card py-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-cj-gold-muted">
                <span>{p.display_name || "Musician"}</span>
                <span>{new Date(p.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-cj-gold">{p.body}</p>
            </li>
          ))}
        </ul>
      )}
    </FeatureShell>
  );
}
