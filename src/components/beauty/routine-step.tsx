'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

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
      className={`flex items-center gap-3 rounded-md px-2 py-3 ${
        isDragging ? 'z-10 bg-surface opacity-90 shadow-md' : 'hover:bg-hover'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none p-1 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>
      <span className="w-6 shrink-0 text-center text-sm font-bold text-text-secondary">
        {index + 1}
      </span>
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
        {step.product.thumbnailUrl && (
          <img
            src={step.product.thumbnailUrl}
            alt={step.product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <span className="flex-grow truncate font-body text-sm text-primary">
        {step.product.name}
      </span>
      <button
        onClick={() => onRemove(step.id)}
        className="shrink-0 p-1 text-muted-foreground hover:text-destructive"
        aria-label={`Remove ${step.product.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
