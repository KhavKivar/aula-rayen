import { HomeHero } from "@/features/landing/home/home-hero";
import { CocoDog } from "@/features/landing/home/coco-dog";
import { HomeFaq } from "@/features/landing/home/home-faq";
import { HomeFooter } from "@/features/landing/home/home-footer";
import { HomeHeader } from "@/features/landing/home/home-header";
import {
  AboutSection,
  ApproachSection,
  AudienceCards,
  BookingSteps,
  ClosingSection,
  CreativeGallery,
  LocationSection,
} from "@/features/landing/home/home-sections";
import { SketchFilter } from "@/features/landing/home/illustrations";
import "@/features/landing/home/home.css";

/** Home «cuaderno»: «Agendar hora» lleva a Calendly; ver variants/01-cuaderno. */
export function LandingPage() {
  return (
    <div className="home">
      <SketchFilter />
      <HomeHeader />
      <main id="inicio">
        <HomeHero />
        <BookingSteps />
        <AudienceCards />
        <ApproachSection />
        <CreativeGallery />
        <AboutSection />
        <LocationSection />
        <HomeFaq />
        <ClosingSection />
      </main>
      <HomeFooter />
      <CocoDog />
    </div>
  );
}
