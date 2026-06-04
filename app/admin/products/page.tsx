import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, farm:farms(name), category:categories(name)")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center rounded-lg bg-green-700 px-4 text-sm text-white font-medium hover:bg-green-800 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Farm</th>
              <th className="pb-3 pr-4 font-medium">Category</th>
              <th className="pb-3 pr-4 font-medium">Price</th>
              <th className="pb-3 pr-4 font-medium">Stock</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.length === 0 ? (
              <tr>
                <td colSpan={7} className="pt-8 text-center text-gray-500">
                  No products yet.
                </td>
              </tr>
            ) : (
              products?.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="py-3 pr-4 font-medium">{product.name}</td>
                  <td className="py-3 pr-4 text-gray-600">{product.farm?.name}</td>
                  <td className="py-3 pr-4 text-gray-600 capitalize">
                    {product.category?.name || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    £{Number(product.price).toFixed(2)} / {product.unit}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={
                        product.stock_qty > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {product.stock_qty}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {product.is_available ? (
                      <span className="text-green-600 text-xs font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 text-xs font-medium">Hidden</span>
                    )}
                  </td>
                  <td className="py-3 flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} name={product.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
