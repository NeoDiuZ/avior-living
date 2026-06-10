import {
  ArrowRight,
  X,
  Check,
  Tag,
  BadgePercent,
  Truck,
  Wrench,
  Recycle,
  MessageCircle,
  LayoutGrid,
} from "lucide-react";

const features = [
  {
    group: "Pricing & Value",
    name: "Pricing Model",
    icon: Tag,
    traditional: "Showroom and retail markups built into every price",
    avior: "Factory-direct pricing, no middleman markups",
  },
  {
    group: "Pricing & Value",
    name: "Typical Savings",
    icon: BadgePercent,
    traditional: "Higher final price due to distribution layers",
    avior: "Up to 40% savings versus traditional retail pricing",
  },
  {
    group: "Service Inclusions",
    name: "Delivery",
    icon: Truck,
    traditional: "May be charged separately or limited to doorstep",
    avior: "White-glove delivery into your home, included",
  },
  {
    group: "Service Inclusions",
    name: "Assembly",
    icon: Wrench,
    traditional: "May be an add-on charge or limited to some items",
    avior: "Full assembly included for applicable items",
  },
  {
    group: "Service Inclusions",
    name: "Packaging Disposal",
    icon: Recycle,
    traditional: "Often not included, you handle the packaging",
    avior: "Packaging disposal included after setup",
  },
  {
    group: "Support & Tools",
    name: "Customer Support",
    icon: MessageCircle,
    traditional: "Standard customer service channels",
    avior: "WhatsApp support before and after your purchase",
  },
  {
    group: "Support & Tools",
    name: "Home Fit Check",
    icon: LayoutGrid,
    traditional: "Customer takes measurements independently",
    avior: "AI room planner helps visualise fit before purchase",
  },
];

const groups = ["Pricing & Value", "Service Inclusions", "Support & Tools"];

export function WhyAvior() {
  return (
    <section id="why-avior" className="bg-cream py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-6xl">
            Why Pay Showroom Markups?
          </h2>
          <p className="mt-5 text-base text-foreground/65 sm:text-lg">
            Most furniture prices include layers of middlemen, retail rent and showroom costs. Avior Living keeps things simple with factory-direct pricing and included service.
          </p>
        </div>

        {/* Supply chain visual */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <SupplyChain
            label="Traditional Retail Model"
            steps={["Factory", "Distributor", "Retailer", "Showroom", "You pay more"]}
            variant="muted"
          />
          <SupplyChain
            label="Avior Living Model"
            steps={["Factory", "Avior Living", "You save up to 40%"]}
            variant="accent"
          />
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          By removing unnecessary middlemen and showroom costs, Avior passes the savings directly to you.
        </p>

        {/* Comparison table - desktop */}
        <div className="mt-12 hidden overflow-hidden rounded-3xl border border-border bg-background md:block">
          {/* Header */}
          <div className="grid grid-cols-[2fr_1.1fr_1.1fr]">
            <div className="border-b border-border bg-secondary px-7 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Feature
            </div>
            <div className="border-b border-l border-border bg-secondary px-7 py-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Traditional Retailers
            </div>
            <div className="border-b border-l border-border bg-accent/12 px-7 py-5 text-xs font-bold uppercase tracking-wider text-accent">
              Avior Living
            </div>
          </div>

          {/* Feature rows grouped */}
          {groups.map((group, gi) => {
            const rows = features.filter((f) => f.group === group);
            return (
              <div key={group}>
                {gi > 0 && (
                  <div className="grid grid-cols-[2fr_1.1fr_1.1fr]">
                    <div className="border-t-2 border-border/60 px-7 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60" />
                    <div className="border-l border-t-2 border-border/60 px-7 py-3" />
                    <div className="border-l border-t-2 border-border/60 bg-accent/12 px-7 py-3" />
                  </div>
                )}
                {rows.map((f) => (
                  <div key={f.name} className="grid grid-cols-[2fr_1.1fr_1.1fr] border-t border-border/40">
                    <div className="flex items-center gap-3 px-7 py-5">
                      <f.icon className="h-5 w-5 shrink-0 text-foreground/40" strokeWidth={1.75} />
                      <span className="text-base font-semibold text-foreground">{f.name}</span>
                    </div>
                    <div className="flex items-start gap-2.5 border-l border-border/40 px-7 py-5">
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive/50" strokeWidth={2.5} />
                      <span className="text-sm text-muted-foreground">{f.traditional}</span>
                    </div>
                    <div className="flex items-start gap-2.5 border-l border-border/40 bg-accent/12 px-7 py-5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />
                      <span className="text-sm font-medium text-foreground">{f.avior}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Comparison cards - mobile */}
        <div className="mt-10 space-y-3 md:hidden">
          {features.map((f) => (
            <div key={f.name} className="overflow-hidden rounded-2xl border border-border bg-background">
              <div className="flex items-center gap-3 bg-secondary px-5 py-4">
                <f.icon className="h-4 w-4 shrink-0 text-foreground/50" strokeWidth={1.75} />
                <span className="text-sm font-bold text-foreground">{f.name}</span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="px-4 py-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5 text-destructive/50" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Traditional
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{f.traditional}</p>
                </div>
                <div className="bg-accent/8 px-4 py-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      Avior Living
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground">{f.avior}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupplyChain({
  label,
  steps,
  variant,
}: {
  label: string;
  steps: string[];
  variant: "muted" | "accent";
}) {
  const isAccent = variant === "accent";
  return (
    <div
      className={`rounded-2xl p-6 ${
        isAccent ? "bg-primary text-primary-foreground" : "bg-sand/70 text-foreground"
      }`}
    >
      <p
        className={`mb-4 text-[11px] font-bold uppercase tracking-widest ${
          isAccent ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                isAccent
                  ? s.includes("You save")
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary-foreground/15 text-primary-foreground"
                  : s === "You pay more"
                  ? "bg-foreground/10 text-foreground/50 line-through"
                  : "bg-secondary text-foreground"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight
                className={`h-4 w-4 shrink-0 ${
                  isAccent ? "text-primary-foreground/50" : "text-muted-foreground"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
