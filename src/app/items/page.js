"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import PageBanner from "@/components/PageBanner";
import ProductCard from "@/components/ProductCard";
import { fetchAllDynamicProducts, normalizeProduct } from "@/lib/fetchProducts";
import { subscribeToCatalog } from "@/lib/data-fetcher";
import {
  Search,
  X,
  Filter,
  Package,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";

function ProductsContent({ city }) {
  // Firebase dynamic products only
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlCategory = searchParams
    ? searchParams.get("category") || searchParams.get("cat")
    : null;

  // ---------------------------------------------------------
  // DISTRICT / CITY ROUTE
  // ---------------------------------------------------------

  const pathParts = pathname.split("/").filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
    "products",
  ];

  const district =
    pathParts.length > 0 && !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : null;

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    if (path.startsWith("/items?")) {
      return `/${district}${path}`;
    }

    return `/${district}${path.startsWith("/") ? path : `/${path}`}`;
  };

  // ---------------------------------------------------------
  // LOAD PRODUCTS FROM FIREBASE
  // ---------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const loadInitialProducts = async () => {
      try {
        const fetched = await fetchAllDynamicProducts();

        if (!isMounted) return;

        if (Array.isArray(fetched)) {
          // Firebase data only
          setProducts(
            fetched
              .map((item) => normalizeProduct(item))
              .filter(Boolean)
          );
        } else {
          // No dynamic data
          setProducts([]);
        }
      } catch (err) {
        console.error("Error loading dynamic products:", err);

        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInitialProducts();

    // -------------------------------------------------------
    // REAL-TIME FIREBASE CATALOG
    // -------------------------------------------------------

    const unsubscribe = subscribeToCatalog((updatedCatalog) => {
      if (!isMounted) return;

      if (Array.isArray(updatedCatalog)) {
        const normalized = updatedCatalog
          .map((item) => normalizeProduct(item))
          .filter(Boolean);

        // Always update from Firebase.
        // Empty Firebase catalog = empty website catalog.
        setProducts(normalized);
      } else {
        setProducts([]);
      }
    });

    return () => {
      isMounted = false;

      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // ---------------------------------------------------------
  // DYNAMIC CATEGORIES
  // ---------------------------------------------------------

  const categoriesList = useMemo(() => {
    const categorySet = new Set(["All Categories"]);

    products.forEach((product) => {
      if (product.category && String(product.category).trim()) {
        categorySet.add(String(product.category).trim());
      }
    });

    return Array.from(categorySet);
  }, [products]);

  // ---------------------------------------------------------
  // SYNC CATEGORY FROM URL
  // ---------------------------------------------------------

  useEffect(() => {
    if (
      urlCategory &&
      typeof urlCategory === "string" &&
      urlCategory.trim()
    ) {
      const decoded = decodeURIComponent(urlCategory.trim());

      // Only select category if it exists in current Firebase data
      const matchingCategory = categoriesList.find(
        (cat) =>
          cat.toLowerCase().trim() === decoded.toLowerCase().trim()
      );

      if (matchingCategory) {
        setSelectedCategory(matchingCategory);
      }
    }
  }, [urlCategory, categoriesList]);

  // ---------------------------------------------------------
  // FILTER PRODUCTS
  // ---------------------------------------------------------

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const selected = selectedCategory.toLowerCase().trim();

      const matchesCategory =
        selectedCategory === "All Categories" ||
        (product.category &&
          String(product.category).toLowerCase().trim() === selected) ||
        (product.subCategory &&
          String(product.subCategory).toLowerCase().trim() === selected);

      const q = searchQuery.toLowerCase().trim();

      const matchesQuery =
        !q ||
        (product.title &&
          String(product.title).toLowerCase().includes(q)) ||
        (product.description &&
          String(product.description).toLowerCase().includes(q)) ||
        (product.category &&
          String(product.category).toLowerCase().includes(q)) ||
        (product.brand &&
          String(product.brand).toLowerCase().includes(q)) ||
        (product.model &&
          String(product.model).toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // ---------------------------------------------------------
  // RESET FILTERS
  // ---------------------------------------------------------

  const resetFilters = () => {
    setSelectedCategory("All Categories");
    setSearchQuery("");
  };

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  return (
    <div className="bg-[#FFF9F8] text-[#2D1818]">

      {/* =====================================================
          PAGE BANNER
      ===================================================== */}

      <PageBanner
        badge="Product Inventory"
        title={
          city
            ? `Diagnostic Equipment Collection in ${city}`
            : "Diagnostic Equipment Collection"
        }
        subtitle="Explore our certified catalog of clinical chemistry analyzers, hematology counters, PCR systems, patient monitors, and laboratory consumables."
      />

      {/* =====================================================
          MAIN CATALOG
      ===================================================== */}

      <section className="section-padding bg-gradient-to-b from-white via-[#FFF9F8] to-[#FFF0EF]">
        <div className="container-custom">

          {/* =================================================
              FILTER / SEARCH BAR
          ================================================= */}

          <div className="sticky top-20 z-40 rounded-2xl sm:rounded-3xl border border-[#FBD5D3] bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-lg shadow-[#E05353]/5 transition-all">

            <div className="grid gap-4 md:grid-cols-12 items-center">

              {/* Search */}
              <div className="md:col-span-5 relative">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E05353]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by equipment name, model, or parameter..."
                  className="w-full rounded-xl border border-[#FBD5D3] bg-[#FFF0EF]/40 pl-10 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm text-[#2D1818] transition-all focus:border-[#E05353] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E05353]/20"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#796565] hover:text-[#E05353]"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}

              </div>

              {/* Dynamic Category Filter */}
              <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">

                <Filter
                  size={16}
                  className="text-[#E05353] shrink-0 mr-1"
                />

                {categoriesList.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${selectedCategory.toLowerCase().trim() ===
                      category.toLowerCase().trim()
                      ? "bg-[#E05353] text-white shadow-md shadow-[#E05353]/30"
                      : "bg-[#FFF0EF] border border-[#FBD5D3] text-[#796565] hover:bg-[#FDE2E1]"
                      }`}
                  >
                    {category}
                  </button>
                ))}

              </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 flex items-center justify-between border-t border-[#FBD5D3]/40 pt-3 text-xs font-semibold text-[#796565]">

              <span>
                Showing{" "}
                <strong className="text-[#E05353] font-bold">
                  {filteredProducts.length}
                </strong>{" "}
                of {products.length} instruments

                {selectedCategory !== "All Categories" && (
                  <span className="ml-1 text-[#E05353] font-bold">
                    &ldquo;{selectedCategory}&rdquo;
                  </span>
                )}
              </span>

              {(selectedCategory !== "All Categories" ||
                searchQuery) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[#E05353] font-bold hover:underline"
                  >
                    Reset all filters
                  </button>
                )}

            </div>
          </div>

          {/* =================================================
              LOADING STATE
          ================================================= */}

          {loading ? (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-[#FBD5D3] bg-white p-5 shadow-sm animate-pulse"
                >
                  <div className="h-48 rounded-2xl bg-[#FFF0EF]" />

                  <div className="mt-5 h-5 w-3/4 rounded bg-[#FFF0EF]" />

                  <div className="mt-3 h-4 w-full rounded bg-[#FFF0EF]" />

                  <div className="mt-2 h-4 w-5/6 rounded bg-[#FFF0EF]" />

                  <div className="mt-5 h-10 w-32 rounded-xl bg-[#FFF0EF]" />
                </div>
              ))}

            </div>
          ) : filteredProducts.length === 0 ? (

            /* =================================================
               NO PRODUCTS
            ================================================= */

            <div className="mt-16 text-center rounded-3xl border border-[#FBD5D3] bg-white p-16 shadow-sm">

              <Package
                size={48}
                className="mx-auto text-[#E05353]/60 mb-4 animate-bounce"
              />

              <h3 className="text-2xl font-bold text-[#2D1818]">
                No Instruments Found
              </h3>

              <p className="mt-2 text-sm text-[#796565]">
                {products.length === 0
                  ? "No diagnostic instruments are currently available."
                  : "Try adjusting your search keyword or selecting a different equipment category."}
              </p>

              {(selectedCategory !== "All Categories" ||
                searchQuery) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#E05353] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#E05353]/25 hover:bg-[#C93B3B]"
                  >
                    Clear Search Filters
                  </button>
                )}

            </div>

          ) : (

            /* =================================================
               DYNAMIC PRODUCT GRID
            ================================================= */

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product.slug}
                  product={product}
                  makeLink={makeLink}
                />
              ))}

            </div>

          )}

        </div>
      </section>

      {/* =====================================================
          BULK PROCUREMENT BANNER
      ===================================================== */}

      <section className="section-padding bg-white border-t border-[#FBD5D3]/60">

        <div className="container-custom">

          <div className="rounded-3xl border border-[#FBD5D3] bg-gradient-to-r from-[#FFF0EF] via-[#FFF9F8] to-[#FEEAE8] p-8 sm:p-12 shadow-lg">

            <div className="grid lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-8">

                <span className="inline-flex items-center gap-2 rounded-full border border-[#E05353]/30 bg-white px-4 py-1.5 text-xs font-bold text-[#C93B3B] uppercase tracking-wider">

                  <ShieldCheck
                    size={16}
                    className="text-[#E05353]"
                  />

                  Bulk Hospital Orders & Tenders

                </span>

                <h3 className="mt-4 text-3xl font-black text-[#2D1818]">
                  Procuring Equipment for New Hospital Blocks or Diagnostics Chains?
                </h3>

                <p className="mt-3 text-base text-[#796565] leading-relaxed">
                  We offer institutional discounts, customized equipment leasing plans, and complete turnkey lab setup packages with extended AMC warranties.
                </p>

              </div>

              <div className="lg:col-span-4 flex items-center justify-end">

                <a
                  href={makeLink("/contact")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E05353] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#E05353]/30 transition-all hover:bg-[#C93B3B] hover:-translate-y-0.5"
                >

                  <span className="font-bold text-white">
                    Request Bulk Tender Quote
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-white"
                  />

                </a>

              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

// ============================================================
// PAGE WRAPPER
// ============================================================

export default function ItemsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF9F8]">

          <div className="flex flex-col items-center gap-3">

            <Loader2
              size={36}
              className="animate-spin text-[#E05353]"
            />

            <p className="text-sm font-bold text-[#2D1818]">
              Loading Diagnostic Catalog...
            </p>

          </div>

        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}