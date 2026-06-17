"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ProductCard } from "@/components/site/ProductCard";
import {
  storefrontApiRequest,
  PAGINATED_PRODUCTS_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  OPENING_SALE_COLLECTION_HANDLE,
  type ShopifyProduct,
} from "@/lib/shopify/client";
import { useCartSync } from "@/hooks/useCartSync";

const PAGE_SIZE = 24;
const OPENING_SALE_PRICE = 219;

const CATEGORIES: Array<{ label: string; query: string | null; collection?: string }> = [
  { label: "Opening Sale",      query: null, collection: OPENING_SALE_COLLECTION_HANDLE },
  { label: "All",               query: null },
  { label: "Sofas",             query: 'product_type:"Fabric Sofa" OR product_type:"Leather Sofa" OR product_type:"Faux Leather Sofa" OR product_type:"Wooden Sofa" OR product_type:"Sofa Bed" OR product_type:"Recliner" OR product_type:"Armchair"' },
  { label: "Coffee Tables",     query: 'product_type:"Coffee Table"' },
  { label: "TV Consoles",       query: 'product_type:"TV Console"' },
  { label: "Shoe Cabinets",     query: 'product_type:"Shoe Cabinet"' },
  { label: "Wardrobes",         query: 'product_type:"Modular Wardrobe" OR product_type:"Open Door Wardrobe" OR product_type:"Sliding Door Wardrobe"' },
  { label: "Study Tables",      query: 'product_type:"Study Table"' },
  { label: "Dressing Tables",   query: 'product_type:"Dressing Table"' },
  { label: "Beds",              query: 'product_type:"Bed" OR product_type:"Wooden Bed Frame" OR product_type:"Storage Bed" OR product_type:"Drawer Bed" OR product_type:"Loft Bed" OR product_type:"Bedroom Set"' },
  { label: "Bedside Tables",    query: 'product_type:"Bed Side Table" OR product_type:"Bedside Table"' },
  { label: "Side Tables",       query: 'product_type:"Side Table"' },
  { label: "Mattresses",        query: 'product_type:"Mattress" OR product_type:"Foldable Mattress"' },
  { label: "Office Chairs",     query: 'product_type:"Office Chair"' },
  { label: "Storage & Shelves", query: 'product_type:"Storage Cabinet" OR product_type:"Bookshelf" OR product_type:"Chest of Drawer"' },
  { label: "Pillows & Bedding", query: 'product_type:"Pillows" OR product_type:"Baby Pillows" OR product_type:"Bolster"' },
];

export function ProductsContent() {
  useCartSync();

  const [activeCategory, setActiveCategory] = useState(0);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (categoryIndex: number, after: string | null = null) => {
    const isLoadMore = after !== null;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const cat = CATEGORIES[categoryIndex];
      let edges: ShopifyProduct[];
      let pageInfo: { hasNextPage: boolean; endCursor: string | null } | undefined;

      if (cat.collection) {
        const data = await storefrontApiRequest(COLLECTION_PRODUCTS_QUERY, {
          handle: cat.collection,
          first: PAGE_SIZE,
          after,
        });
        if (!data) return;
        edges = data.data?.collection?.products?.edges ?? [];
        pageInfo = data.data?.collection?.products?.pageInfo;
      } else {
        const data = await storefrontApiRequest(PAGINATED_PRODUCTS_QUERY, {
          first: PAGE_SIZE,
          after,
          query: cat.query,
        });
        if (!data) return;
        edges = data.data?.products?.edges ?? [];
        pageInfo = data.data?.products?.pageInfo;
      }

      if (isLoadMore) {
        setProducts((prev) => [...prev, ...edges]);
      } else {
        setProducts(edges);
      }

      setCursor(pageInfo?.endCursor ?? null);
      setHasMore(pageInfo?.hasNextPage ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory, null);
  }, [activeCategory, fetchProducts]);

  const handleCategoryChange = (index: number) => {
    if (index === activeCategory) return;
    setActiveCategory(index);
    setProducts([]);
    setCursor(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />

      <main>
        {/* Page header */}
        <div className="border-b border-border bg-cream">
          <div className="container-page py-10 md:py-14">
            <h1
              className="font-display font-bold leading-none tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              All Furniture
            </h1>
            <p className="mt-3 text-base text-foreground/60">
              Factory-direct pricing. Up to 40% below retail.
            </p>
          </div>
        </div>

        {/* Filters + grid */}
        <div className="container-page py-8 md:py-10">

          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
            <div className="flex items-center gap-2">
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryChange(i)}
                  className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === i
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product count */}
          {!loading && (
            <p className="mt-4 text-sm text-muted-foreground">
              {products.length} product{products.length !== 1 ? "s" : ""}
              {hasMore ? "+" : ""} shown
            </p>
          )}

          {/* States */}
          {loading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              Could not load products: {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              No products found in this category.
            </div>
          )}

          {/* Grid */}
          {products.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.node.id}
                  product={p}
                  badge={CATEGORIES[activeCategory].collection ? "Opening Sale" : undefined}
                  openingSalePrice={CATEGORIES[activeCategory].collection ? OPENING_SALE_PRICE : undefined}
                />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && !loading && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => fetchProducts(activeCategory, cursor)}
                disabled={loadingMore}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
