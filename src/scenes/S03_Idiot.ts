/**
 * S03 — IDIOTA · Registro B · preto + vermelho · 1,5 viewport · pinned, rápido
 *
 * Corte seco. O pixel desaparece. Fundo chapado, sem cenário.
 *
 * Uma silhueta. Uma segunda atravessa a primeira, e a cada atravessamento
 * nasce uma cópia deslocada. Autocorreção virando autopunição: o campo vai
 * ficando congestionado de versões dele mesmo, e nenhuma sai.
 *
 * Aqui Jason entra pela primeira vez (§11): uma das cópias, por três ou quatro
 * quadros apenas, tem a silhueta errada — menor, capa mais curta. E some. Não
 * se nomeia, não se explica, não se volta a ela até a S14.
 */

import { applyGrain, misregister } from '../visual/grain';
import { P_IDIOT } from '../visual/palettes';
import type { Scene, SceneFrame } from '../engine/scene';
import { clamp, range } from '../engine/math';

/** Quantas vezes a segunda silhueta atravessa a primeira. */
const CROSSINGS = 5;
/** Em qual atravessamento a forma errada aparece. */
const JASON_AT = 2;
/** Largura da janela em que ela existe. Três ou quatro quadros de scroll. */
const JASON_WINDOW = 0.007;

interface Shape {
  /** Altura da figura em pixels de tela. */
  h: number;
  /** Capa curta: a forma errada. */
  short?: boolean;
}

/**
 * A silhueta, por massa. Sem contorno, sem anatomia, sem acabamento — só o
 * recorte. É construída em unidades da própria altura, então a mesma função
 * serve a uma figura de 12px e a uma que ocupa a tela inteira.
 */
function silhueta(ctx: CanvasRenderingContext2D, cx: number, baseY: number, s: Shape): void {
  const { h, short = false } = s;
  // A capa curta da forma errada: nasce mais alto e abre menos.
  const hem = short ? 0.42 : 0.09;
  const wing = short ? 0.20 : 0.30;
  const p = (x: number, y: number): [number, number] => [cx + x * h, baseY - y * h];

  const meia: Array<[number, number]> = [
    [-0.09, 0],
    [-0.11, hem * 0.7],
    [-wing, hem],
    [-wing * 0.87, 0.34],
    [-wing * 0.93, 0.52],
    [-0.22, 0.72],
    [-0.20, 0.8],
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
  // O lado direito é o espelho do esquerdo: a figura nunca entorta.
  for (let i = meia.length - 1; i >= 0; i--) {
    const q = p(-meia[i][0], meia[i][1]);
    ctx.lineTo(q[0], q[1]);
  }
  ctx.closePath();
  ctx.fill();
}

export const S03: Scene = {
  id: 'S03',
  register: 'B',
  viewports: 1.5,
  pinned: true,
  palette: P_IDIOT,

  draw({ progress, registers, reduced }: SceneFrame): void {
    const c = P_IDIOT.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    const baseY = h * 0.84;
    const alt = h * 0.46;
    // A composição vive à direita do quadro: a pilha cresce para lá, e a
    // esquerda fica sendo o lugar das acusações. As duas coisas não disputam
    // o mesmo espaço.
    const cx = w * 0.62;

    ctx.fillStyle = c.red;

    // A primeira silhueta, parada no centro. É dele que as cópias nascem.
    misregister(ctx, 2, -1, 0.45, () => {
      silhueta(ctx, cx, baseY, { h: alt });
    });

    // As cópias já nascidas. Cada atravessamento deixa uma, e nenhuma sai.
    const feitos = Math.floor(progress * CROSSINGS);
    for (let i = 0; i < feitos; i++) {
      // Todas para o mesmo lado: a pilha deriva numa direção só, em vez de se
      // abrir simétrica. Lê como deslocamento, e deixa o outro lado do quadro
      // livre para as acusações.
      const lado = 1;
      const dist = (0.07 + i * 0.05) * w;
      const encolhe = 1 - i * 0.09;
      ctx.globalAlpha = 0.75 - i * 0.09;
      silhueta(ctx, cx + lado * dist, baseY, { h: alt * encolhe });
    }
    ctx.globalAlpha = 1;

    // A segunda silhueta, atravessando. Ela não para: entra por um lado e sai
    // pelo outro, e o ciclo recomeça.
    const t = progress * CROSSINGS;
    const fase = t - Math.floor(t);
    const direcao = Math.floor(t) % 2 === 0 ? 1 : -1;
    const x = cx + direcao * (fase - 0.5) * w * 1.25;
    silhueta(ctx, x, baseY, { h: alt * 1.04 });

    // Jason. Três ou quatro quadros, e some. Menor, capa mais curta.
    // Não é mostrada — é notada.
    if (!reduced) {
      const marca = JASON_AT / CROSSINGS;
      const perto = 1 - range(Math.abs(progress - marca), 0, JASON_WINDOW);
      if (perto > 0) {
        ctx.globalAlpha = clamp(perto);
        silhueta(ctx, cx - w * 0.14, baseY, { h: alt * 0.62, short: true });
        ctx.globalAlpha = 1;
      }
    }

    registers.endB(0.07);
    // O grão sobe com o congestionamento: quanto mais cópias, mais ruído.
    applyGrain(ctx, w, h, 0.02 * (feitos / CROSSINGS));
  },
};

export default S03;
