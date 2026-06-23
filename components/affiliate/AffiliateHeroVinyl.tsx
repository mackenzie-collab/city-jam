"use client";

const GROOVES = [0.96, 0.9, 0.84, 0.78, 0.72, 0.66, 0.6, 0.54, 0.48, 0.42, 0.36, 0.3];

export default function AffiliateHeroVinyl() {
  return (
    <div className="affiliate-hero-vinyl" aria-hidden>
      <div className="affiliate-hero-vinyl__disc">
        <svg viewBox="0 0 400 400" className="affiliate-hero-vinyl__svg">
          <defs>
            <radialGradient id="affiliate-vinyl-fill" cx="34%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3d0052" />
              <stop offset="45%" stopColor="#1a0024" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </radialGradient>
            <radialGradient id="affiliate-vinyl-shine" cx="28%" cy="22%" r="45%">
              <stop offset="0%" stopColor="rgba(208, 207, 136, 0.14)" />
              <stop offset="100%" stopColor="rgba(208, 207, 136, 0)" />
            </radialGradient>
            <linearGradient id="affiliate-label-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5c007a" />
              <stop offset="100%" stopColor="#2d003e" />
            </linearGradient>
          </defs>

          <circle cx="200" cy="200" r="198" fill="url(#affiliate-vinyl-fill)" />
          <circle
            cx="200"
            cy="200"
            r="198"
            fill="url(#affiliate-vinyl-shine)"
          />
          <circle
            cx="200"
            cy="200"
            r="197"
            fill="none"
            stroke="#b3a200"
            strokeWidth="1.5"
            opacity="0.55"
          />

          {GROOVES.map((scale) => (
            <circle
              key={scale}
              cx="200"
              cy="200"
              r={198 * scale}
              fill="none"
              stroke="rgba(208, 207, 136, 0.07)"
              strokeWidth={scale > 0.5 ? 0.75 : 0.5}
            />
          ))}

          <circle cx="200" cy="200" r="112" fill="url(#affiliate-label-fill)" />
          <circle
            cx="200"
            cy="200"
            r="112"
            fill="none"
            stroke="#b3a200"
            strokeWidth="1"
            opacity="0.65"
          />
          <circle cx="200" cy="200" r="104" fill="none" stroke="rgba(10, 10, 10, 0.35)" strokeWidth="8" />

          <text
            x="200"
            y="178"
            textAnchor="middle"
            fill="#d0cf88"
            fontFamily="var(--font-affiliate-display), Anton, sans-serif"
            fontSize="28"
            letterSpacing="4"
          >
            CITY JAM
          </text>
          <text
            x="200"
            y="208"
            textAnchor="middle"
            fill="#b3a200"
            fontFamily="var(--font-affiliate-mono), monospace"
            fontSize="11"
            letterSpacing="3"
          >
            AFFILIATE
          </text>
          <text
            x="200"
            y="232"
            textAnchor="middle"
            fill="rgba(208, 207, 136, 0.72)"
            fontFamily="var(--font-affiliate-mono), monospace"
            fontSize="10"
            letterSpacing="2"
          >
            WAITLIST 2026
          </text>

          <circle cx="200" cy="200" r="10" fill="#0a0a0a" stroke="#b3a200" strokeWidth="1" opacity="0.9" />
          <circle cx="200" cy="200" r="3" fill="#d0cf88" opacity="0.85" />
        </svg>
      </div>
      <div className="affiliate-hero-vinyl__sleeve" />
    </div>
  );
}
