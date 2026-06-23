import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildFaqPageJsonLd } from "@/lib/seo/jsonld";

const TITLE = "Return Policy - Avior Living";
const DESCRIPTION =
  "Avior Living's return policy: inspect your furniture on delivery and flag any issue before our team leaves. Once the delivery team has left, the order is final.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/returns",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/returns",
    type: "website",
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Return Policy", url: "/returns" },
]);

const faqs = [
  {
    q: "Can I return furniture after the delivery team has left?",
    a: "No. Avior's return window closes the moment our delivery team leaves your home. Returns must be requested on the spot, while the team is still present, so inspect the piece and raise any concern before they go.",
  },
  {
    q: "What if I find a defect a few days after delivery?",
    a: "That's covered separately by Avior's 2-year warranty, not the return policy. Warranty claims for manufacturing defects, hardware failure, or surface issues are handled as a repair or replacement, not a refund. Message us on WhatsApp with photos and we'll assess within one business day.",
  },
  {
    q: "Can I cancel or change my order before it's delivered?",
    a: "Message us on WhatsApp as early as possible. If your order hasn't been dispatched yet, we'll do our best to accommodate a change or cancellation.",
  },
  {
    q: "Is there a fee for an on-the-spot return?",
    a: "No. If you decide to return a piece while the delivery team is still on site, there's no restocking fee or return fee.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <div className="bg-cream pt-14 pb-12 md:pt-20 md:pb-16">
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
                  <BreadcrumbPage>Return Policy</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1
              className="font-display font-bold leading-[1.05] tracking-tight text-foreground"
              style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
            >
              Return Policy
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Returns at Avior happen on the spot, while our delivery team is still in your home.
              Once they leave, the order is final.
            </p>
          </div>
        </div>

        <div className="container-page max-w-3xl py-12 md:py-16">
          <p className="text-[1.0625rem] leading-[1.8] text-foreground/85">
            We don't run a mail-back or drop-off return process. Instead, every delivery doubles
            as your inspection window: our team delivers, assembles, and stays until you've had a
            chance to look the piece over. If something isn't right, that's the moment to tell us.
          </p>

          <h2 className="mt-12 font-display text-2xl tracking-tight text-foreground md:text-3xl">
            How it works
          </h2>
          <ul className="mt-5 space-y-3 text-[1.0625rem] leading-[1.7] text-foreground/85">
            <li className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Our team delivers your order, carries it into the room you specify, and assembles it fully.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Before they leave, inspect the piece: check the colour, the build, the fit in your space, and that nothing was damaged in transit.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>If you want to return it, tell the team on the spot. They'll take it back with them and we'll process your refund, free of any return fee.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>Once the delivery team has left your home, the order is considered final. We're not able to accept returns after that point.</span>
            </li>
          </ul>

          <div className="mt-7 rounded-2xl border border-border bg-sand px-6 py-5 text-[0.95rem] leading-relaxed text-foreground/80">
            Because the return window closes when our team leaves, it's worth measuring your
            doorways and room dimensions before ordering, and using the{" "}
            <Link href="/#room-planner" className="text-accent underline-offset-4 hover:underline">
              Room Planner
            </Link>{" "}
            to check fit in advance.
          </div>

          <h2 className="mt-12 font-display text-2xl tracking-tight text-foreground md:text-3xl">
            This is separate from your warranty
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-[1.8] text-foreground/85">
            The on-the-spot window above covers returns, meaning you've changed your mind or
            something isn't right at the point of delivery. It doesn't affect your 2-year warranty,
            which continues to cover manufacturing defects, hardware failure, and surface issues
            discovered after delivery. Warranty issues are handled as a repair or replacement, not
            a refund. Message us on WhatsApp with photos and we'll assess within one business day.
          </p>

          <h2 className="mt-12 font-display text-2xl tracking-tight text-foreground md:text-3xl">
            Before delivery
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-[1.8] text-foreground/85">
            To change or cancel an order before it has been dispatched, message us on WhatsApp as
            soon as possible. We'll do our best to accommodate the change.
          </p>

          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-border">
              {faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <p className="font-display text-base text-foreground">{f.q}</p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
            <a
              href="https://wa.me/6588414701"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.97]"
            >
              Ask us on WhatsApp
            </a>
            <Link
              href="/products"
              className="inline-flex h-11 items-center rounded-md border border-border bg-secondary px-5 text-sm font-semibold text-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-sand active:scale-[0.97]"
            >
              Shop all furniture
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
