import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "bwrnnn-iw.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN = "e975f36a13dc44834d7a3d89aaf7c756";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    // This function also runs server-side (sitemap generation, generateMetadata) where
    // sonner's toast has no DOM to render into — only fire it in the browser.
    if (typeof window !== "undefined") {
      toast.error("Shopify: Payment required", {
        description:
          "Shopify API access requires an active billing plan. Please upgrade your store at https://admin.shopify.com.",
      });
    }
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(
      `Shopify error: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`,
    );
  }
  return data;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType?: string;
    vendor?: string;
    priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
    compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
    images: { edges: Array<{ node: ShopifyImage }> };
    variants: { edges: Array<{ node: ShopifyVariant }> };
    options: Array<{ name: string; values: string[] }>;
  };
}

export const PAGINATED_PRODUCTS_QUERY = `
  query GetProductsPaginated($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id title handle productType
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { edges { node { url altText } } }
          variants(first: 10) {
            edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          vendor
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      productType
      vendor
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 10) { edges { node { url altText } } }
      variants(first: 25) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
      metafields(identifiers: [
        {namespace: "custom", key: "dimensions"}
        {namespace: "custom", key: "product_care"}
        {namespace: "custom", key: "warranty"}
        {namespace: "custom", key: "product_detail"}
      ]) {
        namespace
        key
        value
      }
      pairsWellWith: metafield(namespace: "custom", key: "pairs_well_with") {
        references(first: 8) {
          edges {
            node {
              ... on Product {
                id
                title
                handle
                productType
                priceRange { minVariantPrice { amount currencyCode } }
                compareAtPriceRange { minVariantPrice { amount currencyCode } }
                images(first: 2) { edges { node { url altText } } }
                variants(first: 10) {
                  edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } }
                }
                options { name values }
              }
            }
          }
        }
      }
    }
  }
`;

export const OPENING_SALE_COLLECTION_HANDLE = "below-250";

export const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id title handle productType
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
            images(first: 2) { edges { node { url altText } } }
            variants(first: 10) {
              edges { node { id title price { amount currencyCode } availableForSale selectedOptions { name value } } }
            }
            options { name values }
          }
        }
      }
    }
  }
`;

export function formatPrice(amount: string | number, currencyCode = "SGD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(n);
}

export interface ShopifyProductDetail {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType?: string;
  vendor?: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
}

// Server-safe single-product fetch, shared by generateMetadata and the page body
// in product/[handle]/page.tsx (Next.js dedupes identical fetch() calls made
// during the same request, so this does not cost a second network round trip).
export async function getProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.data?.product ?? null;
}

export interface ProductHandleAndDate {
  handle: string;
}

// Server-only helper for sitemap generation. Loops the paginated products query
// at Shopify's max page size (250) until exhausted. Treats a null response (the
// 402 billing-lapse path in storefrontApiRequest) as "stop here" rather than
// throwing, so a Shopify billing issue degrades the sitemap instead of failing the build.
export async function getAllProductHandles(): Promise<ProductHandleAndDate[]> {
  const handles: ProductHandleAndDate[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await storefrontApiRequest(PAGINATED_PRODUCTS_QUERY, {
      first: 250,
      after,
    });

    const products = data?.data?.products;
    if (!products) break;

    for (const edge of products.edges as Array<{ node: { handle: string } }>) {
      if (edge?.node?.handle) {
        handles.push({ handle: edge.node.handle });
      }
    }

    hasNextPage = products.pageInfo?.hasNextPage ?? false;
    after = products.pageInfo?.endCursor ?? null;
  }

  return handles;
}
