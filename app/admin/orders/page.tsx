import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import Link from "next/link";

const STATUSES = ["", "pending", "confirmed", "dispatched", "delivered", "cancelled"] as const;
const PER_PAGE = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { status, page } = await searchParams;
  const currentStatus = typeof status === "string" && STATUSES.includes(status as any) ? status : "";
  const currentPage = Math.max(1, Number(page) || 1);

  let query = supabase.from("orders").select("*, items:order_items(*)", { count: "exact" });
  if (currentStatus) {
    query = query.eq("status", currentStatus);
  }
  const { data: orders, count: totalOrders } = await query
    .order("created_at", { ascending: false })
    .range((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE - 1);

  const totalPages = Math.ceil((totalOrders ?? 0) / PER_PAGE);

  function filterUrl(s: string, p: number) {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/orders${qs ? "?" + qs : ""}`;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => {
          const label = s ? s.charAt(0).toUpperCase() + s.slice(1) : "All";
          const href = filterUrl(s, 1);
          return (
            <Link
              key={s || "all"}
              href={href}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                currentStatus === s
                  ? "bg-green-700 text-white border-green-700"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">Order</th>
              <th className="pb-3 pr-4 font-medium">Customer</th>
              <th className="pb-3 pr-4 font-medium">Items</th>
              <th className="pb-3 pr-4 font-medium">Total</th>
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {!orders || orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="pt-8 text-center text-gray-500">
                  No orders{currentStatus ? ` with status "${currentStatus}"` : ""} yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs text-blue-600 hover:underline"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">
                    <div>{order.delivery_phone}</div>
                    <div className="text-xs text-gray-500">
                      {order.delivery_city}, {order.delivery_state}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    &pound;{Number(order.total_amount).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3 pr-4">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="py-3 text-xs text-gray-500 max-w-40 truncate">
                    {order.delivery_address}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Link
            href={filterUrl(currentStatus, currentPage - 1)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
              currentPage <= 1
                ? "text-gray-300 border-gray-200 pointer-events-none"
                : "text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Previous
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={filterUrl(currentStatus, p)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                currentPage === p
                  ? "bg-green-700 text-white border-green-700"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {p}
            </Link>
          ))}
          <Link
            href={filterUrl(currentStatus, currentPage + 1)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
              currentPage >= totalPages
                ? "text-gray-300 border-gray-200 pointer-events-none"
                : "text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
