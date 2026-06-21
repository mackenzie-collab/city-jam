import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#5C007A",
          "purple-deep": "#3D0052",
          "purple-muted": "#4A0062",
          gold: "#B3A200",
          parchment: "#D0CF88",
          black: "#050508",
        },
        vinyl: {
          black: "var(--vinyl-black)",
          groove: "var(--groove-purple)",
        },
        label: {
          amber: "var(--hinabi-gold)",
          cream: "var(--parchment)",
        },
        wax: {
          burgundy: "var(--royal-purple-deep)",
        },
        signal: {
          teal: "#2ABFAD",
        },
        dust: {
          grey: "var(--royal-purple-muted)",
        },
        "cj-purple": {
          DEFAULT: "rgb(var(--cj-surface-rgb) / <alpha-value>)",
          dark: "rgb(var(--cj-bg-rgb) / <alpha-value>)",
          card: "var(--cj-purple-card)",
          continent: "var(--cj-purple-continent)",
          map: "var(--cj-purple-map)",
        },
        "cj-gold": {
          DEFAULT: "rgb(var(--cj-gold-rgb) / <alpha-value>)",
          bright: "var(--cj-gold-bright)",
          dot: "var(--cj-gold-dot)",
          muted: "var(--cj-gold-muted)",
          border: "var(--cj-gold-border)",
        },
        "cj-dark": "rgb(var(--cj-dark-rgb) / <alpha-value>)",
        "cj-accent": "var(--cj-accent)",
        "cj-on-gold": "var(--cj-on-gold)",
        "cj-card": "var(--cj-card)",
        "cj-bg": "rgb(var(--cj-bg-rgb) / <alpha-value>)",
        "cj-surface": "var(--cj-surface)",
        "cj-surface-elevated": "var(--cj-surface-elevated)",
        "cj-text": "var(--cj-text)",
        "cj-text-bright": "var(--cj-text-bright)",
        "cj-text-muted": "var(--cj-text-muted)",
        "cj-border": "var(--cj-border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "Impact", "sans-serif"],
        headline: ["var(--font-display)", "Bebas Neue", "Impact", "sans-serif"],
        callout: ["var(--font-mono)", "Courier Prime", "Courier New", "monospace"],
        body: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Courier Prime", "Courier New", "monospace"],
        serif: ["var(--font-display)", "Bebas Neue", "Impact", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
        stamp: "0.12em",
        nav: "0.06em",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        ticker: "ticker 20s linear infinite",
        spin: "spin 4s linear infinite",
        "vinyl-spin": "vinyl-spin 20s linear infinite",
        "vinyl-spin-fast": "vinyl-spin 10s linear infinite",
        "needle-drop": "needle-drop 0.8s ease-out forwards",
        "groove-sweep": "groove-sweep 0.4s ease-out forwards",
        "vu-pulse": "vu-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.15)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "vinyl-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "needle-drop": {
          "0%": { transform: "rotate(-30deg) translateY(-8px)", opacity: "0" },
          "60%": { transform: "rotate(2deg) translateY(0)", opacity: "1" },
          "100%": { transform: "rotate(0deg) translateY(0)", opacity: "1" },
        },
        "groove-sweep": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "vu-pulse": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
      boxShadow: {
        emboss: "inset 0 1px 0 rgba(208,207,136,0.15), 0 3px 0 rgba(0,0,0,0.35)",
        "press-collapse": "inset 0 2px 4px rgba(0,0,0,0.5)",
        "lp-lift": "0 12px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(179,162,0,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
