import { Truck, Wrench, MessageCircle, ShieldCheck } from "lucide-react";

const services = [
  { icon: Truck,         line1: "White-Glove",   line2: "Delivery",   value: "$0" },
  { icon: Wrench,        line1: "Free Assembly", line2: "& Disposal", value: "$0" },
  { icon: MessageCircle, line1: "WhatsApp",      line2: "Support",    value: "$0" },
  { icon: ShieldCheck,   line1: "1-Year",        line2: "Warranty",   value: "$0" },
];

export function WhiteGlove() {
  return (
    <section className="bg-sand py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-display font-bold leading-[1.05] tracking-tight text-foreground text-wrap-balance"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            The Avior Assurance
          </h2>
          <p
            className="mt-4 font-display italic font-normal leading-none tracking-tight text-muted-foreground"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
          >
            Everything included.{" "}
            <span className="text-accent">Zero Stress.</span>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {services.map(({ icon: Icon, line1, line2, value }) => (
            <div
              key={line1}
              className="group flex flex-col items-center rounded-2xl bg-background p-6 text-center transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(60,35,15,0.15)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="mt-3 font-display text-3xl font-bold leading-none text-accent">
                {value}
              </p>
              <h3 className="mt-3 font-display text-base font-semibold leading-snug sm:text-lg">
                {line1}
                <br />
                {line2}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
