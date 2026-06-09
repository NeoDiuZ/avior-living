import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { WhyAvior } from "@/components/site/WhyAvior";
import { BestSellers } from "@/components/site/BestSellers";
import { WhiteGlove } from "@/components/site/WhiteGlove";
import { RoomPlanner } from "@/components/site/RoomPlanner";
import { Inspiration } from "@/components/site/Inspiration";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { Collections } from "@/components/site/Collections";
import { OpeningSale } from "@/components/site/OpeningSale";
import { useCartSync } from "@/hooks/useCartSync";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avior Living Singapore Furniture | Factory Direct" },
      {
        name: "description",
        content:
          "Avior Living offers factory direct furniture in Singapore with a $189 opening sale and Avior Assurance including delivery, assembly, disposal and WhatsApp support.",
      },
      { property: "og:title", content: "Avior Living | Factory Direct Furniture Singapore" },
      {
        property: "og:description",
        content:
          "Save more on premium-looking furniture with factory direct pricing, a $189 opening sale, and Avior Assurance included.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useCartSync();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <Collections />
        <OpeningSale />
        <WhyAvior />
        <BestSellers />
        <WhiteGlove />
        <RoomPlanner />
        <Inspiration />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
