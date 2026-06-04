"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { placeOrder } from "@/lib/actions/checkout";
import { createClient } from "@/lib/supabase/browser";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      router.push("/app/cart");
    }
  }, [items.length, router]);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  if (items.length === 0) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("Please sign in to place an order.");
      return;
    }

    if (!address || !city || !state || !zip || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await placeOrder(
        userId,
        items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          unitPrice: i.price,
          quantity: i.quantity,
        })),
        { address, city, state, zip, phone, notes },
      );

      clearCart();
      router.push(`/app/orders/${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {!userId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
          You need to{" "}
          <a href="/login" className="font-medium underline">sign in</a>
          {" "}to place an order.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Delivery Address</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address *</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City *</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State *</label>
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Postcode"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Delivery Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={2}
                placeholder="Optional: delivery instructions, gate code, etc."
              />
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Summary</h2>

          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Payment Method</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: "debit", label: "Debit", icon: "💳" },
              { id: "visa", label: "Visa", icon: "💳" },
              { id: "credit", label: "Credit Card", icon: "💳" },
              { id: "paypal", label: "PayPal", icon: "🅿️" },
              { id: "klarna", label: "Klarna", icon: "🅺" },
            ].map((method) => (
              <label
                key={method.id}
                className="flex flex-col items-center gap-1.5 p-3 border-2 rounded-xl cursor-pointer transition-all hover:border-green-400 has-[:checked]:border-green-600 has-[:checked]:bg-green-50"
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  className="sr-only"
                  defaultChecked={method.id === "debit"}
                />
                <span className="text-lg">{method.icon}</span>
                <span className="text-xs font-medium text-stone-700">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting || !userId}
          className="w-full h-12 rounded-full bg-green-700 text-white font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
        >
          {submitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
