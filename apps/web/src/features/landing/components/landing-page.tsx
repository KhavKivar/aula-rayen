import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/ui/navbar";
import { sessionQueries } from "@/lib/session-queries";
import { LandingBenefits } from "@/features/landing/components/landing-benefits";
import { LandingCourses } from "@/features/landing/components/landing-courses";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { LandingExperience } from "@/features/landing/components/landing-experience";
import { LandingFaq } from "@/features/landing/components/landing-faq";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingLicense } from "@/features/landing/components/landing-license";
import { LandingMethod } from "@/features/landing/components/landing-method";
import { LandingProfessional } from "@/features/landing/components/landing-professional";
import { LandingTrustBar } from "@/features/landing/components/landing-trust-bar";

export function LandingPage() {
  const { data: session, isPending } = useQuery(sessionQueries.session);

  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <Navbar isLoggedIn={isLoggedIn} isPending={isPending} />
      <LandingHero />
      <LandingTrustBar />
      <LandingBenefits />
      <LandingCourses />
      <LandingMethod />
      <LandingExperience />
      <LandingProfessional />
      <LandingLicense />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
