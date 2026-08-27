/**
 * S00 — TÍTULO · Registro A · tela cheia
 *
 * A obra abre aqui. Fundo preto quase absoluto, apenas a sugestão de uma
 * caverna ao fundo, muito escura. Sem menu, sem botões, sem "novo jogo",
 * sem logo animado, sem tela de loading, sem clique obrigatório.
 *
 * O próprio scroll começa a experiência: o título sobe e sai de quadro, e a
 * S01 já está atrás dele.
 *
 * Motion mínimo — uma gota caindo em loop lento. A obra inteira depende de o
 * leitor entrar em silêncio.
 */

import { drawText, LINE_H } from '../visual/bitfont';
import { fbm } from '../visual/grain';
import { P_TITLE } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { clamp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

const TITLE_1 = 'BATMAN';
const TITLE_2 = 'E A TORMENTA OBSCURA DO CAVALEIRO';
const AUTHOR = 'uma obra de Matheus Henrique Bozio';

/** Silhueta de caverna ao fundo. Sugestão, nunca cenário. */
function drawSuggestion(ctx: CanvasRenderingContext2D): void {
  const c = P_TITLE.colors;
  ctx.fillStyle = c.caveDeep;
  for (let x = 0; x < A_W; x++) {
    const top = 26 + (fbm(x * 0.014, 0.5, 3) + 1) * 14;
    ctx.fillRect(x, 0, 1, Math.round(top));
    const bottom = A_H - 22 - (fbm(x * 0.011, 8.2, 3) + 1) * 12;
    ctx.fillRect(x, Math.round(bottom), 1, A_H - Math.round(bottom));
  }
  ctx.fillStyle = c.caveEdge;
  for (let x = 0; x < A_W; x += 1) {
    const top = 26 + (fbm(x * 0.014, 0.5, 3) + 1) * 14;
    ctx.fillRect(x, Math.round(top), 1, 1);
  }
}

export const S00: Scene = {
  id: 'S00',
  register: 'A',
  viewports: 1,
  palette: P_TITLE,

  draw({ progress, time, registers }: SceneFrame): void {
    const c = P_TITLE.colors;
    const ctx = registers.beginA(c.void);

    drawSuggestion(ctx);

    // A gota. É o único movimento da cena, e é lento de propósito.
    // Aqui o relógio é legítimo: antes do primeiro scroll não existe progresso,
    // e a obra precisa respirar enquanto o leitor decide entrar.
    const dropPhase = ((time % 4200) / 4200) as number;
    const dropY = 40 + dropPhase * (A_H - 74);
    ctx.fillStyle = c.cyanDim;
    ctx.fillRect(A_W - 18, Math.round(dropY), 1, dropPhase > 0.2 ? 2 : 1);
    if (dropPhase > 0.94) {
      // O respingo, dois pixels e nada mais.
      ctx.fillStyle = c.cyanDim;
      ctx.fillRect(A_W - 20, A_H - 33, 1, 1);
      ctx.fillRect(A_W - 16, A_H - 33, 1, 1);
    }

    // O título sobe e sai de quadro conforme o leitor rola.
    const lift = Math.round(progress * A_H * 1.6);
    const fade = 1 - range(progress, 0.35, 0.9);
    const cx = A_W / 2;
    const baseY = 68 - lift;

    if (fade > 0.02) {
      // A cor escurece em vez de esmaecer: no Registro A não há transparência
      // parcial, então a saída acontece pela paleta.
      const on = fade > 0.55 ? c.cyan : fade > 0.25 ? c.cyanDim : c.caveEdge;
      const sub = fade > 0.55 ? c.cyanDim : c.caveEdge;
      drawText(ctx, TITLE_1, cx, baseY, on, { align: 'center', spacing: 3 });
      drawText(ctx, TITLE_2, cx, baseY + LINE_H + 4, on, { align: 'center', spacing: 1 });
      drawText(ctx, AUTHOR, cx, baseY + LINE_H * 2 + 12, sub, { align: 'center', spacing: 1 });
    }

    // Um fio de luz na borda inferior, quase invisível: o leitor precisa
    // entender que há para onde descer, sem que nada peça isso por escrito.
    const hint = clamp(1 - progress * 4);
    if (hint > 0.05) {
      ctx.fillStyle = c.cyanDim;
      const w = Math.round(18 * hint);
      ctx.fillRect(Math.round(cx - w / 2), A_H - 8, w, 1);
    }

    registers.presentA();
  },
};

export default S00;
