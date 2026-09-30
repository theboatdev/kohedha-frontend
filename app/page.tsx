import { AppSection } from "@/components/home/app-section";
import { BeaconStory } from "@/components/home/beacon-story";
import { Browse } from "@/components/home/browse";
import { DayParts } from "@/components/home/day-parts";
import { Faq } from "@/components/home/faq";
import { Features } from "@/components/home/features";
import { Hero } from "@/components/home/hero";
import { MotionProvider } from "@/components/brand/primitives";
import { Problem } from "@/components/home/problem";
import { ScrollProgress } from "@/components/home/scroll-progress";
import { VenueCta } from "@/components/home/venue-cta";
import { VibeMarquee } from "@/components/home/vibe-marquee";
import "./home-landing.css";

export default function HomePage() {
  return (
    <div className="kh-page bg-kh-cream font-kh text-kh-ink antialiased">
      <MotionProvider>
        <ScrollProgress />
        <Hero />
        <VibeMarquee />
        <Problem />
        <BeaconStory />
                <VenueCta />
        <Browse />
        <Features />
        <DayParts />
        <AppSection />
        <Faq />
      </MotionProvider>
    </div>
  );
}
