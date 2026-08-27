/**
 * S08 — INTERLÚDIO · limiar · meia viewport
 *
 * Preto. O asterisco triplo do texto original vira imagem. É a única
 * formatação autoral do manuscrito e merece existir na tela — por isso ele é
 * desenhado aqui, e não fica em `narrative.ts` como texto a ser lido.
 *
 * A cena é curta e não pede nada do leitor. Ela existe para separar a conversa
 * com a Bárbara da conversa com o Alfred.
 */

import { applyGrain } from '../visual/grain';
import { P_VOID } from '../visual/palettes';
import type { Scene, SceneFrame } from '../engine/scene';
import { clamp } from '../engine/math';

/** Seis braços por asterisco. */
const ARMS = 6;

function asterisco(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
  ctx.lineCap = 'butt';
  for (let i = 0; i < ARMS; i++) {
    const a = (Math.PI / ARMS) * i;
    ctx.beginPath();
    ctx.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }
}

export const S08: Scene = {
  id: 'S08',
  register: 'C',
  viewports: 0.5,
  palette: P_VOID,

  draw({ progress, registers }: SceneFrame): void {
    const c = P_VOID.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    // Entra e sai com a cena, sem se demorar. Meia viewport é meia viewport.
    const vivo = Math.sin(clamp(progress) * Math.PI);
    if (vivo <= 0.01) {
      registers.endB(0.04);
      return;
    }

    const r = Math.min(w, h) * 0.028;
    const gap = r * 3.4;
    ctx.strokeStyle = c.white;
    ctx.lineWidth = Math.max(2, r * 0.22);
    ctx.globalAlpha = vivo;
    for (let i = -1; i <= 1; i++) asterisco(ctx, w / 2 + i * gap, h / 2, r);
    ctx.globalAlpha = 1;

    registers.endB(0.05);
    applyGrain(ctx, w, h, 0.03 * vivo);
  },
};

export default S08;
