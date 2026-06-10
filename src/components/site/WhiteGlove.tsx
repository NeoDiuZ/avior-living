import { Truck, Wrench, Recycle, MessageCircle, Home, ShieldCheck } from "lucide-react";

const primaryServices = [
  {
    icon: Truck,
    title: "White-Glove Delivery",
    value: "$0",
    description: "Delivered carefully to your home by our team, at no extra charge.",
  },
  {
    icon: Wrench,
    title: "Assembly Included",
    value: "$0",
    description: "We assemble your furniture for you. No tools, no stress.",
  },
];

const secondaryServices = [
  {
    icon: Recycle,
    title: "Packaging Disposal",
    value: "$0",
    description: "We clear all packaging after setup, so your home stays clean.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    description: "Get help before and after purchase. Replies within 1 working day.",
  },
  {
    icon: Home,
    title: "Singapore Homes",
    description: "Furniture selected with BTOs, condos and compact layouts in mind.",
  },
  {
    icon: ShieldCheck,
    title: "1-Year Warranty",
    description: "Structural warranty included. Contact us within 7 days of delivery for any issues.",
  },
];

export function WhiteGlove() {
  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-6xl">
            The Avior Assurance
          </h2>
          <p className="mt-5 text-base text-foreground/65 sm:text-lg">
            Everything you need for a smoother furniture buying experience in Singapore.
          </p>
        </div>

        {/* Primary services - 2 larger cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {primaryServices.map(({ icon: Icon, title, value, description }) => (
            <div
              key={title}
              className="group flex flex-col rounded-3xl bg-background p-8 transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-20px_rgba(60,35,15,0.25)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </div>
                {value && (
                  <div className="text-right">
                    <p className="font-display text-4xl font-semibold leading-none text-accent">{value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Always Included
                    </p>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold sm:text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        {/* Secondary services - 4 smaller cards */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {secondaryServices.map(({ icon: Icon, title, value, description }) => (
            <div
              key={title}
              className="group flex flex-col rounded-2xl bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(60,35,15,0.2)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                {value && (
                  <p className="font-display text-3xl font-semibold leading-none text-accent">{value}</p>
                )}
              </div>
              <h3 className="mt-4 font-display text-base font-semibold sm:text-lg">{title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
