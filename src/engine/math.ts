/** Utilidades numéricas do motor. Nada aqui decide nada — só mede. */

export function clamp(v: number, lo = 0, hi = 1): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Remapeia `v` de [inA, inB] para 0–1, com corte nas pontas. */
export function range(v: number, inA: number, inB: number): number {
  if (inB === inA) return 0;
  return clamp((v - inA) / (inB - inA));
}

export function smoothstep(t: number): number {
  const k = clamp(t);
  return k * k * (3 - 2 * k);
}

export function easeInOut(t: number): number {
  const k = clamp(t);
  return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
}

/** Posição inteira. O Registro A não admite subpixel. */
export function snap(v: number): number {
  return Math.round(v);
}
