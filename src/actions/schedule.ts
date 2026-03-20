"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { scheduleJobs } from "@/lib/db/schema";
import { eq, and, gte, lte, asc } from "drizzle-orm";
import { z } from "zod";

const uuidSchema = z.string().uuid();

const createJobSchema = z.object({
  jobDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  clientName: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location too long"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  payAmount: z.number().int().min(0, "Pay amount must be non-negative"),
  status: z.enum(["paid", "pending"]),
  notes: z.string().max(1000, "Notes too long").optional().nullable(),
});

const updateJobSchema = z.object({
  jobDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
  clientName: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Client name too long")
    .optional(),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location too long")
    .optional(),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format")
    .optional(),
  payAmount: z
    .number()
    .int()
    .min(0, "Pay amount must be non-negative")
    .optional(),
  status: z.enum(["paid", "pending"]).optional(),
  notes: z.string().max(1000, "Notes too long").optional().nullable(),
});

export async function createJob(data: z.infer<typeof createJobSchema>) {
  const parsed = createJobSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [created] = await db
    .insert(scheduleJobs)
    .values(parsed.data)
    .returning();

  return created;
}

export async function getJobsForMonth(year: number, month: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

  return db
    .select()
    .from(scheduleJobs)
    .where(
      and(
        gte(scheduleJobs.jobDate, startDate),
        lte(scheduleJobs.jobDate, endDate)
      )
    )
    .orderBy(asc(scheduleJobs.jobDate), asc(scheduleJobs.startTime));
}

export async function getJobById(jobId: string) {
  const parsed = uuidSchema.safeParse(jobId);
  if (!parsed.success) throw new Error("Invalid job ID");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const results = await db
    .select()
    .from(scheduleJobs)
    .where(eq(scheduleJobs.id, jobId))
    .limit(1);

  return results.length > 0 ? results[0] : null;
}

export async function updateJob(
  jobId: string,
  data: z.infer<typeof updateJobSchema>
) {
  const idParsed = uuidSchema.safeParse(jobId);
  if (!idParsed.success) throw new Error("Invalid job ID");

  const parsed = updateJobSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const [updated] = await db
    .update(scheduleJobs)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(scheduleJobs.id, jobId))
    .returning();

  return updated;
}

export async function deleteJob(jobId: string) {
  const parsed = uuidSchema.safeParse(jobId);
  if (!parsed.success) throw new Error("Invalid job ID");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await db.delete(scheduleJobs).where(eq(scheduleJobs.id, jobId));

  return { success: true };
}

export async function getIncomeStats(year: number, month: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

  const jobs = await db
    .select()
    .from(scheduleJobs)
    .where(
      and(
        gte(scheduleJobs.jobDate, startDate),
        lte(scheduleJobs.jobDate, endDate)
      )
    );

  const totalPaid = jobs
    .filter((j) => j.status === "paid")
    .reduce((sum, j) => sum + j.payAmount, 0);
  const totalPending = jobs
    .filter((j) => j.status === "pending")
    .reduce((sum, j) => sum + j.payAmount, 0);

  return {
    totalPaid,
    totalPending,
    total: totalPaid + totalPending,
    jobCount: jobs.length,
  };
}

export async function getYearlyStats(year: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const jobs = await db
    .select()
    .from(scheduleJobs)
    .where(
      and(
        gte(scheduleJobs.jobDate, startDate),
        lte(scheduleJobs.jobDate, endDate)
      )
    );

  // Group by month
  const monthlyStats: {
    month: number;
    totalPaid: number;
    totalPending: number;
    total: number;
  }[] = [];

  for (let m = 1; m <= 12; m++) {
    const monthStr = String(m).padStart(2, "0");
    const prefix = `${year}-${monthStr}`;
    const monthJobs = jobs.filter((j) => j.jobDate.startsWith(prefix));

    const totalPaid = monthJobs
      .filter((j) => j.status === "paid")
      .reduce((sum, j) => sum + j.payAmount, 0);
    const totalPending = monthJobs
      .filter((j) => j.status === "pending")
      .reduce((sum, j) => sum + j.payAmount, 0);

    monthlyStats.push({
      month: m,
      totalPaid,
      totalPending,
      total: totalPaid + totalPending,
    });
  }

  return monthlyStats;
}
