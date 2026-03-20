import dynamic from "next/dynamic";

const IncomeChart = dynamic(() => import("./income-chart-inner"), {
  ssr: false,
  loading: () => (
    <div className="bg-surface rounded-lg shadow-sm p-6 h-[280px] animate-pulse" />
  ),
});

export { IncomeChart };
