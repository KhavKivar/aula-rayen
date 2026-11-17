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
    expect(paintProgress(1000, 300, 800)).toBe(0);
    expect(paintProgress(800, 300, 800)).toBe(0);
  });

  it("todavía no termina cuando el dibujo recién asoma", () => {
    expect(paintProgress(600, 300, 800)).toBeLessThan(0.5);
  });

  it("pinta rápido al principio: a mitad de recorrido ya va en 75 %", () => {
    // recorrido = 800 * 0.9 + 300 = 1020; mitad en top = 290
    expect(paintProgress(290, 300, 800)).toBeCloseTo(0.75);
  });

  it("deja una porción menor para el final", () => {
    // dibujo completo a la vista (borde de abajo en 440)
    const visible = paintProgress(140, 300, 800);
    expect(visible).toBeGreaterThan(0.85);
    expect(visible).toBeLessThan(1);
  });

  it("termina justo antes de que el dibujo salga por arriba", () => {
    // borde de abajo en el 10 % de la pantalla: top + 300 = 80
    expect(paintProgress(-220, 300, 800)).toBe(1);
    expect(paintProgress(-500, 300, 800)).toBe(1);
  });
});
