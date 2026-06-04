"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { name: string; quantity: number; revenue: number }[];
};

export function PopularProductsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No product sales data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 0, left: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          stroke="#9ca3af"
          width={140}
        />
        <Tooltip
          formatter={(value) => [value, "Units Sold"]}
        />
        <Bar dataKey="quantity" fill="#15803d" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
