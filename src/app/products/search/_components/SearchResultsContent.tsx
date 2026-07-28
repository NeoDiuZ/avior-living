"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ProductCard } from "@/components/site/ProductCard";
import {
  storefrontApiRequest,
  PAGINATED_PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify/client";
import { useCartSync } from "@/hooks/useCartSync";

const PAGE_SIZE = 24;
const DEBOUNCE_MS = 400;

// Shopify's Storefront `products(query:)` does not do a fuzzy/substring match on
// bare terms (a plain "sofa" query can return unrelated products) — build an
// explicit per-word wildcard match across the fields shoppers actually search by.
function buildSearchQuery(term: string): string {
  const words = term
    .split(/\s+/)
    .map((w) => w.replace(/["():]/g, "").trim())
    .filter(Boolean);
  if (words.length === 0) return "";
  return words
    .map((w) => `(title:*${w}* OR product_type:*${w}* OR vendor:*${w}* OR tag:*${w}*)`)
    .join(" AND ");
}

export function SearchResultsContent({ initialQuery }: { initialQuery: string }) {
  useCartSync();
  const router = useRouter();

  const [input, setInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce keystrokes into an active search term, keeping the URL shareable
  // without pushing a new history entry on every keystroke.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = input.trim();
      setActiveQuery(trimmed);
      router.replace(trimmed ? `/products/search?q=${encodeURIComponent(trimmed)}` : "/products/search", { scroll: false });
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, router]);

  const fetchResults = useCallback(async (term: string, after: string | null = null) => {
    const shopifyQuery = buildSearchQuery(term);
    if (!shopifyQuery) {
      setProducts([]);
      setHasMore(false);
      setLoading(false);
      return;
    }
    const isLoadMore = after !== null;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await storefrontApiRequest(PAGINATED_PRODUCTS_QUERY, {
        first: PAGE_SIZE,
        after,
        query: shopifyQuery,
      });
      if (!data) return;
      const edges: ShopifyProduct[] = data.data?.products?.edges ?? [];
      const pageInfo = data.data?.products?.pageInfo;
      setProducts((prev) => (isLoadMore ? [...prev, ...edges] : edges));
      setCursor(pageInfo?.endCursor ?? null);
      setHasMore(pageInfo?.hasNextPage ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search products");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(activeQuery, null);
  }, [activeQuery, fetchResults]);

  const hasQuery = activeQuery.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />

      <main>
        <div className="border-b border-border bg-cream">
          <div className="container-page py-10 md:py-14">
            <h1
              className="font-display font-bold leading-none tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
            >
              Search Furniture
            </h1>
            <div className="relative mt-6 max-w-xl">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <input
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search all furniture..."
                aria-label="Search all furniture"
                className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
        </div>

        <div className="container-page py-8 md:py-10">
          {!hasQuery && (
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              Start typing to search sofas, beds, tables and more.
            </div>
          )}

          {hasQuery && !loading && !error && (
            <p className="text-sm text-muted-foreground">
              {products.length} result{products.length !== 1 ? "s" : ""}
              {hasMore ? "+" : ""} for &ldquo;{activeQuery}&rdquo;
            </p>
          )}

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

          {hasQuery && !loading && !error && products.length === 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              No furniture found for &ldquo;{activeQuery}&rdquo;. Try a different search term.
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => fetchResults(activeQuery, cursor)}
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
