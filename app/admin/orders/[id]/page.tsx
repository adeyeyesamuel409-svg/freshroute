import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { OrderItem } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orders"
        className="text-sm text-green-700 hover:underline mb-4 inline-block"
      >
        &larr; Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3">Customer</h2>
          <p className="text-sm text-gray-600">{order.delivery_phone}</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3">Total</h2>
          <p className="text-2xl font-bold">
            &pound;{Number(order.total_amount).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Delivery Address</h2>
        <p className="text-sm text-gray-600">
          {order.delivery_address}<br />
          {order.delivery_city}, {order.delivery_state} {order.delivery_zip}
        </p>
        {order.delivery_notes && (
          <p className="text-sm text-gray-500 mt-2">
            Notes: {order.delivery_notes}
          </p>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="text-sm font-semibold">Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 text-xs">
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Unit Price</th>
              <th className="px-4 py-2 font-medium">Qty</th>
              <th className="px-4 py-2 font-medium text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {(order.items as OrderItem[])?.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3">{item.product_name}</td>
                <td className="px-4 py-3 text-gray-600">
                  &pound;{Number(item.unit_price).toFixed(2)}
                </td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-medium">
                  &pound;{Number(item.subtotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-bold">
              <td colSpan={3} className="px-4 py-3 text-right">
                Total
              </td>
              <td className="px-4 py-3 text-right">
                &pound;{Number(order.total_amount).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
