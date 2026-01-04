import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SkyAuthor Labs | Premium Tech Insights & Viral News",
    template: "%s | SkyAuthor Labs",
  },
  description: "Premium tech insights, viral news, and the future of digital content. Your source for cutting-edge technology coverage in 2026.",
  keywords: ["tech news", "technology", "AI", "programming", "web development", "startup", "innovation"],
  authors: [{ name: "SkyAuthor Labs" }],
  creator: "SkyAuthor Labs",
  publisher: "SkyAuthor Labs",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skyauthor.labs"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SkyAuthor Labs",
    title: "SkyAuthor Labs | Premium Tech Insights",
    description: "Premium tech insights, viral news, and the future of digital content.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SkyAuthor Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyAuthor Labs",
    description: "Premium tech insights & viral news",
    images: ["/og-image.png"],
    creator: "@skyauthorlabs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="SkyAuthor Labs RSS Feed" href="/feed.xml" />
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
