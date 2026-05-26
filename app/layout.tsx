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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://elba-luce-villas.vercel.app"),
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
    images: ["/images/hero/elba-villas-hero.svg"],
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
