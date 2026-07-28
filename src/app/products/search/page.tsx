import type { Metadata } from "next";
import { SearchResultsContent } from "./_components/SearchResultsContent";

export const metadata: Metadata = {
  title: "Search Furniture",
  description:
    "Search Avior Living's full furniture catalog — sofas, beds, tables and more, factory-direct with free delivery and assembly across Singapore.",
  alternates: {
    canonical: "/products/search",
  },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchResultsContent initialQuery={q ?? ""} />;
}
