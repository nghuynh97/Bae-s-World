'use client';

import { useState, useEffect } from 'react';
import { Plus, Sparkles, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BeautyCategoryFilter } from './beauty-category-filter';
import { ProductCard, type ProductCardData } from './product-card';
import {
  ProductBottomSheet,
  type ProductDetailData,
} from './product-bottom-sheet';
import { ProductForm } from './product-form';
import { BeautyCategoryManager } from './beauty-category-manager';
import { toggleFavorite, deleteBeautyProduct } from '@/actions/beauty-products';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductData {
  id: string;
  name: string;
  brand: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  rating: number;
  notes: string | null;
  isFavorite: number;
  imageId: string;
  imageWidth: number | null;
  imageHeight: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  variants: {
    variantName: string;
    storagePath: string;
    width: number;
    height: number;
    url: string;
  }[];
}

interface ProductGridProps {
  initialProducts: ProductData[];
  categories: Category[];
}

export function ProductGrid({ initialProducts, categories }: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);

  // Sync state when server re-renders with fresh data (after revalidatePath)
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
  const [activeSlug, setActiveSlug] = useState('all');
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetailData | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null,
  );
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Filter products client-side
  const filteredProducts = products.filter((p) => {
    if (activeSlug === 'all') return true;
    if (activeSlug === 'favorites') return p.isFavorite === 1;
    return p.categorySlug === activeSlug;
  });

  const handleToggleFavorite = async (productId: string) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, isFavorite: p.isFavorite === 1 ? 0 : 1 }
          : p,
      ),
    );

    // Also update bottom sheet if open
    if (selectedProduct?.id === productId) {
      setSelectedProduct((prev) =>
        prev ? { ...prev, isFavorite: prev.isFavorite === 1 ? 0 : 1 } : prev,
      );
    }

    try {
      await toggleFavorite(productId);
    } catch {
      // Revert on error
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, isFavorite: p.isFavorite === 1 ? 0 : 1 }
            : p,
        ),
      );
      toast.error('Failed to update favorite');
    }
  };

  const handleSelectProduct = (product: ProductCardData) => {
    const fullProduct = products.find((p) => p.id === product.id);
    if (fullProduct) {
      setSelectedProduct(fullProduct as ProductDetailData);
      setShowBottomSheet(true);
    }
  };

  const handleEdit = (product: ProductDetailData) => {
    const fullProduct = products.find((p) => p.id === product.id);
    if (fullProduct) {
      setEditingProduct(fullProduct);
      setShowForm(true);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteBeautyProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    // revalidatePath in server actions triggers re-render with fresh initialProducts
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Empty state -- no products at all
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sparkles className="mb-4 h-12 w-12 text-accent" />
        <h2 className="mb-2 font-display text-xl font-bold text-primary">
          Start your beauty collection
        </h2>
        <p className="mb-6 max-w-xs font-body text-sm text-text-secondary">
          Add your favorite products and build your daily routines.
        </p>
        <Button
          onClick={handleOpenAddForm}
          className="bg-accent text-white hover:bg-accent/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Product
        </Button>

        <ProductForm
          categories={categories}
          product={null}
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={handleFormSuccess}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Category filter + actions */}
      <div className='flex flex-wrap justify-between'>
        <div className="flex items-center gap-2 flex-wrap">
          <BeautyCategoryFilter
            categories={categories}
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
          />
          <button
            onClick={() => setShowCategoryManager(true)}
            className="shrink-0 p-2 text-text-secondary hover:text-accent"
            aria-label="Edit categories"
          >
            <Settings2 className="h-5 w-5" />
          </button>

        </div>
        <Button
          onClick={handleOpenAddForm}
          className="shrink-0 bg-accent text-white hover:bg-accent/90"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>




      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-md active:scale-[0.97] motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
            >
              <ProductCard
                product={product}
                onSelect={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-text-secondary">
          No products in this category
        </p>
      )}

      {/* Bottom sheet */}
      <ProductBottomSheet
        product={selectedProduct}
        open={showBottomSheet}
        onOpenChange={setShowBottomSheet}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Category manager dialog */}
      <BeautyCategoryManager
        open={showCategoryManager}
        onOpenChange={setShowCategoryManager}
        onCategoriesChanged={() => {
          /* revalidatePath in server action handles refresh */
        }}
      />

      {/* Product form dialog */}
      <ProductForm
        categories={categories}
        product={editingProduct}
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingProduct(null);
        }}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
