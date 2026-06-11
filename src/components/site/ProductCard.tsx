import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify/client";

interface Props {
  product: ShopifyProduct;
  badge?: string;
}

export function ProductCard({ product, badge }: Props) {
  const node = product.node;
  const variant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const price = variant?.price ?? node.priceRange.minVariantPrice;
  // Illustrative retail comparison based on declared "up to 40% below retail"
  const numericPrice = parseFloat(price.amount);
  const retailPrice = Math.round(numericPrice / 0.62 / 10) * 10;
  const hasSavings = retailPrice > numericPrice;
  const savingAmount = hasSavings ? retailPrice - numericPrice : 0;
  const savingPercent = hasSavings ? Math.round((savingAmount / retailPrice) * 100) : 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  return (
    <Link href={`/product/${node.handle}`} className="group block">
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
        <button
          onClick={handleAdd}
          disabled={!variant || isLoading}
          className="absolute bottom-3 right-3 inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground opacity-0 shadow-md transition group-hover:opacity-100 disabled:opacity-50 sm:opacity-0"
        >
          {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add to Cart"}
        </button>
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
            {formatPrice(price.amount, price.currencyCode)}
          </p>
          {hasSavings && (
            <>
              <p className="text-[11px] text-muted-foreground line-through">
                {formatPrice(String(retailPrice), price.currencyCode)}
              </p>
              <span className="mt-0.5 inline-block rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold text-accent">
                Save {formatPrice(String(savingAmount), price.currencyCode)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
