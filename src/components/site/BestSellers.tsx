import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify/client";
import { ProductCard } from "./ProductCard";

export function BestSellers() {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 8, query: null });
        if (cancelled || !data) return;
        setProducts(data.data?.products?.edges ?? []);
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
                $189 Opening Sale
              </h2>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                Ends 21 Jun
              </span>
            </div>
            <p className="mt-3 text-base text-foreground/65 sm:text-lg">
              Up to 40% off retail. Ends 21 Jun.
            </p>
          </div>
          <a
            href="/products"
            className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            View All Items
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
                <ProductCard key={p.node.id} product={p} badge="Opening Sale" />
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
            <a href="/products">Shop All Opening Sale Items</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
