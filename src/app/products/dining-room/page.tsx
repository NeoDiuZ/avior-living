import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";

export const metadata: Metadata = {
  title: "Dining Room Furniture",
  description: "Factory-direct dining tables, chairs and sets. Free white-glove delivery, assembly and disposal across Singapore.",
};

export default function DiningRoomPage() {
  return <ProductListingPage room="dining-room" />;
}
