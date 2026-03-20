'use client';

import { useState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/actions/categories';
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

interface Category {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isDefault: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await createCategory({ name: newName.trim() });
      setNewName('');
      toast.success('Category created');
      await loadCategories();
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
      await updateCategory(categoryId, { name: editName.trim() });
      toast.success('Category updated');
      await loadCategories();
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
      await deleteCategory(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      await loadCategories();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to delete category',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  return (
    <div className="mx-auto max-w-xl py-8 md:py-12">
      <h1 className="mb-6 font-display text-xl font-bold text-text-primary">
        Categories
      </h1>

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
                  {cat.isDefault && (
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

      <div className="mt-6 flex items-center gap-3">
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

      <Dialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              This category and all its photos will need to be recategorized.
              Continue?
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
    </div>
  );
}
