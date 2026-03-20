import { getBeautyProducts } from '@/actions/beauty-products';
import { getBeautyCategories } from '@/actions/beauty-categories';
import { getRoutinesWithSteps } from '@/actions/routines';
import { BeautyTabs } from '@/components/beauty/beauty-tabs';
import { ProductGrid } from '@/components/beauty/product-grid';
import { RoutineList } from '@/components/beauty/routine-list';

export default async function BeautyPage() {
  const [products, categories, routines] = await Promise.all([
    getBeautyProducts(),
    getBeautyCategories(),
    getRoutinesWithSteps(),
  ]);

  return (
    <div className="px-4 pt-16 md:px-8">
      <h1 className="mb-6 font-display text-xl font-bold text-primary">
        Beauty
      </h1>
      <BeautyTabs
        productsContent={
          <ProductGrid initialProducts={products} categories={categories} />
        }
        routinesContent={<RoutineList initialRoutines={routines} />}
      />
    </div>
  );
}
