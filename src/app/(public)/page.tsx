import { getPortfolioItems } from '@/actions/portfolio';
import { getCategories } from '@/actions/categories';
import { InfiniteScrollGallery } from '@/components/portfolio/infinite-scroll-gallery';

export default async function PortfolioPage() {
  const categories = await getCategories();

  // Find the default category (isDefault === 1) or fall back to first category
  const defaultCategory =
    categories.find((c) => c.isDefault === 1) || categories[0];
  const defaultSlug = defaultCategory?.slug ?? 'all';

  // Fetch initial data server-side
  const { items, nextCursor } = await getPortfolioItems(
    undefined,
    defaultSlug === 'all' ? undefined : defaultSlug,
  );

  return (
    <div>
      <h1 className="mb-6 pt-8 font-display text-2xl font-bold text-text-primary">
        Portfolio
      </h1>
      <InfiniteScrollGallery
        initialItems={items}
        initialCursor={nextCursor}
        initialCategorySlug={defaultSlug}
        categories={categories}
      />
    </div>
  );
}
