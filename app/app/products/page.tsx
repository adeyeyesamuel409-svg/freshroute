import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ProductFilters } from "@/components/products/product-filters";

const PER_PAGE = 20;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { search, category, farm, page } = await searchParams;
  const searchStr = typeof search === "string" ? search : "";
  const categorySlug = typeof category === "string" ? category : "";
  const farmId = typeof farm === "string" ? farm : "";
  const currentPage = Math.max(1, Number(page) || 1);

  const supabase = await createClient();

  const [catResult, farmResult] = await Promise.all([
    supabase.from("categories").select("id, slug, name").order("name"),
    supabase.from("farms").select("id, name").order("name"),
  ]);

  let countQuery = supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("is_available", true);

  let dataQuery = supabase
    .from("products")
    .select("*, farm:farms(name), category:categories(name,slug)")
    .eq("is_available", true);

  if (searchStr) {
    countQuery = countQuery.ilike("name", `%${searchStr}%`);
    dataQuery = dataQuery.ilike("name", `%${searchStr}%`);
  }
  if (categorySlug) {
    const matched = catResult.data?.find((c) => c.slug === categorySlug);
    if (matched) {
      countQuery = countQuery.eq("category_id", matched.id);
      dataQuery = dataQuery.eq("category_id", matched.id);
    }
  }
  if (farmId) {
    countQuery = countQuery.eq("farm_id", farmId);
    dataQuery = dataQuery.eq("farm_id", farmId);
  }

  const [{ count: totalProducts }, prodResult] = await Promise.all([
    countQuery,
    dataQuery
      .order("name")
      .range((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE - 1),
  ]);

  const products = prodResult.data || [];
  const categories = catResult.data || [];
  const farms = farmResult.data || [];
  const totalPages = Math.ceil((totalProducts ?? 0) / PER_PAGE);

  const categoryOptions = categories.map((c) => ({
    slug: c.slug,
    name: c.name.charAt(0).toUpperCase() + c.name.slice(1).replace(/-/g, " "),
  }));

  function filterUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    if (searchStr) params.set("search", searchStr);
    if (categorySlug && !overrides.category) params.set("category", categorySlug);
    if (farmId && !overrides.farm) params.set("farm", farmId);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return `/app/products${qs ? "?" + qs : ""}`;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Produce</h1>
        <p className="text-gray-500 mt-1">Fresh from local farms to your table</p>
      </div>

      <ProductFilters categories={categoryOptions} farms={farms} />

      {totalProducts !== null && totalProducts !== undefined && (
        <p className="text-sm text-gray-500 mb-4">
          {totalProducts} product{totalProducts !== 1 ? "s" : ""}
          {searchStr && <> matching &ldquo;{searchStr}&rdquo;</>}
          {totalPages > 1 && (
            <span className="ml-2 text-xs text-gray-400">
              (Page {currentPage} of {totalPages})
            </span>
          )}
        </p>
      )}

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-2">No products found.</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/app/products/${product.id}`}
                className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 bg-white"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-0.5 truncate">
                    <span className="truncate">{product.farm?.name}</span>
                    {product.category && (
                      <>
                        <span>·</span>
                        <span className="capitalize truncate">
                          {product.category.name}
                        </span>
                      </>
                    )}
                  </div>

                  <h2 className="text-sm font-semibold group-hover:text-green-700 transition-colors leading-tight">
                    {product.name}
                  </h2>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-bold text-sm">
                      &pound;{Number(product.price).toFixed(2)}
                      <span className="font-normal text-[11px] text-gray-500">
                        {" "}
                        / {product.unit}
                      </span>
                    </span>
                    <span className="text-[11px] text-green-600 font-medium">
                      In Stock
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Link
                href={filterUrl({ page: String(currentPage - 1) })}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  currentPage <= 1
                    ? "text-gray-300 border-gray-200 pointer-events-none"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Previous
              </Link>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={filterUrl({ page: String(p) })}
                  className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                    currentPage === p
                      ? "bg-green-700 text-white border-green-700"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </Link>
              ))}
              <Link
                href={filterUrl({ page: String(currentPage + 1) })}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  currentPage >= totalPages
                    ? "text-gray-300 border-gray-200 pointer-events-none"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
