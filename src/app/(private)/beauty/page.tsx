import { getBeautyProducts } from "@/actions/beauty-products";
import { getBeautyCategories } from "@/actions/beauty-categories";
import { BeautyTabs } from "@/components/beauty/beauty-tabs";
import { ProductGrid } from "@/components/beauty/product-grid";

export default async function BeautyPage() {
  const [products, categories] = await Promise.all([
    getBeautyProducts(),
    getBeautyCategories(),
  ]);

  return (
    <div className="px-4 md:px-8 pt-16">
      <h1 className="font-display text-xl font-bold text-primary mb-6">Beauty</h1>
      <BeautyTabs
        productsContent={
          <ProductGrid
            initialProducts={products}
            categories={categories}
          />
        }
        routinesContent={
          <div className="text-center text-text-secondary text-sm py-12">
            Routines coming soon...
          </div>
        }
      />
    </div>
  );
}
