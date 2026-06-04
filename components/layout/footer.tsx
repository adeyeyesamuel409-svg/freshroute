import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          FreshRoute
        </p>
        <p className="mb-4">
          Fresh produce from local farms, delivered to your door.
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <Link href="/app/products" className="hover:text-green-700 transition-colors">
            Produce
          </Link>
          <Link href="/login" className="hover:text-green-700 transition-colors">
            Sign In
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} FreshRoute. All rights reserved.</p>
      </div>
    </footer>
  );
}
