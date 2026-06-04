"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "@/lib/use-debounced-callback";

type Props = {
  categories: { slug: string; name: string }[];
  farms: { id: string; name: string }[];
};

export function ProductFilters({ categories, farms }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentFarm = searchParams.get("farm") || "";

  const setParam = useDebouncedCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    300,
  );

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters = currentSearch || currentCategory || currentFarm;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          defaultValue={currentSearch}
          onChange={(e) => setParam("search", e.target.value)}
          placeholder="Search produce..."
          className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
        />
      </div>

      <select
        value={currentCategory}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) {
            params.set("category", e.target.value);
          } else {
            params.delete("category");
          }
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="border rounded-lg px-3 py-2 text-sm text-stone-900"
      >
        <option value="" className="text-stone-900">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={currentFarm}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value) {
            params.set("farm", e.target.value);
          } else {
            params.delete("farm");
          }
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="border rounded-lg px-3 py-2 text-sm text-stone-900"
      >
        <option value="" className="text-stone-900">All Farms</option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      )}
    </div>
  );
}
