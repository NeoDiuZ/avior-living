import type { Metadata } from "next";
import { ProductsContent } from "./_components/ProductsContent";

export const metadata: Metadata = {
  title: "All Furniture",
  description:
    "Browse all factory-direct furniture. Save up to 40% off retail with free white-glove delivery, assembly and disposal across Singapore.",
};

export default function ProductsPage() {
  return <ProductsContent />;
}
