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
import { silhueta } from '../visual/figures';
import { clamp, range } from '../engine/math';

/** Quantas vezes a segunda silhueta atravessa a primeira. */
const CROSSINGS = 5;
/** Em qual atravessamento a forma errada aparece. */
const JASON_AT = 2;
/** Largura da janela em que ela existe. Três ou quatro quadros de scroll. */
const JASON_WINDOW = 0.007;

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
