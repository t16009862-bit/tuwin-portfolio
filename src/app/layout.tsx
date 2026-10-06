import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MusicPlayer from "./components/MusicPlayer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tuwinh.com"),
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  title: "Tuwin Herath | Professional Squash Athlete & WSF Level 1 Coach",
  description: "Official portfolio of Tuwin Herath, world-ranked squash player (PSA No. 316) representing Sri Lanka. High performance athlete, WSF coach, and Deshabandu award recipient.",
  keywords: [
    "Tuwin Herath",
    "Tuwin Herath",
    "Squash",
    "Professional Squash Athlete",
    "PSA World Tour",
    "Sri Lanka Squash",
    "WSF Level 1 Coach",
    "Squash Coach Shanghai",
    "Deshabandu Award",
    "Sports Management"
  ],
  authors: [{ name: "Tuwin Herath" }],
  creator: "Tuwin Herath",
  openGraph: {
    title: "Tuwin Herath | Professional Squash Athlete & WSF Level 1 Coach",
    description: "Official portfolio of Tuwin Herath, world-ranked squash player representing Sri Lanka. High performance athlete and certified WSF Coach.",
    url: "https://tuwinh.com",
    siteName: "Tuwin Herath Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuwin Herath | Professional Squash Athlete & WSF Level 1 Coach",
    description: "Official portfolio of Tuwin Herath, world-ranked squash player representing Sri Lanka.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <MusicPlayer />
        <ScrollToTopButton />
      </body>
    </html>
  );
}
