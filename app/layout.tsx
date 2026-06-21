import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { club } from "@/data/club";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${club.name} — ${club.tagline}`,
  description:
    "Soleanna Run Club is a Jersey-based community run club. Track Tuesdays every week, monthly events, 5Ks, collabs, and more. Building a community of winners.",
  openGraph: {
    title: club.name,
    description: club.tagline,
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
