import { getBeautyProducts } from '@/actions/beauty-products';
import { getBeautyCategories } from '@/actions/beauty-categories';
import { getRoutinesWithSteps } from '@/actions/routines';
import { BeautyTabs } from '@/components/beauty/beauty-tabs';
import { ProductGrid } from '@/components/beauty/product-grid';
import { RoutineList } from '@/components/beauty/routine-list';

export default async function BeautyPage() {
  const [products, categories] = await Promise.all([
    getBeautyProducts(),
    getBeautyCategories(),
  ]);

  let routines: Awaited<ReturnType<typeof getRoutinesWithSteps>> = [];
  try {
    routines = await getRoutinesWithSteps();
  } catch {
    // Routines fetch failed — render empty list rather than crashing the page
  }

  return (
    <div className="px-4 pt-16 md:px-8">
      <h1 className="mb-6 font-display text-xl font-bold text-primary">
        Beauty
      </h1>
      <BeautyTabs
        productsContent={
          <ProductGrid initialProducts={products} categories={categories} />
        }
        routinesContent={<RoutineList initialRoutines={routines} allProducts={products} categories={categories} />}
      />
    </div>
  );
}
