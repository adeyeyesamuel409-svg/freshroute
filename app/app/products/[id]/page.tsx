import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*, farm:farms(*), category:categories(*)")
    .eq("id", id)
    .single();

  if (error || !product) notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{product.farm?.name}</span>
            {product.category && (
              <>
                <span>·</span>
                <span>{product.category.name}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold">
              £{Number(product.price).toFixed(2)}
            </span>
            <span className="text-gray-500">/ {product.unit}</span>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            {product.stock_qty > 0 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
            {product.stock_qty > 0 && product.stock_qty <= 20 && (
              <span className="ml-2">— Only {product.stock_qty} left</span>
            )}
          </div>

          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={Number(product.price)}
            unit={product.unit}
            imageUrl={product.image_url}
            farmName={product.farm?.name || ""}
            disabled={!product.is_available || product.stock_qty === 0}
          />
        </div>
      </div>
    </div>
  );
}
