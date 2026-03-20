"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createJob, updateJob, deleteJob } from "@/actions/schedule";
import { ButtonSpinner } from "@/components/ui/button-spinner";

interface Job {
  id: string;
  jobDate: string;
  clientName: string;
  location: string;
  startTime: string;
  endTime: string;
  payAmount: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const jobFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(100),
  location: z.string().min(1, "Location is required").max(200),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  payAmount: z.number().int().min(0, "Pay amount must be non-negative"),
  status: z.enum(["paid", "pending"]),
  notes: z.string().max(1000).optional().nullable(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

interface JobFormProps {
  date: Date;
  job?: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobForm({ date, job, open, onOpenChange }: JobFormProps) {
  const isEditing = !!job;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [payDisplay, setPayDisplay] = useState(
    job ? formatPayDisplay(job.payAmount) : ""
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      clientName: job?.clientName ?? "",
      location: job?.location ?? "",
      startTime: job?.startTime ?? "09:00",
      endTime: job?.endTime ?? "17:00",
      payAmount: job?.payAmount ?? 0,
      status: (job?.status as "paid" | "pending") ?? "pending",
      notes: job?.notes ?? "",
    },
  });

  const currentStatus = watch("status");

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  function formatPayDisplay(amount: number): string {
    if (amount === 0) return "";
    return new Intl.NumberFormat("vi-VN").format(amount);
  }

  const handlePayFocus = () => {
    const val = watch("payAmount");
    setPayDisplay(val > 0 ? String(val) : "");
  };

  const handlePayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value.replace(/\D/g, ""), 10) || 0;
    setValue("payAmount", raw);
    setPayDisplay(formatPayDisplay(raw));
  };

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayDisplay(e.target.value);
  };

  const onSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && job) {
        await updateJob(job.id, {
          ...data,
          jobDate: dateStr,
          notes: data.notes || null,
        });
        toast.success("Job updated");
      } else {
        await createJob({
          ...data,
          jobDate: dateStr,
          notes: data.notes || null,
        });
        toast.success("Job added");
      }
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    setIsSubmitting(true);
    try {
      await deleteJob(job.id);
      toast.success("Job deleted");
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[90vh] rounded-t-2xl overflow-y-auto"
          showCloseButton
        >
          {/* Drag indicator */}
          <div className="flex justify-center mt-2 mb-2">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          <SheetHeader className="px-6 pb-2">
            <SheetTitle className="font-display text-xl font-bold">
              {isEditing ? "Edit Job" : "Add Job"}
            </SheetTitle>
            <p className="text-sm font-body text-secondary">
              {format(date, "MMMM d, yyyy")}
            </p>
          </SheetHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 px-6 pb-6"
          >
            {/* Client Name */}
            <div>
              <Label htmlFor="client-name" className="mb-2">
                Client Name
              </Label>
              <Input
                id="client-name"
                placeholder="Client name"
                {...register("clientName")}
              />
              {errors.clientName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="mb-2">
                Location
              </Label>
              <Input
                id="location"
                placeholder="Location"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-xs text-destructive mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Time range */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="start-time" className="mb-2">
                  Start Time
                </Label>
                <Input
                  id="start-time"
                  type="time"
                  {...register("startTime")}
                />
                {errors.startTime && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
              <span className="text-sm font-body text-secondary mt-6">to</span>
              <div className="flex-1">
                <Label htmlFor="end-time" className="mb-2">
                  End Time
                </Label>
                <Input id="end-time" type="time" {...register("endTime")} />
                {errors.endTime && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pay Amount */}
            <div>
              <Label htmlFor="pay-amount" className="mb-2">
                Pay Amount
              </Label>
              <div className="relative">
                <Input
                  id="pay-amount"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={payDisplay}
                  onChange={handlePayChange}
                  onFocus={handlePayFocus}
                  onBlur={handlePayBlur}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-body text-secondary">
                  VND
                </span>
              </div>
              {errors.payAmount && (
                <p className="text-xs text-destructive mt-1">
                  {errors.payAmount.message}
                </p>
              )}
            </div>

            {/* Status toggle */}
            <div>
              <Label className="mb-2">Status</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue("status", "pending")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-body border transition-colors",
                    currentStatus === "pending"
                      ? "bg-[var(--color-pending)]/15 text-[var(--color-pending)] border-[var(--color-pending)]"
                      : "bg-transparent text-secondary border-border"
                  )}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setValue("status", "paid")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-body border transition-colors",
                    currentStatus === "paid"
                      ? "bg-[var(--color-paid)]/15 text-[var(--color-paid)] border-[var(--color-paid)]"
                      : "bg-transparent text-secondary border-border"
                  )}
                >
                  Paid
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="job-notes" className="mb-2">
                Notes
              </Label>
              <Textarea
                id="job-notes"
                {...register("notes")}
                placeholder="Notes about this job..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2" />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent text-white hover:bg-accent-hover active:scale-[0.97] transition-all duration-100"
            >
              <span className="inline-flex items-center gap-2">
                {isSubmitting && <ButtonSpinner />}
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Add Job"}
              </span>
            </Button>

            {/* Delete (edit mode only) */}
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full text-destructive border-destructive hover:bg-destructive/10"
              >
                Delete Job
              </Button>
            )}
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      {isEditing && job && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Delete this job?</DialogTitle>
              <DialogDescription>
                This job for {job.clientName} on{" "}
                {format(date, "MMMM d, yyyy")} will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
