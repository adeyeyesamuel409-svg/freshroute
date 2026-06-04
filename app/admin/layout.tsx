import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-check";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="w-56 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4 hidden md:block">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Admin
        </p>
        <nav className="space-y-1 text-sm">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/orders"
            className="block px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Orders
          </Link>
          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/products/new"
            className="block px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            + New Product
          </Link>
        </nav>
      </aside>

      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
