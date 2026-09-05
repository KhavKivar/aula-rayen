import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const flowerVideo = "/media/florecer.mp4";

export function FlowerVisual({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      if (preference.matches) {
        video.pause();
      } else {
        if (!video.getAttribute("src")) video.src = flowerVideo;
        void video.play().catch(() => undefined);
      }
    };
    applyPreference();
    preference.addEventListener("change", applyPreference);
    return () => {
      preference.removeEventListener("change", applyPreference);
      video.pause();
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (!video.getAttribute("src")) video.src = flowerVideo;
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  return (
    <figure className={cn("relative isolate min-w-0", className)}>
      <div className="h-full min-h-96 overflow-hidden rounded-t-[48%] rounded-b-3xl bg-sage">
        <video
          ref={videoRef}
          poster="/images/florecer.png"
          width={1000}
          height={1100}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Flor de arcilla en movimiento suave"
          className="h-full max-h-[620px] min-h-96 w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>
      <button
        type="button"
        disabled={!hydrated}
        onClick={togglePlayback}
        className="absolute right-3 top-5 flex min-h-11 items-center gap-2 rounded-full border border-white/70 bg-background/95 px-4 text-xs font-medium shadow-sm transition hover:bg-card"
        aria-label={playing ? "Pausar animación" : "Reproducir animación"}
      >
        {playing ? (
          <Pause className="size-3.5" aria-hidden="true" />
        ) : (
          <Play className="size-3.5" aria-hidden="true" />
        )}
        {playing ? "Pausar" : "Ver movimiento"}
      </button>
      <figcaption className="absolute bottom-5 left-4 max-w-[85%] rounded-lg bg-background/95 px-4 py-3 font-heading text-lg italic sm:text-xl">
        Cada proceso tiene su tiempo.
      </figcaption>
    </figure>
  );
}
