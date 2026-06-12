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
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active billing plan. Please upgrade your store at https://admin.shopify.com.",
    });
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
  query GetProductsPaginated($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
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
      metafields(identifiers: [{namespace: "custom", key: "dimensions"}]) {
        namespace
        key
        value
      }
    }
  }
`;

interface RichTextNode {
  type: string;
  value?: string;
  children?: RichTextNode[];
}

function extractRichText(node: RichTextNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(extractRichText).join(" ");
}

export function parseDimensionsMetafield(
  raw: string | null | undefined
): { widthM: number; depthM: number } | null {
  if (!raw) return null;
  try {
    const root: RichTextNode = JSON.parse(raw);
    const text = extractRichText(root);
    const lengthMatch = text.match(/Length[:\s]+(\d+(?:\.\d+)?)\s*cm/i);
    const widthMatch = text.match(/Width[:\s]+(\d+(?:\.\d+)?)\s*cm/i);
    if (!lengthMatch || !widthMatch) return null;
    return {
      widthM: parseFloat(lengthMatch[1]) / 100,
      depthM: parseFloat(widthMatch[1]) / 100,
    };
  } catch {
    return null;
  }
}

export function formatPrice(amount: string | number, currencyCode = "SGD") {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(n);
}
