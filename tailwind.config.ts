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
        "cj-purple": {
          DEFAULT: "#5A0090",
          dark: "#3D0066",
          card: "#1A0030",
          continent: "#2A0050",
          map: "#0A0010",
        },
        "cj-gold": {
          DEFAULT: "#C9A800",
          bright: "#D4A017",
          dot: "#D4A000",
          muted: "rgba(201, 168, 0, 0.6)",
          border: "rgba(201, 168, 0, 0.3)",
        },
        "cj-dark": "#0D0D0D",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Bebas Neue", "Anton", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "Space Grotesk", "sans-serif"],
        typewriter: ["var(--font-typewriter)", "Special Elite", "Courier New", "monospace"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        ticker: "ticker 20s linear infinite",
        spin: "spin 4s linear infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
