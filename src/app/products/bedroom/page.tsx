import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Bedroom Furniture",
  description: "Factory-direct beds, wardrobes, mattresses, bedside tables and more. Free white-glove delivery, assembly and disposal across Singapore.",
  alternates: {
    canonical: "/products/bedroom",
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
  { name: "Bedroom", url: "/products/bedroom" },
]);

export default function BedroomPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <ProductListingPage room="bedroom" />
    </>
  );
}
