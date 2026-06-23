import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Facebook,
  Guitar,
  Handshake,
  Instagram,
  PoundSterling,
} from "lucide-react";

import AffiliateFaq from "@/components/affiliate/AffiliateFaq";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import AffiliateSectionHeader from "@/components/affiliate/AffiliateSectionHeader";
import FadeIn from "@/components/affiliate/FadeIn";
import AffiliateHeroVinyl from "@/components/affiliate/AffiliateHeroVinyl";
import BarcodeDivider from "@/components/BarcodeDivider";
import GrainOverlay from "@/components/GrainOverlay";
import { BRAND } from "@/lib/brand-assets";

const earningsRows = [
  { tier: "Starter", referrals: "5–10", monthly: "£132 – £264", annual: "£1,584 – £3,168" },
  { tier: "Growth", referrals: "11–30", monthly: "£290 – £792", annual: "£3,480 – £9,504" },
  { tier: "Partner", referrals: "31–75", monthly: "£818 – £1,980", annual: "£9,820 – £23,760" },
  { tier: "Elite", referrals: "75+", monthly: "£1,980+", annual: "£23,760+" },
] as const;

const steps = [
  {
    number: "01",
    title: "Apply",
    description: "Fill out our quick affiliate onboarding form.",
  },
  {
    number: "02",
    title: "Get onboarded",
    description: "Join a 30-minute onboarding session (individual or band track).",
  },
  {
    number: "03",
    title: "Share City Jam",
    description: "Promote the platform using your unique affiliate link.",
  },
  {
    number: "04",
    title: "Earn",
    description:
      "Receive commissions on every active referral, event sign-up, or in-app activity.",
  },
] as const;

const features = [
  { icon: Guitar, label: "Perform", text: "Put your music in front of a live community." },
  { icon: Handshake, label: "Connect", text: "Bridge your audience to the City Jam scene." },
  { icon: PoundSterling, label: "Earn", text: "Get paid for every active referral you drive." },
] as const;

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

interface AffiliateLandingProps {
  embedded?: boolean;
}

