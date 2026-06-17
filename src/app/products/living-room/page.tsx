import type { Metadata } from "next";
import { ProductListingPage } from "../_components/ProductListingPage";

export const metadata: Metadata = {
  title: "Living Room Furniture",
  description: "Factory-direct sofas, TV consoles, coffee tables, shoe cabinets and more. Free white-glove delivery, assembly and disposal across Singapore.",
};

export default function LivingRoomPage() {
  return <ProductListingPage room="living-room" />;
}
