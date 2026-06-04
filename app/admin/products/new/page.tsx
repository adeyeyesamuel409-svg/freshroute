import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const supabase = await createClient();

  const [{ data: farms }, { data: categories }] = await Promise.all([
    supabase.from("farms").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <ProductForm farms={farms || []} categories={categories || []} />
    </div>
  );
}
