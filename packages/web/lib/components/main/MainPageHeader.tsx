"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, HelpCircle } from "lucide-react";
import DecodedLogo from "../DecodedLogo";
import { RequestModal } from "../request/RequestModal";

const navItems = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "explore", label: "Explore", href: "/explore", icon: Compass },
  { id: "search", label: "Search", href: "/feed", icon: Search },
  { id: "request", label: "Request", href: "#", icon: HelpCircle, isAction: true },
];

export function MainPageHeader() {
  const pathname = usePathname();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const handleRequestModalOpen = useCallback(() => {
    setIsRequestModalOpen(true);
  }, []);

  const handleRequestModalClose = useCallback(() => {
    setIsRequestModalOpen(false);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
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
            <nav className="flex items-center gap-1 md:gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                if (item.isAction) {
                  return (
                    <button
                      key={item.id}
                      onClick={handleRequestModalOpen}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    >
                      <Icon className="h-5 w-5 stroke-[1.5]" />
                      <span className="hidden md:block text-sm font-medium">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-accent/80 text-foreground"
                        : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isActive ? "stroke-[2]" : "stroke-[1.5]"}`}
                    />
                    <span className="hidden md:block text-sm font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Request Modal */}
      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={handleRequestModalClose}
      />
    </>
  );
}
