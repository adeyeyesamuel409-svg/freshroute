import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getSalesTrend, getPopularProducts } from "@/lib/actions/analytics";
import { SalesTrendChart } from "@/components/admin/sales-trend-chart";
import { PopularProductsChart } from "@/components/admin/popular-products-chart";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: confirmedOrders },
    { count: dispatchedOrders },
    { count: deliveredOrders },
    { count: cancelledOrders },
    { count: totalProducts },
    { count: totalFarms },
    deliveryData,
    recentOrders,
    salesTrend,
    popularProducts,
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "dispatched"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("farms").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount").eq("status", "delivered"),
    supabase.from("orders").select("id, total_amount, status, created_at, delivery_city, delivery_phone").order("created_at", { ascending: false }).limit(5),
    getSalesTrend(30),
    getPopularProducts(10),
  ]);

  const revenue = (deliveryData.data || []).reduce(
    (sum, o) => sum + Number(o.total_amount),
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-3xl font-bold mt-1">
            &pound;{revenue.toFixed(0)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold mt-1">{totalOrders ?? 0}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-3xl font-bold mt-1">{totalProducts ?? 0}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Farms</p>
          <p className="text-3xl font-bold mt-1">{totalFarms ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Pending", count: pendingOrders ?? 0, color: "text-yellow-600" },
          { label: "Confirmed", count: confirmedOrders ?? 0, color: "text-blue-600" },
          { label: "Dispatched", count: dispatchedOrders ?? 0, color: "text-purple-600" },
          { label: "Delivered", count: deliveredOrders ?? 0, color: "text-green-600" },
          { label: "Cancelled", count: cancelledOrders ?? 0, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="border rounded-lg p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="border rounded-lg mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-green-700 hover:underline"
          >
            View all
          </Link>
        </div>
        {recentOrders.data?.length === 0 ? (
          <p className="p-4 text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="divide-y">
            {recentOrders.data?.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <span className="font-mono text-xs text-gray-400">
                    #{order.id.slice(0, 8)}
                  </span>
                  <span className="ml-2">{order.delivery_city}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    &pound;{Number(order.total_amount).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-4">Sales Trend (30 Days)</h2>
          <SalesTrendChart data={salesTrend} />
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-4">Popular Products</h2>
          <PopularProductsChart data={popularProducts} />
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex h-10 items-center rounded-lg bg-green-700 px-4 text-sm text-white font-medium hover:bg-green-800 transition-colors"
        >
          View Orders
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex h-10 items-center rounded-lg border px-4 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          Manage Products
        </Link>
      </div>
    </div>
  );
}
