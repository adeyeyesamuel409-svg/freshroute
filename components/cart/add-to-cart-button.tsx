"use client";

import { useCart } from "@/components/cart/cart-context";

type Props = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  imageUrl: string;
  farmName: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  name,
  price,
  unit,
  imageUrl,
  farmName,
  disabled,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() =>
        addItem({
          id: crypto.randomUUID(),
          productId,
          name,
          price,
          unit,
          imageUrl,
          farmName,
          quantity: 1,
        })
      }
      disabled={disabled}
      className="w-full md:w-auto px-8 py-3 rounded-full bg-green-700 text-white font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {disabled ? "Unavailable" : "Add to Cart"}
    </button>
  );
}
