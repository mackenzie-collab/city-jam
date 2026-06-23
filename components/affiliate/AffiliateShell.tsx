import { Anton, Barlow_Condensed, Inter, Space_Mono } from "next/font/google";

import "@/app/affiliate/affiliate.css";
import { cn } from "@/lib/utils";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-affiliate-display",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-affiliate-condensed",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-affiliate-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-affiliate-body",
  display: "swap",
});

export const affiliateFontClassName = `${anton.variable} ${barlowCondensed.variable} ${spaceMono.variable} ${inter.variable}`;

export default function AffiliateShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(affiliateFontClassName, "affiliate-page", className)} data-theme="dark">
      {children}
    </div>
  );
}
