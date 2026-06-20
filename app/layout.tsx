import {
  Instrument_Serif,
  Barlow_Condensed,
  Inter,
  JetBrains_Mono,
  Special_Elite,
} from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import LiveConfigBanner from "@/components/LiveConfigBanner";
import Providers from "@/components/Providers";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-headline",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-typewriter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1E0B2C",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${instrumentSerif.variable} ${barlowCondensed.variable} ${inter.variable} ${jetbrainsMono.variable} ${specialElite.variable}`}
      >
        <Providers>
          <LiveConfigBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
