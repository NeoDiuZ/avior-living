export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl">Avior</span>
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Living
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Factory-direct furniture for Singapore homes. Delivery, assembly and disposal — always
            included.
          </p>
        </div>
        <Col title="Shop" links={["Best Sellers", "Sofas", "Beds", "Dining", "Storage"]} />
        <Col title="Help" links={["Delivery", "Assembly", "Warranty", "Returns", "WhatsApp Us"]} />
        <Col title="Avior" links={["Why Avior", "Room Planner", "Reviews", "FAQ", "Contact"]} />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Avior Living Pte Ltd. Singapore.</p>
          <p>Designer furniture without showroom markups.</p>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-foreground">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
