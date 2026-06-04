"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-check";

export type SalesTrendPoint = {
  date: string;
  revenue: number;
  orders: number;
};

export type PopularProduct = {
  name: string;
  quantity: number;
  revenue: number;
};

export async function getSalesTrend(days: number = 30): Promise<SalesTrendPoint[]> {
  await requireAdmin();
  const supabase = await createClient();

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("orders")
    .select("total_amount, created_at")
    .gte("created_at", since.toISOString())
    .eq("status", "delivered")
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) return [];

  const daily = new Map<string, { revenue: number; orders: number }>();

  for (const order of data) {
    const date = new Date(order.created_at).toISOString().slice(0, 10);
    const existing = daily.get(date) || { revenue: 0, orders: 0 };
    existing.revenue += Number(order.total_amount);
    existing.orders += 1;
    daily.set(date, existing);
  }

  const trend: SalesTrendPoint[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const point = daily.get(key);
    trend.push({
      date: key,
      revenue: point?.revenue ?? 0,
      orders: point?.orders ?? 0,
    });
  }

  return trend;
}

export async function getPopularProducts(limit: number = 10): Promise<PopularProduct[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("order_items")
    .select("product_name, quantity, subtotal");

  if (!data || data.length === 0) return [];

  const grouped = new Map<string, { quantity: number; revenue: number }>();

  for (const item of data) {
    const existing = grouped.get(item.product_name) || { quantity: 0, revenue: 0 };
    existing.quantity += item.quantity;
    existing.revenue += Number(item.subtotal);
    grouped.set(item.product_name, existing);
  }

  return Array.from(grouped.entries())
    .map(([name, stats]) => ({
      name,
      quantity: stats.quantity,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}
