import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";

export const metadata: Metadata = {
  title: "Bedroom Furniture",
  description: "Factory-direct beds, wardrobes, mattresses, bedside tables and more. Free white-glove delivery, assembly and disposal across Singapore.",
};

export default function BedroomPage() {
  return <ProductListingPage room="bedroom" />;
}
