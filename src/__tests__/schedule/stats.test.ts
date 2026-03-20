import { describe, it, expect } from "vitest";

// Test income aggregation logic (mirrors getIncomeStats server action logic)
function aggregateStats(
  jobs: Array<{ status: string; payAmount: number }>
): { totalPaid: number; totalPending: number; total: number; jobCount: number } {
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

// Test yearly grouping logic (mirrors getYearlyStats server action logic)
function groupByMonth(
  jobs: Array<{ jobDate: string; status: string; payAmount: number }>,
  year: number
): Array<{ month: number; totalPaid: number; totalPending: number; total: number }> {
  const result = [];
  for (let m = 1; m <= 12; m++) {
    const prefix = `${year}-${String(m).padStart(2, "0")}`;
    const monthJobs = jobs.filter((j) => j.jobDate.startsWith(prefix));
    const totalPaid = monthJobs
      .filter((j) => j.status === "paid")
      .reduce((sum, j) => sum + j.payAmount, 0);
    const totalPending = monthJobs
      .filter((j) => j.status === "pending")
      .reduce((sum, j) => sum + j.payAmount, 0);
    result.push({ month: m, totalPaid, totalPending, total: totalPaid + totalPending });
  }
  return result;
}

describe("Income stats aggregation", () => {
  it("calculates totalPaid as sum of paid jobs", () => {
    const jobs = [
      { status: "paid", payAmount: 5000000 },
      { status: "paid", payAmount: 3000000 },
      { status: "pending", payAmount: 2000000 },
    ];
    const stats = aggregateStats(jobs);
    expect(stats.totalPaid).toBe(8000000);
  });

  it("calculates totalPending as sum of pending jobs", () => {
    const jobs = [
      { status: "paid", payAmount: 5000000 },
      { status: "pending", payAmount: 2000000 },
      { status: "pending", payAmount: 1000000 },
    ];
    const stats = aggregateStats(jobs);
    expect(stats.totalPending).toBe(3000000);
  });

  it("calculates total as paid + pending", () => {
    const jobs = [
      { status: "paid", payAmount: 5000000 },
      { status: "pending", payAmount: 2000000 },
    ];
    const stats = aggregateStats(jobs);
    expect(stats.total).toBe(7000000);
  });

  it("returns zeros for empty job list", () => {
    const stats = aggregateStats([]);
    expect(stats.totalPaid).toBe(0);
    expect(stats.totalPending).toBe(0);
    expect(stats.total).toBe(0);
    expect(stats.jobCount).toBe(0);
  });

  it("counts jobs correctly", () => {
    const jobs = [
      { status: "paid", payAmount: 1000000 },
      { status: "pending", payAmount: 2000000 },
      { status: "paid", payAmount: 3000000 },
    ];
    const stats = aggregateStats(jobs);
    expect(stats.jobCount).toBe(3);
  });
});

describe("Yearly grouping", () => {
  it("groups jobs correctly by month", () => {
    const jobs = [
      { jobDate: "2026-01-15", status: "paid", payAmount: 5000000 },
      { jobDate: "2026-01-20", status: "pending", payAmount: 2000000 },
      { jobDate: "2026-03-10", status: "paid", payAmount: 3000000 },
    ];
    const result = groupByMonth(jobs, 2026);

    expect(result[0].month).toBe(1); // January
    expect(result[0].totalPaid).toBe(5000000);
    expect(result[0].totalPending).toBe(2000000);
    expect(result[0].total).toBe(7000000);

    expect(result[2].month).toBe(3); // March
    expect(result[2].totalPaid).toBe(3000000);
    expect(result[2].totalPending).toBe(0);
  });

  it("returns zeros for months with no jobs", () => {
    const jobs = [
      { jobDate: "2026-06-15", status: "paid", payAmount: 1000000 },
    ];
    const result = groupByMonth(jobs, 2026);

    // February should be zero
    expect(result[1].totalPaid).toBe(0);
    expect(result[1].totalPending).toBe(0);
    expect(result[1].total).toBe(0);
  });

  it("returns 12 months always", () => {
    const result = groupByMonth([], 2026);
    expect(result).toHaveLength(12);
    result.forEach((m) => {
      expect(m.total).toBe(0);
    });
  });
});
