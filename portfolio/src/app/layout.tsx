import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { GlassmorphismBackground } from "@/components/ui/glassmorphism-background";
import { HomePageJsonLd } from "@/components/seo/json-ld";
import { aboutData } from "@/data/about";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${aboutData.name} - ${aboutData.title}`,
    template: `%s | ${aboutData.name}`,
  },
  description: `Portfolio of ${aboutData.name}, ${aboutData.title} specializing in cross-platform mobile applications. ${aboutData.tagline}`,
  keywords: [
    "Flutter Developer",
    "Mobile App Developer",
    "Dart",
    "iOS",
    "Android",
    "Cross-platform",
    "Flutter",
    "Mobile Development",
    "App Development",
    aboutData.name,
  ],
  authors: [{ name: aboutData.name }],
  creator: aboutData.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: `${aboutData.name} Portfolio`,
    title: `${aboutData.name} - ${aboutData.title}`,
    description: `Portfolio of ${aboutData.name}, ${aboutData.title} specializing in cross-platform mobile applications.`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${aboutData.name} - ${aboutData.title} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${aboutData.name} - ${aboutData.title}`,
    description: `Portfolio of ${aboutData.name}, ${aboutData.title} specializing in cross-platform mobile applications.`,
    images: ["/og-image.jpg"],
    creator: "@alexchen_dev",

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
    google: process.env.GOOGLE_SITE_VERIFICATION,
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
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <HomePageJsonLd />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="portfolio-theme"
        >
          {/* Glassmorphism background - only renders when mode is active */}
          {/* Requirements: 2.4 */}
          <GlassmorphismBackground />
          {/* Skip to main content link for keyboard/screen reader users */}
          {/* Requirements: 11.1, 11.2 */}
          <a
            href="#main-content"
            className="skip-link sr-only focus:not-sr-only"
          >
            Skip to main content
          </a>
          <Header />
          {children}
        </ThemeProvider>
        {/* Vercel Analytics - Requirements: 21.1 */}
        <Analytics />
      </body>
    </html>
  );
}
