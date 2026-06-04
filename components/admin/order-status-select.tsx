"use client";

import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions/admin";

const statuses = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "text-yellow-700 bg-yellow-50 border-yellow-200",
  confirmed: "text-blue-700 bg-blue-50 border-blue-200",
  dispatched: "text-purple-700 bg-purple-50 border-purple-200",
  delivered: "text-green-700 bg-green-50 border-green-200",
  cancelled: "text-red-700 bg-red-50 border-red-200",
};

type Props = {
  orderId: string;
  currentStatus: string;
};

export function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    try {
      await updateOrderStatus(orderId, e.target.value);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    }
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      className={`text-xs font-medium rounded-full px-2 py-1 border cursor-pointer ${
        statusColors[currentStatus] || "text-gray-700 bg-gray-50 border-gray-200"
      }`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
