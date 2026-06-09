import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
    <section id="bestsellers" className="bg-background py-16 md:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Best Sellers
            </p>
            <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-6xl md:text-7xl">
              Singapore's
              <br />
              <span className="text-accent">favourites.</span>
            </h2>
          </div>
          <a
            href="#all"
            className="text-base font-semibold text-foreground underline-offset-4 hover:underline"
          >
            View All →
          </a>
        </div>

        <div className="mt-10">
          {error && (
            <p className="rounded-md border border-border bg-secondary p-6 text-sm text-muted-foreground">
              Couldn't load products: {error}
            </p>
          )}
          {!products && !error && (
            <div className="grid place-items-center py-20 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          {products && products.length === 0 && (
            <p className="rounded-md border border-border bg-secondary p-6 text-sm text-muted-foreground">
              No products found.
            </p>
          )}
          {products && products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard
                  key={p.node.id}
                  product={p}
                  badge={i < 3 ? "Best Seller" : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
