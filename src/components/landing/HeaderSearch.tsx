"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";

interface HeaderSearchProps {
  onClose: () => void;
}

function readSearchQuery(): string {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export default function HeaderSearch({ onClose }: HeaderSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(readSearchQuery);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const params = new URLSearchParams();
    params.set("q", trimmed);
    router.push(`/products?${params.toString()}`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        id="header-search-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="header-search-title"
        className="absolute inset-x-0 top-0 bg-cream shadow-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 md:py-5 lg:px-8">
          <form
            onSubmit={handleSubmit}
            className="flex min-w-0 flex-1 items-center gap-3 border-b border-rose/30"
          >
            <button
              type="submit"
              aria-label="Search"
              className="shrink-0 text-text-muted transition-colors hover:text-rose"
            >
              <IoIosSearch className="h-5 w-5" />
            </button>
            <h2 id="header-search-title" className="sr-only">
              Search products
            </h2>
            <input
              ref={inputRef}
              type="text"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jewellery..."
              autoComplete="off"
              enterKeyHint="search"
              maxLength={100}
              aria-label="Search products"
              className="min-h-11 w-full bg-transparent py-2 text-base text-foreground outline-none placeholder:text-text-muted"
            />
            <button
              type="submit"
              className="hidden shrink-0 px-2 py-2 text-sm font-medium tracking-wide text-rose transition-colors hover:text-dark-green sm:inline"
            >
              Search
            </button>
          </form>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-foreground transition-colors hover:text-rose"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
