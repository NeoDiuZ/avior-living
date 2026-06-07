import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-tight">Avior</span>
          <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Living</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/80 md:flex">
          <a href="#bestsellers" className="hover:text-accent">Best Sellers</a>
          <a href="#why-avior" className="hover:text-accent">Why Avior</a>
          <a href="#room-planner" className="hover:text-accent">Room Planner</a>
          <a href="#faq" className="hover:text-accent">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/6580000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center rounded-md border border-border bg-secondary px-3 text-sm font-medium text-foreground transition hover:bg-sand sm:inline-flex"
          >
            WhatsApp Us
          </a>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
