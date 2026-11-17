import { useEffect, useId, useMemo, useRef } from "react";
import type { ReactNode } from "react";

import { buildBrushPath, paintProgress } from "@/features/landing/home/paint";

type Painter = { element: SVGSVGElement; brush: SVGPathElement };

const painters = new Set<Painter>();
let frame = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function paintAll() {
  frame = 0;
  const reduced = prefersReducedMotion();
  const viewportHeight = window.innerHeight;
  painters.forEach(({ element, brush }) => {
    const rect = element.getBoundingClientRect();
    const progress = reduced
      ? 1
      : paintProgress(rect.top, rect.height, viewportHeight);
    brush.style.strokeDashoffset = String(1 - progress);
  });
}

function schedulePaint() {
  if (!frame) frame = requestAnimationFrame(paintAll);
}

function register(painter: Painter) {
  if (painters.size === 0) {
    window.addEventListener("scroll", schedulePaint, { passive: true });
    window.addEventListener("resize", schedulePaint);
  }
  painters.add(painter);
  schedulePaint();
  return () => {
    painters.delete(painter);
    if (painters.size === 0) {
      window.removeEventListener("scroll", schedulePaint);
      window.removeEventListener("resize", schedulePaint);
    }
  };
}

/**
 * Dibujo de línea cuyo color se pinta con el scroll.
 * `paint` son las manchas de color; `lines`, el trazo negro encima.
 * Con `mode="mount"` se pinta una vez al aparecer (por ejemplo, tras confirmar).
 */
export function PaintableSvg({
  width,
  height,
  rows = 5,
  paint,
  lines,
  label,
  className,
  mode = "scroll",
}: {
  width: number;
  height: number;
  rows?: number;
  paint: ReactNode;
  lines: ReactNode;
  label?: string;
  className?: string;
  mode?: "scroll" | "mount";
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const brushRef = useRef<SVGPathElement>(null);
  const maskId = `pincel-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const brush = useMemo(
    () => buildBrushPath(width, height, rows),
    [width, height, rows],
  );

  useEffect(() => {
    const element = svgRef.current;
    const brushPath = brushRef.current;
    if (!element || !brushPath) return;

    if (mode === "scroll") return register({ element, brush: brushPath });

    if (prefersReducedMotion()) {
      brushPath.style.strokeDashoffset = "0";
      return;
    }
    const start = performance.now();
    let id = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      brushPath.style.strokeDashoffset = String(1 - t * (2 - t));
      if (t < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [mode]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={-40}
          y={-40}
          width={width + 80}
          height={height + 80}
        >
          <path
            ref={brushRef}
            d={brush.d}
            className="home-brush"
            strokeWidth={brush.strokeWidth}
            pathLength={1}
            style={{ strokeDasharray: "1 1", strokeDashoffset: 1 }}
          />
        </mask>
      </defs>
      <g className="home-paint" mask={`url(#${maskId})`}>
        {paint}
      </g>
      <g className="home-lines">{lines}</g>
    </svg>
  );
}
