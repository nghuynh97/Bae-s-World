'use client';

import { useState, useEffect, useTransition, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPortfolioItems } from '@/actions/portfolio';
import { MasonryGrid } from './masonry-grid';
import { GalleryCard } from './gallery-card';
import { CategoryFilter } from './category-filter';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbox } from './lightbox';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  categoryName: string;
  categorySlug: string;
  imageWidth: number;
  imageHeight: number;
  variants: Array<{
    variantName: string;
    storagePath: string;
    width: number;
    height: number;
    url: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isDefault: number;
}

interface InfiniteScrollGalleryProps {
  initialItems: PortfolioItem[];
  initialCursor: string | null;
  initialCategorySlug: string;
  categories: Category[];
}

function getImageUrl(
  variants: PortfolioItem['variants'],
  preferred: string = 'medium',
): string {
  const variant =
    variants.find((v) => v.variantName === preferred) ||
    variants.find((v) => v.variantName === 'large') ||
    variants[0];
  return variant?.url ?? '';
}

function useResponsiveColumns() {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setColumns(e.matches ? 2 : 3);
    };
    handler(mql);
    mql.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
    return () =>
      mql.removeEventListener(
        'change',
        handler as (e: MediaQueryListEvent) => void,
      );
  }, []);

  return columns;
}

export function InfiniteScrollGallery({
  initialItems,
  initialCursor,
  initialCategorySlug,
  categories,
}: InfiniteScrollGalleryProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [activeCategorySlug, setActiveCategorySlug] =
    useState(initialCategorySlug);
  const [isPending, startTransition] = useTransition();
  const [isSwitchingCategory, setIsSwitchingCategory] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const columns = useResponsiveColumns();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  // Load more items when sentinel is in view
  const loadMore = useCallback(() => {
    if (!cursor || isPending) return;
    startTransition(async () => {
      const result = await getPortfolioItems(
        cursor,
        activeCategorySlug === 'all' ? undefined : activeCategorySlug,
      );
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    });
  }, [cursor, isPending, activeCategorySlug]);

  useEffect(() => {
    if (inView) loadMore();
  }, [inView, loadMore]);

  // Handle category change
  const handleCategorySelect = useCallback(
    (slug: string) => {
      if (slug === activeCategorySlug) return;
      setActiveCategorySlug(slug);
      setIsSwitchingCategory(true);
      setItems([]);
      setCursor(null);

      startTransition(async () => {
        const result = await getPortfolioItems(
          undefined,
          slug === 'all' ? undefined : slug,
        );
        setItems(result.items);
        setCursor(result.nextCursor);
        setIsSwitchingCategory(false);
      });
    },
    [activeCategorySlug],
  );

  const galleryItems = items.map((item, index) => (
    <GalleryCard
      key={item.id}
      title={item.title}
      category={item.categoryName}
      imageUrl={getImageUrl(item.variants)}
      width={item.imageWidth}
      height={item.imageHeight}
      onClick={() => setLightboxIndex(index)}
    />
  ));

  return (
    <div>
      <CategoryFilter
        categories={categories}
        activeSlug={activeCategorySlug}
        onSelect={handleCategorySelect}
      />

      <div className="mt-6">
        {items.length === 0 && !isPending && !isSwitchingCategory ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className="font-display text-xl font-bold text-text-primary">
              No photos yet
            </h2>
            <p className="mt-2 max-w-md text-center text-sm text-text-secondary">
              Your portfolio is waiting for its first photo. Head to the admin
              panel to upload one.
            </p>
          </div>
        ) : (
          <div
            className={`transition-opacity duration-200 ${
              isSwitchingCategory ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <MasonryGrid items={galleryItems} columns={columns} />
          </div>
        )}

        {/* Loading skeletons */}
        {(isPending || isSwitchingCategory) && items.length === 0 && (
          <div className="mt-4 flex gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="hidden flex-1 flex-col gap-4 md:flex">
              <Skeleton className="h-56 w-full rounded-lg" />
              <Skeleton className="h-52 w-full rounded-lg" />
            </div>
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        {cursor && <div ref={ref} className="h-10" />}

        {/* Loading indicator for next page */}
        {isPending && items.length > 0 && (
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-48 flex-1 rounded-lg" />
            <Skeleton className="h-48 flex-1 rounded-lg" />
            <Skeleton className="hidden h-48 flex-1 rounded-lg md:block" />
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        items={items}
        currentIndex={lightboxIndex ?? 0}
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
