import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "@/components/AnalyticsScripts";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://howmanyofme.co"),
  title: {
    default: "How Many People Have My Name? Check Instantly 🌍",
    template: "%s | HowManyOfMe",
  },
  description:
    "How many people have your name? Check instantly using 100M+ global records. See rarity, popularity & origin in seconds. Free, no signup needed.",
  authors: [{ name: "Ziven Borceg", url: "https://medium.com/@zivenborceg" }],
  verification: {
    google: "mu13LHCJdzcQGEj69hBuFNH0G3tiqwMOlqWlEpe4Afc",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HowManyOfMe",
    images: [
      {
        url: "/og-image.webp",
        width: 1024,
        height: 1024,
        alt: "HowManyOfMe — How Many People Have My Name?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
        <AnalyticsScripts />
      </body>
    </html>
  );
}
