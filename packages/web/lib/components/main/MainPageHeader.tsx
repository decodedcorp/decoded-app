"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "home", label: "HOME", href: "/" },
  { id: "artist", label: "ARTIST", href: "/artist" },
  { id: "brand", label: "BRAND", href: "/brand" },
  { id: "explore", label: "EXPLORE", href: "/explore" },
];

export function MainPageHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <nav className="flex items-center justify-center gap-8 md:gap-12 h-14 md:h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm md:text-base font-medium tracking-wide transition-colors ${
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
    </header>
  );
}
