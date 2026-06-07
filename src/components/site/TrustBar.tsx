import { Truck, Wrench, Recycle, MessageCircle, MapPin, Star } from "lucide-react";

const items = [
  { icon: Star, label: "Trusted by SG homeowners" },
  { icon: Truck, label: "Delivery included" },
  { icon: Wrench, label: "Assembly included" },
  { icon: Recycle, label: "Packaging disposal" },
  { icon: MessageCircle, label: "WhatsApp support" },
  { icon: MapPin, label: "Designed for SG homes" },
];

export function TrustBar() {
  return (
    <section aria-label="Trust signals" className="border-y border-border bg-background">
      <div className="container-page">
        <ul className="flex snap-x snap-mandatory gap-6 overflow-x-auto py-4 text-sm text-foreground/80 md:grid md:grid-cols-6 md:gap-3 md:overflow-visible">
          {items.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex shrink-0 snap-start items-center gap-2 md:justify-center"
            >
              <Icon className="h-4 w-4 text-accent" />
              <span className="whitespace-nowrap text-xs md:text-[13px]">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
