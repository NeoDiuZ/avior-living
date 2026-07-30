// Shared filter/sort building blocks used by both the room/sale listing pages
// (ProductListingPage) and the cross-catalog search page.

import type { ShopifyProduct } from "@/lib/shopify/client";

export const SORT_OPTIONS = [
  { label: "Featured",            sortKey: "RELEVANCE",   reverse: false },
  { label: "Price: Low to High",  sortKey: "PRICE",       reverse: false },
  { label: "Price: High to Low",  sortKey: "PRICE",       reverse: true  },
  { label: "Newest",              sortKey: "CREATED_AT",  reverse: true  },
];

export const PRICE_RANGES = [
  { label: "Any price",     min: null as number | null, max: null as number | null },
  { label: "Under $200",    min: null,  max: 200  },
  { label: "$200 – $500",   min: 200,   max: 500  },
  { label: "$500 – $1,000", min: 500,   max: 1000 },
  { label: "Over $1,000",   min: 1000,  max: null },
];

// ── Product type → room mapping (client-side room filter) ────────────────────

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
export const ROOM_TYPE_SETS: Record<string, Set<string>> = {
  "living-room": LIVING_ROOM_TYPES,
  bedroom: BEDROOM_TYPES,
  "dining-room": DINING_ROOM_TYPES,
};

export const ROOM_FILTERS = [
  { label: "All Rooms",    key: null as string | null },
  { label: "Living Room",  key: "living-room" },
  { label: "Bedroom",      key: "bedroom" },
  { label: "Dining Room",  key: "dining-room" },
];

export function buildPriceQuery(base: string | null, priceIdx: number): string | null {
  const range = PRICE_RANGES[priceIdx];
  const parts: string[] = [];
  if (base) parts.push(`(${base})`);
  if (range.min !== null) parts.push(`variants.price:>=${range.min}`);
  if (range.max !== null) parts.push(`variants.price:<=${range.max}`);
  return parts.length ? parts.join(" AND ") : null;
}

// Client-side room + price filter and sort, shared by any page that fetches a
// batch of products up front (Opening Sale, search results) rather than
// paginating a pre-filtered Shopify query.
export function filterAndSortProducts(
  items: ShopifyProduct[],
  { roomFilter, priceRangeIndex, sortIndex }: { roomFilter: string | null; priceRangeIndex: number; sortIndex: number },
): ShopifyProduct[] {
  let result = items;

  if (roomFilter) {
    const types = ROOM_TYPE_SETS[roomFilter];
    result = result.filter((p) => types?.has(p.node.productType ?? ""));
  }

  const range = PRICE_RANGES[priceRangeIndex];
  if (range.min !== null || range.max !== null) {
    result = result.filter((p) => {
      const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
      if (range.min !== null && price < range.min) return false;
      if (range.max !== null && price > range.max) return false;
      return true;
    });
  }

  const sort = SORT_OPTIONS[sortIndex];
  if (sort.sortKey === "PRICE") {
    result = [...result].sort((a, b) => {
      const pa = parseFloat(a.node.priceRange.minVariantPrice.amount);
      const pb = parseFloat(b.node.priceRange.minVariantPrice.amount);
      return sort.reverse ? pb - pa : pa - pb;
    });
  } else if (sort.sortKey === "CREATED_AT") {
    result = sort.reverse ? [...result].reverse() : result;
  }

  return result;
}
