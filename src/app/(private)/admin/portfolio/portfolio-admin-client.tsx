'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  createPortfolioItem,
  deletePortfolioItem,
} from '@/actions/portfolio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ImageUploader } from '@/components/upload/image-uploader';
import { ButtonSpinner } from '@/components/ui/button-spinner';

// --- Types ---

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  categoryName: string;
  createdAt: Date;
  variants: {
    variantName: string;
    url: string;
    width: number;
    height: number;
  }[];
}

interface Category {
  id: string;
  name: string;
}

interface PortfolioAdminClientProps {
  items: PortfolioItem[];
  categories: Category[];
}

// --- Upload Form Schema ---

const uploadSchema = z.object({
  title: z.string().max(100, 'Title too long').default(''),
  description: z.string().max(500, 'Description too long').optional(),
  categoryId: z.string().min(1, 'Category is required'),
});

type UploadFormData = z.infer<typeof uploadSchema>;

// --- Component ---

export function PortfolioAdminClient({
  items,
  categories,
}: PortfolioAdminClientProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
    },
  });

  // --- Handlers ---

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setIsDeleting(true);
    try {
      await deletePortfolioItem(deleteItemId);
      toast.success('Photo deleted');
      setDeleteItemId(null);
    } catch {
      toast.error('Failed to delete photo. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const onUploadSubmit = async (data: UploadFormData) => {
    if (imageIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await Promise.all(
        imageIds.map((id) =>
          createPortfolioItem({
            title: data.title,
            description: data.description || undefined,
            categoryId: data.categoryId,
            imageId: id,
          }),
        ),
      );
      toast.success(
        imageIds.length === 1
          ? 'Photo uploaded successfully'
          : `${imageIds.length} photos uploaded successfully`,
      );
      setShowUpload(false);
      setImageIds([]);
      reset();
    } catch {
      toast.error('Upload failed. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseUpload = (open: boolean) => {
    if (!open) {
      setShowUpload(false);
      setImageIds([]);
      reset();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-end">
        <Button
          onClick={() => setShowUpload(true)}
          className="gap-2 active:scale-[0.97]"
        >
          <Plus size={16} />
          Upload Photo
        </Button>
      </div>

      {/* Grid or Empty State */}
      {items.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="mb-2 font-display text-xl font-bold text-text-primary">
            No portfolio photos
          </h2>
          <p className="mb-6 text-base text-text-secondary">
            Upload your first photo to start building the portfolio.
          </p>
          <Button
            onClick={() => setShowUpload(true)}
            className="gap-2 active:scale-[0.97]"
          >
            <Plus size={16} />
            Upload Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {items.map((item) => {
            const thumb = item.variants.find(
              (v) => v.variantName === 'thumb',
            );
            const imageUrl = thumb?.url || item.variants[0]?.url;

            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-black/5"
              >
                {imageUrl && (
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary">
                      {item.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {item.categoryName}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {new Date(item.createdAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-muted">
                      <MoreHorizontal size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link
                          href={`/admin/portfolio/${item.id}/edit`}
                          className="flex w-full items-center gap-2"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteItemId(item.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={handleCloseUpload}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
            <DialogDescription>
              Add a new photo to your portfolio.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-6 py-2">
            <ImageUploader
              bucket="public-images"
              folder="portfolio"
              onUploadComplete={(id) => setImageIds((prev) => [...prev, id])}
            />

            {imageIds.length > 0 && (
              <form
                onSubmit={handleSubmit(onUploadSubmit)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="upload-title">Title</Label>
                  <Input
                    id="upload-title"
                    maxLength={100}
                    placeholder="Enter photo title"
                    {...register('title')}
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-description">Description</Label>
                  <Textarea
                    id="upload-description"
                    maxLength={500}
                    placeholder="Optional description"
                    {...register('description')}
                    className="min-h-[80px] resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-category">Category</Label>
                  <Controller
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? null}
                        onValueChange={field.onChange}
                        items={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
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
                    <p className="text-sm text-destructive">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCloseUpload(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="active:scale-[0.97]"
                  >
                    <span className="inline-flex items-center gap-2">
                      {isSubmitting && <ButtonSpinner />}
                      {isSubmitting ? 'Uploading...' : 'Upload Photo'}
                    </span>
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteItemId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteItemId(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Photo</DialogTitle>
            <DialogDescription>
              This photo will be permanently removed from the portfolio. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItemId(null)}>
              Cancel
            </Button>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Photo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
