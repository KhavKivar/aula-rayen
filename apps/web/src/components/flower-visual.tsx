import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import "@/components/flower-visual.css";

export function FlowerVisual({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setPlaying(!preference.matches);
    applyPreference();
    preference.addEventListener("change", applyPreference);
    return () => preference.removeEventListener("change", applyPreference);
  }, []);

  return (
    <figure
      className={cn("bloom-garden relative isolate min-w-0", className)}
      data-motion={playing ? "running" : "paused"}
    >
      <div className="overflow-hidden rounded-t-[48%] rounded-b-3xl bg-[#e4e9d8]">
        <svg
          viewBox="0 0 500 550"
          width={500}
          height={550}
          role="img"
          aria-label="Una maceta sonriente se balancea mientras una mariposa juega entre sus hojas"
          className="block h-auto max-h-[620px] w-full"
        >
          <rect width="500" height="550" fill="#e4e9d8" />
          <circle cx="250" cy="256" r="171" fill="#f4f2e5" />
          <path d="M0 439 Q130 378 260 424 T500 405 V550 H0Z" fill="#d3ddc3" />
          <path d="M0 477 Q185 424 500 470 V550 H0Z" fill="#c4d1b1" />

          <g transform="translate(365 125)">
            <g className="bloom-garden__sun">
              <g stroke="#d1a24e" strokeWidth="3" strokeLinecap="round">
                <path d="M0-43V-51 M0 43V51 M43 0H51 M-43 0H-51 M31-31L37-37 M-31 31L-37 37 M31 31L37 37 M-31-31L-37-37" />
              </g>
              <circle r="31" fill="#ebc779" />
              <path d="M-12-1q4-6 8 0 M5-1q4-6 8 0 M-7 10q7 7 14 0" fill="none" stroke="#775737" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>

          <g fill="#fffdf3" className="bloom-garden__sparkles">
            <path d="M107 242l4 12 12 4-12 4-4 12-4-12-12-4 12-4Z M390 307l3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" />
            <circle cx="157" cy="173" r="4" />
            <circle cx="350" cy="365" r="4" />
          </g>
          <ellipse className="bloom-garden__shadow" cx="249" cy="448" rx="91" ry="12" fill="#526944" opacity=".16" />

          <g className="bloom-garden__plant">
            <path d="M250 343 C247 294 259 242 244 208" fill="none" stroke="#527353" strokeWidth="9" strokeLinecap="round" />
            <g className="bloom-garden__leaf bloom-garden__leaf--left">
              <path d="M251 296 C192 300 145 263 153 218 C207 214 247 251 251 296Z" fill="#779569" />
              <path d="M248 292Q209 250 172 236" fill="none" stroke="#dbe5c8" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <g className="bloom-garden__leaf bloom-garden__leaf--right">
              <path d="M253 266 C251 218 290 181 343 191 C345 238 308 273 253 266Z" fill="#456e51" />
              <path d="M258 262Q286 222 324 205" fill="none" stroke="#a9c397" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <path d="M246 224 C210 218 194 186 208 157 C241 162 259 190 246 224Z" fill="#94ab78" />
            <path d="M245 216L221 180" stroke="#dbe5c8" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M180 343H320L306 420Q303 442 280 444H219Q197 441 194 422Z" fill="#bc7559" />
            <path d="M192 356H211L222 425Q225 436 238 444H219Q197 441 194 422Z" fill="#d28b6b" />
            <rect x="172" y="328" width="156" height="29" rx="12" fill="#d39271" />
            <path d="M184 338H313" stroke="#e9b090" strokeWidth="3" strokeLinecap="round" />
            <g fill="#513e33" className="bloom-garden__eyes">
              <ellipse cx="230" cy="383" rx="4" ry="6" />
              <ellipse cx="272" cy="383" rx="4" ry="6" />
            </g>
            <g fill="#ecac91" opacity=".8">
              <ellipse cx="215" cy="397" rx="10" ry="5" />
              <ellipse cx="286" cy="397" rx="10" ry="5" />
            </g>
            <path d="M238 401Q251 415 264 401" fill="none" stroke="#513e33" strokeWidth="3" strokeLinecap="round" />
          </g>

          <g className="bloom-garden__butterfly-flight">
            <g transform="translate(135 196) rotate(-18)">
              <g className="bloom-garden__wings">
                <path d="M0 0C-40-39-46 9-9 12C-34 27-8 43 0 12Z" fill="#b6a0bf" />
                <path d="M0 0C40-39 46 9 9 12C34 27 8 43 0 12Z" fill="#cfbdd3" />
                <circle cx="-17" cy="1" r="5" fill="#f7efe3" />
                <circle cx="17" cy="1" r="5" fill="#f7efe3" />
              </g>
              <path d="M0-3V18 M0-3L-5-10 M0-3L5-10" stroke="#65546a" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
          <g stroke="#6c865d" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M112 442v-16m0 9-9-9m9 5 8-12 M379 451v-17m0 9-8-8m8 2 9-12" />
          </g>
        </svg>
      </div>
      <button
        type="button"
        disabled={!hydrated}
        onClick={() => setPlaying((current) => !current)}
        className="absolute right-3 top-5 hidden min-h-11 items-center gap-2 rounded-full border border-white/70 bg-background/95 px-4 text-xs font-medium shadow-sm transition hover:bg-card sm:flex"
        aria-label={playing ? "Pausar animación" : "Reproducir animación"}
      >
        {playing ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
        {playing ? "Pausar" : "Ver movimiento"}
      </button>
      <figcaption className="absolute bottom-5 left-4 max-w-[85%] rounded-lg bg-background/95 px-4 py-3 font-heading text-lg italic sm:text-xl">
        Cada proceso tiene su tiempo.
      </figcaption>
    </figure>
  );
}
