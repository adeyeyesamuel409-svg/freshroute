import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { OrderItem } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

const steps = [
  {
    key: "pending",
    label: "Order Placed",
    desc: "Your order has been received and is awaiting confirmation.",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    desc: "Your order has been confirmed and we are preparing your produce.",
  },
  {
    key: "dispatched",
    label: "Dispatched",
    desc: "Your order is on its way and will arrive soon.",
  },
  {
    key: "delivered",
    label: "Delivered",
    desc: "Your order has been delivered. Enjoy your fresh produce!",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single();

  if (error || !order) notFound();

  const isCancelled = order.status === "cancelled";
  const currentIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/app/account/orders"
        className="text-sm text-green-700 hover:underline mb-6 inline-block"
      >
        &larr; My Orders
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Order #{order.id.slice(0, 8)}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Placed on {new Date(order.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-6">Order Status</h2>

        {isCancelled ? (
          <div className="space-y-0">
            {steps.slice(0, currentIdx).map((step, i) => (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-green-300 my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  {i === 0 && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Cancelled</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  This order has been cancelled.
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatDate(order.updated_at)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {steps.map((step, i) => {
              const isDone = i < currentIdx;
              const isCurrent = i === currentIdx;
              const isFuture = i > currentIdx;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDone || isCurrent
                          ? "bg-green-700"
                          : "bg-gray-200"
                      }`}
                    >
                      {isDone ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-white" : "bg-gray-400"}`} />
                      )}
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${isDone ? "bg-green-300" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className={`pb-8 ${isFuture ? "opacity-40" : ""}`}>
                    <p className={`text-sm font-medium ${isCurrent ? "text-green-700" : ""}`}>
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 text-[11px] font-normal text-green-600">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                    {i === 0 && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    )}
                    {isCurrent && i > 0 && (
                      <p className="text-[11px] text-gray-400 mt-1">
                        Updated {formatDate(order.updated_at)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Delivery Address</h2>
        <p className="text-sm text-gray-600">
          {order.delivery_address}<br />
          {order.delivery_city}, {order.delivery_state} {order.delivery_zip}<br />
          {order.delivery_phone}
        </p>
        {order.delivery_notes && (
          <p className="text-sm text-gray-500 mt-2">
            Notes: {order.delivery_notes}
          </p>
        )}
      </div>

      <div className="border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-2 text-sm">
          {(order.items as OrderItem[])?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product_name} &times; {item.quantity}
              </span>
              <span>&pound;{Number(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>&pound;{Number(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/app/products"
        className="w-full inline-flex h-12 items-center justify-center rounded-full bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
