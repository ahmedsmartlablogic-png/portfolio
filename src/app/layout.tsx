import type { Metadata } from "next";
import { Special_Elite, Courier_Prime, Oswald } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: "400",
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CASE FILE No. 026 — AHMED · Full Stack Developer",
  description:
    "An open investigation into Ahmed: Full Stack Developer with ~6 years of shipped Laravel, React, Next.js and Node.js applications. Open the dossiers, trace the red string, and stamp your way into the case.",
  keywords: [
    "Ahmed",
    "Full Stack Developer",
    "Laravel",
    "React",
    "Next.js",
    "Node.js",
    "Portfolio",
    "Karachi",
  ],
  authors: [{ name: "Ahmed" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${specialElite.variable} ${courierPrime.variable} ${oswald.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
