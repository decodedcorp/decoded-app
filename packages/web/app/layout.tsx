import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { MobileNavBar } from "@/lib/components/MobileNavBar";
import { Sidebar } from "@/lib/components/Sidebar";

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
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content Area - offset by sidebar width on desktop */}
          <div className="md:ml-[60px] lg:ml-[240px] min-h-screen transition-[margin] duration-300">
            {children}
            {modal}
          </div>

          {/* Mobile Bottom Nav */}
          <MobileNavBar />
        </AppProviders>
      </body>
    </html>
  );
}
