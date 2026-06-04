"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdminAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Forbidden");
  return supabase;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["dispatched", "cancelled"],
  dispatched: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await requireAdminAction();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) throw new Error("Order not found");

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed || !allowed.includes(status)) {
    throw new Error(
      `Cannot transition order from "${order.status}" to "${status}".`,
    );
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw new Error(`Failed to update order: ${error.message}`);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

type ProductInput = {
  farm_id: string;
  category_id?: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image_url: string;
  stock_qty: number;
  is_available: boolean;
};

export async function createProduct(input: ProductInput) {
  const supabase = await requireAdminAction();
  const { error } = await supabase.from("products").insert({
    farm_id: input.farm_id,
    category_id: input.category_id || null,
    name: input.name,
    description: input.description,
    price: input.price,
    unit: input.unit,
    image_url: input.image_url,
    stock_qty: input.stock_qty,
    is_available: input.is_available,
  });

  if (error) throw new Error(`Failed to create product: ${error.message}`);

  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = await requireAdminAction();
  const { error } = await supabase
    .from("products")
    .update({
      farm_id: input.farm_id,
      category_id: input.category_id || null,
      name: input.name,
      description: input.description,
      price: input.price,
      unit: input.unit,
      image_url: input.image_url,
      stock_qty: input.stock_qty,
      is_available: input.is_available,
    })
    .eq("id", id);

  if (error) throw new Error(`Failed to update product: ${error.message}`);

  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdminAction();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) throw new Error(`Failed to delete product: ${error.message}`);

  revalidatePath("/admin/products");
}
