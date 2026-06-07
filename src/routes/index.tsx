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
import { useCartSync } from "@/hooks/useCartSync";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Avior Living — Designer Furniture Without Showroom Markups" },
      {
        name: "description",
        content:
          "Factory-direct furniture for Singapore homes. Up to 40% below retail with white-glove delivery, assembly and packaging disposal included.",
      },
      { property: "og:title", content: "Avior Living — Factory-Direct Furniture in Singapore" },
      {
        property: "og:description",
        content:
          "Designer furniture without showroom markups. Delivery, assembly and disposal included across Singapore.",
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
