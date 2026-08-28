/**
 * S19 — LEVANTAR · Registro B · azul-frio → dourado · 1,5 viewport · lento
 *
 * Contraluz. Ele está de costas contra a luz, e a transformação de criança
 * para adulto acontece **na silhueta, durante o scroll, sem corte e sem
 * efeito**. Só a postura mudando e a escala crescendo.
 *
 * **A paleta é a cena.** A progressão vai do azul frio ao dourado em quatro
 * estágios discretos e chapados — não interpolados suavemente, mas trocados
 * como quem troca a tinta da serigrafia. Em nenhum momento há mais de duas
 * cores na tela, e é por isso que quatro tons não violam o teto do Registro B:
 * eles nunca coexistem.
 *
 * **Direção:** isso não é transformação heroica. Não tem capa esvoaçando, não
 * tem pose, não tem trilha. É alguém que estava no chão e agora não está. A
 * diferença entre as duas coisas é tudo.
 *
 * O dourado desta cena e o do navio são as duas únicas aparições da cor na
 * obra inteira.
 */

import { ajoelhado, pessoa } from '../visual/figures';
import { mix, P_RISE } from '../visual/palettes';
import { clamp, lerp } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/**
 * Os quatro estágios. A cor de cada um é fixa e chapada — nada é interpolado
 * na tela, só escolhido.
 */
const ESTAGIOS = [0, 0.34, 0.67, 1].map((k) => mix(P_RISE.colors.cold, P_RISE.colors.gold, k));

/** Onde cada estágio começa, no progresso da cena. */
const CORTES = [0, 0.3, 0.56, 0.8];

export const S19: Scene = {
  id: 'S19',
  register: 'B',
  viewports: 1.5,
  palette: P_RISE,

  draw({ progress, registers }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_RISE.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    let estagio = 0;
    while (estagio < CORTES.length - 1 && t >= CORTES[estagio + 1]) estagio++;
    const cor = ESTAGIOS[estagio];

    /* ---- a luz atrás dele ---- */

    // Um vão aceso, e não um halo. Um disco atrás da figura centralizada é
    // exatamente a iconografia heroica que a §S19 proíbe: aqui a luz é um
    // lugar, e ele está na frente dela porque está saindo.
    const chao = h * 0.94;
    ctx.fillStyle = cor;
    const vaoX = w * 0.46;
    const vaoW = w * 0.3;
    const vaoTopo = lerp(h * 0.42, h * 0.1, t);
    ctx.fillRect(vaoX, vaoTopo, vaoW, chao - vaoTopo);
    // O que a luz alcança do chão. Chapado, como tudo nesta cena.
    ctx.fillRect(vaoX - w * 0.03, chao, vaoW + w * 0.06, h * 0.02);

    /* ---- ele, de costas ---- */

    // Encolhido, sentado, de pé de costas, de pé contra a luz. A postura muda
    // junto com a cor, e nada acompanha a mudança: nem efeito, nem corte, nem
    // capa esvoaçando. É alguém que estava no chão e agora não está.
    //
    // Ele fica dentro do vão, e fora do centro dele. Em 0,42 caía à esquerda
    // da luz, preto sobre preto, e nos últimos vinte por cento da cena não
    // sobrava na tela nada além de um retângulo dourado. Contraluz só existe
    // se houver luz atrás.
    ctx.fillStyle = c.void;
    const cx = w * 0.54;
    const alt = lerp(h * 0.13, h * 0.5, t);
    if (estagio === 0) {
      ajoelhado(ctx, cx, chao, alt * 1.15);
    } else if (estagio === 1) {
      ajoelhado(ctx, cx, chao, alt * 0.8);
      pessoa(ctx, cx + alt * 0.14, chao, alt * 0.6);
    } else {
      pessoa(ctx, cx, chao, alt);
    }
  },
};

export default S19;
