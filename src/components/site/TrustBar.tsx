import { Tag, Truck, Wrench, Recycle, MessageCircle, Home } from "lucide-react";

const trustItems = [
  { icon: Tag,           label: "Factory-Direct Pricing" },
  { icon: Truck,         label: "White-Glove Delivery" },
  { icon: Wrench,        label: "Assembly Included" },
  { icon: Recycle,       label: "Packaging Disposal" },
  { icon: MessageCircle, label: "WhatsApp Support" },
  { icon: Home,          label: "Singapore Homes" },
];

export function TrustBar() {
  return (
    <section aria-label="Avior Assurance highlights" className="bg-background">
      <div className="container-page">
        <div className="grid grid-cols-3 divide-x divide-border md:grid-cols-6">
          {trustItems.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2.5 px-3 py-6 text-center md:px-5 md:py-8"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-[11px] font-semibold leading-tight text-foreground/75 sm:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
