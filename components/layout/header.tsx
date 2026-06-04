"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { createClient } from "@/lib/supabase/browser";
import { signOut } from "@/lib/actions/auth";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const { itemCount } = useCart();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
        <Link href="/" className="font-bold text-lg tracking-tight">
          FreshRoute
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/app/products" className="hover:text-green-700 transition-colors">
            Produce
          </Link>
          <Link href="/app/cart" className="relative hover:text-green-700 transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-green-700 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/admin" className="hover:text-green-700 transition-colors">
                Admin
              </Link>
              <Link href="/app/account/orders" className="hover:text-green-700 transition-colors">
                Orders
              </Link>
              <form action={signOut}>
                <button type="submit" className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="hover:text-green-700 transition-colors">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
