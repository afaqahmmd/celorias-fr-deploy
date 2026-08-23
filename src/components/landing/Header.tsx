import Link from "next/link";
import { IoIosHeart, IoIosSearch, IoMdCart, IoMdPerson } from "react-icons/io";
import CeloriaLogo from "@/components/ui/CeloriaLogo";
import type { NavLink } from "@/types/landing";

interface HeaderProps {
  navLinks: NavLink[];
}

export default function Header({ navLinks }: HeaderProps) {
  return (
    <header className="bg-[#F7EFEB]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 lg:px-8">
        <Link href="/" aria-label="Celoria home">
          <CeloriaLogo height={102} width={200} />
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

        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            className="text-foreground transition-colors hover:text-rose"
          >
            <IoIosSearch className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="text-foreground transition-colors hover:text-rose"
          >
            <IoMdPerson className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            className="text-foreground transition-colors hover:text-rose"
          >
            <IoIosHeart className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Cart"
            className="text-foreground transition-colors hover:text-rose"
          >
            <IoMdCart className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
