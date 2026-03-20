"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

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

export function ProductCard({ product, onSelect, onToggleFavorite }: ProductCardProps) {
  const mediumVariant = product.variants.find((v) => v.variantName === "medium")
    ?? product.variants.find((v) => v.variantName === "small")
    ?? product.variants[0];

  return (
    <div
      className="aspect-square rounded-md overflow-hidden relative cursor-pointer group"
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
        <div className="w-full h-full bg-muted flex items-center justify-center">
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
        className="absolute top-1 right-1 bg-black/20 rounded-full p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors hover:bg-black/40"
        aria-label={product.isFavorite === 1 ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-5 w-5 ${
            product.isFavorite === 1
              ? "fill-accent text-accent"
              : "fill-none text-white drop-shadow"
          }`}
        />
      </button>
    </div>
  );
}
