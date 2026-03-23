'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Plus, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addRoutineStep } from '@/actions/routines';
import { toast } from 'sonner';

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

interface RoutineProductPickerProps {
  routineId: string;
  currentStepProductIds: string[];
  allProducts: ProductData[];
  categories: { id: string; name: string; slug: string }[];
  onStepAdded: () => void;
}

export function RoutineProductPicker({
  routineId,
  currentStepProductIds,
  allProducts,
  categories,
  onStepAdded,
}: RoutineProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [localAddedIds, setLocalAddedIds] = useState<Set<string>>(new Set());

  const addedProductIds = new Set([...currentStepProductIds, ...localAddedIds]);

  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      activeCategory === 'all' || p.categorySlug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (productId: string) => {
    setLocalAddedIds((prev) => new Set([...prev, productId]));
    try {
      await addRoutineStep(routineId, productId);
      onStepAdded();
    } catch {
      setLocalAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      toast.error('Failed to add step \u2014 please try again');
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearchQuery('');
      setActiveCategory('all');
      setLocalAddedIds(new Set());
    }
  };

  const allCategoryPills = [
    { id: 'all', name: 'All', slug: 'all' },
    ...categories,
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" className="mt-4">
            <Plus className="mr-1 h-4 w-4" />
            Add step
          </Button>
        }
      />
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold">Add step</DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        {/* Category filter pills */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
          {allCategoryPills.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-4 py-2 font-body text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-accent text-white'
                  : 'border border-border text-text-secondary hover:border-accent hover:text-accent'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Scrollable product grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-text-secondary">
              No products match your search
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredProducts.map((product) => {
                const isAdded = addedProductIds.has(product.id);
                const variant =
                  product.variants.find((v) => v.variantName === 'medium') ??
                  product.variants.find((v) => v.variantName === 'small') ??
                  product.variants[0];

                return (
                  <div key={product.id}>
                    <div
                      className={`relative aspect-square overflow-hidden rounded-md ${
                        isAdded
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer transition-transform hover:scale-105'
                      }`}
                      onClick={
                        isAdded ? undefined : () => handleAddProduct(product.id)
                      }
                    >
                      {variant?.url ? (
                        <Image
                          src={variant.url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-xs text-muted-foreground">
                            No photo
                          </span>
                        </div>
                      )}
                      {isAdded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-6 w-6 text-white drop-shadow" />
                        </div>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-text-secondary">
                      {product.name}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
