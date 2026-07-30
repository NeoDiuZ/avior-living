"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { ProductCard } from "@/components/site/ProductCard";
import { RoomFilterPills, FilterSortButton } from "@/app/products/_components/FilterBar";
import { FilterSortDrawer } from "@/app/products/_components/FilterSortDrawer";
import { SORT_OPTIONS, PRICE_RANGES, filterAndSortProducts } from "@/app/products/_components/filters";
import {
  storefrontApiRequest,
  PAGINATED_PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify/client";
import { useCartSync } from "@/hooks/useCartSync";

const SEARCH_BATCH_SIZE = 100;
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
  const [allResults, setAllResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter / sort state (mirrors ProductListingPage's room + sale pages)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortIndex, setSortIndex] = useState(0);
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);
  const [pendingSort, setPendingSort] = useState(0);
  const [pendingPrice, setPendingPrice] = useState(0);
  const [activeRoomFilter, setActiveRoomFilter] = useState<string | null>(null);

  const activeFilterCount = (sortIndex > 0 ? 1 : 0) + (priceRangeIndex > 0 ? 1 : 0);

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

  // Fetch a single batch of matches for the active term; room/price/sort are
  // then applied client-side (see filterAndSortProducts), same as Opening Sale.
  useEffect(() => {
    const shopifyQuery = buildSearchQuery(activeQuery);
    if (!shopifyQuery) {
      setAllResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await storefrontApiRequest(PAGINATED_PRODUCTS_QUERY, {
          first: SEARCH_BATCH_SIZE,
          after: null,
          query: shopifyQuery,
        });
        if (!data) return;
        setAllResults(data.data?.products?.edges ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search products");
      } finally {
        setLoading(false);
      }
    })();
  }, [activeQuery]);

  const filtered = useMemo(
    () => filterAndSortProducts(allResults, { roomFilter: activeRoomFilter, priceRangeIndex, sortIndex }),
    [allResults, activeRoomFilter, priceRangeIndex, sortIndex],
  );

  const hasQuery = activeQuery.length > 0;

  const applyFilters = () => {
    setSortIndex(pendingSort);
    setPriceRangeIndex(pendingPrice);
    setDrawerOpen(false);
  };

  const clearFilters = () => {
    setPendingSort(0);
    setPendingPrice(0);
  };

  const openDrawer = () => {
    setPendingSort(sortIndex);
    setPendingPrice(priceRangeIndex);
    setDrawerOpen(true);
  };

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
            <p className="mt-3 text-base text-foreground/55">
              Search our full catalog by name, category or brand.
            </p>
          </div>
        </div>

        <div className="container-page py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64 sm:shrink-0">
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

            {hasQuery && (
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex flex-1 gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                  <RoomFilterPills active={activeRoomFilter} onChange={setActiveRoomFilter} />
                </div>
                <FilterSortButton activeCount={activeFilterCount} onClick={openDrawer} />
              </div>
            )}
          </div>

          {hasQuery && !loading && !error && (
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{activeQuery}&rdquo;
              </span>
              {sortIndex > 0 && (
                <>
                  <span className="text-border">·</span>
                  <span>{SORT_OPTIONS[sortIndex].label}</span>
                  <button
                    onClick={() => setSortIndex(0)}
                    className="text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Clear sort"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
              {priceRangeIndex > 0 && (
                <>
                  <span className="text-border">·</span>
                  <span>{PRICE_RANGES[priceRangeIndex].label}</span>
                  <button
                    onClick={() => setPriceRangeIndex(0)}
                    className="text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Clear price filter"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="container-page pb-16">
          {!hasQuery && (
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              Start typing to search sofas, beds, tables and more.
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              Could not load products: {error}
            </div>
          )}

          {hasQuery && !loading && !error && filtered.length === 0 && (
            <div className="rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              No furniture found for &ldquo;{activeQuery}&rdquo;. Try a different search term or filter.
            </div>
          )}

          {filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <FilterSortDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        pendingSort={pendingSort}
        setPendingSort={setPendingSort}
        pendingPrice={pendingPrice}
        setPendingPrice={setPendingPrice}
        onClear={clearFilters}
        onApply={applyFilters}
      />
    </div>
  );
}
