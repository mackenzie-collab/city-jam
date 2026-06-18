"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FeatureShell from "@/components/FeatureShell";
import AudioPostCard from "@/components/AudioPostCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  addComment,
  fetchAudioPost,
  fetchComments,
  type AudioComment,
  type AudioPost,
} from "@/lib/scene";
import { displayName, fetchProfile } from "@/lib/profiles";
import { ICONS } from "@/lib/brand-assets";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ScenePostPage({ postId }: { postId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<AudioPost | null>(null);
  const [comments, setComments] = useState<AudioComment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([fetchAudioPost(postId), fetchComments(postId)]);
      setPost(p);
      setComments(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !body.trim()) return;
    setPosting(true);
    try {
      const prof = await fetchProfile(user.id);
      const name = displayName(prof, user.name ?? user.email);
      const comment = await addComment(postId, user.id, name, body.trim());
      setComments((prev) => [...prev, comment]);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to comment");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <FeatureShell title="Post" iconSrc={ICONS.band} heading="Loading...">
        <p className="text-cj-gold-muted">Loading post...</p>
      </FeatureShell>
    );
  }

  if (!post) {
    return (
      <FeatureShell title="Post" iconSrc={ICONS.band} heading="Not Found">
        <Link href="/scene" className="text-cj-gold underline">
          Back to Scene
        </Link>
      </FeatureShell>
    );
  }

  return (
    <FeatureShell
      title={post.title}
      iconSrc={ICONS.band}
      badge="Scene Post"
      heading={post.title}
      subtitle={post.author_display_name ?? "Musician"}
      maxWidth="md"
      headerRight={
        <button type="button" onClick={() => router.back()} className="cj-btn-ghost text-xs">
          ← Back
        </button>
      }
    >
      <AudioPostCard post={post} />

      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg uppercase text-cj-gold">
          Comments ({comments.length})
        </h2>

        {comments.length === 0 ? (
          <p className="text-sm text-cj-gold-muted">No comments yet — start the conversation.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="cj-card py-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                  {c.display_name || "Musician"}
                  <span>·</span>
                  {timeAgo(c.created_at)}
                </div>
                <p className="mt-2 text-sm text-cj-gold">{c.body}</p>
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <form onSubmit={handleComment} className="cj-card mt-6 space-y-3">
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Add a comment..."
              className="cj-input !pl-4 min-h-[80px]"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <Button type="submit" variant="primary" disabled={posting}>
              {posting ? "Posting..." : "Comment"}
            </Button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-cj-gold-muted">
            <Link href={`/login?returnUrl=/scene/post/${postId}`} className="text-cj-gold underline">
              Sign in
            </Link>{" "}
            to comment.
          </p>
        )}
      </section>
    </FeatureShell>
  );
}
