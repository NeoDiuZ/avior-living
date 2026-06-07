import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ChevronLeft, Truck, Wrench, Recycle } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import {
  storefrontApiRequest,
  PRODUCT_BY_HANDLE_QUERY,
  formatPrice,
  type ShopifyProduct,
} from "@/lib/shopify/client";
import { useCartStore } from "@/stores/cartStore";
import { useCartSync } from "@/hooks/useCartSync";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle.replace(/-/g, " ")} — Avior Living` },
      {
        name: "description",
        content:
          "Factory-direct furniture with white-glove delivery, assembly and disposal included across Singapore.",
      },
    ],
  }),
  component: ProductPage,
  errorComponent: ({ error, reset }) => (
    <ErrorView message={error.message} reset={reset} />
  ),
  notFoundComponent: () => <NotFoundView />,
});

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType?: string;
  vendor?: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
  options: Array<{ name: string; values: string[] }>;
}

function ProductPage() {
  useCartSync();
  const { handle } = Route.useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (cancelled) return;
        const p = data?.data?.product;
        if (!p) {
          setError("Product not found");
        } else {
          setProduct(p);
          setSelectedVariantId(p.variants.edges[0]?.node?.id ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  if (loading) {
    return (
      <Shell>
        <div className="grid place-items-center py-32 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Shell>
    );
  }

  if (error || !product) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <p className="text-muted-foreground">{error ?? "Product not found"}</p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  const variant =
    product.variants.edges.find((e) => e.node.id === selectedVariantId)?.node ??
    product.variants.edges[0]?.node;
  const image = product.images.edges[0]?.node;
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const numericPrice = parseFloat(price.amount);
  const retailPrice = Math.round((numericPrice / 0.62) / 10) * 10;

  // Reconstruct minimal ShopifyProduct shape for cart
  const cartProduct: ShopifyProduct = {
    node: {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      productType: product.productType,
      vendor: product.vendor,
      priceRange: product.priceRange,
      images: product.images,
      variants: product.variants,
      options: product.options,
    },
  };

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product: cartProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  return (
    <Shell>
      <div className="container-page py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-2xl bg-secondary">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText || product.title}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[4/5] place-items-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            {product.images.edges.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.edges.slice(0, 4).map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-lg bg-secondary">
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.productType && (
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {product.productType}
              </p>
            )}
            <h1 className="mt-1 font-display text-3xl tracking-tight sm:text-4xl">
              {product.title}
            </h1>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {retailPrice > numericPrice && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(retailPrice, price.currencyCode)}
                  </span>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                    Save {Math.round((1 - numericPrice / retailPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {product.variants.edges.length > 1 && (
              <div className="mt-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-foreground/80">
                  Options
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map((v) => (
                    <button
                      key={v.node.id}
                      onClick={() => setSelectedVariantId(v.node.id)}
                      disabled={!v.node.availableForSale}
                      className={`rounded-md border px-3 py-2 text-sm transition ${
                        v.node.id === selectedVariantId
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background hover:border-foreground/40"
                      } ${!v.node.availableForSale ? "opacity-40" : ""}`}
                    >
                      {v.node.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <Button
                onClick={handleAdd}
                disabled={!variant || isLoading || !variant.availableForSale}
                size="lg"
                className="h-12 flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : variant?.availableForSale ? (
                  "Add to Cart"
                ) : (
                  "Sold Out"
                )}
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 border-foreground/15 bg-background px-5"
              >
                <a href="https://wa.me/6580000000" target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-7 space-y-3 rounded-xl border border-border bg-cream p-5 text-sm">
              <Row icon={Truck} label="White-glove delivery included islandwide" />
              <Row icon={Wrench} label="Full assembly by our two-person team" />
              <Row icon={Recycle} label="Packaging disposal — we take it back" />
            </div>

            {product.description && (
              <div className="mt-8">
                <h2 className="font-display text-xl">About this piece</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Row({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-accent" />
      <span>{label}</span>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function ErrorView({ message, reset }: { message: string; reset: () => void }) {
  const router = useRouter();
  return (
    <Shell>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <Button
          className="mt-6"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </Button>
      </div>
    </Shell>
  );
}

function NotFoundView() {
  return (
    <Shell>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl">Product not found</h1>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </Shell>
  );
}
