import { Truck, Wrench, Recycle, MessageCircle } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "White-Glove Delivery",
    body: "Two-person delivery to your unit — into the room of your choice. Coordinated by WhatsApp the day before.",
  },
  {
    icon: Wrench,
    title: "Assembly Included",
    body: "Our team builds it, levels it, and hands you a finished room. No allen keys. No half-empty afternoons.",
  },
  {
    icon: Recycle,
    title: "Packaging Disposal",
    body: "Cardboard, plastic, foam — we take all of it back with us. You're left with the furniture, nothing else.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    body: "Real humans, 7 days a week. Ask about fit, fabric, lead time — get answers in minutes, not days.",
  },
];

export function WhiteGlove() {
  return (
    <section className="bg-sand py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="chip mb-4 bg-background">White-glove experience</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            We don't just deliver. <em className="not-italic text-accent">We finish the job.</em>
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Furniture should arrive, get set up, and look exactly how you imagined — without
            you spending a Saturday on the floor with a screwdriver.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-2xl bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-30px_rgba(80,50,30,0.4)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
