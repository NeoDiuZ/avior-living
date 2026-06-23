import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageJsonLd } from "@/lib/seo/jsonld";

const faqs = [
  {
    q: "How can Avior sell the same quality furniture at 40% below retail?",
    a: "Traditional furniture retail has four cost layers between factory and customer: manufacturer, distributor, retailer, and showroom. Each adds 20 to 40% markup to cover their margins, staff, and rent. Avior sources directly from the same factories that produce for established local brands, then ships straight to you with no middlemen and no Orchard Road showroom overhead. The furniture is identical in material and build. The only difference is who's taking the cut.",
  },
  {
    q: "What exactly is included with every order: delivery, assembly, and disposal?",
    a: "Everything is included at no extra charge. Our team delivers island-wide across all HDBs, condos, and landed properties, including upper floors with no lift access. We carry furniture into the exact room you specify, assemble it fully, and remove every piece of packaging and old carton before we leave. You won't need to arrange a separate handyman or make a trip to the recycling point.",
  },
  {
    q: "How long does delivery take, and what is the process?",
    a: "Most in-stock items are delivered within 5–10 business days. You'll receive a confirmation WhatsApp once your order is placed, followed by a delivery window closer to the date. On the day, our team calls 30 minutes before arrival. Assembly typically takes 30–60 minutes depending on the piece. If you have a specific move-in date or renovation timeline, message us on WhatsApp and we'll do our best to accommodate.",
  },
  {
    q: "Will the furniture fit my room? How do I check before ordering?",
    a: "Use our Room Planner on this page: upload your floor plan or enter dimensions and you can visualise how each piece sits in your space. That said, always double-check the product dimensions listed on each item against your actual room measurements, particularly doorway widths and ceiling height for taller pieces. If you're unsure about fit for a specific space (e.g. a narrow BTO corridor), send us a photo on WhatsApp and we'll advise before you order.",
  },
  {
    q: "What warranty do I get, and what happens if something arrives damaged?",
    a: "Every item comes with a 2-year warranty covering manufacturing defects, including structural issues, hardware failure, and surface defects present at delivery. If anything arrives damaged, photograph it before our team leaves and flag it on the spot; we'll arrange a replacement at no cost. For issues that develop after delivery, WhatsApp us with photos and we'll assess within one business day. We don't make you fill in forms or wait weeks for a response.",
  },
  {
    q: "What is Avior's return policy?",
    a: "Returns happen on the spot: inspect your furniture while our delivery team is still there and let them know before they leave if you'd like to return it, free of any return fee. Once the team has left, the order is final and can't be returned for a refund. This is separate from the 2-year warranty above, which still covers defects found later as a repair or replacement, not a refund. See our full return policy for details.",
  },
  {
    q: "Is Avior furniture suitable for Singapore BTOs, HDBs, and compact spaces?",
    a: "Yes, our range is designed with Singapore homes in mind. Pieces are sized for typical BTO and HDB room layouts, with dimensions that clear standard doorframes. Many items are available in compact variants suited for 3-room and 4-room flats. We also carry loft beds and multi-function pieces that work well in smaller bedrooms. If you're furnishing a new BTO and want to plan the whole space, our team can advise on what combinations work best together.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <JsonLd data={buildFaqPageJsonLd(faqs)} />
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
            href="https://wa.me/6588414701"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" style={{ fill: "#25D366" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
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
                <AccordionContent className="pb-6 text-[0.9375rem] leading-relaxed text-muted-foreground">
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
