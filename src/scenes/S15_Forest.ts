/**
 * S15 — A FLORESTA · Registro B · preto + verde-escuro + amarelo · MICROGAME 3
 *
 * A transição acontece durante o scroll, sem corte: as verticais da cena
 * anterior ganham vegetação e viram troncos. É para isto que existe um canvas
 * único — a mesma superfície que era corredor vira floresta sem que nada seja
 * recarregado.
 *
 * Figuras carregando tochas caminham em procissão. Sem rosto, fatigadas,
 * silhuetas. Não interagem, não ameaçam, não olham. Só andam.
 *
 * A mecânica está em `games/Forest.ts`. O que esta cena precisa fazer é
 * desenhar o escuro sem trair: os troncos continuam passando, para que o
 * leitor saiba que está andando, e nada — nada — indica que a direção é a
 * certa.
 */

import { applyGrain, misregister, mulberry32 } from '../visual/grain';
import { silhueta } from '../visual/figures';
import { P_FOREST } from '../visual/palettes';
import * as Forest from '../games/Forest';
import { clamp, lerp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/** Onde o microgame prende o leitor. Fica num vão entre dois blocos de texto:
 *  o trecho escuro não pode ter texto nenhum na tela (§S15). */
const JOGO_EM = 0.56;
const TETO_JOGO = 0.58;

/** Até aqui as verticais ainda estão virando árvores. */
const MORPH_ATE = 0.16;

interface Tronco {
  /** Onde a tábua estava. */
  readonly reto: number;
  /** Onde a árvore está. */
  readonly torto: number;
  readonly larguraReta: number;
  readonly larguraTorta: number;
  /** 0 fundo, 1 meio, 2 frente. */
  readonly camada: number;
  readonly inclina: number;
}

const PARALLAX = [0.35, 0.68, 1.15];

const TRONCOS: readonly Tronco[] = (() => {
  const rand = mulberry32(0xf01e5);
  const out: Tronco[] = [];
  for (let camada = 0; camada < 3; camada++) {
    for (let i = 0; i < 42; i++) {
      const reto = i * 26 - 546;
      out.push({
        reto,
        torto: reto + (rand() - 0.5) * 46,
        larguraReta: 7,
        larguraTorta: 4 + rand() * (camada === 2 ? 16 : 9),
        camada,
        inclina: (rand() - 0.5) * 0.16,
      });
    }
  }
  return out;
})();

/** A procissão. Cada uma leva uma tocha e nenhuma olha para nada. */
const PROCISSAO = Array.from({ length: 7 }, (_, i) => ({
  offset: i * 96 - 280,
  altura: 0.82 + (i % 3) * 0.06,
}));

const jogo = { estado: null as Forest.ForestState | null };

export const S15: Scene = {
  id: 'S15',
  register: 'B',
  viewports: 3,
  pinned: true,
  palette: P_FOREST,

  draw({ progress, registers, input, dt, state, reduced }: SceneFrame): void {
    const t = clamp(progress);
    const g = (jogo.estado ??= Forest.newForest(reduced));
    const noJogo = t >= JOGO_EM;

    if (noJogo) Forest.update(g, input, dt, reduced);

    const c = P_FOREST.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    // As tábuas viram troncos ao longo dos primeiros dezesseis por cento.
    const morph = range(t, 0, MORPH_ATE);

    // No escuro tudo perde presença — mas os troncos continuam passando, para
    // que o leitor saiba que está andando. O que some é a informação sobre a
    // direção, não a informação sobre o movimento.
    const escuro = Forest.darkProgress(g);
    const presenca = lerp(1, 0.22, escuro);

    const chao = h * 0.86;

    /* ---- os troncos ---- */

    for (const tr of TRONCOS) {
      const px = lerp(tr.reto, tr.torto, morph);
      const larg = lerp(tr.larguraReta, tr.larguraTorta, morph) * (w / 320);
      const x = (px - g.x * PARALLAX[tr.camada]) * (w / 320) + w / 2;
      if (x + larg < -40 || x - larg > w + 40) continue;

      const tom = tr.camada === 2 ? c.green : c.void;
      ctx.fillStyle = tom;
      ctx.globalAlpha = tr.camada === 2 ? presenca : presenca * 0.85;

      // A árvore inclina e afina para cima; a tábua era reta. O morph passa de
      // uma coisa à outra sem que nada seja trocado.
      const topo = chao - h * (0.5 + tr.camada * 0.12);
      const desvio = tr.inclina * morph * (chao - topo);
      ctx.beginPath();
      ctx.moveTo(x - larg / 2, chao);
      ctx.lineTo(x + larg / 2, chao);
      ctx.lineTo(x + desvio + (larg * lerp(1, 0.45, morph)) / 2, topo);
      ctx.lineTo(x + desvio - (larg * lerp(1, 0.45, morph)) / 2, topo);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* ---- as luzes ao longe ---- */

    // Só existem enquanto existirem. Quando uma direção fica sem luz, não há
    // aviso: simplesmente não há nada lá.
    for (const dir of [-1, 1] as const) {
      if (!Forest.hasLight(g, dir)) continue;
      const alvo = dir * Forest.LIGHT_DIST;
      const x = (alvo - g.x) * (w / 320) + w / 2;
      if (x < -80 || x > w + 80) continue;
      const perto = 1 - Math.min(1, Math.abs(alvo - g.x) / Forest.LIGHT_DIST);
      const r = lerp(h * 0.008, h * 0.03, perto);
      ctx.fillStyle = c.torch;
      ctx.globalAlpha = lerp(0.5, 1, perto);
      ctx.beginPath();
      ctx.ellipse(x, chao - h * 0.16, r, r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* ---- a procissão ---- */

    const marcha = ((state.marcha as number | undefined) ?? 0) + dt * 0.014;
    state.marcha = marcha;

    for (const p of PROCISSAO) {
      const mundo = p.offset + marcha;
      const x = (((mundo - g.x) % 680) + 1020) % 680 - 340;
      const sx = x * (w / 320) + w / 2;
      if (sx < -60 || sx > w + 60) continue;
      const alt = h * 0.1 * p.altura;
      // Verde, e não preto: contra um fundo preto a procissão sumiria, e ela
      // precisa ser vista para não ser notada. O que a distingue dos troncos
      // é que ela anda.
      ctx.fillStyle = c.green;
      ctx.globalAlpha = presenca;
      silhueta(ctx, sx, chao, { h: alt, short: true });
      // A tocha. É a única coisa que elas levam, e não ilumina nada.
      ctx.fillStyle = c.torch;
      ctx.globalAlpha = presenca * 0.85;
      ctx.fillRect(sx + alt * 0.3, chao - alt * 0.95, Math.max(2, alt * 0.06), alt * 0.12);
      ctx.globalAlpha = 1;
    }

    /* ---- ele ---- */

    const alt = h * 0.13;
    ctx.fillStyle = c.green;
    misregister(ctx, 2, -1, 0.35, () => {
      silhueta(ctx, w / 2, chao, { h: alt });
    });

    // A dica de comando, uma vez só, e some ao primeiro passo (§15).
    if (noJogo && !input.hasUsed('left') && !input.hasUsed('right')) {
      ctx.fillStyle = c.green;
      ctx.font = `600 ${Math.round(h * 0.022)}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('← →', w / 2, h * 0.95);
      ctx.textAlign = 'left';
    }

    registers.endB(0.06);
    applyGrain(ctx, w, h, 0.02);
  },

  hold(f: SceneFrame): number | null {
    const g = jogo.estado;
    if (!g || g.done) return null;
    return f.progress >= JOGO_EM ? TETO_JOGO : null;
  },
};

export default S15;
