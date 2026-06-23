import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Facebook, Guitar, Handshake, Instagram, PoundSterling } from "lucide-react";

import AffiliateFaq from "@/components/affiliate/AffiliateFaq";
import AffiliateForm from "@/components/affiliate/AffiliateForm";
import FadeIn from "@/components/affiliate/FadeIn";
import { BRAND, STOCK } from "@/lib/brand-assets";

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
    description: "Join a 2-hour onboarding session (individual or band track).",
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

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

export default function AffiliateLanding() {
  return (
    <>
      <section className="affiliate-hero" aria-labelledby="affiliate-hero-heading">
        <div
          className="affiliate-hero__bg"
          style={{ backgroundImage: `url(${STOCK.hero})` }}
          role="img"
          aria-label="Musicians performing in an urban venue"
        />
        <div className="affiliate-hero__overlay" aria-hidden />
        <div className="affiliate-hero__grain" aria-hidden />

        <div className="affiliate-hero__content">
          <div className="affiliate-hero__logo">
            <Image
              src={BRAND.logo2026Inverted}
              alt="City Jam"
              width={160}
              height={48}
              priority
              className="h-10 w-auto object-contain sm:h-12"
            />
          </div>

          <h1 id="affiliate-hero-heading" className="affiliate-display affiliate-hero__headline">
            Join the City Jam affiliate program — earn while you jam
          </h1>

          <p className="affiliate-body affiliate-hero__sub">
            Be part of the movement. Launch with us on July 29 and start earning from Day 1.
          </p>

          <div className="affiliate-hero__ctas">
            <a href="#signup" className="affiliate-btn-primary">
              Apply to become an affiliate
            </a>
            <a href="#how-it-works" className="affiliate-btn-ghost">
              Learn how it works
            </a>
          </div>
        </div>
      </section>

      <FadeIn as="section" className="affiliate-section" style={{ backgroundColor: "var(--color-purple-brand)" }}>
        <div className="affiliate-container">
          <h2 className="affiliate-display affiliate-section-title">What is City Jam?</h2>
          <p className="affiliate-body" style={{ maxWidth: "42rem" }}>
            City Jam is a live music community platform connecting performers, fans, and partners in a
            shared jamming experience. We&apos;re building the ultimate space for musicians to be
            discovered, perform, and get paid — and we want you to help us grow.
          </p>

          <div className="affiliate-icon-row">
            <div className="affiliate-icon-item">
              <Guitar aria-hidden />
              <span className="affiliate-icon-item__label">Perform</span>
            </div>
            <div className="affiliate-icon-item">
              <Handshake aria-hidden />
              <span className="affiliate-icon-item__label">Connect</span>
            </div>
            <div className="affiliate-icon-item">
              <PoundSterling aria-hidden />
              <span className="affiliate-icon-item__label">Earn</span>
            </div>
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn
        as="section"
        id="how-it-works"
        className="affiliate-section"
        style={{ backgroundColor: "var(--color-bg-dark)" }}
      >
        <div className="affiliate-container">
          <h2 className="affiliate-display affiliate-section-title">How it works.</h2>

          <div className="affiliate-steps">
            {steps.map((step, index) => (
              <div key={step.number} style={{ display: "contents" }}>
                <article className="affiliate-step">
                  <p className="affiliate-step__number">{step.number}</p>
                  <h3 className="affiliate-step__title">{step.title}</h3>
                  <p className="affiliate-body" style={{ opacity: 0.85 }}>
                    {step.description}
                  </p>
                </article>
                {index < steps.length - 1 ? (
                  <div className="affiliate-step__arrow" aria-hidden>
                    <ChevronRight size={24} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn
        as="section"
        id="earnings"
        className="affiliate-section"
        style={{ backgroundColor: "var(--color-bg-deep)" }}
      >
        <div className="affiliate-container">
          <h2 className="affiliate-display affiliate-section-title">Your earning potential.</h2>
          <p className="affiliate-body" style={{ maxWidth: "42rem" }}>
            Affiliates earn £26.40 per active referral (30% of the £88/month app subscription). The
            more your audience engages, the more you earn — month after month.
          </p>

          <div className="affiliate-earnings-table-wrap">
            <table className="affiliate-earnings-table">
              <caption className="affiliate-sr-only">
                Affiliate earnings projections by referral tier
              </caption>
              <thead>
                <tr>
                  <th scope="col">Tier</th>
                  <th scope="col">Monthly referrals</th>
                  <th scope="col">Est. monthly earnings</th>
                  <th scope="col">Annual projection</th>
                </tr>
              </thead>
              <tbody>
                {earningsRows.map((row) => (
                  <tr key={row.tier}>
                    <td>{row.tier}</td>
                    <td>{row.referrals}</td>
                    <td>{row.monthly}</td>
                    <td>{row.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="affiliate-disclaimer">
            Projections are estimates based on average affiliate activity. Actual earnings may vary.
          </p>

          <a
            href="#signup"
            className="affiliate-btn-primary affiliate-btn-full"
            style={{ marginTop: "2rem", display: "flex" }}
          >
            Start earning — apply now
          </a>
        </div>
      </FadeIn>

      <hr className="affiliate-divider" />

      <FadeIn
        as="section"
        className="affiliate-section"
        style={{ backgroundColor: "var(--color-purple-brand)" }}
      >
        <div className="affiliate-container">
          <h2 className="affiliate-display affiliate-section-title">Who should apply?</h2>

          <div className="affiliate-two-col">
            <article className="affiliate-who-card affiliate-who-card--individual">
              <h3 className="affiliate-who-card__title">Individual / creator</h3>
              <ul className="affiliate-body">
                <li>You have an audience of engaged followers on social media.</li>
                <li>You&apos;re ready to dedicate time to promoting City Jam.</li>
                <li>You attend or organize music events, jam sessions, or open mics.</li>
              </ul>
              <a href="#signup-individual" className="affiliate-btn-ghost affiliate-btn-ghost--blue">
                Apply as individual
              </a>
            </article>

            <article className="affiliate-who-card affiliate-who-card--band">
              <h3 className="affiliate-who-card__title">Band / collective</h3>
              <ul className="affiliate-body">
                <li>You lead or manage a band or musical collective.</li>
                <li>Your group performs regularly or is looking for more performance opportunities.</li>
                <li>You can drive high ticket or membership volume through your fanbase.</li>
              </ul>
              <a href="#signup-band" className="affiliate-btn-ghost affiliate-btn-ghost--purple">
                Apply as a band
              </a>
            </article>
          </div>
        </div>
      </FadeIn>

      <FadeIn
        as="section"
        className="affiliate-section"
        style={{ backgroundColor: "var(--color-bg-dark)", position: "relative" }}
      >
        <div
          className="affiliate-hero__grain"
          style={{ opacity: 0.08 }}
          aria-hidden
        />
        <div className="affiliate-container" style={{ position: "relative" }}>
          <h2 className="affiliate-display affiliate-section-title">Founding affiliates.</h2>

          <div className="affiliate-testimonials">
            <article className="affiliate-card affiliate-testimonial affiliate-card--dark">
              <p className="affiliate-body">
                Be one of our founding affiliates. Shape how City Jam grows from Day 1.
              </p>
            </article>

            {[1, 2].map((slot) => (
              <article key={slot} className="affiliate-card affiliate-testimonial">
                <span className="affiliate-testimonial__quote" aria-hidden>
                  &ldquo;
                </span>
                <p className="affiliate-body" style={{ opacity: 0.7, fontStyle: "italic" }}>
                  Testimonial coming soon.
                </p>
                <div className="affiliate-testimonial__avatar" aria-hidden />
                <p className="affiliate-testimonial__name">Founding affiliate {slot}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn
        as="section"
        id="faq"
        className="affiliate-section"
        style={{ backgroundColor: "var(--color-bg-deep)" }}
      >
        <div className="affiliate-container">
          <h2 className="affiliate-display affiliate-section-title">Common questions.</h2>
          <AffiliateFaq />
        </div>
      </FadeIn>

      <FadeIn as="section" id="signup" className="affiliate-section affiliate-signup-bg">
        <div
          className="affiliate-signup-bg__image"
          style={{ backgroundImage: `url(${STOCK.community})` }}
          aria-hidden
        />
        <div className="affiliate-signup-bg__overlay" aria-hidden />

        <div className="affiliate-container" style={{ position: "relative", zIndex: 1 }}>
          <h2 className="affiliate-display affiliate-section-title">Ready to earn with City Jam?</h2>
          <p className="affiliate-body" style={{ maxWidth: "36rem" }}>
            Join our founding affiliate cohort. Apply before July 22, 2026 and be ready to earn from
            Day 1.
          </p>
          <AffiliateForm />
        </div>
      </FadeIn>

      <footer className="affiliate-footer">
        <div className="affiliate-container">
          <div className="affiliate-footer__inner">
            <Image
              src={BRAND.logo2026Inverted}
              alt="City Jam"
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
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
    </>
  );
}
