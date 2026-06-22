import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Dining Room Furniture",
  description: "Factory-direct dining tables, chairs and sets. Free white-glove delivery, assembly and disposal across Singapore.",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
  { name: "Dining Room", url: "/products/dining-room" },
]);

export default function DiningRoomPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <ProductListingPage room="dining-room" />
    </>
  );
}