export default function AffiliateLanding({ embedded = false }: AffiliateLandingProps) {
  return (
    <>
      <section
        className={embedded ? "affiliate-hero affiliate-hero--embedded" : "affiliate-hero"}
        aria-labelledby="affiliate-hero-heading"
      >
        <div className="affiliate-hero__canvas" aria-hidden>
          <div className="affiliate-hero__mesh" />
        </div>
        <AffiliateHeroVinyl />
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
            <span className="affiliate-badge affiliate-badge--outline">Affiliate waitlist · opens Jun 24</span>
          </div>

          <div className="affiliate-hero__grid">
            <div className="affiliate-hero__copy">
              <h1 id="affiliate-hero-heading" className="affiliate-display affiliate-hero__headline">
                Join the City Jam affiliate program — earn while you jam
              </h1>
              <p className="affiliate-body affiliate-hero__sub">
                The affiliate waitlist opens tomorrow. Secure your spot, complete a 30-minute onboarding,
                and be ready to earn when City Jam launches July 29.
              </p>
              <div className="affiliate-hero__ctas">
                <a href="#signup" className="affiliate-btn-primary">
                  Join the waitlist
                  <ArrowRight size={16} aria-hidden />
                </a>
                <a href="#how-it-works" className="affiliate-btn-ghost">
                  Learn how it works
                </a>
              </div>
            </div>

            <aside className="affiliate-hero__panel" aria-label="Program highlights">
              <div className="affiliate-stat-card">
                <span className="affiliate-stat-card__label">Per referral</span>
                <span className="affiliate-stat-card__value">£26.40</span>
                <span className="affiliate-stat-card__note">30% of £88/mo plan</span>
              </div>
              <div className="affiliate-stat-card">
                <span className="affiliate-stat-card__label">Waitlist opens</span>
                <span className="affiliate-stat-card__value">Jun 24</span>
                <span className="affiliate-stat-card__note">30-min onboarding after you apply</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <FadeIn as="section" className="affiliate-section affiliate-section--brand">
        <GrainOverlay intensity={0.05} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="The platform"
            title="What is City Jam?"
            lead="City Jam is a live music community platform connecting performers, fans, and partners in a shared jamming experience. We're building the ultimate space for musicians to be discovered, perform, and get paid — and we want you to help us grow."
          />

          <div className="affiliate-feature-grid">
            {features.map(({ icon: Icon, label, text }) => (
              <article key={label} className="affiliate-feature-card">
                <div className="affiliate-feature-card__icon">
                  <Icon size={28} strokeWidth={1.5} aria-hidden />
                </div>
                <span className="affiliate-feature-card__label">{label}</span>
                <p className="affiliate-body affiliate-feature-card__text">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn as="section" id="how-it-works" className="affiliate-section affiliate-section--dark">
        <GrainOverlay intensity={0.04} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Process"
            title="How it works."
            lead="Four steps from application to recurring commission. No guesswork."
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

      <FadeIn as="section" id="earnings" className="affiliate-section affiliate-section--deep">
        <GrainOverlay intensity={0.05} warm />
        <div className="affiliate-container affiliate-section__inner">
          <div className="affiliate-earnings-layout">
            <div className="affiliate-earnings-copy">
              <AffiliateSectionHeader
                label="Commission"
                title="Your earning potential."
                lead="Affiliates earn £26.40 per active referral (30% of the £88/month app subscription). The more your audience engages, the more you earn — month after month."
              />
              <a href="#signup" className="affiliate-btn-primary affiliate-earnings-cta">
                Start earning — apply now
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>

            <div className="affiliate-earnings-table-wrap">
              <table className="affiliate-earnings-table">
                <caption className="affiliate-sr-only">
                  Affiliate earnings projections by referral tier
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Tier</th>
                    <th scope="col">Monthly referrals</th>
                    <th scope="col">Est. monthly</th>
                    <th scope="col">Annual</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsRows.map((row) => (
                    <tr key={row.tier}>
                      <td>
                        <span className="affiliate-tier">{row.tier}</span>
                      </td>
                      <td>{row.referrals}</td>
                      <td className="affiliate-earnings-table__money">{row.monthly}</td>
                      <td className="affiliate-earnings-table__money">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="affiliate-disclaimer">
                Projections are estimates based on average affiliate activity. Actual earnings may
                vary.
              </p>
            </div>
          </div>
          <a href="#signup" className="affiliate-btn-primary affiliate-btn-full affiliate-earnings-mobile-cta">
            Start earning — apply now
            <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn as="section" className="affiliate-section affiliate-section--brand">
        <GrainOverlay intensity={0.04} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Fit check"
            title="Who should apply?"
            lead="Two tracks. Same commission. Pick the path that matches how you move in the scene."
          />

          <div className="affiliate-two-col">
            <article className="affiliate-who-card affiliate-who-card--individual">
              <span className="affiliate-badge affiliate-badge--blue">Individual / creator</span>
              <h3 className="affiliate-who-card__title">You run your own lane</h3>
              <ul className="affiliate-who-card__list">
                <li>You have an audience of engaged followers on social media.</li>
                <li>You&apos;re ready to dedicate time to promoting City Jam.</li>
                <li>You attend or organize music events, jam sessions, or open mics.</li>
              </ul>
              <a href="#signup-individual" className="affiliate-btn-ghost affiliate-btn-ghost--blue">
                Apply as individual
              </a>
            </article>

            <article className="affiliate-who-card affiliate-who-card--band">
              <span className="affiliate-badge affiliate-badge--violet">Band / collective</span>
              <h3 className="affiliate-who-card__title">You move as a unit</h3>
              <ul className="affiliate-who-card__list">
                <li>You lead or manage a band or musical collective.</li>
                <li>Your group performs regularly or wants more stage time.</li>
                <li>You can drive ticket or membership volume through your fanbase.</li>
              </ul>
              <a href="#signup-band" className="affiliate-btn-ghost affiliate-btn-ghost--purple">
                Apply as a band
              </a>
            </article>
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" className="affiliate-section affiliate-section--dark">
        <GrainOverlay intensity={0.06} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader
            label="Social proof"
            title="Founding affiliates."
            lead="Be one of our founding affiliates. Shape how City Jam grows from Day 1."
          />

          <div className="affiliate-testimonials">
            <article className="affiliate-testimonial affiliate-testimonial--featured">
              <span className="affiliate-testimonial__quote" aria-hidden>
                &ldquo;
              </span>
              <p className="affiliate-body">
                The founding cohort sets the tone — your voice, your network, your commission from
                the first subscriber you bring in.
              </p>
              <span className="affiliate-mono">Founding cohort · 2026</span>
            </article>

            {[1, 2].map((slot) => (
              <article key={slot} className="affiliate-testimonial">
                <span className="affiliate-testimonial__quote" aria-hidden>
                  &ldquo;
                </span>
                <p className="affiliate-body affiliate-testimonial__placeholder">
                  Testimonial coming soon.
                </p>
                <div className="affiliate-testimonial__footer">
                  <div className="affiliate-testimonial__avatar" aria-hidden />
                  <span className="affiliate-mono">Founding affiliate {slot}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" id="faq" className="affiliate-section affiliate-section--deep">
        <GrainOverlay intensity={0.04} />
        <div className="affiliate-container affiliate-section__inner">
          <AffiliateSectionHeader label="FAQ" title="Common questions." />
          <div className="affiliate-faq-shell">
            <AffiliateFaq />
          </div>
        </div>
      </FadeIn>

      <FadeIn as="section" id="signup" className="affiliate-section affiliate-section--signup">
        <div className="affiliate-signup-bg__mesh" aria-hidden />
        <GrainOverlay intensity={0.08} warm />
        <div className="affiliate-container affiliate-section__inner affiliate-signup-layout">
          <div className="affiliate-signup-copy">
            <AffiliateSectionHeader
              label="Apply"
              title="Ready to earn with City Jam?"
              lead="Join the founding affiliate waitlist. Apply now — we'll schedule your 30-minute onboarding and have you ready to earn from Day 1 on July 29."
            />
            <ul className="affiliate-signup-points">
              <li>30-minute onboarding session</li>
              <li>Unique affiliate link + assets</li>
              <li>Monthly commission payouts</li>
            </ul>
          </div>
          <AffiliateForm />
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
              <Link href="/">About</Link>
              <a href="#signup">Affiliate program</a>
              <Link href="/privacy">Privacy policy</Link>
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
            <span>A Hinabi Music brand</span>
            <span>© 2026 City Jam</span>
          </div>
        </div>
      </footer>
      ) : null}
    </>
  );
}
