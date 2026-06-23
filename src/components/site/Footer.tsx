import { BUSINESS_UEN } from "@/lib/seo/config";

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
          { label: "Returns", href: "/#faq" },
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
