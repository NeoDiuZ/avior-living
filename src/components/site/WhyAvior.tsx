import { ArrowRight } from "lucide-react";

const traditional = ["Factory", "Distributor", "Retailer", "Showroom", "You"];
const avior = ["Factory", "Avior", "You"];

export function WhyAvior() {
  return (
    <section id="why-avior" className="bg-cream py-20 md:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mb-4 bg-background">Why Avior exists</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Same factories. <em className="not-italic text-accent">Half the markup.</em>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Traditional furniture retailers stack distributor, importer and showroom margins
            onto every piece. Avior sources directly from the same factories — and passes the
            savings on to you.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <PriceFlow
            title="The Old Way"
            sub="Up to 2.5× markup before it reaches you"
            steps={traditional}
            tone="muted"
            badge="Retail pricing"
          />
          <PriceFlow
            title="The Avior Way"
            sub="Up to 40% savings on every order"
            steps={avior}
            tone="accent"
            badge="Factory-direct"
          />
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
          We don't run physical showrooms. We don't pay middlemen. You get the same quality,
          built in the same factories that supply Singapore's biggest furniture brands —
          for thousands of dollars less.
        </p>
      </div>
    </section>
  );
}

function PriceFlow({
  title,
  sub,
  steps,
  tone,
  badge,
}: {
  title: string;
  sub: string;
  steps: string[];
  tone: "muted" | "accent";
  badge: string;
}) {
  const isAccent = tone === "accent";
  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 ${
        isAccent
          ? "border-accent/30 bg-background shadow-[0_20px_60px_-30px_rgba(170,80,40,0.3)]"
          : "border-border bg-background/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">{title}</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${
            isAccent ? "bg-accent text-accent-foreground" : "bg-sand text-foreground/70"
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isAccent && (s === "Avior" || s === "You")
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight className={`h-4 w-4 ${isAccent ? "text-accent" : "text-muted-foreground"}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
