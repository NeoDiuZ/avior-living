import type { Metadata } from "next";
import { ProductContent } from "./_components/ProductContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { getProductByHandle } from "@/lib/shopify/client";

const FALLBACK_DESCRIPTION =
  "Factory-direct furniture with white-glove delivery, assembly and disposal included across Singapore.";

function truncateDescription(text: string, maxLength = 155): string {
  const clean = text.trim();
  if (clean.length <= maxLength) return clean;
  const truncated = clean.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: handle.replace(/-/g, " "),
      description: FALLBACK_DESCRIPTION,
      alternates: { canonical: `/product/${handle}` },
    };
  }

  const description = product.description
    ? truncateDescription(product.description)
    : FALLBACK_DESCRIPTION;
  const image = product.images.edges[0]?.node;

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `/product/${handle}`,
    },
    openGraph: {
      title: product.title,
      description,
      images: image ? [{ url: image.url, alt: image.altText || product.title }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sale?: string }>;
}) {
  const { handle } = await params;
  const { sale } = await searchParams;
  const product = await getProductByHandle(handle);

  return (
    <>
      {product && (
        <>
          <JsonLd
            data={buildProductJsonLd({
              name: product.title,
              description: product.description,
              images: product.images.edges.map((edge) => edge.node.url),
              handle: product.handle,
              price: parseFloat(
                product.variants.edges[0]?.node.price.amount ??
                  product.priceRange.minVariantPrice.amount,
              ),
              priceCurrency:
                product.variants.edges[0]?.node.price.currencyCode ??
                product.priceRange.minVariantPrice.currencyCode,
              availability: product.variants.edges.some((edge) => edge.node.availableForSale),
            })}
          />
          <JsonLd
            data={buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Products", url: "/products" },
              { name: product.title, url: `/product/${handle}` },
            ])}
          />
        </>
      )}
      <ProductContent handle={handle} isOpeningSale={sale === "opening"} />
    </>
  );
}
