import { Bebas_Neue, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import LiveConfigBanner from "@/components/LiveConfigBanner";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://city-jam.vercel.app"),
  title: "City Jam — Make Music Fun Again",
  description:
    "Audio-first, anonymous musician matchmaking. No photos, no follower counts, no algorithms.",
  icons: {
    icon: "/icons/30_jam_session_match.png",
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
    <html lang="en">
      <body className={`${bebasNeue.variable} ${inter.variable}`}>
        <LiveConfigBanner />
        {children}
      </body>
    </html>
  );
}
