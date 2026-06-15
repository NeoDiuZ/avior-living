import type { Metadata } from "next";
import { ProductContent } from "./_components/ProductContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return {
    title: handle.replace(/-/g, " "),
    description:
      "Factory-direct furniture with white-glove delivery, assembly and disposal included across Singapore.",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <ProductContent handle={handle} />;
}
