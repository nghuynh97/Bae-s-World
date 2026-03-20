"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

interface RoutineStepProps {
  step: {
    id: string;
    stepOrder: number;
    product: {
      id: string;
      name: string;
      brand: string | null;
      thumbnailUrl: string;
    };
  };
  index: number;
  onRemove: (stepId: string) => void;
}

export function RoutineStep({ step, index, onRemove }: RoutineStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: step.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 py-3 px-2 rounded-md ${
        isDragging ? "shadow-md bg-surface opacity-90 z-10" : "hover:bg-hover"
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none p-1"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <span className="text-sm font-bold text-text-secondary w-6 text-center shrink-0">
        {index + 1}
      </span>
      <div className="h-10 w-10 rounded-md overflow-hidden shrink-0 bg-muted">
        {step.product.thumbnailUrl && (
          <img
            src={step.product.thumbnailUrl}
            alt={step.product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <span className="text-sm font-body text-primary flex-grow truncate">
        {step.product.name}
      </span>
      <button
        onClick={() => onRemove(step.id)}
        className="p-1 text-muted-foreground hover:text-destructive shrink-0"
        aria-label={`Remove ${step.product.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
