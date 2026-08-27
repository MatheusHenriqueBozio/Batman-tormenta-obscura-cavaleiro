/**
 * S09 — ALFRED · Registro A · âmbar quente · avanço por Enter
 *
 * Mesma gramática da S06, enquadramento mais fechado e paleta mais quente.
 * Bárbara foi clínica. Alfred é doméstico.
 *
 * Fim da cena: a caverna escurece de baixo para cima. Isso acontece depois que
 * a conversa termina, conforme o leitor rola — é a única coisa nesta cena que
 * responde ao scroll, e ela só existe para fechar a porta atrás dele.
 */

import { P_ALFRED } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { BOX_TOP } from '../visual/dialoguebox';
import { drawSprite, FIGURES } from '../visual/sprites';
import { range } from '../engine/math';
import type { Scene } from '../engine/scene';
import { makeDialogueScene } from './dialoguescene';

export const S09: Scene = makeDialogueScene({
  id: 'S09',
  palette: P_ALFRED,
  viewports: 1.5,
  background: 'void',
  colors: {
    panel: P_ALFRED.colors.brownDeep,
    border: P_ALFRED.colors.brownMid,
    text: P_ALFRED.colors.amberHot,
    dim: P_ALFRED.colors.amberDim,
  },
  stage(ctx, _palette, f, done) {
    const c = P_ALFRED.colors;
    const chao = BOX_TOP - 10;

    ctx.fillStyle = c.brownDeep;
    ctx.fillRect(0, 0, A_W, chao);
    ctx.fillStyle = c.brownDark;
    ctx.fillRect(0, chao, A_W, A_H - chao);
    ctx.fillStyle = c.brownMid;
    ctx.fillRect(0, chao, A_W, 1);

    // Enquadramento fechado: as telas da caverna entram só como um brilho ao
    // fundo, largas e fora de foco. Não é a caverna inteira, é o canto dela.
    ctx.fillStyle = c.brownLit;
    ctx.fillRect(20, chao - 74, A_W - 40, 40);
    ctx.fillStyle = c.amberDim;
    ctx.fillRect(24, chao - 70, A_W - 48, 32);
    ctx.fillStyle = c.amberMid;
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(34 + i * 52, chao - 62, 38, 1);
      ctx.fillRect(34 + i * 52, chao - 54, 24, 1);
    }

    // Bruce mais perto do centro que na S06: aqui não há distância a manter.
    drawSprite(ctx, FIGURES.bruce, 118, chao - 24, P_ALFRED);
    drawSprite(ctx, FIGURES.alfred, 172, chao - 24, P_ALFRED);

    // A caverna escurece de baixo para cima, e só depois que a conversa acaba.
    if (done) {
      const sobe = range(f.progress, 0.12, 0.9);
      if (sobe > 0) {
        ctx.fillStyle = c.void;
        const altura = Math.round(sobe * A_H);
        ctx.fillRect(0, A_H - altura, A_W, altura);
      }
    }
  },
});

export default S09;
