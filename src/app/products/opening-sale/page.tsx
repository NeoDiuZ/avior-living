import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Opening Sale — $219 Furniture",
  description: "Curated furniture pieces at $219. Up to 40% below retail with free white-glove delivery, assembly and disposal across Singapore.",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
  { name: "Opening Sale", url: "/products/opening-sale" },
]);

export default function OpeningSalePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <ProductListingPage room="opening-sale" />
    </>
  );
}
