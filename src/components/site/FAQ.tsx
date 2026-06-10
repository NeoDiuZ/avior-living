import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does Avior offer lower prices?",
    a: "We work directly with the same factories that supply Singapore's major furniture retailers, cutting out distributors, showrooms and retail rent. That saving goes straight to you.",
  },
  {
    q: "Is delivery included?",
    a: "Yes. White-glove delivery is included for eligible orders across Singapore, including HDBs and condos. Our team brings your furniture into the room of your choice.",
  },
  {
    q: "Is assembly included?",
    a: "Yes. Assembly is included for applicable furniture items. You do not need to provide tools or arrange a separate handyman.",
  },
  {
    q: "Do you dispose of packaging after delivery?",
    a: "Yes. After assembly is complete, our team will clear and remove all packaging so your home stays clean from the start.",
  },
  {
    q: "Can I check whether the furniture fits my home before buying?",
    a: "Yes. Our Find Your Fit room planner lets you upload a PDF, PNG or JPG floor plan to get a rough idea of whether selected furniture fits your space.",
  },
  {
    q: "Is the AI room planner accurate?",
    a: "It is designed to provide visual guidance and a rough fit check. We recommend confirming final measurements before placing your order.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach us through WhatsApp before or after your purchase. Most replies come back within 1 working day.",
  },
  {
    q: "Is Avior Living suitable for BTOs and smaller Singapore homes?",
    a: "Yes. Our furniture selection and planning tools are designed with Singapore homes, BTOs, condos and compact layouts specifically in mind.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="chip mb-3">FAQ</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Still unsure? Message us on WhatsApp and we will get back to you within 1 working day.
          </p>
          <a
            href="https://wa.me/6580000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Chat with us on WhatsApp
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
