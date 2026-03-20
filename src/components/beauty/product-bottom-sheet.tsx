"use client";

import { useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";

export interface ProductDetailData {
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
  variants: {
    variantName: string;
    storagePath: string;
    width: number;
    height: number;
    url: string;
  }[];
}

interface ProductBottomSheetProps {
  product: ProductDetailData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: ProductDetailData) => void;
  onDelete: (productId: string) => void;
}

export function ProductBottomSheet({
  product,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ProductBottomSheetProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!product) return null;

  const largeVariant =
    product.variants.find((v) => v.variantName === "large") ??
    product.variants.find((v) => v.variantName === "medium") ??
    product.variants[0];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[85vh] rounded-t-2xl overflow-y-auto"
          showCloseButton={false}
        >
          {/* Hidden title for accessibility */}
          <SheetTitle className="sr-only">{product.name} details</SheetTitle>

          {/* Drag indicator */}
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-muted-foreground/30" />

          <div className="p-4 space-y-4">
            {/* Product photo */}
            {largeVariant?.url && (
              <div className="relative w-full max-h-[300px] overflow-hidden rounded-lg">
                <Image
                  src={largeVariant.url}
                  alt={product.name}
                  width={largeVariant.width}
                  height={largeVariant.height}
                  className="w-full max-h-[300px] object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            )}

            {/* Product name */}
            <h2 className="font-display text-xl font-bold text-primary">
              {product.name}
            </h2>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm font-body text-text-secondary">
                {product.brand}
              </p>
            )}

            {/* Star rating */}
            <StarRating value={product.rating} readonly />

            {/* Category badge */}
            <span className="inline-block px-3 py-1 rounded-full text-xs border border-border text-text-secondary">
              {product.categoryName}
            </span>

            {/* Notes */}
            {product.notes && (
              <p className="text-sm font-body text-primary whitespace-pre-wrap">
                {product.notes}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(product);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {product.name}?</DialogTitle>
            <DialogDescription>
              This product will be removed from your collection and any routines.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteConfirm(false);
                onOpenChange(false);
                onDelete(product.id);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
