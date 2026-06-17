import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";

export const metadata: Metadata = {
  title: "Opening Sale — $219 Furniture",
  description: "Curated furniture pieces at $219. Up to 40% below retail with free white-glove delivery, assembly and disposal across Singapore.",
};

export default function OpeningSalePage() {
  return <ProductListingPage room="opening-sale" />;
}
