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
  title: "City Jam — Make Music Fun Again",
  description:
    "Audio-first, anonymous musician matchmaking. No photos, no follower counts, no algorithms.",
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
