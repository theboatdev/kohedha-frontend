import type { Metadata } from "next";
import { MotionProvider } from "@/components/brand/primitives";
import { FaqSection } from "@/components/brand/faq-section";
import { BidRoom } from "@/components/vendors-landing/bid-room";
import { VENDOR_FAQS } from "@/components/vendors-landing/data";
import { Deals } from "@/components/vendors-landing/deals";
import { FinalCta } from "@/components/vendors-landing/final-cta";
import { VendorHero } from "@/components/vendors-landing/hero";
import { MenuIntel } from "@/components/vendors-landing/menu-intel";
import { Onboarding } from "@/components/vendors-landing/onboarding";
import { PayPerGuest } from "@/components/vendors-landing/pay-per-guest";
import { Pricing } from "@/components/vendors-landing/pricing";
import { VendorFooter } from "@/components/vendors-landing/vendor-footer";
import { VendorNav } from "@/components/vendors-landing/vendor-nav";

export const metadata: Metadata = {
  title: "For venues",
  description:
    "Diners cast Beacons with their group size, budget and vibe. Bid for the ones that match your venue, win the table, and pay only when guests are scanned in.",
  alternates: { canonical: "/vendors" },
};

export default function VendorLandingPage() {
  return (
    <div className="kh-page min-h-screen bg-kh-cream font-kh text-kh-ink antialiased">
      <MotionProvider>
        <VendorNav />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <VendorHero />
          <PayPerGuest />
          <BidRoom />
          <Deals />
          <MenuIntel />
          <Onboarding />
          <Pricing />
          <FaqSection
            id="faq"
            kicker="Questions"
            title="For venue *owners.*"
            intro="Straight answers on costs, equipment and what happens when a guest doesn't show."
            items={VENDOR_FAQS}
            className="bg-kh-cream pb-24 pt-0 sm:pb-32"
          />
          <FinalCta />
        </main>
        <VendorFooter />
      </MotionProvider>
    </div>
  );
}
