import type { Metadata } from "next";
import { HomeContent } from "./_components/HomeContent";

export const metadata: Metadata = {
  title: "Avior Living — Designer Furniture Without Showroom Markups",
  description:
    "Factory-direct furniture for Singapore homes. Up to 40% below retail with white-glove delivery, assembly and packaging disposal included.",
  openGraph: {
    title: "Avior Living — Factory-Direct Furniture in Singapore",
    description:
      "Designer furniture without showroom markups. Delivery, assembly and disposal included across Singapore.",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
