"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatVND, formatVNDCompact } from "@/lib/schedule/format-vnd";

interface ChartDataPoint {
  label: string;
  paid: number;
  pending: number;
}

interface IncomeChartInnerProps {
  monthlyData: ChartDataPoint[];
  yearlyData: ChartDataPoint[];
}

export default function IncomeChartInner({
  monthlyData,
  yearlyData,
}: IncomeChartInnerProps) {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const data = period === "monthly" ? monthlyData : yearlyData;
  const isEmpty = data.every((d) => d.paid === 0 && d.pending === 0);

  return (
    <div className="bg-surface rounded-lg shadow-sm p-6">
      <div className="flex justify-center mb-4">
        <div className="bg-muted rounded-lg p-1 flex">
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === "monthly"
                ? "bg-accent text-white"
                : "text-text-secondary"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPeriod("yearly")}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              period === "yearly"
                ? "bg-accent text-white"
                : "text-text-secondary"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex items-center justify-center h-[200px] text-text-secondary text-sm">
          No income data for this period.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v: number) => formatVNDCompact(v)} />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatVND(value),
                name === "paid" ? "Paid" : "Pending",
              ]}
            />
            <Bar
              dataKey="paid"
              stackId="income"
              fill="var(--color-paid)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pending"
              stackId="income"
              fill="var(--color-pending)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
