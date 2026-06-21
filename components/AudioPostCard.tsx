"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Play } from "lucide-react";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";
import { incrementPlayCount, likePost, type AudioPost } from "@/lib/scene";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import VinylCard from "@/components/analog/VinylCard";
import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";

interface AudioPostCardProps {
  post: AudioPost;
  queue?: AudioPost[];
  liked?: boolean;
  onLike?: () => void;
}

export default function AudioPostCard({ post, queue, liked = false, onLike }: AudioPostCardProps) {
  const { play } = useAudioPlayer();
  const { user } = useAuth();
  const [localLiked, setLocalLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(post.like_count);

  const artistName = post.author_display_name ?? "Musician";
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;

  const toTrack = (p: AudioPost): Track => ({
    id: p.id,
    title: p.title,
    artist: p.author_display_name ?? "Musician",
    audioUrl: p.audio_url,
    postId: p.id,
    coverUrl: p.cover_url || undefined,
  });

  const handlePlay = () => {
    const tracks = (queue ?? [post]).map(toTrack);
    play(toTrack(post), tracks);
    incrementPlayCount(post.id).catch(() => undefined);
  };

  const handleLike = async () => {
    if (!user?.id || localLiked) return;
    setLocalLiked(true);
    setLikeCount((c) => c + 1);
    try {
      await likePost(post.id, user.id);
      onLike?.();
    } catch {
      setLocalLiked(false);
      setLikeCount(post.like_count);
    }
  };

  return (
    <VinylCard padding="none" className="overflow-hidden">
      <div className="relative flex items-center justify-center border-b border-cj-gold-border/20 bg-brand-purple-deep px-4 py-6 sm:px-6 sm:py-8">
        <VinylPhotoFrame
          src={post.cover_url}
          alt={post.title}
          size={200}
          maxVw={42}
          className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        />
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity hover:opacity-100"
          aria-label={`Play ${post.title}`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cj-gold text-cj-on-gold">
            <Play className="h-5 w-5 pl-0.5" />
          </span>
        </button>
        {post.genre && (
          <span className="cj-tag absolute left-3 top-3 bg-cj-card/90">{post.genre}</span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="cj-zine-headline">{post.title}</h3>
        <Link href={profileHref} className="mt-1 inline-block text-sm text-cj-text-muted hover:text-cj-gold">
          {artistName}
        </Link>
        {post.caption && (
          <p className="mt-2 line-clamp-2 text-sm text-cj-text-muted">{post.caption}</p>
        )}

        <div className="mt-4 flex items-center gap-4 text-sm">
          <button
            type="button"
            onClick={handlePlay}
            className="flex items-center gap-1 font-medium text-cj-text-muted hover:text-cj-gold"
          >
            <Play className="h-3.5 w-3.5" /> Play
          </button>
          <button
            type="button"
            onClick={handleLike}
            disabled={localLiked || !user}
            className={cn(
              "flex items-center gap-1 font-medium transition-colors",
              localLiked ? "text-cj-gold-bright" : "text-cj-text-muted hover:text-cj-gold"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", localLiked && "fill-current")} />
            {likeCount}
          </button>
          <Link
            href={`/scene/post/${post.id}`}
            className="flex items-center gap-1 font-medium text-cj-text-muted hover:text-cj-gold"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {post.comment_count}
          </Link>
          <span className="ml-auto text-xs text-cj-text-muted">{post.play_count} plays</span>
        </div>
      </div>
    </VinylCard>
  );
}
