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

import { misregister } from '../visual/grain';
import { P_IDIOT } from '../visual/palettes';
import type { Scene, SceneFrame } from '../engine/scene';
import { silhueta } from '../visual/figures';
import { clamp, range } from '../engine/math';

/** Quantas vezes a segunda silhueta atravessa a primeira. */
const CROSSINGS = 5;
/** Em qual atravessamento a forma errada aparece. */
const JASON_AT = 2;
/**
 * Largura da janela em que a forma errada existe.
 *
 * Era 0,007, o que dava oito pixels de rolagem: menos de um décimo de um
 * clique da roda do mouse. Uma aparição que ninguém alcança não é sutil, é
 * inexistente. Em 0,05 ela ocupa uns sessenta pixels — ainda menos que um
 * gesto, ainda perfeitamente perdível, mas agora alcançável por quem rola
 * devagar. Ser notada na terceira leitura é o objetivo; ser impossível, não.
 */
const JASON_WINDOW = 0.05;

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
    //
    // A travessia acontece dentro da metade direita do quadro, e não de borda
    // a borda. O comentário lá em cima já dizia que a esquerda é o lugar das
    // acusações; o percurso é que não respeitava isso, e passava por cima das
    // palavras — texto vermelho apagado por silhueta vermelha. O que a cena
    // precisa é do vaivém, e o vaivém cabe inteiro deste lado.
    const t = progress * CROSSINGS;
    const fase = t - Math.floor(t);
    const direcao = Math.floor(t) % 2 === 0 ? 1 : -1;
    const x = cx + direcao * (fase - 0.5) * w * 0.66;
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

    // O grão sobe com o congestionamento: quanto mais cópias, mais ruído.
    //
    // A rampa era uma segunda passada somada a um grão fixo de 0,07, e nessa
    // altura os 0,02 dela não moviam nada. Agora ela é a passada — 0,05 a
    // 0,08, a faixa inteira do Registro B — e o ruído realmente sobe.
    registers.endB(0.05 + 0.03 * (feitos / CROSSINGS));
  },
};

export default S03;
