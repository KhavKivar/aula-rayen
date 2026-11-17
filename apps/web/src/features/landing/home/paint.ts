/**
 * Utilidades del efecto «pintar con el scroll» de la home.
 *
 * Cada dibujo tiene una capa de color enmascarada por un «pincel»: un trazo
 * grueso en zigzag que recorre el dibujo de arriba abajo. El avance del trazo
 * (stroke-dashoffset con pathLength=1) depende de la posición del dibujo en la
 * pantalla, así que al subir el color se «despinta».
 */

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Trazo en zigzag que cubre un área de width × height en `rows` pasadas. */
export function buildBrushPath(width: number, height: number, rows: number) {
  const safeRows = Math.max(1, Math.round(rows));
  const rowHeight = height / safeRows;
  const step = Math.max(28, width / 14);
  const xs: number[] = [];
  for (let x = -20; x <= width + 20; x += step) xs.push(x);

  const points: string[] = [];
  for (let row = 0; row < safeRows; row += 1) {
    const y = rowHeight * (row + 0.5);
    const line = row % 2 === 0 ? xs : [...xs].reverse();
    line.forEach((x, index) => {
      const offset = index % 2 === 0 ? -rowHeight * 0.35 : rowHeight * 0.35;
      points.push(`${x.toFixed(1)} ${(y + offset).toFixed(1)}`);
    });
  }

  return {
    d: `M${points.join(" L")}`,
    strokeWidth: rowHeight * 1.25,
  };
}

/**
 * Avance (0–1) de un dibujo según su posición en la pantalla.
 * Empieza cuando el borde de arriba entra por abajo de la pantalla y termina
 * cuando el borde de abajo llega a `end` del alto visible (0.55 = un poco más
 * abajo de la mitad), es decir, cuando el dibujo completo ya está a la vista.
 */
export function paintProgress(
  top: number,
  height: number,
  viewportHeight: number,
  end = 0.55,
) {
  if (viewportHeight <= 0) return 1;
  const travel = viewportHeight * (1 - end) + height;
  return clamp((viewportHeight - top) / travel, 0, 1);
}
