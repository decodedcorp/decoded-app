"use client";
import { useState } from "react";
import { pretendardRegular, pretendardMedium } from "@/lib/constants/fonts";
import { cn } from "@/lib/utils/style";
import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";

function Footer() {
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
              실시간 아이템 검색 플랫폼을 통해 새로운 커뮤니티 경험을
              제공합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3
              className={cn(pretendardMedium.className, "text-white text-sm")}
            >
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              {["About", "Features", "Community", "Support"].map((item) => (
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
              <p>서울시 강남구 도산대로 156(논현동) | 대표자: 디코디드</p>
              <p>
                사업자등록번호: 123-45-67890 | 통신판매업신고번호:
                2024-서울강남-0000
              </p>
              <p>이메일: decodedapp@gmail.com | 전화번호: 02-1234-5678</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-[#EAFD66] transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-[#EAFD66] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
          <p className="text-center md:text-left">
            © 2024 Decoded Limited. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
