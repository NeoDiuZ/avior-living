import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Living Room Furniture",
  description: "Factory-direct sofas, TV consoles, coffee tables, shoe cabinets and more. Free white-glove delivery, assembly and disposal across Singapore.",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
  { name: "Living Room", url: "/products/living-room" },
]);

export default function LivingRoomPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <ProductListingPage room="living-room" />
    </>
  );
}
