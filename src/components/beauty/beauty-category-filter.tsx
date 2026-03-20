"use client";

import { Heart } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface BeautyCategoryFilterProps {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export function BeautyCategoryFilter({
  categories,
  activeSlug,
  onSelect,
}: BeautyCategoryFilterProps) {
  const allCategories = [
    { id: "all", name: "All", slug: "all" },
    { id: "favorites", name: "Favorites", slug: "favorites" },
    ...categories,
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      role="tablist"
    >
      {allCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          role="tab"
          aria-selected={activeSlug === cat.slug}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-body whitespace-nowrap transition-colors ${
            activeSlug === cat.slug
              ? "bg-accent text-white"
              : "border border-border text-text-secondary hover:border-accent hover:text-accent"
          }`}
        >
          {cat.slug === "favorites" && <Heart className="h-4 w-4" />}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
