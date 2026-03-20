"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createPortfolioItem } from "@/actions/portfolio";
import { getCategories } from "@/actions/categories";
import { ImageUploader } from "@/components/upload/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/button-spinner";

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface Category {
  id: string;
  name: string;
}

export default function NewPortfolioPage() {
  const router = useRouter();
  const [imageId, setImageId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const onSubmit = async (data: UploadFormData) => {
    if (!imageId) return;
    setIsSubmitting(true);
    try {
      await createPortfolioItem({
        title: data.title,
        description: data.description || undefined,
        categoryId: data.categoryId,
        imageId,
      });
      toast.success("Photo uploaded successfully");
      router.push("/admin/portfolio");
    } catch {
      toast.error("Upload failed. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-xl mx-auto">
      <h1 className="font-display text-xl font-bold text-text-primary mb-6">
        Upload Photo
      </h1>

      <div className="mb-6">
        <ImageUploader
          bucket="public-images"
          folder="portfolio"
          onUploadComplete={setImageId}
        />
      </div>

      {imageId && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              maxLength={100}
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              maxLength={500}
              {...register("description")}
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm min-h-[100px] resize-y"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              aria-invalid={!!errors.categoryId}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-destructive mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-accent text-white hover:bg-accent-hover active:scale-[0.97] transition-all duration-100"
              disabled={isSubmitting}
            >
              <span className="inline-flex items-center gap-2">
                {isSubmitting && <ButtonSpinner />}
                {isSubmitting ? "Uploading..." : "Upload Photo"}
              </span>
            </Button>
            <Link href="/admin/portfolio">
              <Button type="button" variant="outline" className="text-text-secondary">
                Cancel Upload
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
