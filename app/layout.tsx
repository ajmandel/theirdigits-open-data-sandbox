import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "theirdigits.com";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "theirdigits — Ask a better question of open data";
  const description = "An AI-guided sandbox for discovering, combining, and learning from openly licensed US and European datasets.";

  return {
    metadataBase: new URL(origin),
    title,
    description,
    alternates: { canonical: "https://theirdigits.com" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://theirdigits.com",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "Ask a better question of open data." }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${origin}/og.png`] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
