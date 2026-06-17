import { useEffect, useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  COLLECTION_PRODUCTS_QUERY,
  OPENING_SALE_COLLECTION_HANDLE,
  type ShopifyProduct,
} from "@/lib/shopify/client";
import { ProductCard } from "./ProductCard";

const OPENING_SALE_PRICE = 219;

export function BestSellers() {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await storefrontApiRequest(COLLECTION_PRODUCTS_QUERY, {
          handle: OPENING_SALE_COLLECTION_HANDLE,
          first: 8,
          after: null,
        });
        if (cancelled || !data) return;
        setProducts(data.data?.collection?.products?.edges ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="opening-sale" className="bg-background py-16 md:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-6xl">
                <span className="text-accent">$219</span> Opening Sale
              </h2>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                Ends 31 Jul
              </span>
            </div>
            <p className="mt-3 text-base text-foreground/65 sm:text-lg">
              Up to 40% off retail. Ends 31 Jul.
            </p>
          </div>
          <a
            href="/products/opening-sale"
            className="inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            View All Items
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </a>
        </div>

        <div className="mt-10">
          {error && (
            <p className="rounded-2xl border border-border bg-secondary p-6 text-sm text-muted-foreground">
              Could not load products: {error}
            </p>
          )}
          {!products && !error && (
            <div className="grid place-items-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {products && products.length === 0 && (
            <p className="rounded-2xl border border-border bg-secondary p-6 text-sm text-muted-foreground">
              No products found.
            </p>
          )}
          {products && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.node.id}
                  product={p}
                  badge="Opening Sale"
                  openingSalePrice={OPENING_SALE_PRICE}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 border-foreground/20 px-10 text-base font-semibold hover:bg-secondary"
          >
            <a href="/products/opening-sale">Shop All Opening Sale Items</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
