"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePortfolioItem } from "@/actions/portfolio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

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
      toast.success("Photo deleted");
      setDeleteItemId(null);
    } catch {
      toast.error("Failed to delete photo. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const thumb = item.variants.find(
            (v) => v.variantName === "thumb"
          );
          const imageUrl = thumb?.url || item.variants[0]?.url;

          return (
            <div
              key={item.id}
              className="bg-surface rounded-[16px] ring-1 ring-foreground/10 overflow-hidden"
            >
              {imageUrl && (
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {item.title}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {item.categoryName}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors">
                    <MoreHorizontal size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href={`/admin/portfolio/${item.id}/edit`}
                        className="flex items-center gap-2 w-full"
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
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Photo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
