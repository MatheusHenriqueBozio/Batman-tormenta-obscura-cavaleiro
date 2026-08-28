/**
 * S24 — VOAR · Registro B dessaturando · o quanto precisar
 *
 * A câmera continua subindo depois da frase. O navio some nas nuvens. Uma
 * silhueta pequena atravessa o quadro.
 *
 * Sem trilha triunfal, sem animação heroica, sem logo, sem créditos animados.
 * Fade. Fim.
 *
 * A dessaturação é a última coisa que o sistema de registros faz: a cor vai
 * saindo até sobrar branco, e o branco não é vitória — é o quadro acabando.
 */

import { P_END, P_SHIP, mix } from '../visual/palettes';
import { silhueta } from '../visual/figures';
import { clamp, easeInOut, lerp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/** Onde o navio já sumiu de vez. */
const SOME_EM = 0.42;

export const S24: Scene = {
  id: 'S24',
  register: 'B',
  viewports: 2.5,
  palette: P_END,
  ambience: ['vento'],

  draw({ progress, registers }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_END.colors;

    // Dessatura até branco. É a mesma cor do céu da S23 perdendo o azul.
    const dessatura = easeInOut(t);
    const fundo = mix(P_SHIP.colors.sky, c.white, dessatura);
    const ctx = registers.beginB(fundo);
    const { w, h } = registers.viewport;

    const tinta = mix(P_SHIP.colors.white, c.grey, dessatura * 0.7);

    /* ---- as nuvens, ainda descendo ---- */

    // A câmera não para de subir depois da frase. É a última coisa que
    // acontece, e ela continua acontecendo enquanto a tela esvazia.
    const sobe = t * h * 2.6;
    ctx.fillStyle = tinta;
    for (let i = 0; i < 16; i++) {
      const y = (((i * 173 + sobe) % (h * 2.4)) | 0) - h * 0.3;
      const x = ((i * 211) % 1000) / 1000 * w * 1.2 - w * 0.1;
      const rw = w * (0.1 + ((i * 7) % 9) / 60);
      const rh = h * 0.028;
      ctx.globalAlpha = lerp(0.5, 0.14, dessatura);
      ctx.beginPath();
      ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ---- o navio sumindo ---- */

    const some = 1 - range(t, 0.08, SOME_EM);
    if (some > 0.02) {
      const cy = lerp(h * 0.72, -h * 0.2, range(t, 0, SOME_EM));
      const cw = w * 0.3 * some;
      ctx.globalAlpha = some * 0.8;
      ctx.fillStyle = tinta;
      ctx.beginPath();
      ctx.moveTo(w / 2 - cw / 2, cy);
      ctx.lineTo(w / 2 + cw / 2, cy);
      ctx.lineTo(w / 2 + cw * 0.36, cy + h * 0.05 * some);
      ctx.lineTo(w / 2 - cw * 0.36, cy + h * 0.05 * some);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* ---- e uma silhueta pequena atravessa ---- */

    // Uma vez só, e sem destaque. Ela não volta e não é apontada.
    const cruza = range(t, 0.52, 0.88);
    if (cruza > 0 && cruza < 1) {
      ctx.globalAlpha = 0.55 * (1 - dessatura * 0.5);
      ctx.fillStyle = tinta;
      silhueta(ctx, lerp(-w * 0.1, w * 1.1, cruza), h * (0.34 + cruza * 0.1), {
        h: h * 0.055,
      });
      ctx.globalAlpha = 1;
    }

    /* ---- fade ---- */

    const fade = range(t, 0.86, 1);
    if (fade > 0) {
      ctx.fillStyle = c.white;
      ctx.globalAlpha = fade;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;
    }
  },
};

export default S24;
