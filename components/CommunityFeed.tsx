"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { displayName, fetchProfile } from "@/lib/profiles";
import {
  createCommunityPost,
  fetchCommunityFeed,
  FEED_KIND_COLOR,
  FEED_KIND_LABEL,
  type FeedItem,
  communityUnavailable,
} from "@/lib/community";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommunityFeed({ showComposer = true }: { showComposer?: boolean }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [name, setName] = useState("Musician");

  const load = useCallback(async () => {
    if (communityUnavailable()) {
      setLoading(false);
      return;
    }
    setItems(await fetchCommunityFeed());
    setLoading(false);
  }, []);

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
    setPosting(true);
    try {
      await createCommunityPost(user.id, name, { body: body.trim(), kind: "post" });
      setBody("");
      load();
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      {showComposer && isAuthenticated && (
        <form onSubmit={handlePost} className="cj-card mb-6 space-y-3">
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-cj-gold-muted">
            <MessageCircle className="h-4 w-4" /> Share with the scene
          </p>
          <textarea
            required
            placeholder="What are you working on? Looking for a drummer? Just dropped a demo?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="cj-input !pl-4 min-h-[80px]"
          />
          <Button type="submit" variant="primary" size="sm" disabled={posting}>
            {posting ? "Posting..." : "Post to Feed"}
          </Button>
        </form>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg uppercase text-cj-gold">Community Feed</h2>
        <button type="button" onClick={load} className="text-cj-gold-muted hover:text-cj-gold" aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-cj-gold-muted">Loading feed...</p>
      ) : items.length === 0 ? (
        <div className="cj-card py-8 text-center">
          <p className="text-cj-gold-muted">The feed is quiet. Be the first to post or start a jam.</p>
          <Link href="/blind-echo" className="mt-4 inline-block text-sm text-cj-gold underline">
            Start a jam
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const inner = (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display uppercase text-cj-gold">{item.display_name}</span>
                  <span className={`cj-tag ${FEED_KIND_COLOR[item.kind]}`}>{FEED_KIND_LABEL[item.kind]}</span>
                  <span className="text-[10px] text-cj-gold-muted">{timeAgo(item.created_at)}</span>
                </div>
                {item.title && <p className="mt-2 font-display text-sm uppercase text-cj-gold-bright">{item.title}</p>}
                <p className="mt-1 text-sm leading-relaxed text-cj-gold-muted">{item.body}</p>
              </>
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} className="cj-card block py-4 no-underline transition-colors hover:border-cj-gold/50">
                    {inner}
                  </Link>
                ) : (
                  <div className="cj-card py-4">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
