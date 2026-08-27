/**
 * Grão, ruído e desalinhamento de camada — DIRECAO.md §5 (Registro B) e §17.
 *
 * O grão vem de um tile pré-renderizado com offset aleatório por frame,
 * nunca de ruído calculado por pixel em tempo real.
 */

/** PRNG determinístico. Mesma semente, mesmo ruído — a arte precisa ser reproduzível. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let grainTile: HTMLCanvasElement | null = null;

/**
 * Tile de ruído monocromático, gerado uma única vez e reaproveitado pela obra
 * inteira. 128px é grande o bastante para o olho não achar o padrão.
 */
export function getGrainTile(size = 128, seed = 0x8a2f): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d')!;
  const img = g.createImageData(size, size);
  const rand = mulberry32(seed);
  for (let i = 0; i < size * size; i++) {
    const v = (rand() * 255) | 0;
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  grainTile = c;
  return c;
}

/**
 * Grão permanente do Registro B: 4% a 8% de opacidade, offset aleatório por frame.
 * `amount` é a opacidade final; fora da faixa 0.04–0.08 a cena está errada.
 */
export function applyGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  amount = 0.06,
): void {
  const tile = getGrainTile();
  const ox = -Math.floor(Math.random() * tile.width);
  const oy = -Math.floor(Math.random() * tile.height);
  ctx.save();
  ctx.globalAlpha = amount;
  ctx.globalCompositeOperation = 'overlay';
  const pattern = ctx.createPattern(tile, 'repeat');
  if (pattern) {
    ctx.translate(ox, oy);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w - ox, h - oy);
  }
  ctx.restore();
}

/**
 * Camadas levemente fora de registro, deslocadas de 1 a 3px entre si, como
 * impressão mal alinhada. Desenha o mesmo conteúdo duas vezes com offsets
 * diferentes; a segunda passada entra rebaixada.
 */
export function misregister(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  alpha: number,
  draw: () => void,
): void {
  draw();
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(dx, dy);
  draw();
  ctx.restore();
}

/* ------------------------------------------------------------------ *
 * Campo de ruído com corte por limiar.
 *
 * É assim que nascem as massas do Registro B: mancha de tinta, carvão,
 * fumaça, sombra escorrendo. Nunca por degradê suave — o corte por limiar
 * mantém a cor chapada e ainda assim dá forma viva e imprevisível.
 * ------------------------------------------------------------------ */

const GRAD_SIZE = 256;
const perm = new Uint8Array(GRAD_SIZE * 2);
{
  const rand = mulberry32(0x1f3d5b);
  const p = new Uint8Array(GRAD_SIZE);
  for (let i = 0; i < GRAD_SIZE; i++) p[i] = i;
  for (let i = GRAD_SIZE - 1; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < GRAD_SIZE * 2; i++) perm[i] = p[i & (GRAD_SIZE - 1)];
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function grad(hash: number, x: number, y: number): number {
  switch (hash & 3) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    default:
      return -x - y;
  }
}

/** Ruído de gradiente 2D, saída em -1..1. */
export function noise2D(x: number, y: number): number {
  const xi = Math.floor(x) & (GRAD_SIZE - 1);
  const yi = Math.floor(y) & (GRAD_SIZE - 1);
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);
  const aa = perm[perm[xi] + yi];
  const ab = perm[perm[xi] + yi + 1];
  const ba = perm[perm[xi + 1] + yi];
  const bb = perm[perm[xi + 1] + yi + 1];
  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v,
  );
}

/** Ruído fractal somado em oitavas. Saída aproximadamente -1..1. */
export function fbm(x: number, y: number, octaves = 4): number {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += noise2D(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

export interface MassOptions {
  /** Escala do ruído. Menor = massas maiores. */
  scale?: number;
  /** Corte. Acima do limiar vira massa, abaixo vira vazio. */
  threshold?: number;
  /** Deslocamento do campo — anima a massa sem recalcular a forma. */
  offsetX?: number;
  offsetY?: number;
  octaves?: number;
}

/**
 * Renderiza uma massa de cor chapada num canvas offscreen, por corte de limiar
 * sobre o campo de ruído. O resultado tem borda orgânica e cor sólida — sem
 * degradê, sem anti-aliasing decorativo.
 *
 * Custa uma varredura de pixel, então a cena deve gerar a massa uma vez e
 * reusar o canvas, animando por `offset` só quando a forma precisar viver.
 */
export function renderMass(
  w: number,
  h: number,
  color: string,
  opts: MassOptions = {},
): HTMLCanvasElement {
  const { scale = 0.012, threshold = 0.05, offsetX = 0, offsetY = 0, octaves = 4 } = opts;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w));
  c.height = Math.max(1, Math.floor(h));
  const g = c.getContext('2d')!;
  const img = g.createImageData(c.width, c.height);
  const [r, gg, b] = [
    parseInt(color.slice(1, 3), 16),
    parseInt(color.slice(3, 5), 16),
    parseInt(color.slice(5, 7), 16),
  ];
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const n = fbm((x + offsetX) * scale, (y + offsetY) * scale, octaves);
      const i = (y * c.width + x) * 4;
      const on = n > threshold;
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = b;
      img.data[i + 3] = on ? 255 : 0;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}
