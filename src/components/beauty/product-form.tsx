"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/upload/image-uploader";
import { StarRating } from "./star-rating";
import { createBeautyProduct, updateBeautyProduct } from "@/actions/beauty-products";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  brand: z.string().max(100).optional().nullable(),
  categoryId: z.string().uuid("Please select a category"),
  rating: z.number().int().min(0).max(5),
  notes: z.string().max(1000).optional().nullable(),
  imageId: z.string().uuid("Please upload a photo"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface EditProduct {
  id: string;
  name: string;
  brand: string | null;
  categoryId: string;
  rating: number;
  notes: string | null;
  imageId: string;
  variants: {
    variantName: string;
    url: string;
    width: number;
    height: number;
  }[];
}

interface ProductFormProps {
  categories: Category[];
  product?: EditProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ProductForm({
  categories,
  product,
  open,
  onOpenChange,
  onSuccess,
}: ProductFormProps) {
  const isEditing = !!product;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      brand: product?.brand ?? "",
      categoryId: product?.categoryId ?? "",
      rating: product?.rating ?? 0,
      notes: product?.notes ?? "",
      imageId: product?.imageId ?? "",
    },
  });

  const currentRating = watch("rating");
  const currentImageId = watch("imageId");

  // Get existing image preview for edit mode
  const existingImageUrl = product?.variants?.find(
    (v) => v.variantName === "medium"
  )?.url ?? product?.variants?.[0]?.url;

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && product) {
        await updateBeautyProduct(product.id, {
          name: data.name,
          brand: data.brand || null,
          categoryId: data.categoryId,
          rating: data.rating,
          notes: data.notes || null,
        });
        toast.success("Product updated");
      } else {
        await createBeautyProduct({
          name: data.name,
          brand: data.brand || null,
          categoryId: data.categoryId,
          rating: data.rating,
          notes: data.notes || null,
          imageId: data.imageId,
        });
        toast.success("Product added to your collection");
      }
      reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Photo upload */}
          <div>
            <Label className="mb-2">Photo</Label>
            {currentImageId && (isEditing ? existingImageUrl : true) ? (
              <div className="relative aspect-square w-32 rounded-md overflow-hidden mb-2">
                {existingImageUrl && isEditing && currentImageId === product?.imageId ? (
                  <Image
                    src={existingImageUrl}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs text-accent">Photo uploaded</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setValue("imageId", "")}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  x
                </button>
              </div>
            ) : (
              <ImageUploader
                bucket="private-images"
                folder="beauty"
                onUploadComplete={(imageId) => setValue("imageId", imageId)}
              />
            )}
            {errors.imageId && (
              <p className="text-xs text-destructive mt-1">{errors.imageId.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="product-name" className="mb-1">Name</Label>
            <Input
              id="product-name"
              placeholder="Product name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Brand */}
          <div>
            <Label htmlFor="product-brand" className="mb-1">Brand</Label>
            <Input
              id="product-brand"
              placeholder="Brand name"
              {...register("brand")}
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="product-category" className="mb-1">Category</Label>
            <select
              id="product-category"
              {...register("categoryId")}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-destructive mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <Label className="mb-1">Rating</Label>
            <StarRating
              value={currentRating}
              onChange={(val) => setValue("rating", val)}
              size="md"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="product-notes" className="mb-1">Notes</Label>
            <textarea
              id="product-notes"
              {...register("notes")}
              placeholder="Your thoughts on this product..."
              rows={4}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none md:text-sm"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
