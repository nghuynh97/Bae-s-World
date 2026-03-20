'use client';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export function CategoryFilter({
  categories,
  activeSlug,
  onSelect,
}: CategoryFilterProps) {
  const allCategories = [
    { id: 'all', name: 'All', slug: 'all' },
    ...categories,
  ];

  return (
    <div
      className="scrollbar-hide flex gap-2 overflow-x-auto pb-2"
      role="tablist"
    >
      {allCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          role="tab"
          aria-selected={activeSlug === cat.slug}
          className={`rounded-full px-4 py-2 font-body text-sm whitespace-nowrap transition-colors ${
            activeSlug === cat.slug
              ? 'bg-accent text-white'
              : 'border border-border text-text-secondary hover:border-accent hover:text-accent'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
