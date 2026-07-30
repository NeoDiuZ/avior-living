import { Instagram } from "lucide-react";
import { BUSINESS_UEN, SOCIAL_LINKS } from "@/lib/seo/config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/avior logo.png"
              alt=""
              className="h-12 w-auto"
              style={{ mixBlendMode: "multiply" }}
            />
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl">Avior</span>
              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Living</span>
            </div>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Factory-direct furniture for Singapore homes. Delivery, assembly, and disposal always included.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="Avior Living on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="Avior Living on TikTok"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>
        <Col title="Shop" links={[
          { label: "Best Sellers", href: "/#opening-sale" },
          { label: "Coffee Tables", href: "/products" },
          { label: "TV Consoles", href: "/products" },
          { label: "Side Tables", href: "/products" },
          { label: "Loft Beds", href: "/products" },
        ]} />
        <Col title="Help" links={[
          { label: "Delivery Info", href: "/#faq" },
          { label: "Assembly", href: "/#faq" },
          { label: "Warranty", href: "/#faq" },
          { label: "Returns", href: "/returns" },
          { label: "WhatsApp Us", href: "https://wa.me/6588414701" },
        ]} />
        <Col title="Avior" links={[
          { label: "Why Avior", href: "/#why-avior" },
          { label: "Room Planner", href: "/#room-planner" },
          { label: "All Products", href: "/products" },
          { label: "Blogs", href: "/blogs" },
          { label: "FAQ", href: "/#faq" },
          { label: "Contact", href: "https://wa.me/6588414701" },
        ]} />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Avior Living Pte Ltd. Singapore.
            {BUSINESS_UEN ? ` UEN: ${BUSINESS_UEN}.` : ""}
          </p>
          <p>Factory direct. Zero markup.</p>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="hover:text-foreground">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
