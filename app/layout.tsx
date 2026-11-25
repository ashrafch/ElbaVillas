import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  variable: "--font-heading",
  weight: "400 700",
  adjustFontFallback: "Times New Roman",
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
