import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";

import "./globals.css";
import GlobalHeader from "@/components/layout/GlobalHeader";
import FloristSocialFooter from "@/components/layout/FloristSocialFooter";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FloristSocial",
  description:
    "A florist marketplace and social commerce platform built with Next.js, Supabase and Stripe Connect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} antialiased`}>
      <ThemeProvider>
        <GlobalHeader />

        <main>{children}</main>

        <FloristSocialFooter />
      </ThemeProvider>
    </body>
    </html>
  );
}
