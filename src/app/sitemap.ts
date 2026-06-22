import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getAllProductHandles } from "@/lib/shopify/client";

const staticRoutes: Array<{ path: string; changeFrequency: "daily" | "weekly"; priority: number }> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  { path: "/products/opening-sale", changeFrequency: "daily", priority: 0.9 },
  { path: "/products/living-room", changeFrequency: "weekly", priority: 0.8 },
  { path: "/products/bedroom", changeFrequency: "weekly", priority: 0.8 },
  { path: "/products/dining-room", changeFrequency: "weekly", priority: 0.8 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const handles = await getAllProductHandles();
  const productEntries: MetadataRoute.Sitemap = handles.map(({ handle }) => ({
    url: `${SITE_URL}/product/${handle}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
