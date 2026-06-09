import { Link } from "@tanstack/react-router";
import { CartDrawer } from "./CartDrawer";
import logo from "@/assets/avior-logo.png.asset.json";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/92 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="Avior Living logo" className="h-11 w-auto sm:h-12" />
          <div className="hidden sm:block">
            <p className="font-display text-2xl leading-none text-foreground">Avior Living</p>
            <p className="mt-1 text-xs font-semibold text-foreground/60">Factory Direct Furniture</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-foreground/80 md:flex">
          <a href="#collections" className="hover:text-accent">Collections</a>
          <a href="#sale-189" className="hover:text-accent">$189 Sale</a>
          <a href="#why-avior" className="hover:text-accent">Factory Direct</a>
          <a href="#assurance" className="hover:text-accent">Avior Assurance</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/6580000000"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center rounded-md border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition hover:bg-sand sm:inline-flex"
          >
            WhatsApp
          </a>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
