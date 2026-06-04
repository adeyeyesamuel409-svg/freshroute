import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: farms }, { data: categories }] =
    await Promise.all([
      supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("farms").select("id, name").order("name"),
      supabase.from("categories").select("id, name").order("name"),
    ]);

  if (!product) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm
        product={product}
        farms={farms || []}
        categories={categories || []}
      />
    </div>
  );
}
