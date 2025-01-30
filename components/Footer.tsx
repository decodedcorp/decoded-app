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
    <footer className="border-t border-white/5 bg-black/30 backdrop-blur-lg mt-10">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h2
              className={cn(
                pretendardMedium.className,
                "text-[#EAFD66] text-lg"
              )}
            >
              DECODED
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              {t.footer.company.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={cn(pretendardMedium.className, "text-white text-sm")}
            >
              {t.footer.quickLinks.title}
            </h3>
            <nav className="flex flex-col space-y-3">
              {Object.values(t.footer.quickLinks.items).map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-zinc-400 hover:text-[#EAFD66] text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3
              className={cn(pretendardMedium.className, "text-white text-sm")}
            >
              Connect with us
            </h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:decodedapp@gmail.com"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={cn(
            pretendardRegular.className,
            "pt-8 border-t border-white/5 text-xs text-zinc-500 space-y-4"
          )}
        >
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="space-y-2">
              <p>{t.footer.legal.businessInfo.address}</p>
              <p>{t.footer.legal.businessInfo.registration}</p>
              <p>{t.footer.legal.businessInfo.contact}</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-[#EAFD66] transition-colors">
                {t.footer.legal.links.privacy}
              </Link>
              <Link href="#" className="hover:text-[#EAFD66] transition-colors">
                {t.footer.legal.links.terms}
              </Link>
            </div>
          </div>
          <p className="text-center md:text-left">{t.footer.legal.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
