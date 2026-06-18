"use client";

import { useCallback, useEffect, useState } from "react";
import { Music } from "lucide-react";
import AudioPostCard from "@/components/AudioPostCard";
import EmptyState from "@/components/EmptyState";
import { fetchSceneFeed, subscribeToAudioPosts, type AudioPost } from "@/lib/scene";

export default function SceneFeed() {
  const [posts, setPosts] = useState<AudioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setPosts(await fetchSceneFeed());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  if (loading) {
    return <p className="text-cj-gold-muted">Loading scene...</p>;
  }

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Music}
        title="No posts yet"
        description="Be the first to drop a track on the scene."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <AudioPostCard key={post.id} post={post} queue={posts} />
      ))}
    </div>
  );
}
