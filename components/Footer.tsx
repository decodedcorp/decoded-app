'use client';

import { useState } from 'react';
import { pretendardRegular, pretendardMedium } from '@/lib/constants/fonts';
import { cn } from '@/lib/utils/style';
import { Github, Mail, Twitter, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useLocaleContext } from '@/lib/contexts/locale-context';

function Footer() {
  const { t } = useLocaleContext();
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  return (
    <footer className="w-full border-t border-white/5 bg-black/30 backdrop-blur-lg">
      <div className="container mx-auto py-4 sm:py-8 lg:py-12 px-3 sm:px-4">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="space-y-2 col-span-2 md:col-span-1">
            <h2
              className={cn(
                pretendardMedium.className,
                'text-[#EAFD66] text-base sm:text-lg lg:text-xl'
              )}
            >
              DECODED
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md">
              {t.footer.company.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h3
              className={cn(
                pretendardMedium.className,
                'text-white text-sm sm:text-base'
              )}
            >
              {t.footer.quickLinks.title}
            </h3>
            <nav className="grid grid-cols-2 md:flex md:flex-col gap-1 md:space-y-1.5">
              {Object.values(t.footer.quickLinks.items).map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-zinc-400 hover:text-[#EAFD66] text-xs sm:text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="space-y-2">
            <h3
              className={cn(
                pretendardMedium.className,
                'text-white text-sm sm:text-base'
              )}
            >
              Connect with us
            </h3>
            <div className="flex items-center -ml-1">
              <Link
                href="#"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors p-1.5"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="#"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors p-1.5"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <Link
                href="mailto:decodedapp@gmail.com"
                className="text-zinc-400 hover:text-[#EAFD66] transition-colors p-1.5"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - 모바일에서 아코디언 형태 */}
        <div
          className={cn(
            pretendardRegular.className,
            'pt-4 border-t border-white/5 text-xs lg:text-sm text-zinc-500'
          )}
        >
          {/* 모바일용 아코디언 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsLegalOpen(!isLegalOpen)}
              className="w-full flex items-center justify-between py-2"
            >
              <span>법적 정보</span>
              {isLegalOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isLegalOpen && (
              <div className="space-y-2 py-2">
                {/* <p className="text-xs">{t.footer.legal.businessInfo.registration}</p>
                <p className="text-xs">{t.footer.legal.businessInfo.contact}</p> */}
              </div>
            )}
          </div>

          {/* 데스크톱용 정보 표시 */}
          {/* <div className="hidden md:flex md:flex-col md:space-y-1 md:mb-2">
            <p className="text-xs">{t.footer.legal.businessInfo.registration}</p>
            <p className="text-xs">{t.footer.legal.businessInfo.contact}</p>
          </div> */}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-6 mt-2 md:mt-0">
            <div className="flex items-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-xs hover:text-[#EAFD66] transition-colors"
              >
                {t.footer.legal.links.privacy}
              </Link>
              <Link
                href="/terms-of-service"
                className="text-xs hover:text-[#EAFD66] transition-colors"
              >
                {t.footer.legal.links.terms}
              </Link>
            </div>
            <p className="text-xs mt-2 sm:mt-0">{t.footer.legal.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
