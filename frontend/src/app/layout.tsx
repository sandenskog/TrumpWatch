import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trump Watch — Counting Down Democracy's Wildest Ride",
  description:
    "Daily satirical dashboard tracking the Trump presidency. Scare-O-Meters, countdowns, and the craziest headlines from 60+ sources.",
  openGraph: {
    title: "Trump Watch",
    description: "Counting down democracy's wildest ride. Updated daily.",
    type: "website",
    url: "https://trumpwatch.live",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sourceSerif.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
