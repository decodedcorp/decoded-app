"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocaleContext } from "@/lib/contexts/locale-context";
import LogoPng from "@/styles/logos/LogoPng";
import {
  pretendardBold,
  pretendardRegular,
  pretendardSemiBold,
} from "@/lib/constants/fonts";
import { cn } from "@/lib/utils/style";

function Footer() {
  const { t } = useLocaleContext();
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLogoVisible(true);
          observer.disconnect(); // 한 번 나타나면 관찰 중단
        }
      },
      {
        threshold: 0.1, // 10% 정도 보이면 트리거
        rootMargin: "50px", // 뷰포트 하단에서 50px 위에서 트리거
      }
    );

    if (logoRef.current) {
      observer.observe(logoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const legalLinks = [
    { label: t.footer.legal.links.privacy, href: "/privacy-policy" },
    { label: t.footer.legal.links.terms, href: "/terms-of-service" },
  ];

  // TODO: Add `request`
  // TODO: Add `search`
  const quickLinks = [{ label: t.footer.quickLinks.items.home, href: "/" }];

  const supportLinks = [
    {
      label: t.footer.communication.items.telegram,
      href: process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL,
    },
  ];

  const socialLinks = ["Youtube", "Instagram", "Youtube", "Instagram"];

  return (
    <footer className="w-full bg-black text-white/80 overflow-hidden">
      <div className="mx-auto py-12">
        {/* Top Section with Navigation */}
        <div className="container mx-auto md:px-8">
          <div className="flex flex-col sm:flex-row lg:justify-between gap-8 text-gray-600 mb-16 sm:mb-28">
            {/* Description */}
            <div className="w-full lg:max-w-xl">
              <h3
                className={`text-sm mb-4 text-gray-500 ${pretendardSemiBold.className}`}
              >
                ABOUT US
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                {t.footer.company.description}
              </p>
            </div>

            {/* Navigation Links Grid */}
            <div className="grid grid-cols-3 gap-8 lg:gap-16">
              {/* Quick Links */}
              <div className="flex flex-col">
                <h3
                  className={`text-sm mb-4 text-gray-500 ${pretendardSemiBold.className}`}
                >
                  {t.footer.quickLinks.title}
                </h3>
                <div className="grid grid-cols-1 gap-y-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-xs sm:text-sm hover:text-[#EAFD66] transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support Link */}
              <div className="flex flex-col">
                <h3
                  className={`text-sm mb-4 text-gray-500 ${pretendardSemiBold.className}`}
                >
                  {t.footer.communication.title}
                </h3>
                <div className="grid grid-cols-1 gap-y-2">
                  {supportLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href ?? ""}
                      className="text-xs sm:text-sm hover:text-[#EAFD66] transition-colors whitespace-nowrap"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex flex-col">
                <h3
                  className={`text-sm mb-4 text-gray-500 ${pretendardSemiBold.className}`}
                >
                  LEGAL
                </h3>
                <div className="grid grid-cols-1 gap-y-2">
                  {legalLinks.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-xs sm:text-sm hover:text-[#EAFD66] transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stay in Touch Section */}
        <div className="flex flex-col mb-16 justify-center">
          <h3
            className={`flex justify-center text-md mb-2 text-gray-600 ${pretendardSemiBold.className}`}
          >
            STAY IN TOUCH
          </h3>
          <div className="relative overflow-hidden text-gray-800">
            <div
              className={`flex whitespace-nowrap animate-marquee-infinite font-extrabold`}
            >
              {socialLinks.map((item, index) => (
                <Link
                  key={`first-${index}`}
                  href="#"
                  className="text-4xl md:text-6xl px-4 hover:text-[#EAFD66] transition-colors"
                >
                  {item}
                </Link>
              ))}
              {socialLinks.map((item, index) => (
                <Link
                  key={`second-${index}`}
                  href="#"
                  className="text-4xl md:text-6xl px-4 hover:text-[#EAFD66] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div
          ref={logoRef}
          className={cn(
            "mt-40 flex justify-center",
            isLogoVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <Link href="/">
            <LogoPng width={1000} height={28} className="object-contain mb-2" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
