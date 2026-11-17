import { useEffect, useRef, useState } from "react";

import { clamp } from "@/features/landing/home/paint";

const BARKS = ["¡Guau!", "¡Guau guau!", "¡Wau!"];
const EDGE = 8;

// Ladrido sintetizado (sin archivos). Solo suena al tocar a Coco.
function playBark(context: AudioContext) {
  const start = context.currentTime;
  [0, 0.2].forEach((delay) => {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const volume = context.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(420, start + delay);
    oscillator.frequency.exponentialRampToValueAtTime(190, start + delay + 0.13);
    filter.type = "lowpass";
    filter.frequency.value = 1300;
    filter.Q.value = 4;
    volume.gain.setValueAtTime(0.0001, start + delay);
    volume.gain.exponentialRampToValueAtTime(0.35, start + delay + 0.015);
    volume.gain.exponentialRampToValueAtTime(0.0001, start + delay + 0.16);
    oscillator.connect(filter).connect(volume).connect(context.destination);
    oscillator.start(start + delay);
    oscillator.stop(start + delay + 0.18);
  });
}

/**
 * Coco Drila, el perro que dibujó Rayen. Camina de lado a lado
 * mientras la persona hace scroll y ladra al darse vuelta. Si lo tocan,
 * ladra con sonido.
 */
export function CocoDog() {
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const barkRef = useRef<(options?: { text?: string; sound?: boolean }) => void>(
    () => undefined,
  );
  const [bubble, setBubble] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = {
      x: 16,
      direction: 1,
      distance: 0,
      lastBark: 0,
      barks: 0,
      lastY: window.scrollY,
      frame: 0,
    };
    let walkTimer = 0;
    let bubbleTimer = 0;

    const width = () => root.getBoundingClientRect().width;
    const bark = ({ text, sound = false }: { text?: string; sound?: boolean } = {}) => {
      const now = performance.now();
      if (!sound && now - state.lastBark < 900) return;
      state.lastBark = now;
      setBubble(text ?? BARKS[state.barks % BARKS.length]);
      state.barks += 1;
      root.classList.remove("is-barking");
      void root.offsetWidth;
      root.classList.add("is-barking");
      window.clearTimeout(bubbleTimer);
      bubbleTimer = window.setTimeout(() => {
        setBubble(null);
        root.classList.remove("is-barking");
      }, 1300);
      if (sound) {
        try {
          audioRef.current ??= new AudioContext();
          playBark(audioRef.current);
        } catch {
          // Sin audio disponible: queda solo el globo.
        }
      }
    };
    barkRef.current = bark;

    const place = () => {
      root.style.setProperty("--coco-x", `${state.x.toFixed(1)}px`);
      root.style.setProperty("--coco-direction", String(state.direction));
    };

    const walk = (delta: number) => {
      const max = window.innerWidth - width() - EDGE;
      state.x += Math.min(Math.abs(delta), 80) * 0.9 * state.direction;
      if (state.x >= max || state.x <= EDGE) {
        state.x = clamp(state.x, EDGE, max);
        state.direction *= -1;
        bark();
      }
      state.distance += Math.abs(delta);
      if (state.distance > 1600) {
        state.distance = 0;
        bark();
      }
      place();
      root.classList.add("is-walking");
      window.clearTimeout(walkTimer);
      walkTimer = window.setTimeout(() => root.classList.remove("is-walking"), 160);
    };

    const onScroll = () => {
      if (state.frame) return;
      state.frame = requestAnimationFrame(() => {
        state.frame = 0;
        const y = window.scrollY;
        const delta = y - state.lastY;
        state.lastY = y;
        if (!reduced && delta !== 0) walk(delta);
      });
    };

    const onResize = () => {
      state.x = clamp(state.x, EDGE, window.innerWidth - width() - EDGE);
      place();
    };

    if (reduced) state.x = window.innerWidth - width() - 24;
    place();
    const greeting = window.setTimeout(
      () => bark({ text: "¡Hola! Soy Coco 🐾" }),
      1200,
    );

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(state.frame);
      window.clearTimeout(walkTimer);
      window.clearTimeout(bubbleTimer);
      window.clearTimeout(greeting);
    };
  }, []);

  return (
    <div ref={rootRef} className="home-coco">
      <div className="home-coco__hideout">
        <p className="home-coco__bubble" aria-live="polite" hidden={!bubble}>
          {bubble}
        </p>
        <button
          type="button"
          className="home-coco__button"
          aria-label="Toca a Coco para que ladre"
          onClick={() => barkRef.current({ sound: true })}
        >
          <svg
            className="home-coco__drawing"
            viewBox="0 0 210 150"
            aria-hidden="true"
            focusable="false"
          >
            <g className="home-coco__body">
              <path className="home-coco__tail" d="M48 66 Q26 56 22 34" />
              <g className="home-coco__leg home-coco__leg--a">
                <path d="M58 90 L56 126 Q55 132 62 132 L72 132 Q76 128 69 126 L69 90 Z" />
              </g>
              <g className="home-coco__leg home-coco__leg--b">
                <path d="M74 90 L75 126 Q75 132 82 132 L91 132 Q94 128 87 126 L86 90 Z" />
              </g>
              <g className="home-coco__leg home-coco__leg--b">
                <path d="M124 90 L123 126 Q122 132 129 132 L139 132 Q142 128 135 126 L136 90 Z" />
              </g>
              <g className="home-coco__leg home-coco__leg--a">
                <path d="M138 88 L142 126 Q142 132 149 132 L158 132 Q161 128 154 126 L150 88 Z" />
              </g>
              <path
                className="home-coco__shadow"
                d="M54 80 Q50 56 80 52 Q108 47 138 51 Q162 54 161 76 Q162 98 146 106 Q108 113 70 107 Q52 103 54 80 Z"
              />
              <path
                className="home-coco__fill"
                d="M46 74 Q42 50 72 46 Q100 41 130 45 Q154 48 153 70 Q154 92 138 100 Q100 107 62 101 Q44 97 46 74 Z"
              />
              <path
                className="home-coco__fill"
                d="M140 56 Q136 26 162 22 Q184 20 189 40 Q194 50 200 53 Q207 60 196 66 Q184 70 172 68 Q158 72 148 66 Z"
              />
              <path
                className="home-coco__ear"
                d="M156 28 Q142 30 144 54 Q148 62 157 54 Q160 40 156 28 Z"
              />
              <path className="home-coco__collar" d="M146 60 Q152 70 160 72" />
              <g className="home-coco__lines">
                <path d="M46 74 Q42 50 72 46 Q100 41 130 45 Q154 48 153 70 Q154 92 138 100 Q100 107 62 101 Q44 97 46 74 Z" />
                <path d="M140 56 Q136 26 162 22 Q184 20 189 40 Q194 50 200 53 Q207 60 196 66 Q184 70 172 68 Q158 72 148 66" />
                <path d="M156 28 Q142 30 144 54 Q148 62 157 54 Q160 40 156 28 Z" />
                <path d="M182 64 Q188 68 194 64" />
              </g>
              <circle className="home-coco__eye" cx="174" cy="40" r="3" />
              <circle className="home-coco__eye" cx="199" cy="56" r="4.5" />
              <circle className="home-coco__freckle" cx="184" cy="58" r="1.4" />
              <circle className="home-coco__freckle" cx="189" cy="61" r="1.4" />
              <circle className="home-coco__freckle" cx="181" cy="62" r="1.4" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}
