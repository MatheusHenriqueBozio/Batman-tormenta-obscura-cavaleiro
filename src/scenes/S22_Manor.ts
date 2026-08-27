/**
 * S22 — MANSÃO · Registro A suavizado · âmbar e rosa de madrugada · lenta
 *
 * A mansão aparece em pixel, mas diferente de tudo que veio antes: **grid
 * maior, paleta quente, contraste baixo, sem linha dura**. O pixel amolecendo.
 *
 * O grid maior não é um desenho diferente: é o mesmo canvas de 320×180, com o
 * blit passando por um divisor. A cena não sabe que está mais grossa, e é por
 * isso que a suavização se aplica a tudo de uma vez, sem exceção e sem
 * retoque.
 *
 * Os textos entram mais devagar que em qualquer outra cena, e não há
 * praticamente movimento: a desaceleração deve ser sentida fisicamente.
 */

import { fbm } from '../visual/grain';
import { P_MANOR } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { ALFRED, BATMAN_BACK, drawSprite } from '../visual/sprites';
import { clamp, lerp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/** O divisor do grid. Dois é o suficiente para o pixel amolecer sem borrar. */
const GRID = 2;

/** A janela enorme. */
const JAN_X = 96;
const JAN_Y = 22;
const JAN_W = 168;
const JAN_H = 112;

const CHAO = 152;

export const S22: Scene = {
  id: 'S22',
  register: 'A',
  viewports: 4,
  palette: P_MANOR,

  draw({ progress, registers }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_MANOR.colors;
    const ctx = registers.beginA(c.void);

    /* ---- a sala ---- */

    ctx.fillStyle = c.duskDeep;
    ctx.fillRect(0, 0, A_W, CHAO);
    ctx.fillStyle = c.duskDark;
    ctx.fillRect(0, CHAO, A_W, A_H - CHAO);

    /* ---- a janela, e a madrugada começando ---- */

    // O céu sobe de tom ao longo da cena, em faixas chapadas. É a única coisa
    // que muda aqui, e muda devagar.
    const amanhece = range(t, 0.1, 0.9);
    const faixas = [c.duskMid, c.duskLit, c.roseDim, c.roseMid, c.rose, c.amberDim];
    const passo = JAN_H / faixas.length;
    for (let i = 0; i < faixas.length; i++) {
      // A faixa de baixo é a mais clara, e o amanhecer empurra as claras para
      // cima ao longo da cena.
      const idx = Math.min(faixas.length - 1, Math.floor(i + amanhece * 1.6));
      ctx.fillStyle = faixas[idx];
      ctx.fillRect(JAN_X, Math.round(JAN_Y + i * passo), JAN_W, Math.ceil(passo) + 1);
    }

    // O jardim, contra a luz. Massas baixas, sem detalhe: dele só se vê a
    // silhueta a esta hora.
    ctx.fillStyle = c.duskDeep;
    for (let x = JAN_X; x < JAN_X + JAN_W; x++) {
      const alto = 16 + (fbm(x * 0.05, 3.3, 3) + 1) * 11;
      ctx.fillRect(x, Math.round(JAN_Y + JAN_H - alto), 1, Math.round(alto));
    }
    // Um par de árvores, mais altas que o resto. A copa é empilhada em três
    // faixas de larguras diferentes: no grid grosso desta cena, um retângulo
    // só lia como placa.
    for (const tx of [JAN_X + 34, JAN_X + 122]) {
      ctx.fillRect(tx, JAN_Y + JAN_H - 52, 4, 52);
      ctx.fillRect(tx - 8, JAN_Y + JAN_H - 56, 20, 6);
      ctx.fillRect(tx - 12, JAN_Y + JAN_H - 62, 28, 6);
      ctx.fillRect(tx - 8, JAN_Y + JAN_H - 68, 20, 6);
    }

    // O caixilho. Sem linha dura: o quadro é do mesmo tom da sala, um passo
    // acima, e não um contorno.
    ctx.fillStyle = c.duskMid;
    ctx.fillRect(JAN_X - 4, JAN_Y - 4, JAN_W + 8, 4);
    ctx.fillRect(JAN_X - 4, JAN_Y + JAN_H, JAN_W + 8, 5);
    ctx.fillRect(JAN_X - 4, JAN_Y, 4, JAN_H);
    ctx.fillRect(JAN_X + JAN_W, JAN_Y, 4, JAN_H);
    ctx.fillRect(JAN_X + Math.round(JAN_W / 2) - 1, JAN_Y, 3, JAN_H);

    // A luz que a janela deixa no chão da sala.
    ctx.fillStyle = c.duskMid;
    ctx.fillRect(JAN_X - 10, CHAO, JAN_W + 20, A_H - CHAO);
    ctx.fillStyle = c.duskLit;
    ctx.fillRect(JAN_X - 2, CHAO, JAN_W + 4, 6);

    /* ---- os dois ---- */

    // Ele de costas, diante da janela. Alfred se aproxima, e para.
    drawSprite(ctx, BATMAN_BACK, 138, CHAO - 24, P_MANOR, { figureDark: c.figureDark });
    const alfredX = lerp(A_W + 10, 198, range(t, 0.16, 0.44));
    drawSprite(ctx, ALFRED, Math.round(alfredX), CHAO - 24, P_MANOR, {
      skin: c.roseMid,
      cloth: c.duskLit,
      hair: c.roseDim,
      figureDark: c.duskDeep,
      figureMid: c.duskMid,
      figureEdge: c.duskLit,
    });

    // O grid maior é aplicado aqui, e só aqui.
    registers.presentA(undefined, GRID);
  },
};

export default S22;
