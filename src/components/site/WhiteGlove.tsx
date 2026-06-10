import { Truck, Wrench, Recycle, MessageCircle } from "lucide-react";

const services = [
  { icon: Truck, title: "Free Delivery" },
  { icon: Wrench, title: "Free Assembly" },
  { icon: Recycle, title: "Packaging Removed" },
  { icon: MessageCircle, title: "WhatsApp Support" },
];

export function WhiteGlove() {
  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Avior Assurance
          </p>
          <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-6xl md:text-7xl">
            Everything included.
            <br />
            <span className="text-accent">Zero stress.</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {services.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="group flex flex-col items-center rounded-3xl bg-background p-8 text-center transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(80,50,30,0.4)]"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-xl sm:text-2xl">{title}</h3>
              <p className="mt-1 font-display text-3xl text-accent sm:text-4xl">$0</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
