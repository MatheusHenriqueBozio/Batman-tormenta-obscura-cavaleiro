/**
 * Figuras por massa, para o Registro B — DIRECAO.md §5.
 *
 * Aqui não há sprite nem grid: as formas são recortes, definidas em unidades
 * da própria altura, de modo que a mesma função sirva a uma figura de 12px e a
 * uma que ocupe três viewports.
 *
 * A silhueta de capa curta é a forma errada da §11: menor, capa mais curta.
 * Ela nasce na S03, por três ou quatro quadros, e volta na S14 — maior, e
 * desta vez ela fica. Por isso mora aqui, e não dentro de uma cena.
 */

export interface FigureOptions {
  /** Altura da figura em pixels de tela. */
  readonly h: number;
  /** Capa curta: a forma errada. */
  readonly short?: boolean;
}

/**
 * O recorte de uma figura de capa. Sem contorno, sem anatomia, sem
 * acabamento — só a massa. O lado direito é o espelho do esquerdo, o que é o
 * que impede a figura de entortar.
 */
export function silhueta(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  opts: FigureOptions,
): void {
  const { h, short = false } = opts;
  const hem = short ? 0.42 : 0.09;
  const wing = short ? 0.2 : 0.3;
  const p = (x: number, y: number): [number, number] => [cx + x * h, baseY - y * h];

  const meia: Array<[number, number]> = [
    [-0.09, 0],
    [-0.11, hem * 0.7],
    [-wing, hem],
    [-wing * 0.87, 0.34],
    [-wing * 0.93, 0.52],
    [-0.22, 0.72],
    [-0.2, 0.8],
    [-0.085, 0.83],
    [-0.085, 0.97],
    [-0.13, 1.1],
    [-0.045, 0.99],
  ];

  ctx.beginPath();
  const primeiro = p(...meia[0]);
  ctx.moveTo(primeiro[0], primeiro[1]);
  for (let i = 1; i < meia.length; i++) {
    const q = p(...meia[i]);
    ctx.lineTo(q[0], q[1]);
  }
  for (let i = meia.length - 1; i >= 0; i--) {
    const q = p(-meia[i][0], meia[i][1]);
    ctx.lineTo(q[0], q[1]);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Uma figura de joelhos, mãos no chão, por massa. A postura da S14.
 *
 * A cabeça e a orelha entram como formas próprias, e não como parte do
 * contorno: sem elas a massa lê como pedra, e a cena precisa que se reconheça
 * uma pessoa curvada antes de reconhecer qualquer outra coisa.
 */
export function ajoelhado(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  h: number,
): void {
  const p = (x: number, y: number): [number, number] => [cx + x * h, baseY - y * h];

  // A corcova da capa sobre as costas, do quadril à nuca.
  const capa: Array<[number, number]> = [
    [-0.66, 0],
    [-0.64, 0.16],
    [-0.5, 0.38],
    [-0.28, 0.44],
    [-0.04, 0.46],
    [0.12, 0.4],
    [0.16, 0.28],
    [0.12, 0.06],
    [0.08, 0],
  ];
  ctx.beginPath();
  const q = p(...capa[0]);
  ctx.moveTo(q[0], q[1]);
  for (let i = 1; i < capa.length; i++) {
    const r = p(...capa[i]);
    ctx.lineTo(r[0], r[1]);
  }
  ctx.closePath();
  ctx.fill();

  // A cabeça, baixa e à frente, fora da corcova.
  const [hx, hy] = p(0.23, 0.29);
  ctx.beginPath();
  ctx.ellipse(hx, hy, h * 0.155, h * 0.145, 0, 0, Math.PI * 2);
  ctx.fill();

  // A orelha, apontando para trás e para cima.
  ctx.beginPath();
  const orelha: Array<[number, number]> = [
    [0.15, 0.4],
    [0.13, 0.56],
    [0.26, 0.42],
  ];
  const o0 = p(...orelha[0]);
  ctx.moveTo(o0[0], o0[1]);
  for (let i = 1; i < orelha.length; i++) {
    const r = p(...orelha[i]);
    ctx.lineTo(r[0], r[1]);
  }
  ctx.closePath();
  ctx.fill();

  // O braço que desce até o chão. É ele que diz que as mãos estão apoiadas.
  ctx.beginPath();
  const braco: Array<[number, number]> = [
    [0.24, 0.26],
    [0.36, 0.24],
    [0.5, 0.02],
    [0.36, 0],
  ];
  const b0 = p(...braco[0]);
  ctx.moveTo(b0[0], b0[1]);
  for (let i = 1; i < braco.length; i++) {
    const r = p(...braco[i]);
    ctx.lineTo(r[0], r[1]);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Uma pessoa de pé, por massa. Sem capa, sem orelha, sem nada que a torne
 * personagem — é a forma de alguém parado.
 *
 * Os pais da S16 usam isto. O horror daquela cena não é que eles sejam
 * monstros: é que eles estão calmos, distantes, imóveis e íntegros. Uma forma
 * humana comum é exatamente o que a cena precisa, e qualquer deformidade a
 * estragaria.
 */
export function pessoa(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  h: number,
): void {
  const p = (x: number, y: number): [number, number] => [cx + x * h, baseY - y * h];

  const meia: Array<[number, number]> = [
    [-0.055, 0],
    [-0.06, 0.3],
    [-0.085, 0.4],
    [-0.105, 0.52],
    [-0.115, 0.74],
    [-0.1, 0.8],
    [-0.05, 0.84],
    [-0.045, 0.92],
    [-0.02, 0.97],
  ];

  ctx.beginPath();
  const q = p(...meia[0]);
  ctx.moveTo(q[0], q[1]);
  for (let i = 1; i < meia.length; i++) {
    const r = p(...meia[i]);
    ctx.lineTo(r[0], r[1]);
  }
  for (let i = meia.length - 1; i >= 0; i--) {
    const r = p(-meia[i][0], meia[i][1]);
    ctx.lineTo(r[0], r[1]);
  }
  ctx.closePath();
  ctx.fill();

  // A cabeça, separada do corpo pelo pescoço.
  const [hx, hy] = p(0, 1.02);
  ctx.beginPath();
  ctx.ellipse(hx, hy, h * 0.056, h * 0.066, 0, 0, Math.PI * 2);
  ctx.fill();
}
