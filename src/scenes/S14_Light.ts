/**
 * S14 — A LUZ TENTADORA · limiar · preto + amarelo · 6 viewports
 *
 * O corredor perde o pixel. O grid dilata até virar mancha — é a primeira vez
 * na obra que o limiar do §5 é usado para valer, e ele é a mesma função
 * parametrizada de sempre.
 *
 * Bruce de joelhos, mãos no chão. Um único ponto de luz no fundo do preto.
 *
 * Jason volta aqui, conforme a regra 11: a mesma silhueta errada da S03, agora
 * maior, e desta vez ela não some. Fica parada no escuro enquanto o Coringa
 * fala. Não é mostrada. É notada.
 *
 * **E quando ele decide não seguir a luz, a luz não apaga.** Ela continua lá.
 * Ele é que anda para o outro lado. Isso é muito mais preciso do que apagá-la.
 */

import { misregister } from '../visual/grain';
import { ajoelhado, silhueta } from '../visual/figures';
import { collapseTo, P_HALL, P_LIGHT } from '../visual/palettes';
import { threshold } from '../visual/registers';
import { BATMAN_KNEEL, drawSilhouette } from '../visual/sprites';
import { clamp, easeInOut, lerp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCorridor, drawCorridor, FLOOR, type CorridorWorld } from './corridor';

/**
 * Até aqui o corredor ainda existe, dilatando. Depois, só o preto.
 *
 * São 0,8 viewport de dissolução. Antes eram 1,36, e naquele tamanho a cena
 * gastava um terço do próprio curso antes da primeira palavra.
 */
const DISSOLVE_ATE = 0.133;
/** Onde a forma errada entra. Ela não sai mais. */
const JASON_EM = 0.5;
/** Onde ele para de olhar para a luz e anda para o outro lado. */
const VIRADA_EM = 0.78;

const BRUCE_X = 64;

let world: CorridorWorld | null = null;

export const S14: Scene = {
  id: 'S14',
  register: 'C',
  viewports: 6,
  pinned: true,
  palette: P_LIGHT,

  enter(): void {
    world ??= buildCorridor();
  },

  draw({ progress, registers }: SceneFrame): void {
    const t = clamp(progress);
    const dissolve = easeInOut(range(t, 0, DISSOLVE_ATE));

    /* ---- o corredor perdendo o pixel ---- */

    if (dissolve < 1) {
      const w = (world ??= buildCorridor());
      // O corredor é o mesmo de sempre. O que muda é a paleta que ele recebe:
      // ela colapsa das dezesseis cores para as duas da S14 — preto e amarelo
      // — enquanto o grid dilata. As duas metades do limiar, juntas.
      const pal = collapseTo(P_HALL, P_LIGHT.colors.void, P_LIGHT.colors.yellow, dissolve);
      const ctx = registers.beginA(pal.colors.void);
      drawCorridor(ctx, w, pal, { camera: 0.96, light: 1, jokerScale: 2 });
      // Ele fica preto enquanto tudo em volta vai virando luz.
      drawSilhouette(ctx, BATMAN_KNEEL, BRUCE_X, FLOOR - 24, P_LIGHT.colors.void);
      // A mesma função de limiar de sempre, parametrizada pelo scroll.
      registers.presentA(threshold(dissolve));
      if (dissolve < 0.98) return;
    }

    /* ---- o preto, e o ponto de luz ---- */

    const c = P_LIGHT.colors;
    const ctx = registers.beginB(c.void);
    const { w: vw, h: vh } = registers.viewport;

    // A luz. Fica onde está, do começo ao fim da cena.
    //
    // Alta e ao fundo, e não à altura dos olhos: as falas do Coringa ocupam a
    // coluna da direita, e no meio do quadro o halo comia as palavras —
    // amarelo sobre amarelo. Uma luz mais alta também é uma luz mais longe, o
    // que é o que a cena diz dela. Ele continua ajoelhado olhando para cima.
    const luzX = vw * 0.82;
    const luzY = vh * 0.13;
    const raio = Math.min(vw, vh) * 0.032;

    // O halo é chapado e em degraus, não em rampa: a cor está quantizada.
    ctx.fillStyle = c.yellowDim;
    ctx.beginPath();
    ctx.ellipse(luzX, luzY, raio * 3.4, raio * 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.yellow;
    ctx.beginPath();
    ctx.ellipse(luzX, luzY, raio * 1.6, raio * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.yellowHot;
    ctx.beginPath();
    ctx.ellipse(luzX, luzY, raio, raio, 0, 0, Math.PI * 2);
    ctx.fill();

    /* ---- ele ---- */

    // Até a virada ele está de joelhos, voltado para a luz. Depois ele se
    // levanta e anda para o outro lado — e a luz continua exatamente ali.
    const virada = easeInOut(range(t, VIRADA_EM, 1));
    const baseY = vh * 0.82;
    const alt = vh * 0.42;
    const x = lerp(vw * 0.46, -vw * 0.14, virada);

    ctx.fillStyle = c.yellowDim;
    misregister(ctx, 2, -1, 0.4, () => {
      if (virada < 0.12) {
        ajoelhado(ctx, x, baseY, alt);
      } else {
        silhueta(ctx, x, baseY, { h: alt * 1.2 });
      }
    });

    /* ---- Jason ---- */

    // Entra e fica. Menor, capa mais curta, parada no escuro. Nada a aponta.
    if (t >= JASON_EM) {
      ctx.fillStyle = c.yellowDim;
      // Mais apagada que ele, e menor. Ela não é mostrada — é notada, e o
      // leitor que não reparar agora vai reparar numa segunda leitura.
      ctx.globalAlpha = 0.3;
      silhueta(ctx, vw * 0.66, vh * 0.84, { h: vh * 0.28, short: true });
      ctx.globalAlpha = 1;
    }

    // Uma passada de grão, não duas. A segunda era constante e só somava
    // 0,02 à primeira — o mesmo resultado que subir esta, por metade do custo.
    registers.endB(0.08);
  },
};

export default S14;
