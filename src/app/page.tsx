import type { Metadata } from "next";
import { HomeContent } from "./_components/HomeContent";

export const metadata: Metadata = {
  title: "Avior Living | Save 40% Off Retail Furniture in Singapore",
  description:
    "Factory-direct furniture for Singapore homes. Save up to 40% off retail. Free white-glove delivery, assembly, and packaging disposal.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Avior Living | Factory-Direct Furniture, Singapore",
    description:
      "Save up to 40% off retail. Free delivery, assembly, and disposal across Singapore.",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
