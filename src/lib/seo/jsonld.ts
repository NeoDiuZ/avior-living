import { SITE_URL, BUSINESS_LEGAL_NAME, BUSINESS_UEN, RETURN_POLICY_URL } from "@/lib/seo/config";

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Avior Living",
    legalName: BUSINESS_LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/images/avior logo.png"),
    ...(BUSINESS_UEN ? { taxID: BUSINESS_UEN } : {}),
    ...(RETURN_POLICY_URL
      ? {
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            url: RETURN_POLICY_URL,
          },
        }
      : {}),
  };
}

export interface ProductJsonLdInput {
  name: string;
  description?: string;
  images: string[];
  handle: string;
  price: number;
  priceCurrency: string;
  availability: boolean;
  brand?: string;
}

export function buildProductJsonLd(input: ProductJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.images,
    sku: input.handle,
    brand: { "@type": "Brand", name: input.brand ?? "Avior Living" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${input.handle}`),
      priceCurrency: input.priceCurrency,
      price: input.price.toFixed(2),
      availability: input.availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export interface BreadcrumbJsonLdItem {
  name: string;
  url: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export interface FaqJsonLdEntry {
  q: string;
  a: string;
}

export function buildFaqPageJsonLd(faqs: FaqJsonLdEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
