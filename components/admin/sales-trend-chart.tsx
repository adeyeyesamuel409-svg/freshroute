"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = {
  data: { date: string; revenue: number; orders: number }[];
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function SalesTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        No sales data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11 }}
          stroke="#9ca3af"
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="#9ca3af"
          tickFormatter={(v) => `£${v}`}
        />
        <Tooltip
          labelFormatter={(label) => formatDate(String(label))}
          formatter={(value) => [`£${Number(value).toFixed(2)}`, "Revenue"]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#15803d"
          strokeWidth={2}
          dot={{ r: 3, fill: "#15803d" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
