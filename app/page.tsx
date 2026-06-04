import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from("products")
    .select("id, name, price, unit, image_url, farm_id")
    .eq("is_available", true)
    .limit(8);

  const [farmsResult, catResult] = await Promise.all([
    supabase.from("farms").select("id, name, description, location, image_url"),
    supabase.from("categories").select("id, name, slug, image_url"),
  ]);

  const farmMap = Object.fromEntries(
    (farmsResult.data || []).map((f) => [f.id, f.name]),
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Church_Farm%2C_Stockton%2C_Norfolk_-_geograph.org.uk_-_1968544.jpg/1280px-Church_Farm%2C_Stockton%2C_Norfolk_-_geograph.org.uk_-_1968544.jpg"
            alt="Farm landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/75 to-emerald-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">
          <div className="max-w-2xl">
            <div className="inline-block mb-4 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-green-100 text-sm font-medium border border-white/10">
              &#127793; Farm-fresh produce, delivered to your door
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              From Our
              <span className="text-green-300 block">Fields to Your</span>
              Table
            </h1>
            <p className="text-lg text-green-50/80 max-w-lg mb-10 leading-relaxed">
              Order the freshest fruits, vegetables, and herbs directly from local farms. Hand-picked at peak ripeness and delivered by courier.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/app/products"
                className="inline-flex h-13 items-center justify-center rounded-full bg-green-500 px-9 text-white font-semibold hover:bg-green-400 transition-all shadow-xl shadow-green-900/30 hover:shadow-green-500/30 hover:scale-105 active:scale-100"
              >
                Shop Now
              </Link>
              <Link
                href="/app/products"
                className="inline-flex h-13 items-center justify-center rounded-full border-2 border-white/25 px-9 text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
              >
                Browse Produce
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Category Cards */}
      {catResult.data && catResult.data.length > 0 && (
        <section className="py-20 -mt-2 relative z-10 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-green-700 text-sm font-semibold tracking-widest uppercase">Categories</span>
              <h2 className="text-3xl font-bold mt-2 text-stone-800">What We Grow</h2>
              <p className="text-stone-500 mt-2 max-w-md mx-auto">Fresh produce from our partner farms, organised by category</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {catResult.data.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/app/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] block shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg drop-shadow-sm">{cat.name}</h3>
                    <span className="text-white/70 text-xs group-hover:text-white transition-colors inline-flex items-center gap-1">
                      Browse &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Farm Partners */}
      {farmsResult.data && farmsResult.data.length > 0 && (
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="text-green-700 text-sm font-semibold tracking-widest uppercase">Our Farms</span>
              <h2 className="text-3xl font-bold mt-2 text-stone-800">Meet the Growers</h2>
              <p className="text-stone-500 mt-2 max-w-md mx-auto">Family farms and growers committed to sustainable agriculture</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmsResult.data.slice(0, 3).map((farm) => (
                <div
                  key={farm.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={farm.image_url}
                      alt={farm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-stone-800 text-lg">{farm.name}</h3>
                    <p className="text-stone-500 text-sm mt-1 flex items-center gap-1">
                      <span>&#128205;</span> {farm.location}
                    </p>
                    <p className="text-stone-600 text-sm mt-3 leading-relaxed line-clamp-2">
                      {farm.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-green-700 text-sm font-semibold tracking-widest uppercase">How It Works</span>
            <h2 className="text-3xl font-bold mt-2 text-stone-800">From Farm to Doorstep</h2>
            <p className="text-stone-500 mt-2 max-w-md mx-auto">Three simple steps to enjoying the freshest local produce</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-green-200 -z-0" />
            {[
              {
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                    <path d="M24 4C20 4 12 8 12 16C12 22 18 28 24 34C30 28 36 22 36 16C36 8 28 4 24 4Z" fill="currentColor" opacity="0.3"/>
                    <circle cx="24" cy="16" r="6" fill="currentColor"/>
                    <path d="M16 28C12 30 8 34 6 40H42C40 34 36 30 32 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                step: "01",
                title: "Choose Your Produce",
                desc: "Browse our selection of farm-fresh fruits, vegetables, and herbs. Filter by farm, category, or search for your favourites.",
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                    <rect x="6" y="14" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14 14V10C14 7 16 5 19 5H29C32 5 34 7 34 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="24" cy="28" r="4" fill="currentColor" opacity="0.3"/>
                  </svg>
                ),
                step: "02",
                title: "Place Your Order",
                desc: "Add items to your cart, enter your delivery address, and securely place your order. We'll confirm right away.",
              },
              {
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
                    <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2"/>
                    <path d="M24 14V24L30 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 24H16M20 24H28M32 24H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                ),
                step: "03",
                title: "Track Your Delivery",
                desc: "We dispatch your order via courier. Follow its journey with real-time status updates from farm to your door.",
              },
            ].map((item) => (
              <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-700 mb-6 shadow-sm">
                  {item.icon}
                </div>
                <span className="text-green-600 font-bold text-sm tracking-wider">{item.step}</span>
                <h3 className="font-bold text-stone-800 text-lg mt-1 mb-3">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Produce */}
      {featured && featured.length > 0 && (
        <section className="py-20 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-green-700 text-sm font-semibold tracking-widest uppercase">Featured</span>
                <h2 className="text-3xl font-bold mt-2 text-stone-800">Fresh This Week</h2>
                <p className="text-stone-500 mt-1">Hand-picked selections at peak ripeness</p>
              </div>
              <Link
                href="/app/products"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-all shadow-md hover:shadow-lg"
              >
                View All
                <span>&rarr;</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/app/products/${product.id}`}
                  className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-semibold text-green-800 shadow-sm">
                      Fresh
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-stone-500 mb-1 truncate">
                      {farmMap[product.farm_id] || ""}
                    </p>
                    <h3 className="text-sm font-semibold text-stone-800 group-hover:text-green-700 transition-colors leading-tight">
                      {product.name}
                    </h3>
                    <p className="font-bold text-stone-900 text-base mt-2">
                      &pound;{Number(product.price).toFixed(2)}
                      <span className="font-normal text-xs text-stone-500">
                        {" "}/ {product.unit}
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link
                href="/app/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-all shadow-md"
              >
                View All Products
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats + CTA */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-green-900 via-emerald-800 to-green-950">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-14">
            {[
              { num: "65+", label: "Products" },
              { num: "5", label: "Partner Farms" },
              { num: "1000+", label: "Orders Delivered" },
              { num: "99%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-green-300">{stat.num}</div>
                <div className="text-sm text-green-100/70 mt-1.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Taste the Difference?</h2>
            <p className="text-green-100/70 max-w-lg mx-auto mb-8">
              Join hundreds of happy customers getting farm-fresh produce delivered straight to their door.
            </p>
            <Link
              href="/app/products"
              className="inline-flex h-13 items-center justify-center rounded-full bg-green-500 px-10 text-white font-semibold hover:bg-green-400 transition-all shadow-xl shadow-green-900/30 hover:shadow-green-500/30 hover:scale-105 active:scale-100"
            >
              Start Shopping
            </Link>
          </div>
        </div>
        {/* Decorative top curve */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent" />
      </section>
    </div>
  );
}
