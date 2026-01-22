"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DecodedLogo from "../DecodedLogo";

const navItems = [
  { id: "home", label: "HOME", href: "/" },
  { id: "artist", label: "ARTIST", href: "/artist" },
  { id: "brand", label: "BRAND", href: "/brand" },
  { id: "explore", label: "EXPLORE", href: "/explore" },
];

export function MainPageHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative w-36 md:w-44 h-14 md:h-16 flex items-center overflow-visible"
            aria-label="Go to home"
          >
            <DecodedLogo
              asciiFontSize={3}
              textFontSize={160}
              planeBaseHeight={10}
              enableWaves={false}
              enableHueRotate={true}
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-xs md:text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
