'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  categoryName: string;
  variants: Array<{
    variantName: string;
    url: string;
    width: number;
    height: number;
  }>;
}

interface LightboxProps {
  items: PortfolioItem[];
  currentIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (index: number) => void;
}

function getLightboxUrl(variants: PortfolioItem['variants']): string {
  const variant =
    variants.find((v) => v.variantName === 'large') ||
    variants.find((v) => v.variantName === 'full') ||
    variants[0];
  return variant?.url ?? '';
}

export function Lightbox({
  items,
  currentIndex,
  open,
  onOpenChange,
  onNavigate,
}: LightboxProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  const goToNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, items.length, onNavigate]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, goToPrev, goToNext, handleClose]);

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    },
    [goToNext, goToPrev],
  );

  if (!open || items.length === 0) return null;

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  const imageUrl = getLightboxUrl(currentItem.variants);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md" />
        <DialogPrimitive.Popup
          className="fixed inset-0 z-50 flex items-center justify-center outline-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Visually hidden title for accessibility */}
          <DialogPrimitive.Title className="sr-only">
            {currentItem.title}
          </DialogPrimitive.Title>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/40"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Previous arrow */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute top-1/2 left-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/40"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next arrow */}
          {currentIndex < items.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white transition-colors hover:bg-black/40"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Photo and info */}
          <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center">
            <div
              key={currentIndex}
              className="animate-in duration-200 fade-in-0"
            >
              <img
                src={imageUrl}
                alt={currentItem.title}
                className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
              />
            </div>

            {/* Info panel */}
            <div className="mt-3 text-center">
              <h3 className="font-display text-xl font-bold text-white">
                {currentItem.title}
              </h3>
              <p className="text-sm text-white/80">
                {currentItem.categoryName}
              </p>
              {currentItem.description && (
                <p className="mt-1 text-sm text-white/70">
                  {currentItem.description}
                </p>
              )}
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
