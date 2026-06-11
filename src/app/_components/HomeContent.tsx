"use client";

import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { WhyAvior } from "@/components/site/WhyAvior";
import { BestSellers } from "@/components/site/BestSellers";
import { WhiteGlove } from "@/components/site/WhiteGlove";
import { RoomPlanner } from "@/components/site/RoomPlanner";
import { Inspiration } from "@/components/site/Inspiration";
import { FAQ } from "@/components/site/FAQ";
import { FinalCTA } from "@/components/site/FinalCTA";
import { Footer } from "@/components/site/Footer";
import { useCartSync } from "@/hooks/useCartSync";

export function HomeContent() {
  useCartSync();
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main className="pb-20 md:pb-0">
        <Hero />
        <WhyAvior />
        <BestSellers />
        <WhiteGlove />
        <RoomPlanner />
        <Inspiration />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex gap-3 border-t border-border bg-background/96 px-4 py-3 backdrop-blur-sm md:hidden">
        <a
          href="#opening-sale"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition active:scale-[0.98]"
        >
          Shop Opening Sale
        </a>
        <a
          href="https://wa.me/6580000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-foreground transition hover:bg-secondary active:scale-[0.98]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
