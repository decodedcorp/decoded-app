import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import AppContextProvider from "@/components/hooks/context";

export const metadata: Metadata = {
  title: "BrandBySam",
  description: "Powered by Segment Anything by Meta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppContextProvider>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </AppContextProvider>
  );
}
