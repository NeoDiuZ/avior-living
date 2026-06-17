"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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

const OPENING_SALE_PRICE = 219;
const PAGE_SIZE = 24;

// ── Product type → room mapping (for client-side Opening Sale room filter) ──

const LIVING_ROOM_TYPES = new Set([
  "Fabric Sofa","Leather Sofa","Faux Leather Sofa","Wooden Sofa","Sofa Bed","Recliner","Armchair",
  "TV Console","Coffee Table","Shoe Cabinet","Side Table",
  "Storage Cabinet","Bookshelf","Chest of Drawer",
  "Pillows","Baby Pillows","Bolster",
]);
const BEDROOM_TYPES = new Set([
  "Bed","Wooden Bed Frame","Storage Bed","Drawer Bed","Loft Bed","Bedroom Set",
  "Modular Wardrobe","Open Door Wardrobe","Sliding Door Wardrobe",
  "Bed Side Table","Bedside Table","Study Table","Dressing Table",
  "Mattress","Foldable Mattress","Office Chair",
]);
const DINING_ROOM_TYPES = new Set([
  "Dining Table","Dining Chair","Dining Set","Buffet Table",
]);
const ROOM_TYPE_SETS: Record<string, Set<string>> = {
  "living-room": LIVING_ROOM_TYPES,
  bedroom: BEDROOM_TYPES,
  "dining-room": DINING_ROOM_TYPES,
};

// ── Sub-filter configs for room pages ────────────────────────────────────────

type SubFilter = { label: string; query: string | null };

const SUB_FILTERS: Record<string, SubFilter[]> = {
  "living-room": [
    { label: "All", query: null },
    { label: "Sofas", query: 'product_type:"Fabric Sofa" OR product_type:"Leather Sofa" OR product_type:"Faux Leather Sofa" OR product_type:"Wooden Sofa" OR product_type:"Sofa Bed" OR product_type:"Recliner" OR product_type:"Armchair"' },
    { label: "TV Consoles", query: 'product_type:"TV Console"' },
    { label: "Coffee Tables", query: 'product_type:"Coffee Table"' },
    { label: "Shoe Cabinets", query: 'product_type:"Shoe Cabinet"' },
    { label: "Side Tables", query: 'product_type:"Side Table"' },
    { label: "Storage", query: 'product_type:"Storage Cabinet" OR product_type:"Bookshelf" OR product_type:"Chest of Drawer"' },
    { label: "Pillows & Bedding", query: 'product_type:"Pillows" OR product_type:"Baby Pillows" OR product_type:"Bolster"' },
  ],
  bedroom: [
    { label: "All", query: null },
    { label: "Beds", query: 'product_type:"Bed" OR product_type:"Wooden Bed Frame" OR product_type:"Storage Bed" OR product_type:"Drawer Bed" OR product_type:"Loft Bed" OR product_type:"Bedroom Set"' },
    { label: "Wardrobes", query: 'product_type:"Modular Wardrobe" OR product_type:"Open Door Wardrobe" OR product_type:"Sliding Door Wardrobe"' },
    { label: "Bedside Tables", query: 'product_type:"Bed Side Table" OR product_type:"Bedside Table"' },
    { label: "Study Tables", query: 'product_type:"Study Table"' },
    { label: "Dressing Tables", query: 'product_type:"Dressing Table"' },
    { label: "Mattresses", query: 'product_type:"Mattress" OR product_type:"Foldable Mattress"' },
  ],
  "dining-room": [
    { label: "All", query: null },
    { label: "Dining Tables", query: 'product_type:"Dining Table"' },
    { label: "Dining Chairs", query: 'product_type:"Dining Chair"' },
    { label: "Dining Sets", query: 'product_type:"Dining Set"' },
    { label: "Buffet Tables", query: 'product_type:"Buffet Table"' },
  ],
};

