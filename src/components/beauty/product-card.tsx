'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';

export interface ProductCardData {
  id: string;
  name: string;
  brand: string | null;
  isFavorite: number;
  imageId: string;
  variants: {
    variantName: string;
    storagePath: string;
    width: number;
    height: number;
    url: string;
  }[];
}

interface ProductCardProps {
  product: ProductCardData;
  onSelect: (product: ProductCardData) => void;
  onToggleFavorite: (productId: string) => void;
}

export function ProductCard({
  product,
  onSelect,
  onToggleFavorite,
}: ProductCardProps) {
  const mediumVariant =
    product.variants.find((v) => v.variantName === 'medium') ??
    product.variants.find((v) => v.variantName === 'small') ??
    product.variants[0];

  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md"
      onClick={() => onSelect(product)}
    >
      {mediumVariant?.url ? (
        <Image
          src={mediumVariant.url}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-xs text-muted-foreground">No photo</span>
        </div>
      )}

      {/* Heart overlay button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        className="absolute top-1 right-1 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/20 p-1.5 transition-colors hover:bg-black/40"
        aria-label={
          product.isFavorite === 1
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
      >
        <Heart
          className={`h-5 w-5 ${
            product.isFavorite === 1
              ? 'fill-accent text-accent'
              : 'fill-none text-white drop-shadow'
          }`}
        />
      </button>
    </div>
  );
}
