"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center py-24">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link
          href="/app/products"
          className="inline-flex h-11 items-center rounded-full bg-green-700 px-6 text-white font-medium hover:bg-green-800 transition-colors"
        >
          Browse Produce
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart ({itemCount} items)</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 border rounded-lg p-4"
          >
            <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500">{item.farmName}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                    }
                    className="w-7 h-7 rounded-full border text-sm hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="w-7 h-7 rounded-full border text-sm hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    £{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    £{item.price.toFixed(2)} / {item.unit}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>£{total.toFixed(2)}</span>
        </div>
        <Link
          href="/app/checkout"
          className="w-full inline-flex h-12 items-center justify-center rounded-full bg-green-700 text-white font-medium hover:bg-green-800 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