// Base query for each room (used when sub-filter is "All")
const ROOM_BASE_QUERIES: Record<string, string> = {
  "living-room":
    'product_type:"Fabric Sofa" OR product_type:"Leather Sofa" OR product_type:"Faux Leather Sofa" OR product_type:"Wooden Sofa" OR product_type:"Sofa Bed" OR product_type:"Recliner" OR product_type:"Armchair" OR product_type:"TV Console" OR product_type:"Coffee Table" OR product_type:"Shoe Cabinet" OR product_type:"Side Table" OR product_type:"Storage Cabinet" OR product_type:"Bookshelf" OR product_type:"Chest of Drawer" OR product_type:"Pillows" OR product_type:"Baby Pillows" OR product_type:"Bolster"',
  bedroom:
    'product_type:"Bed" OR product_type:"Wooden Bed Frame" OR product_type:"Storage Bed" OR product_type:"Drawer Bed" OR product_type:"Loft Bed" OR product_type:"Bedroom Set" OR product_type:"Modular Wardrobe" OR product_type:"Open Door Wardrobe" OR product_type:"Sliding Door Wardrobe" OR product_type:"Bed Side Table" OR product_type:"Bedside Table" OR product_type:"Study Table" OR product_type:"Dressing Table" OR product_type:"Mattress" OR product_type:"Foldable Mattress" OR product_type:"Office Chair"',
  "dining-room":
    'product_type:"Dining Table" OR product_type:"Dining Chair" OR product_type:"Dining Set" OR product_type:"Buffet Table"',
};

// ── Room nav cards ────────────────────────────────────────────────────────────

const ROOM_CARDS = [
  { label: "Opening Sale", href: "/products/opening-sale", image: null,                              sub: "Ends 31 Jul" },
  { label: "Living Room",  href: "/products/living-room",  image: "/images/inspiration-living.jpg",  sub: "120+ pieces" },
  { label: "Bedroom",      href: "/products/bedroom",      image: "/images/inspiration-bedroom.jpg", sub: "80+ pieces" },
  { label: "Dining Room",  href: "/products/dining-room",  image: "/images/inspiration-dining.jpg",  sub: "60+ pieces" },
];

const OPENING_SALE_ROOM_FILTERS = [
  { label: "All Rooms", key: null as string | null },
  { label: "Living Room", key: "living-room" },
  { label: "Bedroom", key: "bedroom" },
  { label: "Dining Room", key: "dining-room" },
];

const PAGE_META: Record<string, { title: string; description: string }> = {
  "opening-sale": { title: "Opening Sale", description: "Curated pieces at $219. Up to 40% below retail. Ends 31 Jul." },
  "living-room":  { title: "Living Room",  description: "Sofas, TV consoles, coffee tables and more." },
  bedroom:        { title: "Bedroom",       description: "Beds, wardrobes, mattresses and storage." },
  "dining-room":  { title: "Dining Room",   description: "Dining tables, chairs and sets." },
};

// ── Component ─────────────────────────────────────────────────────────────────

export type RoomKey = "opening-sale" | "living-room" | "bedroom" | "dining-room";

