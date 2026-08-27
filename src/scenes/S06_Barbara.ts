/**
 * S06 — BÁRBARA · Registro A puro · avanço por Enter, não por scroll
 *
 * A cena mais estável e organizada da obra inteira. Dois sprites de corpo
 * inteiro, retratos de 32×32 na caixa, texto caractere a caractere, idle
 * mínimo, muito espaço negativo.
 *
 * É a única cena em que alguém de fora está olhando para o problema. A ordem
 * visual aqui é conforto, e o leitor precisa senti-lo para sentir a falta
 * depois — por isso nada aqui treme, pisca ou se desloca. Tudo está no lugar,
 * e continua no lugar.
 */

import { P_ORACLE } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { BOX_TOP } from '../visual/dialoguebox';
import { drawSprite, FIGURES } from '../visual/sprites';
import type { Scene } from '../engine/scene';
import { makeDialogueScene } from './dialoguescene';

/** Console da Bárbara: telas âmbar, alinhadas. Ordem é o assunto da cena. */
function console_(ctx: CanvasRenderingContext2D, y: number): void {
  const c = P_ORACLE.colors;
  const cols = 4;
  const mw = 22;
  const mh = 15;
  const gap = 5;
  const x0 = Math.round((A_W - (cols * mw + (cols - 1) * gap)) / 2) - 46;
  for (let i = 0; i < cols; i++) {
    const x = x0 + i * (mw + gap);
    ctx.fillStyle = c.greenDark;
    ctx.fillRect(x, y, mw, mh);
    ctx.fillStyle = c.amberDim;
    ctx.fillRect(x + 1, y + 1, mw - 2, mh - 2);
    ctx.fillStyle = c.amberMid;
    ctx.fillRect(x + 3, y + 3, mw - 6, 1);
    ctx.fillRect(x + 3, y + 6, Math.round((mw - 6) * 0.7), 1);
    ctx.fillRect(x + 3, y + 9, Math.round((mw - 6) * 0.45), 1);
  }
}

export const S06: Scene = makeDialogueScene({
  id: 'S06',
  palette: P_ORACLE,
  viewports: 1.5,
  background: 'void',
  colors: {
    panel: P_ORACLE.colors.greenDeep,
    border: P_ORACLE.colors.greenMid,
    text: P_ORACLE.colors.amberHot,
    dim: P_ORACLE.colors.greenEdge,
  },
  stage(ctx) {
    const c = P_ORACLE.colors;
    const chao = BOX_TOP - 12;

    // Uma parede e um chão, e mais nada. O espaço negativo é o conforto.
    ctx.fillStyle = c.greenDeep;
    ctx.fillRect(0, 0, A_W, chao);
    ctx.fillStyle = c.greenDark;
    ctx.fillRect(0, chao, A_W, A_H - chao);
    ctx.fillStyle = c.greenMid;
    ctx.fillRect(0, chao, A_W, 1);

    console_(ctx, chao - 62);

    // Bárbara à esquerda, diante do console. Bruce à direita, de pé, de frente
    // para ela. A distância entre os dois é deliberada.
    drawSprite(ctx, FIGURES.barbara, 62, chao - 24, P_ORACLE);
    drawSprite(ctx, FIGURES.bruce, 214, chao - 24, P_ORACLE);
  },
});

export default S06;
