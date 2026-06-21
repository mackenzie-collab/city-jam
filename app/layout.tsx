import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Instrument_Serif, Inter } from "next/font/google";

import "./globals.css";

import LiveConfigBanner from "@/components/LiveConfigBanner";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-headline",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0A0F",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://city-jam.vercel.app"),
  title: "City Jam — Make Music Fun Again",
  description:
    "Audio-first, anonymous musician matchmaking. No photos, no follower counts, no algorithms.",
  icons: {
    icon: "/brand/city-jam-logo.png",
    apple: "/brand/city-jam-logo.png",
  },
  openGraph: {
    title: "City Jam — Make Music Fun Again",
    description:
      "Audio-first, anonymous musician matchmaking. No photos, no follower counts, no algorithms.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "City Jam" }],
  },
};

const themeInitScript = `(function(){try{var k='cj-theme',s=localStorage.getItem(k),t=s==='light'||s==='dark'?s:window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${barlowCondensed.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body">
        <Providers>
          <LiveConfigBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