export function ProductListingPage({ room }: { room: RoomKey }) {
  useCartSync();

  const isOpeningSale = room === "opening-sale";
  const meta = PAGE_META[room];
  const subFilters = SUB_FILTERS[room] ?? [];

  // Opening Sale state
  const [allSaleProducts, setAllSaleProducts] = useState<ShopifyProduct[] | null>(null);
  const [activeRoomFilter, setActiveRoomFilter] = useState<string | null>(null);

  // Room page state
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [activeSubFilter, setActiveSubFilter] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Opening Sale: fetch all once, filter client-side by room
  useEffect(() => {
    if (!isOpeningSale) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await storefrontApiRequest(COLLECTION_PRODUCTS_QUERY, {
          handle: OPENING_SALE_COLLECTION_HANDLE,
          first: 100,
          after: null,
        });
        if (!data) return;
        setAllSaleProducts(data.data?.collection?.products?.edges ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpeningSale]);

  const openingSaleFiltered = useMemo(() => {
    if (!allSaleProducts) return [];
    if (!activeRoomFilter) return allSaleProducts;
    const types = ROOM_TYPE_SETS[activeRoomFilter];
    return allSaleProducts.filter((p) => types?.has(p.node.productType ?? ""));
  }, [allSaleProducts, activeRoomFilter]);

  // Room pages: paginated fetch
  const fetchRoomProducts = useCallback(
    async (subFilterIndex: number, after: string | null = null) => {
      if (isOpeningSale) return;
      const isLoadMore = after !== null;
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const subQuery = subFilters[subFilterIndex]?.query;
        const query = subQuery ?? ROOM_BASE_QUERIES[room] ?? null;
        const data = await storefrontApiRequest(PAGINATED_PRODUCTS_QUERY, {
          first: PAGE_SIZE,
          after,
          query,
        });
        if (!data) return;
        const edges: ShopifyProduct[] = data.data?.products?.edges ?? [];
        const pageInfo = data.data?.products?.pageInfo;
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
    },
    [room, isOpeningSale, subFilters],
  );

  useEffect(() => {
    if (isOpeningSale) return;
    setProducts([]);
    setCursor(null);
    fetchRoomProducts(activeSubFilter, null);
  }, [activeSubFilter, fetchRoomProducts, isOpeningSale]);

  const displayProducts = isOpeningSale ? openingSaleFiltered : products;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        {/* Page header */}
        <div className="bg-cream pt-14 pb-0 md:pt-20">
          <div className="container-page">
            {isOpeningSale && (
              <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Ends 31 Jul
              </span>
            )}
            <h1
              className="mt-2 w-full max-w-4xl font-display font-bold leading-[0.92] tracking-tight"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
            >
              {meta.title}
            </h1>
            <p className="mt-3 text-base text-foreground/55">{meta.description}</p>
          </div>
        </div>

        {/* Room nav — image tiles */}
        <div className="border-b border-border bg-cream">
          <div className="container-page py-5">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-4">
              {ROOM_CARDS.map((card) => {
                const active = card.href === `/products/${room}`;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className={`group relative shrink-0 w-36 sm:w-auto overflow-hidden rounded-2xl transition-all duration-300 ${
                      active ? "ring-2 ring-accent ring-offset-2 ring-offset-cream" : ""
                    }`}
                  >
                    {card.image ? (
                      <>
                        <img
                          src={card.image}
                          alt={card.label}
                          className="h-28 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${active ? "from-black/80 via-black/20 to-transparent" : "from-black/60 via-black/10 to-transparent group-hover:from-black/75"}`} />
                      </>
                    ) : (
                      /* Opening Sale — dark typographic tile */
                      <div className="h-28 w-full bg-foreground transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className={`text-xs font-bold leading-tight tracking-tight ${active ? "text-accent" : "text-cream"}`}>
                        {card.label}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-cream/60">{card.sub}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters + grid */}
        <div className="container-page py-8 md:py-10">
          {/* Filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {isOpeningSale
              ? OPENING_SALE_ROOM_FILTERS.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setActiveRoomFilter(f.key)}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeRoomFilter === f.key
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))
              : subFilters.map((f, i) => (
                  <button
                    key={f.label}
                    onClick={() => {
                      if (i === activeSubFilter) return;
                      setActiveSubFilter(i);
                      setProducts([]);
                      setCursor(null);
                    }}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      activeSubFilter === i
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground/70 hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
          </div>

          {/* Count */}
          {!loading && (
            <p className="mt-4 text-sm text-muted-foreground">
              {displayProducts.length} product{displayProducts.length !== 1 ? "s" : ""}
              {!isOpeningSale && hasMore ? "+" : ""} shown
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
          {!loading && !error && displayProducts.length === 0 && (
            <div className="mt-8 rounded-2xl border border-border bg-secondary p-8 text-center text-sm text-muted-foreground">
              No products found in this category.
            </div>
          )}

          {displayProducts.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {displayProducts.map((p) => (
                <ProductCard
                  key={p.node.id}
                  product={p}
                  badge={isOpeningSale ? "Opening Sale" : undefined}
                  openingSalePrice={isOpeningSale ? OPENING_SALE_PRICE : undefined}
                />
              ))}
            </div>
          )}

          {/* Load more (room pages only) */}
          {!isOpeningSale && hasMore && !loading && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={() => fetchRoomProducts(activeSubFilter, cursor)}
                disabled={loadingMore}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-8 text-sm font-semibold transition hover:bg-secondary disabled:opacity-50"
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
