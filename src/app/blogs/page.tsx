import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Reveal } from "@/components/site/Reveal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/seo/jsonld";
import { blogPosts } from "@/content/blog-posts";

const BLOGS_TITLE = "Blogs - Avior Living";
const BLOGS_DESCRIPTION =
  "Furniture buying guides and honest comparisons for Singapore homes: HDB/BTO sizing, delivery, and how Avior stacks up against other Singapore furniture brands.";

export const metadata: Metadata = {
  title: BLOGS_TITLE,
  description: BLOGS_DESCRIPTION,
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: BLOGS_TITLE,
    description: BLOGS_DESCRIPTION,
    url: "/blogs",
    type: "website",
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Blogs", url: "/blogs" },
]);

const itemListJsonLd = buildItemListJsonLd(
  blogPosts.map((post) => ({ name: post.title, url: `/blogs/${post.slug}` })),
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-SG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogsIndexPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <div className="bg-cream pt-14 pb-10 md:pt-20 md:pb-14">
          <div className="container-page">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Blogs</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="max-w-2xl border-b border-border pb-8">
              <h1
                className="font-display font-bold leading-[0.95] tracking-tight text-foreground"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)" }}
              >
                The Avior Journal
              </h1>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                Sizing guides, delivery breakdowns, and fact-checked comparisons, written and
                published by Avior Living for Singapore homes.
              </p>
            </div>
          </div>
        </div>

        {featured ? (
          <div className="bg-cream pb-14 md:pb-20">
            <div className="container-page">
              <Reveal>
                <Link
                  href={`/blogs/${featured.slug}`}
                  className="group grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center md:gap-12"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <img
                      src={featured.coverImage}
                      alt={featured.coverImageAlt}
                      className="h-[260px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] md:h-[420px]"
                      loading="eager"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      {featured.category}
                    </p>
                    <h2 className="mt-3 font-display text-3xl leading-[1.05] tracking-tight text-foreground md:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
                      {featured.dek}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{featured.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={featured.datePublished}>{formatDate(featured.datePublished)}</time>
                      <span aria-hidden="true">·</span>
                      <span>{featured.readTime}</span>
                    </div>
                    <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground transition-all duration-300 group-hover:gap-3 group-hover:text-accent">
                      Read the story
                      <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className="bg-background pb-20 md:pb-28">
            <div className="container-page">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                More from the journal
              </p>
              <div className="mt-6 divide-y divide-border border-t border-border">
                {rest.map((post, i) => (
                  <Reveal key={post.slug} delay={i * 60}>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="group grid grid-cols-1 gap-6 py-8 sm:grid-cols-[200px_1fr] sm:items-center md:gap-10"
                    >
                      <div className="overflow-hidden rounded-xl">
                        <img
                          src={post.coverImage}
                          alt={post.coverImageAlt}
                          loading="lazy"
                          className="h-[150px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:h-[130px]"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                          {post.category}
                        </p>
                        <h3 className="mt-2 font-display text-xl leading-snug tracking-tight text-foreground md:text-2xl">
                          {post.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                          {post.dek}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                          <span aria-hidden="true">·</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
