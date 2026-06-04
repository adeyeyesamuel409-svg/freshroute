"use server";

import { createClient } from "@/lib/supabase/server";

type ItemInput = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
};

type DeliveryInput = {
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  notes?: string;
};

export async function placeOrder(
  userId: string,
  items: ItemInput[],
  delivery: DeliveryInput,
) {
  const supabase = await createClient();

  const productIds = items.map((i) => i.productId);
  const { data: products, error: fetchError } = await supabase
    .from("products")
    .select("id, stock_qty, name")
    .in("id", productIds);

  if (fetchError) throw new Error(`Failed to fetch products: ${fetchError.message}`);

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new Error(`${item.productName} is no longer available.`);
    }
    if (product.stock_qty < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock_qty}, requested: ${item.quantity}.`,
      );
    }
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      delivery_address: delivery.address,
      delivery_city: delivery.city,
      delivery_state: delivery.state,
      delivery_zip: delivery.zip,
      delivery_phone: delivery.phone,
      delivery_notes: delivery.notes || null,
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    unit_price: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.unitPrice * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`);

  const { error: stockError } = await supabase.rpc("decrement_stock", {
    p_items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
  });

  if (stockError) throw new Error(`Failed to update stock: ${stockError.message}`);

  return { orderId: order.id };
}
