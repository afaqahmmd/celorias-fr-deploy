"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { getSearchSuggestions } from "@/actions/search";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  formatProductPrice,
  isSearchableQuery,
  MIN_SEARCH_QUERY_LENGTH,
} from "@/lib/catalog";
import { notifyCaughtError } from "@/lib/notify";
import type { ApiSearchSuggestion } from "@/types/api";

interface HeaderSearchProps {
  onClose: () => void;
}

function readSearchQuery(): string {
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export default function HeaderSearch({ onClose }: HeaderSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState(readSearchQuery);
  const [result, setResult] = useState<{
    q: string;
    items: ApiSearchSuggestion[];
  } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedQuery = useDebouncedValue(query, 300);
  const trimmedDebounced = debouncedQuery.trim();
  const canSearch = isSearchableQuery(query.trim());
  const showPanel = isSearchableQuery(trimmedDebounced);
  const suggestions =
    result?.q === trimmedDebounced ? result.items : [];
  const isLoading = showPanel && result?.q !== trimmedDebounced;

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

  useEffect(() => {
    const q = trimmedDebounced;
    if (!isSearchableQuery(q)) {
      requestIdRef.current += 1;
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    void getSearchSuggestions(q)
      .then((response) => {
        if (requestIdRef.current !== requestId) {
          return;
        }
        setResult({ q, items: response.items });
        setHighlightedIndex(-1);
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) {
          return;
        }
        setResult({ q, items: [] });
        setHighlightedIndex(-1);
        notifyCaughtError(error, "Unable to load search suggestions.");
      });
  }, [trimmedDebounced]);

  function goToSearch(term: string) {
    const trimmed = term.trim();
    if (!isSearchableQuery(trimmed)) {
      return;
    }

    const params = new URLSearchParams();
    params.set("q", trimmed);
    router.push(`/products?${params.toString()}`);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const highlighted = suggestions[highlightedIndex];
    goToSearch(highlighted?.name ?? query);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!showPanel || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
    }
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
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-5 lg:px-8">
          <div className="flex items-center gap-3">
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
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search jewellery..."
                autoComplete="off"
                enterKeyHint="search"
                maxLength={100}
                role="combobox"
                aria-label="Search products"
                aria-autocomplete="list"
                aria-expanded={showPanel}
                aria-controls={listboxId}
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `${listboxId}-option-${highlightedIndex}`
                    : undefined
                }
                className="min-h-11 w-full bg-transparent py-2 text-base text-foreground outline-none placeholder:text-text-muted"
              />
              <button
                type="submit"
                disabled={!canSearch}
                className="hidden shrink-0 px-2 py-2 text-sm font-medium tracking-wide text-rose transition-colors hover:text-dark-green disabled:cursor-not-allowed disabled:opacity-50 sm:inline"
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

          {showPanel ? (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Search suggestions"
              className="mt-3 max-h-80 overflow-y-auto border border-rose/20 bg-white"
            >
              {isLoading ? (
                <p className="px-4 py-3 text-sm text-text-muted">Searching…</p>
              ) : suggestions.length === 0 ? (
                <p className="px-4 py-3 text-sm text-text-muted">No matches</p>
              ) : (
                suggestions.map((suggestion, index) => {
                  const isHighlighted = index === highlightedIndex;
                  const imageSrc =
                    suggestion.thumbnail ?? "/images/placeholder-product.svg";

                  return (
                    <button
                      key={suggestion.id}
                      id={`${listboxId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isHighlighted}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => goToSearch(suggestion.name)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isHighlighted ? "bg-cream" : "bg-white hover:bg-cream"
                      }`}
                    >
                      <Image
                        src={imageSrc}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 shrink-0 object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-foreground">
                          {suggestion.name}
                        </span>
                        <span className="block text-sm text-text-muted">
                          {formatProductPrice(suggestion.price)}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          ) : query.trim().length > 0 &&
            query.trim().length < MIN_SEARCH_QUERY_LENGTH ? (
            <p className="mt-3 text-sm text-text-muted">
              Type at least {MIN_SEARCH_QUERY_LENGTH} characters to search
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
