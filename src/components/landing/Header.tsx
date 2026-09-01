"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { IoIosHeart, IoIosSearch, IoMdPerson } from "react-icons/io";
import HeaderCart from "@/components/cart/HeaderCart";
import HeaderSearch from "@/components/landing/HeaderSearch";
import MobileNavDrawer from "@/components/landing/MobileNavDrawer";
import CeloriaLogo from "@/components/ui/CeloriaLogo";
import type { NavLink } from "@/types/landing";

interface HeaderProps {
  navLinks: NavLink[];
}

const desktopIconClass =
  "text-foreground transition-colors hover:text-rose";

export default function Header({ navLinks }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuPathname, setMenuPathname] = useState(pathname);

  if (pathname !== menuPathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(true);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 md:px-6 lg:px-8">
        <Link href="/" aria-label="Celoria home" className="shrink-0">
          <span className="block md:hidden">
            <CeloriaLogo height={64} width={140} />
          </span>
          <span className="hidden md:block">
            <CeloriaLogo height={102} width={200} />
          </span>
        </Link>

        <nav className="hidden items-center gap-14 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium tracking-wide text-foreground transition-colors hover:text-rose"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-5">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={isSearchOpen}
            aria-controls="header-search-dialog"
            onClick={() =>
              setIsSearchOpen((open) => {
                if (!open) {
                  setIsMenuOpen(false);
                }
                return !open;
              })
            }
            className={`hidden md:inline-flex ${desktopIconClass}`}
          >
            <IoIosSearch className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className={`hidden md:inline-flex ${desktopIconClass}`}
          >
            <IoMdPerson className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            className={`hidden md:inline-flex ${desktopIconClass}`}
          >
            <IoIosHeart className="h-6 w-6" />
          </button>
          <HeaderCart />
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex min-h-11 min-w-11 items-center justify-center text-foreground transition-colors hover:text-rose md:hidden"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <MobileNavDrawer
          navLinks={navLinks}
          onClose={() => setIsMenuOpen(false)}
          onSearch={openSearch}
        />
      ) : null}

      {isSearchOpen ? <HeaderSearch onClose={closeSearch} /> : null}
    </header>
  );
}
