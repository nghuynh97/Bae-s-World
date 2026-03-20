"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updatePortfolioItem } from "@/actions/portfolio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/button-spinner";

const editSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  categoryId: z.string().min(1, "Category is required"),
});

type EditFormData = z.infer<typeof editSchema>;

interface EditPortfolioFormProps {
  itemId: string;
  defaultValues: {
    title: string;
    description: string;
    categoryId: string;
  };
  categories: { id: string; name: string }[];
}

export function EditPortfolioForm({
  itemId,
  defaultValues,
  categories,
}: EditPortfolioFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues,
  });

  const onSubmit = async (data: EditFormData) => {
    setIsSubmitting(true);
    try {
      await updatePortfolioItem(itemId, {
        title: data.title,
        description: data.description || undefined,
        categoryId: data.categoryId,
      });
      toast.success("Changes saved");
      router.push("/admin/portfolio");
    } catch {
      toast.error("Changes could not be saved. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </span>
        </Button>
        <Link href="/admin/portfolio">
          <Button type="button" variant="outline" className="text-text-secondary">
            Discard Changes
          </Button>
        </Link>
      </div>
    </form>
  );
}
