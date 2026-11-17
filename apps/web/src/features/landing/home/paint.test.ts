import { describe, expect, it } from "vitest";

import { buildBrushPath, paintProgress } from "@/features/landing/home/paint";

describe("buildBrushPath", () => {
  it("cubre todas las filas con un trazo continuo y grueso", () => {
    const { d, strokeWidth } = buildBrushPath(120, 100, 5);

    expect(d.startsWith("M")).toBe(true);
    expect(d.match(/M/g)).toHaveLength(1);
    expect(strokeWidth).toBeCloseTo(25);
  });

  it("es determinista para que el render del servidor y del cliente coincidan", () => {
    expect(buildBrushPath(600, 380, 9)).toEqual(buildBrushPath(600, 380, 9));
  });

  it("tolera un número de filas inválido", () => {
    expect(buildBrushPath(100, 50, 0).strokeWidth).toBeCloseTo(62.5);
  });
});

describe("paintProgress", () => {
  it("vale 0 mientras el dibujo no entra en la pantalla", () => {
    expect(paintProgress(1000, 800)).toBe(0);
  });

  it("avanza a medida que el dibujo sube", () => {
    expect(paintProgress(540, 800)).toBeCloseTo(0.5);
  });

  it("queda pintado del todo al llegar arriba", () => {
    expect(paintProgress(100, 800)).toBe(1);
    expect(paintProgress(-500, 800)).toBe(1);
  });
});
