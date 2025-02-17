"use client";

import { useState } from "react";
import { pretendardRegular, pretendardMedium } from "@/lib/constants/fonts";
import { cn } from "@/lib/utils/style";
import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useLocaleContext } from "@/lib/contexts/locale-context";

function Footer() {
  const { t } = useLocaleContext();
  return (
    <footer className="w-full border-t border-white/5 bg-black/30 backdrop-blur-lg">
      <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className={cn(pretendardMedium.className, "text-[#EAFD66] text-xl lg:text-2xl")}>
              DECODED
            </h2>
            <p className="text-zinc-400 text-sm lg:text-base leading-relaxed max-w-md">
              {t.footer.company.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={cn(pretendardMedium.className, "text-white text-base lg:text-lg")}>
              {t.footer.quickLinks.title}
            </h3>
            <nav className="flex flex-col space-y-2.5">
              {Object.values(t.footer.quickLinks.items).map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-zinc-400 hover:text-[#EAFD66] text-sm lg:text-base transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className={cn(pretendardMedium.className, "text-white text-base lg:text-lg")}>
              Connect with us
            </h3>
            <div className="flex items-center -ml-2">
              <Link
                href="#"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors p-2"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors p-2"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:decodedapp@gmail.com"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors p-2"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={cn(
          pretendardRegular.className,
          "pt-8 border-t border-white/5 text-xs lg:text-sm text-zinc-500"
        )}>
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div className="space-y-2 sm:space-y-1.5">
              <p>{t.footer.legal.businessInfo.address}</p>
              <p>{t.footer.legal.businessInfo.registration}</p>
              <p>{t.footer.legal.businessInfo.contact}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <Link
                href="/privacy-policy"
                className="hover:text-[#EAFD66] transition-colors"
              >
                {t.footer.legal.links.privacy}
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-[#EAFD66] transition-colors"
              >
                {t.footer.legal.links.terms}
              </Link>
            </div>
          </div>
          <p className="text-center sm:text-left mt-6">{t.footer.legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
