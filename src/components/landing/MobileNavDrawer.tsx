"use client";

import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { IoIosHeart, IoIosSearch, IoMdPerson } from "react-icons/io";
import Link from "next/link";
import type { NavLink } from "@/types/landing";

interface MobileNavDrawerProps {
  navLinks: NavLink[];
  onClose: () => void;
}

const actionButtonClass =
  "flex min-h-11 w-full items-center gap-3 px-6 py-3 text-left text-base text-foreground transition-colors hover:bg-cream hover:text-rose";

export default function MobileNavDrawer({
  navLinks,
  onClose,
}: MobileNavDrawerProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-[#F7EFEB] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-rose/20 px-6 py-4">
          <h2
            id="mobile-nav-title"
            className="font-serif text-2xl text-foreground"
          >
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex min-h-11 min-w-11 items-center justify-center text-foreground transition-colors hover:text-rose"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block px-6 py-3.5 text-lg font-medium tracking-wide text-foreground transition-colors hover:bg-cream hover:text-rose"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-rose/20 py-2">
          <button type="button" aria-label="Search" className={actionButtonClass}>
            <IoIosSearch className="h-5 w-5" />
            Search
          </button>
          <button type="button" aria-label="Account" className={actionButtonClass}>
            <IoMdPerson className="h-5 w-5" />
            Account
          </button>
          <button type="button" aria-label="Wishlist" className={actionButtonClass}>
            <IoIosHeart className="h-5 w-5" />
            Wishlist
          </button>
        </div>
      </aside>
    </div>
  );
}
