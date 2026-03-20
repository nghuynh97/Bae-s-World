'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deletePortfolioItem } from '@/actions/portfolio';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

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

interface PortfolioListClientProps {
  items: PortfolioItem[];
}

export function PortfolioListClient({ items }: PortfolioListClientProps) {
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const thumb = item.variants.find((v) => v.variantName === 'thumb');
          const imageUrl = thumb?.url || item.variants[0]?.url;

          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-[16px] bg-surface ring-1 ring-foreground/10"
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
    </>
  );
}
