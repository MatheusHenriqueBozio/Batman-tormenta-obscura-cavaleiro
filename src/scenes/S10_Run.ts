/**
 * S10 — A CORRIDA · Registro A · azul-noite + silhueta · JOGÁVEL
 *
 * Side-scroll sobre os telhados de Gotham, parallax de três camadas, tudo em
 * silhueta. Sem HUD, sem score, sem vidas.
 *
 * SPACE pula. O comando aparece uma vez, discreto, e some ao primeiro pulo —
 * nunca faça tutorial (§15).
 *
 * A mecânica está em `games/Run.ts`. Aqui só se desenha.
 */

import { fbm, mulberry32 } from '../visual/grain';
import { drawText, LINE_H } from '../visual/bitfont';
import { P_RUN } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { BATMAN_RUN, drawSilhouette } from '../visual/sprites';
import * as Run from '../games/Run';
import type { Scene, SceneFrame } from '../engine/scene';

/** Linha do chão, em pixels internos. */
const GROUND = 138;

/** Parallax das três camadas. A da frente é o telhado em que ele corre. */
const LAYERS = [0.22, 0.5, 1];

interface Building {
  x: number;
  w: number;
  h: number;
  layer: number;
  windows: number;
}

let skyline: Building[] | null = null;

/** A cidade, gerada uma vez com semente fixa. */
function buildSkyline(): Building[] {
  const rand = mulberry32(0x51ade);
  const out: Building[] = [];
  for (let layer = 0; layer < 3; layer++) {
    const span = Run.TRACK * LAYERS[layer] + A_W * 2;
    let x = -A_W;
    while (x < span) {
      const w = 22 + Math.floor(rand() * 46);
      const h = layer === 2 ? 0 : 26 + Math.floor(rand() * (layer === 0 ? 40 : 62));
      out.push({ x, w, h, layer, windows: layer === 0 ? 0 : Math.floor(rand() * 5) });
      x += w + Math.floor(rand() * 12);
    }
  }
  return out;
}

/** O estado do jogo vive fora da cena: o motor descarta cenas. */
let jogo: Run.RunState | null = null;

export const S10: Scene = {
  id: 'S10',
  register: 'A',
  viewports: 2,
  pinned: true,
  palette: P_RUN,

  enter(): void {
    skyline ??= buildSkyline();
  },

  draw({ registers, input, dt, reduced }: SceneFrame): void {
    skyline ??= buildSkyline();
    jogo ??= Run.newRun(reduced);

    Run.update(jogo, input, dt, reduced);

    const c = P_RUN.colors;
    const ctx = registers.beginA(c.void);

    /* --- o céu e as três camadas de cidade --- */

    ctx.fillStyle = c.nightDeep;
    ctx.fillRect(0, 0, A_W, GROUND);

    for (let layer = 0; layer < 3; layer++) {
      const cam = jogo.dist * LAYERS[layer];
      const corpo = layer === 0 ? c.nightDark : layer === 1 ? c.nightMid : c.nightLit;
      const luz = layer === 0 ? c.windowDim : c.window;
      for (const b of skyline) {
        if (b.layer !== layer || b.h === 0) continue;
        const x = Math.round(b.x - cam);
        if (x + b.w < 0 || x > A_W) continue;
        const y = GROUND - b.h;
        ctx.fillStyle = corpo;
        ctx.fillRect(x, y, b.w, b.h);
        // Janelas acesas: poucas, e sempre as mesmas. A cidade não pisca.
        ctx.fillStyle = luz;
        for (let i = 0; i < b.windows; i++) {
          const wx = x + 4 + ((i * 7) % Math.max(1, b.w - 8));
          const wy = y + 5 + ((i * 11) % Math.max(1, b.h - 10));
          ctx.fillRect(wx, wy, 2, 2);
        }
      }
    }

    /* --- o telhado em que ele corre --- */

    ctx.fillStyle = c.nightEdge;
    ctx.fillRect(0, GROUND, A_W, 1);
    ctx.fillStyle = c.silhouette;
    ctx.fillRect(0, GROUND + 1, A_W, A_H - GROUND - 1);
    // Textura do telhado, amarrada à distância: sem ela o chão parece parado.
    ctx.fillStyle = c.nightDark;
    for (let x = 0; x < A_W; x += 4) {
      const n = fbm((x + jogo.dist) * 0.05, 4.2, 2);
      if (n > 0.1) ctx.fillRect(x, GROUND + 3 + Math.round(n * 3), 3, 1);
    }

    /* --- os obstáculos: as frases da S07, como formas no caminho --- */

    for (const o of jogo.obstacles) {
      const x = Math.round(o.x - jogo.dist);
      if (x + o.w < -8 || x > A_W + 8) continue;
      o.rows.forEach((row, i) => {
        drawText(ctx, row, x, GROUND - o.h + i * 8, c.nightEdge);
      });
    }

    /* --- ele --- */

    const quadro = BATMAN_RUN[Math.floor(jogo.dist / 9) % BATMAN_RUN.length];
    // No ar o passo congela: quem está pulando não está correndo.
    const sprite = jogo.y < 0 ? BATMAN_RUN[0] : quadro;
    drawSilhouette(ctx, sprite, Run.RUNNER_X, GROUND - 24 + jogo.y, c.silhouette);

    /* --- o comando, uma vez só --- */

    if (!input.hasUsed('space')) {
      drawText(ctx, 'SPACE', A_W / 2, A_H - LINE_H - 6, c.windowDim, { align: 'center' });
    }

    registers.presentA();
  },

  hold(): number | null {
    // A corrida é por tempo, não por scroll: o leitor fica até atravessar.
    if (!jogo || jogo.done) return null;
    return 0.04;
  },
};

export default S10;
