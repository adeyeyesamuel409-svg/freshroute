import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  dispatched: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function AccountOrdersPage() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <p className="text-red-500">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <Link
            href="/app/products"
            className="inline-flex h-11 items-center rounded-full bg-green-700 px-6 text-white font-medium hover:bg-green-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/app/orders/${order.id}`}
              className="block border rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">
                  Order #{order.id.slice(0, 8)}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="font-medium text-gray-800">
                  £{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 truncate">
                {order.delivery_city}, {order.delivery_state}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
