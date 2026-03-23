'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { updatePortfolioItem } from '@/actions/portfolio';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ButtonSpinner } from '@/components/ui/button-spinner';

const editSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

type EditFormData = z.infer<typeof editSchema>;

interface EditPortfolioModalProps {
  itemId: string;
  imageUrl?: string;
  defaultValues: {
    title: string;
    description: string;
    categoryId: string;
  };
  categories: { id: string; name: string }[];
}

export function EditPortfolioModal({
  itemId,
  imageUrl,
  defaultValues,
  categories,
}: EditPortfolioModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues,
  });

  const handleClose = () => {
    router.back();
  };

  const onSubmit = async (data: EditFormData) => {
    setIsSubmitting(true);
    try {
      await updatePortfolioItem(itemId, {
        title: data.title,
        description: data.description || undefined,
        categoryId: data.categoryId,
      });
      toast.success('Changes saved');
      router.back();
    } catch {
      toast.error('Changes could not be saved. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <DialogBody className="space-y-5">
            {imageUrl && (
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={imageUrl}
                  alt={defaultValues.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="modal-title">Title</Label>
              <Input
                id="modal-title"
                maxLength={100}
                {...register('title')}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-description">Description</Label>
              <Textarea
                id="modal-description"
                maxLength={500}
                {...register('description')}
                className="min-h-[80px] resize-y"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-category">Category</Label>
              <Controller
                control={control}
                name="categoryId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? null}
                    onValueChange={field.onChange}
                    items={categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    }))}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={!!errors.categoryId}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                {isSubmitting && <ButtonSpinner />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
