'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { RoutineStep } from './routine-step';
import { RoutineStepSearch } from './routine-step-search';
import {
  reorderRoutineSteps,
  removeRoutineStep,
  type RoutineWithSteps,
} from '@/actions/routines';
import { toast } from 'sonner';

interface RoutineListProps {
  initialRoutines: RoutineWithSteps[];
}

export function RoutineList({ initialRoutines }: RoutineListProps) {
  const [routinesState, setRoutinesState] =
    useState<RoutineWithSteps[]>(initialRoutines);

  // Sync state when server re-renders with fresh data (after revalidatePath)
  useEffect(() => {
    setRoutinesState(initialRoutines);
  }, [initialRoutines]);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent, routineId: string) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const prevRoutines = routinesState;

      setRoutinesState((prev) =>
        prev.map((routine) => {
          if (routine.id !== routineId) return routine;
          const oldIndex = routine.steps.findIndex((s) => s.id === active.id);
          const newIndex = routine.steps.findIndex((s) => s.id === over.id);
          if (oldIndex === -1 || newIndex === -1) return routine;
          return {
            ...routine,
            steps: arrayMove(routine.steps, oldIndex, newIndex),
          };
        }),
      );

      try {
        const routine = routinesState.find((r) => r.id === routineId);
        if (!routine) return;
        const oldIndex = routine.steps.findIndex((s) => s.id === active.id);
        const newIndex = routine.steps.findIndex((s) => s.id === over.id);
        const newSteps = arrayMove(routine.steps, oldIndex, newIndex);
        await reorderRoutineSteps(
          routineId,
          newSteps.map((s) => s.id),
        );
      } catch {
        setRoutinesState(prevRoutines);
        toast('Something went wrong. Please try again.');
      }
    },
    [routinesState],
  );

  const handleRemoveStep = useCallback(
    async (stepId: string) => {
      const prevRoutines = routinesState;

      // Find which routine and step for the toast
      let productName = '';
      let routineName = '';
      for (const r of routinesState) {
        const step = r.steps.find((s) => s.id === stepId);
        if (step) {
          productName = step.product.name;
          routineName = r.name;
          break;
        }
      }

      // Optimistic removal
      setRoutinesState((prev) =>
        prev.map((routine) => ({
          ...routine,
          steps: routine.steps.filter((s) => s.id !== stepId),
        })),
      );

      try {
        await removeRoutineStep(stepId);
        toast(`${productName} removed from ${routineName}`);
      } catch {
        setRoutinesState(prevRoutines);
        toast('Something went wrong. Please try again.');
      }
    },
    [routinesState],
  );

  const handleStepAdded = useCallback(() => {
    // revalidatePath in server action triggers re-render with fresh initialRoutines
  }, []);

  return (
    <div>
      {routinesState.map((routine) => (
        <div
          key={routine.id}
          className="mb-6 rounded-lg bg-surface p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-primary">
              {routine.name}
            </h3>
            <span className="rounded-full bg-muted px-2 py-1 text-xs text-text-secondary">
              {routine.steps.length} step
              {routine.steps.length !== 1 ? 's' : ''}
            </span>
          </div>

          {routine.steps.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-secondary">
              No steps yet. Search for products to add.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, routine.id)}
            >
              <SortableContext
                items={routine.steps.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {routine.steps.map((step, index) => (
                  <RoutineStep
                    key={step.id}
                    step={step}
                    index={index}
                    onRemove={handleRemoveStep}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}

          <div className="mt-4">
            <RoutineStepSearch
              routineId={routine.id}
              onStepAdded={handleStepAdded}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
