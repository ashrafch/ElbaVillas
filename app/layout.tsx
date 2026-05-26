import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://elba-villas.vercel.app"),
  applicationName: "Elba Luce Villas",
  title: {
    default: "Elba Luce Villas | Ville contemporanee all'Isola d'Elba",
    template: "%s | Elba Luce Villas",
  },
  description:
    "Un progetto residenziale esclusivo all'Isola d'Elba: ville contemporanee tra mare, pietra e macchia mediterranea.",
  openGraph: {
    title: "Elba Luce Villas",
    description:
      "Residenze contemporanee tra mare, pietra e macchia mediterranea.",
    type: "website",
    locale: "it_IT",
    siteName: "Elba Luce Villas",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Elba Luce Villas - residenze contemporanee all'Isola d'Elba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elba Luce Villas",
    description: "Ville contemporanee tra mare, pietra e macchia mediterranea.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
