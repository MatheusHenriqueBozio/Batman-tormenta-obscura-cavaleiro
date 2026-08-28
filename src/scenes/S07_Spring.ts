/**
 * S07 — A MOLA · Registro B · preto + azul elétrico · 4 viewports pinned · MICROGAME 1
 *
 * A cena tem quatro atos, nesta ordem:
 *
 * 1. A MOLA. Um Batman minúsculo sobe uma estrutura vertical repetitiva. O
 *    leitor rola, ele sobe. Rola, sobe. Rola, e ele está de volta ao ponto de
 *    partida sem ter descido. Três voltas.
 *
 * 2. A REVELAÇÃO. A câmera se afasta e a estrutura inteira se revela como o
 *    interior de uma cabeça. Este é o único momento da obra com revelação de
 *    câmera desse tipo, e por isso o recurso não se repete em nenhuma outra
 *    cena.
 *
 * 3. O MICROGAME. A Confirmação. Ver `games/Confirm.ts`.
 *
 * 4. DE VOLTA À CONVERSA. O fecho com a Bárbara, na caixa de diálogo — a
 *    virada em que ela nomeia o movimento que ele acabou de fazer na frente
 *    dela, em vez de nomear a doença.
 */

import { misregister } from '../visual/grain';
import { P_ORACLE, P_SPRING } from '../visual/palettes';
import {
  advance,
  drawBox,
  finished,
  paginate,
  reveal,
  type BoxState,
  type Page,
} from '../visual/dialoguebox';
import { scriptOf } from '../content/dialogue';
import * as Confirm from '../games/Confirm';
import { A_H, A_W } from '../visual/registers';
import { clamp, easeInOut, lerp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/* Onde cada ato começa, em progresso da cena. */
const MOLA_ATE = 0.42;
const REVELA_ATE = 0.58;
const JOGO_EM = 0.58;
/** Teto enquanto o microgame segura o leitor. */
const TETO_JOGO = 0.62;
const CONVERSA_EM = 0.74;
/** Teto enquanto a conversa segura o leitor. */
const TETO_CONVERSA = 0.78;

/** Três voltas, e nenhuma leva a lugar nenhum. */
const VOLTAS = 3;

/** Estado da cena, fora dela: o motor descarta cenas, e isto não pode morrer. */
const estado = {
  jogo: Confirm.newConfirm(),
  paginas: null as Page[] | null,
  caixa: { page: 0, revealed: 0 } as BoxState,
};

function paginas(): Page[] {
  if (!estado.paginas) {
    const s = scriptOf('S07');
    estado.paginas = s ? paginate(s.lines) : [];
  }
  return estado.paginas;
}

/**
 * O perfil de uma cabeça, como caminho.
 *
 * Serve de recorte: a estrutura é desenhada dentro dele. No começo o caminho é
 * grande demais para caber na tela, então não recorta nada e ninguém sabe que
 * ele está ali. Quando a câmera se afasta, ele encolhe para dentro do quadro e
 * a estrutura passa a ter, de repente, o contorno de uma cabeça.
 */
function cabeca(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
  const p = (x: number, y: number): [number, number] => [cx + x * s, cy + y * s];
  const curva = (
    c1x: number, c1y: number, c2x: number, c2y: number, ex: number, ey: number,
  ): void => {
    ctx.bezierCurveTo(...p(c1x, c1y), ...p(c2x, c2y), ...p(ex, ey));
  };

  ctx.beginPath();
  ctx.moveTo(...p(0, -0.5));
  curva(0.22, -0.5, 0.33, -0.36, 0.34, -0.16); // testa
  curva(0.35, -0.06, 0.4, -0.02, 0.43, 0.04); // nariz
  curva(0.4, 0.08, 0.35, 0.08, 0.33, 0.12); // sob o nariz
  curva(0.35, 0.2, 0.33, 0.26, 0.28, 0.31); // boca e queixo
  curva(0.24, 0.37, 0.2, 0.4, 0.17, 0.5); // mandíbula até o pescoço
  ctx.lineTo(...p(-0.05, 0.5));
  curva(-0.1, 0.42, -0.2, 0.4, -0.28, 0.3); // nuca
  curva(-0.36, 0.18, -0.38, 0.02, -0.36, -0.12); // occipital
  curva(-0.33, -0.34, -0.2, -0.5, 0, -0.5); // volta ao alto
  ctx.closePath();
}

/** A estrutura: degraus repetidos, sempre iguais, subindo sem chegar. */
function estrutura(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  desloc: number,
  cor: string,
): void {
  const passo = h * 0.11;
  const larg = w * 0.17;
  const cx = w / 2;
  ctx.fillStyle = cor;
  // Dois montantes e os degraus entre eles. Nada distingue um degrau do outro:
  // é isso que faz a subida não significar nada.
  ctx.fillRect(cx - larg, -h, Math.max(2, w * 0.008), h * 3);
  ctx.fillRect(cx + larg, -h, Math.max(2, w * 0.008), h * 3);
  const off = desloc % passo;
  for (let y = -passo * 2 + off; y < h + passo * 2; y += passo) {
    ctx.fillRect(cx - larg, y, larg * 2, Math.max(2, h * 0.012));
  }
}

/** A figura, minúscula. Em Registro B ela é só massa: nem sprite, nem grid. */
function figura(ctx: CanvasRenderingContext2D, x: number, y: number, alt: number, cor: string): void {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.ellipse(x, y - alt * 0.78, alt * 0.2, alt * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - alt * 0.26, y - alt * 0.6, alt * 0.52, alt * 0.6);
  ctx.beginPath();
  ctx.moveTo(x - alt * 0.26, y - alt * 0.6);
  ctx.lineTo(x - alt * 0.58, y - alt * 0.1);
  ctx.lineTo(x - alt * 0.2, y - alt * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + alt * 0.26, y - alt * 0.6);
  ctx.lineTo(x + alt * 0.58, y - alt * 0.1);
  ctx.lineTo(x + alt * 0.2, y - alt * 0.2);
  ctx.closePath();
  ctx.fill();
}

export const S07: Scene = {
  id: 'S07',
  register: 'B',
  viewports: 4,
  pinned: true,
  palette: P_SPRING,

  draw(f: SceneFrame): void {
    const { progress, registers, input, dt, reduced } = f;
    const c = P_SPRING.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    const revelaT = easeInOut(range(progress, MOLA_ATE, REVELA_ATE));
    const noJogo = progress >= JOGO_EM;

    /* ---- atos 1 e 2: a mola, e a câmera se afastando dela ---- */

    // O recorte parte grande demais para caber na tela — ninguém sabe que ele
    // existe — e encolhe até virar uma cabeça.
    const escalaCabeca = lerp(4.2, 1, revelaT) * Math.min(w, h) * 0.86;
    const escalaEstrutura = lerp(1, 0.5, revelaT);

    ctx.save();
    cabeca(ctx, w / 2, h / 2, escalaCabeca);
    ctx.clip();

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(escalaEstrutura, escalaEstrutura);
    ctx.translate(-w / 2, -h / 2);

    // A subida: três voltas dentro do primeiro ato, e depois a estrutura
    // continua rolando devagar enquanto a câmera se afasta.
    const subida = clamp(progress / MOLA_ATE);
    const t = subida * VOLTAS;
    const volta = Math.min(VOLTAS - 1, Math.floor(t));
    const dentro = noJogo ? 1 : t - volta;

    misregister(ctx, 3, -2, 0.35, () => {
      estrutura(ctx, w, h, subida * h * 2.4, c.blue);
    });

    // Ele sobe do rodapé ao topo. Na volta seguinte está no rodapé outra vez,
    // e nunca desceu: a estrutura é periódica, então nada no fundo denuncia o
    // salto. Só ele.
    const alt = h * 0.055;
    const y = lerp(h * 0.92, h * 0.12, dentro);
    figura(ctx, w / 2, y, alt, c.blue);
    ctx.restore();

    // O contorno da cabeça só aparece depois que já dá para reconhecê-lo.
    if (revelaT > 0.25) {
      ctx.strokeStyle = c.blue;
      ctx.lineWidth = Math.max(1.5, Math.min(w, h) * 0.003);
      ctx.globalAlpha = range(revelaT, 0.25, 0.85) * 0.75;
      cabeca(ctx, w / 2, h / 2, escalaCabeca);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    /* ---- ato 3: o microgame ---- */

    // Quando a conversa volta, o botão sai. O leitor parou de alimentar, e o
    // objeto da insistência não fica na tela cobrando de novo.
    const naConversa = estado.jogo.freed && progress >= CONVERSA_EM;

    let caixaJogo: Confirm.Hitbox | null = null;
    if (noJogo && !naConversa) {
      const texto = Confirm.label(estado.jogo);
      const tamanho = Math.round(Math.min(w * 0.045, 44));
      ctx.font = `800 ${tamanho}px system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const larg = ctx.measureText(texto).width;
      const cy = h * 0.5;
      caixaJogo = { x: w / 2 - larg / 2 - 18, y: cy - tamanho, w: larg + 36, h: tamanho * 2 };

      Confirm.update(estado.jogo, input, caixaJogo, reduced);

      ctx.globalAlpha = Confirm.opacity(estado.jogo);
      ctx.fillStyle = c.blue;
      ctx.fillText(texto, w / 2, cy);
      // Um sublinhado fino: a única coisa que diz que a palavra é clicável.
      const sub = Confirm.hovering(input, caixaJogo) ? larg : larg * 0.55;
      ctx.fillRect(w / 2 - sub / 2, cy + tamanho * 0.72, sub, Math.max(1, tamanho * 0.045));
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
    }

    registers.endB(0.06);

    /* ---- ato 4: de volta à conversa ---- */

    if (naConversa) {
      const pgs = paginas();
      if (input.wasPressed('enter')) advance(estado.caixa, pgs);
      reveal(estado.caixa, pgs, dt);
    }

    // A gravidade do §S07: passada a oitava confirmação, a conversa começa a
    // assomar na borda de baixo. Não é tutorial — é o peso da cena seguinte.
    const puxa = naConversa ? 1 : Confirm.gravity(estado.jogo);
    if (puxa > 0) {
      const pgs = paginas();
      // A caixa é do Registro A, então ela é desenhada no canvas interno e
      // blitada por cima do Registro B. A conversa voltou; o quarto, não.
      const ictx = registers.beginOverlayA();
      drawBox(
        ictx,
        pgs,
        estado.caixa,
        P_ORACLE,
        {
          panel: P_ORACLE.colors.greenDeep,
          border: P_ORACLE.colors.greenMid,
          text: P_ORACLE.colors.amberHot,
          dim: P_ORACLE.colors.greenEdge,
        },
        naConversa && !input.hasUsed('enter'),
      );
      const escala = registers.viewport.scale;
      const dx = Math.round((w - A_W * escala) / 2);
      const dy = Math.round((h - A_H * escala) / 2) + Math.round((1 - puxa) * 90 * escala);
      ctx.save();
      ctx.globalAlpha = naConversa ? 1 : 0.35 + puxa * 0.4;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(registers.a, 0, 0, A_W, A_H, dx, dy, A_W * escala, A_H * escala);
      ctx.restore();
    }
  },

  hold(f: SceneFrame): number | null {
    // Enquanto o leitor alimenta a confirmação, ele fica. Quando para, o
    // scroll volta a funcionar em silêncio: sem aviso, sem dica, sem seta.
    if (!estado.jogo.freed && f.progress >= JOGO_EM) return TETO_JOGO;
    if (estado.jogo.freed && f.progress >= CONVERSA_EM) {
      const pgs = paginas();
      if (pgs.length > 0 && !finished(estado.caixa, pgs)) return TETO_CONVERSA;
    }
    return null;
  },
};

export default S07;
