"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/admin";

type Farm = { id: string; name: string };
type Category = { id: string; name: string };

type Props = {
  product?: {
    id: string;
    farm_id: string;
    category_id: string | null;
    name: string;
    description: string;
    price: number;
    unit: string;
    image_url: string;
    stock_qty: number;
    is_available: boolean;
  };
  farms: Farm[];
  categories: Category[];
};

export function ProductForm({ product, farms, categories }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!product;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const input = {
      farm_id: form.get("farm_id") as string,
      category_id: (form.get("category_id") as string) || undefined,
      name: form.get("name") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      unit: form.get("unit") as string,
      image_url: form.get("image_url") as string,
      stock_qty: Number(form.get("stock_qty")),
      is_available: form.get("is_available") === "true",
    };

    try {
      if (isEdit) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Farm *</label>
        <select
          name="farm_id"
          defaultValue={product?.farm_id || ""}
          required
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select farm</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category_id"
          defaultValue={product?.category_id || ""}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          name="name"
          defaultValue={product?.name || ""}
          required
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description || ""}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price || ""}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit *</label>
          <input
            name="unit"
            defaultValue={product?.unit || "kg"}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          name="image_url"
          defaultValue={product?.image_url || ""}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stock Qty *</label>
          <input
            name="stock_qty"
            type="number"
            min="0"
            defaultValue={product?.stock_qty || "0"}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <select
            name="is_available"
            defaultValue={product?.is_available ? "true" : "false"}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="h-10 rounded-lg bg-green-700 px-6 text-sm text-white font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
        >
          {submitting
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 rounded-lg border px-6 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
