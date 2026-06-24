"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  MessageCircle,
  Pause,
  Play,
  Share2,
  Upload,
  X,
} from "lucide-react";
import AppChrome from "@/components/AppChrome";
import AuthBanner from "@/components/AuthBanner";
import SceneComposer from "@/components/SceneComposer";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchSceneFeed,
  incrementPlayCount,
  likePost,
  mergeSceneFeed,
  subscribeToAudioPosts,
  type AudioPost,
} from "@/lib/scene";
import { cn } from "@/lib/utils";

function SceneSnapSlide({
  post,
  isActive,
  isPlaying,
  liked,
  likeCount,
  onTogglePlay,
  onLike,
  onShare,
  showSwipeHint,
}: {
  post: AudioPost;
  isActive: boolean;
  isPlaying: boolean;
  liked: boolean;
  likeCount: number;
  onTogglePlay: () => void;
  onLike: () => void;
  onShare: () => void;
  showSwipeHint?: boolean;
}) {
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;
  const artistName = post.author_display_name ?? "Musician";

  return (
    <section
      data-post-id={post.id}
      className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden bg-cj-purple"
    >
      {post.cover_url ? (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl"
          style={{ backgroundImage: `url(${post.cover_url})` }}
          aria-hidden
        />
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" aria-hidden />

      <div className="relative z-[1] flex h-full w-full items-center justify-center px-6 pb-36 pt-16">
        <div
          className={cn(
            "relative h-[280px] w-[280px] overflow-hidden rounded-full border-2 border-brand-gold/50 shadow-[0_0_60px_rgba(179,162,0,0.2)]",
            isActive && isPlaying && "cj-vinyl-spin-slow"
          )}
        >
          {post.cover_url ? (
            <Image src={post.cover_url} alt={post.title} fill className="object-cover" sizes="280px" priority={showSwipeHint} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-purple-deep font-display text-sm uppercase text-cj-text-muted">
              No cover
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/30" aria-hidden />
        </div>
      </div>

      <aside className="absolute right-4 top-1/2 z-[2] flex -translate-y-1/2 flex-col items-center gap-5">
        <button
          type="button"
          onClick={onLike}
          className="flex flex-col items-center gap-1 text-cj-parchment transition-colors hover:text-brand-gold"
          aria-label="Like"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-sm">
            <Heart className={cn("h-5 w-5", liked && "fill-brand-gold text-brand-gold")} />
          </span>
          <span className="font-mono text-[10px]">{likeCount}</span>
        </button>

        <Link
          href={`/scene/post/${post.id}`}
          className="flex flex-col items-center gap-1 text-cj-parchment transition-colors hover:text-brand-gold no-underline"
          aria-label="Comments"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-sm">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="font-mono text-[10px]">{post.comment_count}</span>
        </Link>

        <button
          type="button"
          onClick={onShare}
          className="flex flex-col items-center gap-1 text-cj-parchment transition-colors hover:text-brand-gold"
          aria-label="Share"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-sm">
            <Share2 className="h-5 w-5" />
          </span>
          <span className="font-mono text-[10px]">Share</span>
        </button>
      </aside>

      <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-28 pt-16 sm:px-8">
        <Link href={profileHref} className="font-mono text-xs uppercase tracking-widest text-brand-gold no-underline hover:text-cj-parchment">
          {artistName}
        </Link>
        <h2 className="mt-1 font-display text-2xl uppercase leading-tight text-cj-parchment sm:text-3xl">
          {post.title}
        </h2>
        {post.is_editors_pick ? (
          <span className="mt-2 inline-block border border-brand-gold/60 bg-brand-gold/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand-gold">
            Editor&apos;s Pick
          </span>
        ) : null}
        {post.genre ? <span className="cj-badge mt-3 text-[10px]">{post.genre}</span> : null}
        {post.caption ? (
          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-cj-text-muted line-clamp-2">
            {post.caption}
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onTogglePlay}
            className="flex items-center gap-2 border border-brand-gold/50 bg-brand-purple/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-brand-gold backdrop-blur-sm transition-colors hover:bg-brand-gold hover:text-cj-purple"
          >
            {isActive && isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 pl-0.5" /> Play
              </>
            )}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-cj-text-muted">
            {post.play_count} plays
          </span>
        </div>
      </div>

      {showSwipeHint ? (
        <div className="absolute bottom-36 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-1 text-cj-text-muted animate-bounce">
          <span className="font-mono text-[10px] uppercase tracking-widest">Swipe up</span>
          <ChevronDown className="h-4 w-4 rotate-180" />
        </div>
      ) : null}
    </section>
  );
}

export default function SceneSnapFeed() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<AudioPost[]>(() => mergeSceneFeed([], 20));
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      const feed = await fetchSceneFeed({ limit: 20, minCount: 20, sort: "ranked" });
      setPosts(feed);
      setLikeCounts(
        Object.fromEntries(feed.map((post) => [post.id, post.like_count]))
      );
    } catch {
      const fallback = mergeSceneFeed([], 20);
      setPosts(fallback);
      setLikeCounts(Object.fromEntries(fallback.map((post) => [post.id, post.like_count])));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToAudioPosts(load);
    return unsub;
  }, [load]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || posts.length === 0) return;

    const slides = Array.from(container.querySelectorAll<HTMLElement>("[data-post-id]"));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        const nextId = visible.target.getAttribute("data-post-id");
        if (!nextId || nextId === activeIdRef.current) return;

        setActiveId(nextId);
      },
      { root: container, threshold: [0.55, 0.7, 0.85] }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [posts]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeId) return;

    const post = posts.find((item) => item.id === activeId);
    if (!post?.audio_url) return;

    audio.src = post.audio_url;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        incrementPlayCount(post.id).catch(() => undefined);
      })
      .catch(() => setIsPlaying(false));
  }, [activeId, posts]);

  const handleTogglePlay = (postId: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeId === postId && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (activeId === postId) {
      audio.play().then(() => setIsPlaying(true)).catch(() => undefined);
      return;
    }

    setActiveId(postId);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const handleLike = async (postId: string) => {
    if (!user?.id || likedMap[postId]) return;
    setLikedMap((prev) => ({ ...prev, [postId]: true }));
    setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }));
    try {
      await likePost(postId, user.id);
    } catch {
      setLikedMap((prev) => ({ ...prev, [postId]: false }));
      setLikeCounts((prev) => ({ ...prev, [postId]: Math.max((prev[postId] ?? 1) - 1, 0) }));
    }
  };

  const handleShare = async (post: AudioPost) => {
    const url = `${window.location.origin}/scene/post/${post.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.caption, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* user dismissed share sheet */
    }
  };

  const displayPosts = posts.length > 0 ? posts : mergeSceneFeed([], 20);

  return (
    <AppChrome>
      <div className="relative">
        <div className="pointer-events-none fixed inset-x-0 top-[3.25rem] z-40 flex justify-end px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="pointer-events-auto flex items-center gap-2 border border-brand-gold/50 bg-black/50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-brand-gold backdrop-blur-md transition-colors hover:bg-brand-gold hover:text-cj-purple"
          >
            <Upload className="h-4 w-4" />
            Post to Scene
          </button>
        </div>

        {loading ? (
          <div className="fixed inset-x-0 bottom-0 top-[3.25rem] flex items-center justify-center bg-cj-purple">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-gold animate-pulse">
              Loading scene…
            </p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="fixed inset-x-0 bottom-0 top-[3.25rem] overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-cj-purple [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {displayPosts.map((post, index) => (
              <SceneSnapSlide
                key={post.id}
                post={post}
                isActive={activeId === post.id}
                isPlaying={activeId === post.id && isPlaying}
                liked={!!likedMap[post.id]}
                likeCount={likeCounts[post.id] ?? post.like_count}
                onTogglePlay={() => handleTogglePlay(post.id)}
                onLike={() => handleLike(post.id)}
                onShare={() => handleShare(post)}
                showSwipeHint={index === 0 && displayPosts.length > 1}
              />
            ))}
          </div>
        )}

        <audio ref={audioRef} className="hidden" preload="metadata" />

        {composerOpen ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
            <div className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-none border border-cj-gold-border bg-cj-purple-card p-4 shadow-2xl">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="absolute right-3 top-3 text-cj-text-muted hover:text-brand-gold"
                aria-label="Close composer"
              >
                <X className="h-5 w-5" />
              </button>
              <SceneComposer />
            </div>
          </div>
        ) : null}

        {!isAuthenticated ? (
          <AuthBanner message="Join to post tracks and follow artists." returnUrl="/scene" />
        ) : null}
      </div>
    </AppChrome>
  );
}
