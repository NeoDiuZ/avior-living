"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft, Truck, Wrench, Recycle, Ruler } from "lucide-react";
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
import { RoomPlannerModal } from "@/components/site/RoomPlannerModal";

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
        compareAtPrice?: { amount: string; currencyCode: string } | null;
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
  options: Array<{ name: string; values: string[] }>;
  metafields: Array<{ namespace: string; key: string; value: string } | null>;
}

export function ProductContent({ handle }: { handle: string }) {
  useCartSync();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [plannerOpen, setPlannerOpen] = useState(false);
  const [dims, setDims] = useState<{ widthM: number; depthM: number } | null>(null);
  const [dimsLoading, setDimsLoading] = useState(false);

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
          setSelectedImageIdx(0);
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
            <Link href="/products">Back to products</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  const variant =
    product.variants.edges.find((e) => e.node.id === selectedVariantId)?.node ??
    product.variants.edges[0]?.node;
  const image = product.images.edges[selectedImageIdx]?.node ?? product.images.edges[0]?.node;
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const numericPrice = parseFloat(price.amount);
  const compareAtAmount = variant?.compareAtPrice?.amount ? parseFloat(variant.compareAtPrice.amount) : 0;
  const retailPrice = compareAtAmount > numericPrice
    ? compareAtAmount
    : Math.round(numericPrice / 0.62 / 10) * 10;

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

  const dimsMeta = product.metafields.find(
    (m) => m?.namespace === "custom" && m?.key === "dimensions"
  );

  const handleOpenPlanner = async () => {
    if (dims) { setPlannerOpen(true); return; }
    setDimsLoading(true);
    try {
      const res = await fetch("/api/extract-dimensions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          productType: product.productType ?? "",
          description: product.description ?? "",
          metafieldText: dimsMeta?.value ?? "",
        }),
      });
      const data = await res.json();
      setDims(
        data.widthM && data.depthM
          ? { widthM: data.widthM, depthM: data.depthM }
          : { widthM: 1.0, depthM: 0.8 }
      );
    } catch {
      setDims({ widthM: 1.0, depthM: 0.8 });
    } finally {
      setDimsLoading(false);
      setPlannerOpen(true);
    }
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
          href="/"
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
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`overflow-hidden rounded-lg bg-secondary ring-2 transition ${
                      i === selectedImageIdx ? "ring-foreground" : "ring-transparent hover:ring-foreground/30"
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${i + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                  </button>
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
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" style={{ fill: "#25D366" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Ask on WhatsApp
                </a>
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="mt-3 h-11 w-full border-foreground/15 bg-background font-medium"
              onClick={handleOpenPlanner}
              disabled={dimsLoading}
            >
              {dimsLoading
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Ruler className="mr-2 h-4 w-4 text-accent" />}
              {dimsLoading ? "Measuring…" : "Preview in Room Planner"}
            </Button>

            <div className="mt-7 space-y-3 rounded-xl border border-border bg-cream p-5 text-sm">
              <Row icon={Truck} label="White-glove delivery included islandwide" />
              <Row icon={Wrench} label="Full assembly by our two-person team" />
              <Row icon={Recycle} label="Packaging disposal included" />
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

      <div className="container-page py-8 hidden">
        <button onClick={() => router.refresh()} className="text-sm text-muted-foreground">
          Retry
        </button>
      </div>

      <RoomPlannerModal
        open={plannerOpen}
        onClose={() => setPlannerOpen(false)}
        productName={product.title}
        widthM={dims?.widthM ?? 1.0}
        depthM={dims?.depthM ?? 0.8}
        productImageUrl={product.images.edges[0]?.node?.url}
      />
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
