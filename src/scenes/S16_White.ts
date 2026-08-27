/**
 * S16 — BRANCO · Registro B · branco + cinza · 2 viewports · muito lento
 *
 * Branco total. Depois da floresta isso vai machucar os olhos, e deve. É a
 * única cena de fundo claro da obra inteira.
 *
 * Bruce criança, pequeno, na base do quadro. Os pais distantes, vindo de cima,
 * com muito espaço vazio entre eles.
 *
 * **O horror não é que eles sejam monstros. É que eles estão calmos.**
 * Distantes, imóveis, íntegros e desapontados. Por isso eles são figuras
 * humanas comuns, sem nenhuma deformidade, e por isso não se mexem: qualquer
 * movimento os transformaria em ameaça, e ameaça é a leitura errada.
 *
 * Eles não falam. O texto da cena está ligado a ele, e não a eles — é Bruce
 * quem atribui o desapontamento. Depois eles evaporam de baixo para cima,
 * devagar, e ele levanta a cabeça para a última olhada.
 *
 * E encontra o Batman.
 */

import { pessoa, silhueta } from '../visual/figures';
import { P_WHITE } from '../visual/palettes';
import { clamp, easeInOut, lerp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/** Quando eles começam a evaporar, e quando terminam. */
const EVAPORA_DE = 0.46;
const EVAPORA_ATE = 0.8;
/** Quando ele levanta a cabeça e encontra a figura. */
const ENCONTRO_EM = 0.84;

export const S16: Scene = {
  id: 'S16',
  register: 'B',
  viewports: 2,
  palette: P_WHITE,

  draw({ progress, registers }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_WHITE.colors;
    const ctx = registers.beginB(c.white);
    const { w, h } = registers.viewport;

    /* ---- os pais ---- */

    // Vêm de cima e ficam onde estão. Nenhum movimento: a imobilidade é a
    // caracterização inteira.
    const paiY = h * 0.52;
    const altura = h * 0.34;
    const evapora = easeInOut(range(t, EVAPORA_DE, EVAPORA_ATE));

    if (evapora < 1) {
      ctx.save();
      // Evaporam de baixo para cima: o recorte sobe e come a figura pelos pés.
      const corte = lerp(paiY, paiY - altura * 1.12, evapora);
      ctx.beginPath();
      ctx.rect(0, 0, w, corte);
      ctx.clip();
      ctx.fillStyle = c.grey;
      pessoa(ctx, w * 0.38, paiY, altura);
      pessoa(ctx, w * 0.6, paiY, altura * 0.96);
      ctx.restore();
    }

    /* ---- ele, criança, na base ---- */

    const criancaAlt = h * 0.13;
    ctx.fillStyle = c.grey;
    silhueta(ctx, w * 0.5, h * 0.95, { h: criancaAlt, short: true });

    /* ---- e encontra o Batman ---- */

    // Não entra com efeito nenhum. Ele estava atrás dele o tempo todo, e a
    // cena só chega no ponto em que Bruce olha.
    const encontro = range(t, ENCONTRO_EM, 1);
    if (encontro > 0) {
      ctx.fillStyle = c.grey;
      ctx.globalAlpha = Math.min(1, encontro * 2);
      silhueta(ctx, w * 0.5, h * 0.93, { h: h * 0.42 });
      ctx.globalAlpha = 1;
    }

    // Sem grão. Esta cena é limpa porque é lembrança, e lembrança de criança
    // não tem ruído — tem branco.
  },
};

export default S16;
