"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ListChecks,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useKeyboardShortcuts } from "@/lib/useKeyboardShortcuts";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const primaryNav: NavItem[] = [
  {
    label: "Companies",
    href: "/companies",
    icon: <Building2 size={18} />,
  },
  {
    label: "Lists",
    href: "/lists",
    icon: <ListChecks size={18} />,
  },
  {
    label: "Saved",
    href: "/saved",
    icon: <Bookmark size={18} />,
  },
];

const secondaryNav: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings size={18} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useKeyboardShortcuts();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close mobile sidebar on route change
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Listen for toggle-sidebar event from TopBar hamburger
  const handleToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, [handleToggle]);

  // Close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="sidebar"
        className={`
          fixed top-0 left-0 z-50 h-screen flex flex-col
          bg-[var(--scout-bg-primary)] border-r border-[var(--scout-border)]
          transition-all duration-300 ease-in-out
          ${/* Mobile: slide in/out */""}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "md:w-[68px]" : "md:w-[240px]"}
          w-[260px]
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--scout-border)]">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-teal)]/10 flex-shrink-0">
              <Zap size={18} className="text-[var(--scout-accent-teal)]" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-[var(--scout-text-heading)] whitespace-nowrap fade-in">
                SignalPath
              </span>
            )}
          </Link>
          {/* Desktop collapse toggle */}
          <button
            id="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1 rounded-md text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-[var(--scout-border-light)] transition-scout"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 rounded-md text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-[var(--scout-border-light)] transition-scout"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className={`mb-3 ${collapsed ? "md:hidden" : ""}`}>
            <span className="text-meta px-3">Discovery</span>
          </div>
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.label.toLowerCase()}`}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-scout relative
                  ${
                    active
                      ? "bg-[var(--scout-accent-teal)]/8 text-[var(--scout-accent-teal)]"
                      : "text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.03]"
                  }
                `}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--scout-accent-teal)]" />
                )}
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`text-sm font-medium whitespace-nowrap fade-in ${collapsed ? "md:hidden" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Secondary Nav */}
        <div className="px-3 py-4 border-t border-[var(--scout-border)] space-y-1">
          {secondaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.label.toLowerCase()}`}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-scout
                  ${
                    active
                      ? "bg-[var(--scout-accent-teal)]/8 text-[var(--scout-accent-teal)]"
                      : "text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.03]"
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`text-sm font-medium whitespace-nowrap fade-in ${collapsed ? "md:hidden" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
