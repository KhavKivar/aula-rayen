import { useQuery } from "@tanstack/react-query";

import { Navbar } from "@/components/ui/navbar";
import { sessionQueries } from "@/lib/session-queries";
import { LandingCourses } from "@/features/landing/components/landing-courses";
import { LandingCta } from "@/features/landing/components/landing-cta";
import { LandingFaq } from "@/features/landing/components/landing-faq";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingHero } from "@/features/landing/components/landing-hero";
import { LandingProfessional } from "@/features/landing/components/landing-professional";
import { LandingServices } from "@/features/landing/components/landing-services";
import { LandingTrustBar } from "@/features/landing/components/landing-trust-bar";

export function LandingPage() {
  const { data: session, isPending } = useQuery(sessionQueries.session);

  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="overflow-x-clip bg-background text-foreground">
      <Navbar isLoggedIn={isLoggedIn} isPending={isPending} />
      <LandingHero />
      <LandingTrustBar />
      <LandingServices />
      <LandingProfessional />
      <LandingCourses />
      <LandingFaq />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
