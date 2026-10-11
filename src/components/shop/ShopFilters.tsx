"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { STONE_COLOR_OPTIONS, STONE_TYPE_OPTIONS } from "@/lib/catalog";
import type { ApiCategory } from "@/types/api";

interface ShopFiltersProps {
  categories: Pick<ApiCategory, "name" | "slug">[];
  categorySlug?: string;
  stoneTypes: string[];
  stoneColors: string[];
  onCategoryChange: (slug?: string) => void;
  onToggleStoneType: (value: string) => void;
  onToggleStoneColor: (value: string) => void;
  onClearAll: () => void;
}

export default function ShopFilters({
  // categories,
  categorySlug,
  stoneTypes,
  stoneColors,
  // onCategoryChange,
  onToggleStoneType,
  onToggleStoneColor,
  onClearAll,
}: ShopFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(() => {
    const sections: string[] = [];
    if (stoneTypes.length > 0) {
      sections.push("stone-type");
    }
    if (stoneColors.length > 0) {
      sections.push("stone-color");
    }
    return sections;
  });

  function toggleSection(id: string) {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter((sectionId) => sectionId !== id)
        : [...current, id],
    );
  }

  const hasActiveFilters =
    Boolean(categorySlug) || stoneTypes.length > 0 || stoneColors.length > 0;

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase">
          Filter By
        </h2>
        <button
          type="button"
          onClick={onClearAll}
          disabled={!hasActiveFilters}
          className="text-xs text-text-muted transition-colors hover:text-rose disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear All
        </button>
      </div>

      {/* {categories.length > 0 && (
        <FilterSection
          id="category"
          label="Category"
          isOpen={openSections.includes("category")}
          onToggle={toggleSection}
        >
          {categories.map((category) => (
            <label
              key={category.slug}
              className="flex min-h-11 cursor-pointer items-center gap-2 py-2.5 text-sm"
            >
              <input
                type="radio"
                name="category-filter"
                checked={categorySlug === category.slug}
                onChange={() => onCategoryChange(category.slug)}
                className="accent-rose"
              />
              {category.name}
            </label>
          ))}
        </FilterSection>
      )} */}

      <FilterSection
        id="stone-type"
        label="Stone Type"
        isOpen={openSections.includes("stone-type")}
        onToggle={toggleSection}
      >
        {STONE_TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-2 py-2.5 text-sm"
          >
            <input
              type="checkbox"
              checked={stoneTypes.includes(option.value)}
              onChange={() => onToggleStoneType(option.value)}
              className="accent-rose"
            />
            {option.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection
        id="stone-color"
        label="Stone Color"
        isOpen={openSections.includes("stone-color")}
        onToggle={toggleSection}
      >
        {STONE_COLOR_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex min-h-11 cursor-pointer items-center gap-2 py-2.5 text-sm"
          >
            <input
              type="checkbox"
              checked={stoneColors.includes(option.value)}
              onChange={() => onToggleStoneColor(option.value)}
              className="accent-rose"
            />
            {option.label}
          </label>
        ))}
      </FilterSection>
    </aside>
  );
}

function FilterSection({
  id,
  label,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left text-sm"
      >
        {label}
        <FiChevronDown
          className={`h-4 w-4 text-text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
}
