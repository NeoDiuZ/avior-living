import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify/client";

interface Props {
  product: ShopifyProduct;
  badge?: string;
  openingSalePrice?: number;
}

export function ProductCard({ product, badge, openingSalePrice }: Props) {
  const node = product.node;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const setPendingAddItem = useCartStore((s) => s.setPendingAddItem);
  const setCouponModalOpen = useCartStore((s) => s.setCouponModalOpen);
  const isAvailable = variant?.availableForSale ?? false;

  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const numericPrice = parseFloat(price.amount);
  const compareAtAmount = node.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
    : 0;

  // Opening Sale: hardset display price to $219; use Shopify price as the strikethrough (if above $219)
  const isOpeningSale = openingSalePrice !== undefined;
  const displayPrice = isOpeningSale ? openingSalePrice : numericPrice;
  const retailPrice = isOpeningSale && numericPrice > openingSalePrice
    ? numericPrice
    : !isOpeningSale && compareAtAmount > numericPrice ? compareAtAmount : 0;
  const hasSavings = retailPrice > 0;
  const savingAmount = hasSavings ? retailPrice - displayPrice : 0;
  const savingPercent = hasSavings ? Math.round((savingAmount / retailPrice) * 100) : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    const item = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    };
    if (sessionStorage.getItem("avior_coupon_done")) {
      await addItem(item);
    } else {
      setPendingAddItem(item);
      setCouponModalOpen(true);
    }
  };

  return (
    <Link href={`/product/${node.handle}${isOpeningSale ? "?sale=opening" : ""}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-secondary">
        <div className="aspect-[4/5] w-full">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground">
            {badge}
          </span>
        )}
        {hasSavings && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            -{savingPercent}%
          </span>
        )}
        {isAvailable ? (
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className="absolute bottom-3 right-3 inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground shadow-md transition sm:opacity-0 sm:group-hover:opacity-100 disabled:pointer-events-none disabled:opacity-40"
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add to Cart"}
          </button>
        ) : (
          <span className="absolute bottom-3 right-3 inline-flex h-9 items-center rounded-full border border-border bg-background/80 px-4 text-xs font-medium text-muted-foreground backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100">
            Out of Stock
          </span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-foreground">{node.title}</h3>
          {node.productType && (
            <p className="mt-0.5 text-xs text-muted-foreground">{node.productType}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-display text-base font-semibold text-foreground">
            {formatPrice(displayPrice, price.currencyCode)}
          </p>
          {hasSavings && (
            <div className="mt-0.5 flex items-center justify-end gap-1.5">
              <p className="text-[11px] text-muted-foreground line-through">
                {formatPrice(String(retailPrice), price.currencyCode)}
              </p>
              <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                -{savingPercent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
