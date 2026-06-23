import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getAllProductHandles } from "@/lib/shopify/client";
import { blogPosts } from "@/content/blog-posts";

const staticRoutes: Array<{ path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/products", changeFrequency: "weekly", priority: 0.9 },
  { path: "/products/opening-sale", changeFrequency: "daily", priority: 0.9 },
  { path: "/products/living-room", changeFrequency: "weekly", priority: 0.8 },
  { path: "/products/bedroom", changeFrequency: "weekly", priority: 0.8 },
  { path: "/products/dining-room", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blogs", changeFrequency: "weekly", priority: 0.6 },
  { path: "/returns", changeFrequency: "monthly", priority: 0.5 },
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

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blogs/${post.slug}`,
    lastModified: new Date(post.datePublished),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
