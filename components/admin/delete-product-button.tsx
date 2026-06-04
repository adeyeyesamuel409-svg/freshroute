"use client";

import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions/admin";

type Props = {
  productId: string;
  name: string;
};

export function DeleteProductButton({ productId, name }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await deleteProduct(productId);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:underline"
    >
      Delete
    </button>
  );
}
