import { ShieldCheck, Truck, Wrench, Recycle, MessageCircle } from "lucide-react";

const services = [
  { icon: Truck, title: "Delivery", detail: "$0" },
  { icon: Wrench, title: "Assembly", detail: "$0" },
  { icon: Recycle, title: "Disposal", detail: "$0" },
  { icon: MessageCircle, title: "WhatsApp", detail: "7 days" },
];

export function WhiteGlove() {
  return (
    <section id="assurance" className="bg-sand py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-semibold text-accent">
            <ShieldCheck className="h-4 w-4" />
            Avior Assurance
          </div>
          <h2 className="font-display text-4xl leading-[0.95] text-foreground sm:text-6xl md:text-7xl">
            Everything included.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/75 sm:text-lg">
            Delivery. Assembly. Packaging disposal. WhatsApp support. Everything handled for you.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {services.map(({ icon: Icon, title, detail }) => (
            <div key={title} className="rounded-xl bg-background p-6 text-center shadow-sm">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl text-foreground">{title}</h3>
              <p className="mt-2 text-lg font-semibold text-foreground/75">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
