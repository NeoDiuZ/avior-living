import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does Avior offer lower prices?",
    a: "We source direct from factory, cutting out distributors, showrooms, and retail rent. You keep the savings.",
  },
  {
    q: "Is delivery included?",
    a: "Yes. Island-wide, across HDBs and condos. Brought into your room, not just your door.",
  },
  {
    q: "Is assembly included?",
    a: "Yes. Fully assembled. No tools or handyman needed.",
  },
  {
    q: "Do you dispose of packaging?",
    a: "Yes. We clear everything after assembly.",
  },
  {
    q: "Can I check if furniture fits before buying?",
    a: "Yes. Upload your floor plan to our room planner and see what fits before you order.",
  },
  {
    q: "How accurate is the room planner?",
    a: "Visual guidance only. Confirm final measurements before ordering.",
  },
  {
    q: "How do I contact support?",
    a: "WhatsApp, before or after purchase. Replies within 1 business day.",
  },
  {
    q: "Is Avior suitable for BTOs?",
    a: "Yes. Designed for BTOs, condos, and compact Singapore spaces.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="chip mb-3">FAQ</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Questions answered.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Still unsure? Message us on WhatsApp.
          </p>
          <a
            href="https://wa.me/6580000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="md:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-5 text-left font-display text-lg hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
