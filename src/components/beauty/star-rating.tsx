"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}

export function StarRating({ value, onChange, readonly = false, size = "sm" }: StarRatingProps) {
  const iconClass = size === "md" ? "h-6 w-6" : "h-5 w-5";
  return (
    <div className="flex gap-0.5" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          role="radio"
          aria-checked={value === star}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            className={`${iconClass} ${
              star <= value
                ? "fill-accent text-accent"
                : "fill-none text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
