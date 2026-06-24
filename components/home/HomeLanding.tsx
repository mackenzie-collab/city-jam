import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Ear,
  EyeOff,
  Facebook,
  Globe,
  Instagram,
  Radio,
  Users,
  Zap,
} from "lucide-react";

import AffiliateSectionHeader from "@/components/affiliate/AffiliateSectionHeader";
import FadeIn from "@/components/affiliate/FadeIn";
import BarcodeDivider from "@/components/BarcodeDivider";
import GrainOverlay from "@/components/GrainOverlay";
import MusicianGallery from "@/components/MusicianGallery";
import ScenePreviewCarousel from "@/components/home/ScenePreviewCarousel";
import SignalMapSection from "@/components/home/SignalMapSection";
import HomeHeroVinyl from "@/components/home/HomeHeroVinyl";
import { BRAND } from "@/lib/brand-assets";

const blindEchoFeatures = [
  {
    icon: Zap,
    label: "7 minutes",
    text: "Timed sessions — no endless scrolling. One match, one window.",
  },
  {
    icon: Ear,
    label: "Deep prompts",
    text: "Questions that cut through small talk and surface real musical chemistry.",
  },
  {
    icon: Users,
    label: "Mutual gate",
    text: "Both sides decide. Profiles unlock only when you transmit together.",
  },
] as const;

const steps = [
  {
    number: "01",
    title: "Build your sound profile",
    description: "Pick instruments, genres, who you seek. No photo. No real name.",
  },
  {
    number: "02",
    title: "Choose your mode",
    description: "Deep 7-min Blind Echo session or quick Echo Roulette spin.",
  },
  {
    number: "03",
    title: "Connect anonymously",
    description: "Matched by musical taste alone. You hear them, they hear you.",
  },
  {
    number: "04",
    title: "Transmit or fade",
    description: "Mutual transmit — profiles revealed. Fade — disappear cleanly.",
  },
] as const;

const tools = [
  {
    title: "Community Hub",
    href: "/community",
    description: "Feed, streaks, project board — the heart of the scene.",
  },
  {
    title: "Studio Hub",
    href: "/studio",
    description: "Your command center — projects, stats, and connected tools.",
  },
  {
    title: "Project Match",
    href: "/project-match",
    description: "Post what your track needs. Get matched by intent.",
  },
  {
    title: "Circles",
    href: "/circles",
    description: "Invite-only groups around a sound, city or shared goal.",
  },
  {
    title: "My Tracks",
    href: "/dashboard",
    description: "Your Scene posts, plays, and stats.",
  },
  {
    title: "Collab",
    href: "/collab",
    description: "Project boards with files, tasks, chord sheets.",
  },
] as const;

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

interface HomeLandingProps {
  embedded?: boolean;
}

