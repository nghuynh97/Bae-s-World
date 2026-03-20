"use client";

import { useState, useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { searchBeautyProducts } from "@/actions/beauty-products";
import { addRoutineStep } from "@/actions/routines";

interface RoutineStepSearchProps {
  routineId: string;
  onStepAdded: () => void;
}

export function RoutineStepSearch({
  routineId,
  onStepAdded,
}: RoutineStepSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; name: string; brand: string | null; imageId: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (value.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const data = await searchBeautyProducts(value);
          setResults(data);
          setIsOpen(true);
        } catch {
          setResults([]);
          setIsOpen(false);
        }
      }, 300);
    },
    []
  );

  const handleSelect = useCallback(
    async (productId: string) => {
      if (isAdding) return;
      setIsAdding(true);
      try {
        await addRoutineStep(routineId, productId);
        setQuery("");
        setResults([]);
        setIsOpen(false);
        onStepAdded();
      } catch {
        // silently fail
      } finally {
        setIsAdding(false);
      }
    },
    [routineId, onStepAdded, isAdding]
  );

  const handleBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  }, []);

  const handleFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    if (results.length > 0 && query.length >= 2) {
      setIsOpen(true);
    }
  }, [results.length, query.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    []
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search products to add..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-surface text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-md rounded-md max-h-[200px] overflow-y-auto z-20">
          {results.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-3 px-3">
              No products found
            </p>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(product.id)}
                className="w-full flex items-center gap-3 py-3 px-3 hover:bg-hover cursor-pointer text-left"
              >
                <span className="text-sm font-body text-primary">
                  {product.name}
                </span>
                {product.brand && (
                  <span className="text-xs text-text-secondary">
                    {product.brand}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
