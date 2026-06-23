import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "@/lib/seo/jsonld";
import { blogPosts, getBlogPost, type BlogBlock } from "@/content/blog-posts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.authorName }],
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blogs/${post.slug}`,
      type: "article",
      publishedTime: post.datePublished,
      authors: [post.authorName],
      images: [{ url: post.coverImage, width: 1024, height: 1280, alt: post.coverImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Block({ block, isFirstParagraph }: { block: BlogBlock; isFirstParagraph: boolean }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={slugify(block.text)}
          className="mt-12 scroll-mt-28 font-display text-2xl tracking-tight text-foreground md:text-3xl"
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p
          className={
            isFirstParagraph
              ? "article-dropcap mt-5 text-[1.0625rem] leading-[1.8] text-foreground/85"
              : "mt-5 text-[1.0625rem] leading-[1.8] text-foreground/85"
          }
        >
          {block.text}
        </p>
      );
    case "list":
      return (
        <ul className="mt-5 space-y-3 text-[1.0625rem] leading-[1.7] text-foreground/85">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-2 border-accent py-1 pl-6">
          <p className="font-display text-2xl leading-snug tracking-tight text-foreground md:text-[1.75rem]">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution ? (
            <footer className="mt-3 text-sm text-muted-foreground">{block.attribution}</footer>
          ) : null}
        </blockquote>
      );
    case "callout":
      return (
        <div className="my-7 rounded-2xl border border-border bg-sand px-6 py-5 text-[0.95rem] leading-relaxed text-foreground/80">
          {block.text}
        </div>
      );
    case "table":
      return (
        <div className="my-7 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-sand">
                {block.headers.map((header, h) => (
                  <th
                    key={header}
                    className={
                      h === 0
                        ? "sticky left-0 z-10 min-w-[140px] border-r border-border bg-sand px-3 py-3 font-semibold text-foreground sm:px-5 sm:py-3.5"
                        : "min-w-[180px] px-3 py-3 font-semibold text-foreground sm:px-5 sm:py-3.5"
                    }
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i !== block.rows.length - 1 ? "border-b border-border" : ""}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        j === 0
                          ? "sticky left-0 z-10 border-r border-border bg-background px-3 py-3 font-medium text-foreground sm:px-5 sm:py-3.5"
                          : "px-3 py-3 text-muted-foreground sm:px-5 sm:py-3.5"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const headings = post.blocks.filter((b): b is { type: "h2"; text: string } => b.type === "h2");
  const firstParagraphIndex = post.blocks.findIndex((b) => b.type === "p");
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Blogs", url: "/blogs" },
    { name: post.title, url: `/blogs/${post.slug}` },
  ]);

  const articleJsonLd = buildArticleJsonLd({
    title: post.title,
    description: post.description,
    slug: post.slug,
    datePublished: post.datePublished,
    authorName: post.authorName,
    image: post.coverImage,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="article-progress" />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />
      {post.faqs ? <JsonLd data={buildFaqPageJsonLd(post.faqs)} /> : null}
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <div className="bg-cream pt-14 pb-10 md:pt-20 md:pb-12">
          <div className="container-page max-w-3xl">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/blogs">Blogs</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{post.category}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {post.category}
            </p>
            <h1
              className="mt-3 font-display font-bold leading-[1.05] tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
            >
              {post.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{post.dek}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">{post.authorName}</p>
                <p>{post.authorRole}</p>
              </div>
              <span aria-hidden="true" className="text-border">
                |
              </span>
              <time dateTime={post.datePublished}>
                {new Date(post.datePublished).toLocaleDateString("en-SG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true" className="text-border">
                |
              </span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="container-page max-w-3xl">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt}
              className="h-[260px] w-full object-cover md:h-[440px]"
              loading="eager"
            />
          </div>
        </div>

        <div className="container-page mt-12 max-w-3xl grid-cols-1 gap-12 md:mt-16 lg:grid lg:max-w-none lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
          <article className="mx-auto w-full max-w-3xl">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} isFirstParagraph={i === firstParagraphIndex} />
            ))}

            {post.faqs ? (
              <div className="mt-14 border-t border-border pt-10">
                <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
                  Frequently asked questions
                </h2>
                <Accordion type="single" collapsible className="mt-4 w-full">
                  {post.faqs.map((f, i) => (
                    <AccordionItem key={f.q} value={`faq-${i}`} className="border-b border-border">
                      <AccordionTrigger className="py-4 text-left font-display text-base hover:no-underline">
                        {f.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                        {f.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}

            {post.sources ? (
              <div className="mt-10 border-t border-border pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Sources
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
                      >
                        {source.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
              <Link
                href="/products"
                className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
              >
                Shop all furniture
              </Link>
              <a
                href="https://wa.me/6588414701"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-md border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-sand active:scale-[0.97]"
              >
                Ask us on WhatsApp
              </a>
            </div>
          </article>

          {headings.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24 border-l border-border pl-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  In this article
                </p>
                <nav className="mt-4 space-y-3 text-sm">
                  {headings.map((h) => (
                    <a
                      key={h.text}
                      href={`#${slugify(h.text)}`}
                      className="block leading-snug text-muted-foreground transition-colors duration-150 hover:text-accent"
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          ) : null}
        </div>

        {otherPosts.length > 0 ? (
          <div className="mt-20 border-t border-border bg-cream py-16 md:mt-28 md:py-20">
            <div className="container-page">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Keep reading
              </p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {otherPosts.map((p) => (
                  <Reveal key={p.slug}>
                    <Link
                      href={`/blogs/${p.slug}`}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-7 transition-colors duration-200 hover:border-accent/40"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                          {p.category}
                        </p>
                        <h3 className="mt-3 font-display text-xl leading-snug tracking-tight text-foreground">
                          {p.title}
                        </h3>
                      </div>
                      <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-all duration-300 group-hover:gap-3 group-hover:text-accent">
                        Read guide
                        <ArrowRight className="h-4 w-4" />
                      </p>
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
