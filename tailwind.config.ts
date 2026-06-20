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
        vinyl: {
          black: "#0D0A0F",
          groove: "#1E0B2C",
        },
        label: {
          amber: "#C9962A",
          cream: "#F5EDD6",
        },
        wax: {
          burgundy: "#5C1F2E",
        },
        signal: {
          teal: "#2ABFAD",
        },
        dust: {
          grey: "#3A3340",
        },
        "cj-purple": {
          DEFAULT: "#1E0B2C",
          dark: "#1E0B2C",
          card: "#1E0B2C",
          continent: "#3A3340",
          map: "#0D0A0F",
        },
        "cj-gold": {
          DEFAULT: "#C9962A",
          bright: "#D4A84A",
          dot: "#C9962A",
          muted: "rgba(245, 237, 214, 0.6)",
          border: "rgba(201, 150, 42, 0.3)",
        },
        "cj-dark": "#0D0A0F",
      },
      fontFamily: {
        display: ["var(--font-headline)", "Barlow Condensed", "sans-serif"],
        headline: ["var(--font-headline)", "Barlow Condensed", "sans-serif"],
        serif: ["var(--font-display)", "Instrument Serif", "Playfair Display", "serif"],
        body: ["var(--font-inter)", "Inter", "DM Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        typewriter: ["var(--font-typewriter)", "Special Elite", "Courier New", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
        nav: "0.15em",
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
        emboss: "inset 0 1px 0 rgba(245,237,214,0.25), 0 3px 0 rgba(0,0,0,0.35)",
        "press-collapse": "inset 0 2px 4px rgba(0,0,0,0.5)",
        "lp-lift": "0 12px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(201,150,42,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
