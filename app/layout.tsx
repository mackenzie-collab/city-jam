import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Courier_Prime, DM_Sans } from "next/font/google";

import "./globals.css";

import LiveConfigBanner from "@/components/LiveConfigBanner";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#5C007A" },
    { media: "(prefers-color-scheme: light)", color: "#5C007A" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://city-jam.vercel.app"),
  title: "City Jam — Make Music Fun Again",
  description:
    "Audio-first, anonymous musician matchmaking. No photos, no follower counts, no algorithms.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "City Jam",
  },
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
      className={`${dmSans.variable} ${bebasNeue.variable} ${courierPrime.variable}`}
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="City Jam" />
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
