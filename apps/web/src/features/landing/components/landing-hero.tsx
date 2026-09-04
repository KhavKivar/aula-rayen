import { ArrowDown, Camera, Sparkles } from "lucide-react";

import { siteContent } from "@/config/static-content";
import { ExternalInstagramLink } from "@/features/landing/components/external-instagram-link";

export function LandingHero() {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-[760px] overflow-hidden bg-[#294944] pb-20 pt-40 text-white sm:pt-44 lg:min-h-[820px] lg:pb-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-52 h-[620px] w-[620px] rounded-full border border-white/10" />
        <div className="absolute -right-24 -top-36 h-[430px] w-[430px] rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-0 h-44 w-full bg-[linear-gradient(to_top,rgba(18,50,45,.5),transparent)]" />
        <div className="absolute bottom-20 right-[10%] h-24 w-24 rotate-12 rounded-[2.5rem_1rem_2.5rem_1rem] bg-[#d88968]/30 blur-sm" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.12fr_.88fr] lg:items-center lg:px-12">
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c972] sm:text-sm">
            <span className="h-px w-8 bg-[#f0c972]" />
            {siteContent.eyebrow}
          </p>
          <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            Talleres con propósito,
            <span className="mt-2 block font-serif font-normal italic text-[#f2dca8]">
              listos para llevar a la práctica.
            </span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
            {siteContent.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#cursos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f0c972] px-6 py-3 text-sm font-semibold text-[#263c38] transition hover:-translate-y-0.5 hover:bg-[#f7d990] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Explorar cursos <ArrowDown aria-hidden="true" size={17} />
            </a>
            <ExternalInstagramLink className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <Camera aria-hidden="true" size={17} /> Ver trabajo de{" "}
              {siteContent.professional.shortName}
            </ExternalInstagramLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative mx-auto aspect-[4/5] max-w-[430px] overflow-hidden rounded-[9rem_9rem_2rem_2rem] border border-white/15 bg-[#e8d9bb] shadow-2xl shadow-black/20">
            <img
              src={siteContent.assets.profileImageUrl}
              alt={siteContent.assets.profileImageAlt}
              width={430}
              height={538}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d3935]/95 via-[#1d3935]/60 to-transparent px-7 pb-7 pt-24">
              <p className="text-sm font-semibold text-[#f0c972]">
                {siteContent.professional.title}
              </p>
              <p className="mt-1 text-sm text-white/75">
                Psicología · Arteterapia · Talleres
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 left-0 rounded-2xl border border-white/15 bg-[#345953] px-5 py-4 shadow-xl sm:-left-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0c972] text-[#294944]">
                <Sparkles aria-hidden="true" size={19} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/55">
                  Enfoque
                </p>
                <p className="mt-0.5 text-sm font-semibold">
                  Humano, creativo y aplicable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
