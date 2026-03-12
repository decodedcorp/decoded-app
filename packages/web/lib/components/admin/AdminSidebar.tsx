"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  LayoutDashboard,
  ScanSearch,
  DollarSign,
  GitBranch,
  Server,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard, exact: true },
  { href: "/admin/magazines", label: "매거진", icon: BookOpen },
  { href: "/admin/ai-audit", label: "AI 감사", icon: ScanSearch },
  { href: "/admin/ai-cost", label: "AI 비용", icon: DollarSign },
  { href: "/admin/pipeline-logs", label: "파이프라인 로그", icon: GitBranch },
  { href: "/admin/server-logs", label: "서버 로그", icon: Server },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminName: string;
}

/**
 * AdminSidebar - Sidebar for admin navigation (design system tokens)
 *
 * Width: 220px (compact, maximizes content area)
 * Theme: Uses sidebar semantic tokens (bg-sidebar, border-sidebar-border, etc.)
 * Features: Active route detection, logout, back-to-app link
 */
export function AdminSidebar({
  isOpen,
  onClose,
  adminName,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  function isActive(item: NavItem): boolean {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  }

  function handleLogout() {
    logout();
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[220px] bg-sidebar text-sidebar-foreground flex flex-col z-50",
          "transition-transform duration-200 ease-in-out",
          // Mobile: hidden by default, shown when open
          // Desktop: always visible
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo / Title area */}
        <div className="px-4 py-5 border-b border-sidebar-border flex-shrink-0">
          <p className="text-sm font-semibold text-sidebar-foreground tracking-wide mb-2">
            디코디드 관리자
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-sidebar-accent-foreground hover:text-sidebar-foreground transition-colors"
            onClick={onClose}
          >
            <ArrowLeft className="w-3 h-3" />
            앱으로 돌아가기
          </Link>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 py-4 overflow-y-auto"
          aria-label="관리자 네비게이션"
        >
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                      "border-l-2",
                      active
                        ? "bg-sidebar-accent text-sidebar-foreground border-sidebar-accent-foreground font-medium hover:border-primary"
                        : "text-sidebar-foreground/70 border-transparent hover:bg-sidebar-accent hover:text-sidebar-foreground hover:border-primary"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom: User + Logout */}
        <div className="px-4 py-4 border-t border-sidebar-border flex-shrink-0">
          <p className="text-xs text-sidebar-accent-foreground mb-2 truncate" title={adminName}>
            {adminName}
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-sidebar-accent-foreground hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}
