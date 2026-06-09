import logo from "@/assets/avior-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="Avior Living logo" className="h-12 w-auto" />
            <div>
              <p className="font-display text-2xl text-foreground">Avior Living</p>
              <p className="text-sm font-semibold text-foreground/65">Factory Direct Furniture</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-base text-muted-foreground">
            Factory direct furniture for Singapore homes with Avior Assurance included.
          </p>
        </div>
        <Col title="Shop" links={["Collections", "$189 Sale", "Best Sellers", "Dining", "Bedroom"]} />
        <Col title="Support" links={["Delivery", "Assembly", "Disposal", "WhatsApp", "FAQ"]} />
        <Col title="Why Avior" links={["Factory Direct", "Avior Assurance", "Room Planner", "Contact", "Reviews"]} />
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Avior Living. Singapore.</p>
          <p>Save more. Furnish better.</p>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="text-sm font-semibold text-foreground/80">{title}</h4>
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
