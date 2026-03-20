'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getBeautyCategories,
  createBeautyCategory,
  updateBeautyCategory,
  deleteBeautyCategory,
} from '@/actions/beauty-categories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface BeautyCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isDefault: number;
}

interface BeautyCategoryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriesChanged: () => void;
}

export function BeautyCategoryManager({
  open,
  onOpenChange,
  onCategoriesChanged,
}: BeautyCategoryManagerProps) {
  const [categories, setCategories] = useState<BeautyCategory[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = async () => {
    const cats = await getBeautyCategories();
    setCategories(cats);
  };

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await createBeautyCategory({ name: newName.trim() });
      setNewName('');
      toast.success('Category created');
      await loadCategories();
      onCategoriesChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create category',
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSave = async (categoryId: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await updateBeautyCategory(categoryId, { name: editName.trim() });
      toast.success('Category updated');
      await loadCategories();
      onCategoriesChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update category',
      );
    }
    setEditingId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteBeautyCategory(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      await loadCategories();
      onCategoriesChanged();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete category',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = (cat: BeautyCategory) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Categories</DialogTitle>
          </DialogHeader>

          <div className="space-y-0">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between border-b border-border py-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-6 text-center text-sm text-text-secondary">
                    {cat.displayOrder}
                  </span>
                  {editingId === cat.id ? (
                    <Input
                      ref={editInputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleEditSave(cat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(cat.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="max-w-[200px]"
                    />
                  ) : (
                    <button
                      onClick={() => startEditing(cat)}
                      className="cursor-pointer truncate text-left text-sm text-text-primary hover:text-accent"
                    >
                      {cat.name}
                      {cat.isDefault === 1 && (
                        <span className="ml-2 text-xs text-text-secondary">
                          (default)
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteId(cat.id)}
                  className="text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New category name"
              maxLength={50}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
            />
            <Button
              className="shrink-0 bg-accent text-white hover:bg-accent-hover"
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
            >
              {isAdding ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteId !== null}
        onOpenChange={(openState) => {
          if (!openState) setDeleteId(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