export default function HomeLanding({ embedded = false }: HomeLandingProps) {
  return (
    <>
      <section
        className={embedded ? "affiliate-hero affiliate-hero--embedded" : "affiliate-hero"}
        aria-labelledby="home-hero-heading"
      >
        <div className="affiliate-hero__canvas" aria-hidden>
          <div className="affiliate-hero__mesh" />
        </div>
        <HomeHeroVinyl />
        <GrainOverlay className="affiliate-hero__grain" intensity={0.14} warm />

        <div className="affiliate-hero__content affiliate-container">
          <div className="affiliate-hero__top">
            <Image
              src={BRAND.logo2026Inverted}
              alt="City Jam"
              width={168}
              height={52}
              priority
              className="affiliate-hero__logo"
            />
            <span className="affiliate-badge affiliate-badge--outline">
              Audio-first · anonymous matchmaking
            </span>
          </div>

          <div className="affiliate-hero__grid">
            <div className="affiliate-hero__copy">
              <h1 id="home-hero-heading" className="affiliate-display affiliate-hero__headline">
                Hear someone before you see them
              </h1>
              <p className="affiliate-body affiliate-hero__sub">
                Blind Echo is City Jam&apos;s high-intent matchmaking mode. Deep prompts, timed
                sessions, and a mutual gate at the end — connect by sound alone.
              </p>
              <div className="affiliate-hero__ctas">
                <Link href="/blind-echo" className="affiliate-btn-primary">
                  Enter Blind Echo
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href="/scene" className="affiliate-btn-ghost">
                  Enter the scene
                </Link>
              </div>
            </div>

            <aside className="affiliate-hero__panel" aria-label="Platform highlights">
              <div className="affiliate-stat-card">
                <span className="affiliate-stat-card__label">Session length</span>
                <span className="affiliate-stat-card__value">07:00</span>
                <span className="affiliate-stat-card__note">One match. One window.</span>
              </div>
              <div className="affiliate-stat-card">
                <span className="affiliate-stat-card__label">Match by</span>
                <span className="affiliate-stat-card__value">Sound</span>
                <span className="affiliate-stat-card__note">No photos. No follower counts.</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FadeIn as="section" className="affiliate-section affiliate-section--brand">
        <GrainOverlay intensity={0.05} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Featured · High intent"
            title="Blind Echo"
            lead="Anonymous audio matchmaking for musicians who want to connect by sound alone. Close your eyes. Listen. Decide together."
          />

          <div className="affiliate-feature-grid">
            {blindEchoFeatures.map(({ icon: Icon, label, text }) => (
              <article key={label} className="affiliate-feature-card">
                <div className="affiliate-feature-card__icon">
                  <Icon size={28} strokeWidth={1.5} aria-hidden />
                </div>
                <span className="affiliate-feature-card__label">{label}</span>
                <p className="affiliate-body affiliate-feature-card__text">{text}</p>
              </article>
            ))}
          </div>

          <div className="affiliate-hero__ctas" style={{ marginTop: "2.5rem" }}>
            <Link href="/blind-echo" className="affiliate-btn-primary">
              Enter Blind Echo
              <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/echo-roulette" className="affiliate-btn-ghost">
              Try Echo Roulette
            </Link>
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <SignalMapSection theme="affiliate" />

      <ScenePreviewCarousel theme="affiliate" />

      <MusicianGallery theme="affiliate" />

      <hr className="affiliate-divider" />

      <FadeIn as="section" className="affiliate-section affiliate-section--brand">
        <GrainOverlay intensity={0.04} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Casual mode"
            title="Echo Roulette"
            lead="Want something lighter? Spin the dial and get matched to whoever is live. No timer, no gate — just vibes."
          />

          <div className="affiliate-two-col">
            <article className="affiliate-who-card affiliate-who-card--individual">
              <span className="affiliate-badge affiliate-badge--blue">Blind Echo</span>
              <h3 className="affiliate-who-card__title">High intent</h3>
              <ul className="affiliate-who-card__list">
                <li>7-minute timed session with deep prompts.</li>
                <li>Mutual match gate — both sides decide.</li>
                <li>Best when you want a real connection.</li>
              </ul>
              <Link href="/blind-echo" className="affiliate-btn-ghost affiliate-btn-ghost--blue">
                Enter Blind Echo
              </Link>
            </article>

            <article className="affiliate-who-card affiliate-who-card--band">
              <span className="affiliate-badge affiliate-badge--violet">Echo Roulette</span>
              <h3 className="affiliate-who-card__title">Casual spin</h3>
              <ul className="affiliate-who-card__list">
                <li>Spin the dial, lock into a frequency.</li>
                <li>Get matched to whoever is live right now.</li>
                <li>No timer, no gate — just vibes.</li>
              </ul>
              <Link href="/echo-roulette" className="affiliate-btn-ghost affiliate-btn-ghost--purple">
                Enter Echo Roulette
              </Link>
            </article>
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn as="section" id="how-it-works" className="affiliate-section affiliate-section--dark">
        <GrainOverlay intensity={0.04} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Process"
            title="Four steps. Then it's gone."
            lead="From sound profile to anonymous session to mutual reveal — the whole arc in minutes."
          />

          <div className="affiliate-steps">
            {steps.map((step, index) => (
              <div key={step.number} className="affiliate-steps__item">
                <article className="affiliate-step-card">
                  <span className="affiliate-step-card__number">{step.number}</span>
                  <h3 className="affiliate-step-card__title">{step.title}</h3>
                  <p className="affiliate-body affiliate-step-card__text">{step.description}</p>
                </article>
                {index < steps.length - 1 ? (
                  <div className="affiliate-steps__connector" aria-hidden>
                    <ChevronRight size={22} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn as="section" className="affiliate-section affiliate-section--deep">
        <GrainOverlay intensity={0.05} warm />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Our promise"
            title="Zero visual bias"
            lead="No photos. No usernames. No follower counts. You are matched purely on what you play and what you're looking for."
            align="center"
          />

          <div className="affiliate-testimonials">
            <article className="affiliate-testimonial affiliate-testimonial--featured">
              <span className="affiliate-testimonial__quote" aria-hidden>
                &ldquo;
              </span>
              <p className="affiliate-body">
                Profiles only unlock if both people transmit — simultaneously. Until then, it&apos;s
                sound, taste, and intent. Nothing else.
              </p>
              <span className="affiliate-mono">Close your eyes. Listen.</span>
            </article>

            <article className="affiliate-testimonial">
              <div className="affiliate-feature-card__icon" style={{ marginBottom: "1rem" }}>
                <EyeOff size={28} strokeWidth={1.5} aria-hidden />
              </div>
              <p className="affiliate-body affiliate-feature-card__text">
                No photos on your profile during matching.
              </p>
            </article>

            <article className="affiliate-testimonial">
              <div className="affiliate-feature-card__icon" style={{ marginBottom: "1rem" }}>
                <Radio size={28} strokeWidth={1.5} aria-hidden />
              </div>
              <p className="affiliate-body affiliate-feature-card__text">
                Matched by instruments, genres, and musical intent.
              </p>
            </article>
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn as="section" className="affiliate-section affiliate-section--dark">
        <GrainOverlay intensity={0.04} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Explore"
            title="More tools. Your scene."
            lead="Community, studio, vault, collab — everything musicians need beyond the match."
          />

          <div className="affiliate-feature-grid affiliate-feature-grid--tools">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="affiliate-feature-card affiliate-tool-card">
                <span className="affiliate-feature-card__label">{tool.title}</span>
                <p className="affiliate-body affiliate-feature-card__text">{tool.description}</p>
                <span className="affiliate-tool-card__link">
                  Open <ArrowRight size={14} aria-hidden />
                </span>
              </Link>
            ))}
          </div>

          <div className="affiliate-hero__ctas" style={{ marginTop: "2rem" }}>
            <Link href="/listening-rooms" className="affiliate-btn-ghost">
              Listen Rooms
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" className="affiliate-section affiliate-section--signup">
        <div className="affiliate-signup-bg__mesh" aria-hidden />
        <GrainOverlay intensity={0.08} warm />
        <div className="affiliate-container affiliate-section__inner affiliate-signup-layout">
          <div className="affiliate-signup-copy">
            <AffiliateSectionHeader
              label="No commitment"
              title="Ready to match?"
              lead="Start with Blind Echo for a focused 7-minute session, or spin Echo Roulette as a guest. No account needed to feel the vibe — but you'll need one to connect."
            />
            <ul className="affiliate-signup-points">
              <li>Guest mode on Echo Roulette</li>
              <li>7-minute Blind Echo sessions</li>
              <li>Free to join the rebellion</li>
            </ul>
          </div>

          <div className="affiliate-form-card affiliate-cta-card">
            <div className="affiliate-hero__ctas">
              <Link href="/blind-echo" className="affiliate-btn-primary affiliate-btn-full">
                Enter Blind Echo
                <ArrowRight size={16} aria-hidden />
              </Link>
              <Link href="/register" className="affiliate-btn-ghost affiliate-btn-full">
                Join the rebellion
              </Link>
              <Link href="/#affiliates" className="affiliate-btn-ghost affiliate-btn-full">
                Affiliate waitlist
                <Globe size={16} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {!embedded ? (
        <footer className="affiliate-footer">
          <div className="affiliate-container">
            <BarcodeDivider className="affiliate-footer__barcode" />
            <div className="affiliate-footer__inner">
              <Image
                src={BRAND.logo2026Inverted}
                alt="City Jam"
                width={128}
                height={40}
                className="affiliate-footer__logo"
              />

              <nav className="affiliate-footer__links" aria-label="Footer">
                <Link href="/scene">Scene</Link>
                <Link href="/blind-echo">Blind Echo</Link>
                <Link href="/signal-map">Signal Map</Link>
                <Link href="/#affiliates">Affiliates</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/contact">Contact</Link>
              </nav>

              <div className="affiliate-footer__social" aria-label="Social media">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <TikTokIcon />
                </a>
              </div>
            </div>

            <div className="affiliate-footer__meta">
              <span>100% audio-only · 0 photos · No algorithms</span>
              <span>© {new Date().getFullYear()} City Jam</span>
            </div>
          </div>
        </footer>
      ) : null}
    </>
  );
}
