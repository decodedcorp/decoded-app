import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import {
  ConditionalNav,
  MainContentWrapper,
} from "@/lib/components/ConditionalNav";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Decoded App",
  description: "Decoded application",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-sans`}
        suppressHydrationWarning
      >
        <AppProviders>
          {/* Conditional Navigation (Sidebar + MobileNav) */}
          <ConditionalNav />

          {/* Main Content Area - conditionally offset by sidebar width */}
          <MainContentWrapper>
            {children}
            {modal}
          </MainContentWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
