import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
