import "../styles/globals.css";
import { headers } from "next/headers";
import { HeaderLayout } from "@/components/Header/HeaderLayout";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { Locale } from "@/lib/lang/locales";
import { Metadata } from "next";
import { koMetadata, enMetadata } from "./metadata";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "ko";

  return locale === "ko" ? koMetadata : enMetadata;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";

  return (
    <html lang={locale}>
      <body className="flex flex-col min-h-screen">
        <Providers locale={locale as Locale}>
          <HeaderLayout />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
