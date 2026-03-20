"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BeautyCategoryFilter } from "./beauty-category-filter";
import { ProductCard, type ProductCardData } from "./product-card";
import { ProductBottomSheet, type ProductDetailData } from "./product-bottom-sheet";
import { ProductForm } from "./product-form";
import {
  toggleFavorite,
  deleteBeautyProduct,
} from "@/actions/beauty-products";

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
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [products, setProducts] = useState(initialProducts);
  const [activeSlug, setActiveSlug] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailData | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  // Filter products client-side
  const filteredProducts = products.filter((p) => {
    if (activeSlug === "all") return true;
    if (activeSlug === "favorites") return p.isFavorite === 1;
    return p.categorySlug === activeSlug;
  });

  const handleToggleFavorite = async (productId: string) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, isFavorite: p.isFavorite === 1 ? 0 : 1 }
          : p
      )
    );

    // Also update bottom sheet if open
    if (selectedProduct?.id === productId) {
      setSelectedProduct((prev) =>
        prev ? { ...prev, isFavorite: prev.isFavorite === 1 ? 0 : 1 } : prev
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
            : p
        )
      );
      toast.error("Failed to update favorite");
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
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    startTransition(() => {
      router.refresh();
    });
    // Also refetch by resetting products from server on next render
    // router.refresh() will cause the server component to re-render with fresh data
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // Empty state -- no products at all
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Sparkles className="h-12 w-12 text-accent mb-4" />
        <h2 className="font-display text-xl font-bold text-primary mb-2">
          Start your beauty collection
        </h2>
        <p className="text-sm font-body text-text-secondary mb-6 max-w-xs">
          Add your favorite products and build your daily routines.
        </p>
        <Button onClick={handleOpenAddForm} className="bg-accent text-white hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-1" />
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
      {/* Category filter */}
      <BeautyCategoryFilter
        categories={categories}
        activeSlug={activeSlug}
        onSelect={setActiveSlug}
      />

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelectProduct}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-text-secondary text-sm py-12">
          No products in this category
        </p>
      )}

      {/* Floating add button */}
      <button
        onClick={handleOpenAddForm}
        className="fixed bottom-20 right-4 md:bottom-6 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
        aria-label="Add product"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Bottom sheet */}
      <ProductBottomSheet
        product={selectedProduct}
        open={showBottomSheet}
        onOpenChange={setShowBottomSheet}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
