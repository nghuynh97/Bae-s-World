"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoText } from "./logo-text";

interface TopNavProps {
  isAuthenticated?: boolean;
  userName?: string;
  userMenu?: React.ReactNode;
}

export function TopNav({
  isAuthenticated = false,
  userName,
  userMenu,
}: TopNavProps) {
  const pathname = usePathname();

  const publicLinks = [
    { href: "/", label: "Portfolio" },
    { href: "/about", label: "About" },
  ];

  const authLinks = [
    { href: "/", label: "Portfolio" },
    { href: "/beauty", label: "Beauty" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "About" },
  ];

  const links = isAuthenticated ? authLinks : publicLinks;

  return (
    <nav className="hidden md:flex h-16 w-full bg-surface shadow-sm">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-8">
        <Link href="/">
          <LogoText size="sm" />
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-normal transition-colors relative pb-1 ${
                  isActive
                    ? "text-text-primary border-b-2 border-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {!isAuthenticated ? (
            <Link
              href="/login"
              className="text-sm font-bold uppercase tracking-wider bg-accent text-text-primary px-4 py-2 rounded-[10px] hover:bg-accent-hover transition-colors"
            >
              Sign In
            </Link>
          ) : userMenu ? (
            userMenu
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-text-primary">
              {userName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
