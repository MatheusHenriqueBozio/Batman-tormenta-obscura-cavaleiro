/**
 * S18 — LUTAR PIORA · Registro B · preto + branco degradando · MICROGAME CENTRAL
 *
 * A mecânica está em `games/Feed.ts`. Esta cena desenha a criatura crescendo a
 * cada golpe e se desfazendo quando ele para de alimentá-la.
 *
 * A tipografia da fala dela deforma junto: quanto mais ele se afasta, menos
 * legível ela fica, até virar forma sem sentido. A deformação acontece no DOM,
 * por variável de CSS, para que o texto continue selecionável e legível por
 * leitor de tela mesmo quando não é mais legível pelos olhos — a §8 autoriza
 * caixas de texto a deformar junto do espaço, e a §12 exige que o texto seja
 * DOM.
 *
 * Quando a criatura acaba, a tela fica vazia e o scroll volta. Nada mais: sem
 * tela de vitória, sem parabéns, sem moral.
 */

import { applyGrain, fbm, misregister } from '../visual/grain';
import { silhueta } from '../visual/figures';
import { P_VOID } from '../visual/palettes';
import * as Feed from '../games/Feed';
import { clamp, lerp } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/** Onde o leitor fica enquanto só existe o botão de atacar. */
const ATAQUE_EM = 0.44;
const TETO_ATAQUE = 0.5;
/** Onde ele fica enquanto anda embora. */
const FUGA_EM = 0.8;
const TETO_FUGA = 0.84;

const jogo = Feed.newFeed();

/** Aplica a deformação da fala dela no DOM. Só muda quando muda. */
let deformacaoAtual = -1;
function deformar(valor: number): void {
  const v = Math.round(valor * 100) / 100;
  if (v === deformacaoAtual) return;
  deformacaoAtual = v;
  const raiz = document.documentElement.style;
  raiz.setProperty('--deformacao', String(v));
}

export const S18: Scene = {
  id: 'S18',
  register: 'B',
  viewports: 5,
  pinned: true,
  palette: P_VOID,

  exit(): void {
    deformar(0);
  },

  draw({ progress, registers, input, dt, reduced }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_VOID.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    const jogando = t >= ATAQUE_EM;
    if (jogando) Feed.update(jogo, input, dt, reduced);

    const presenca = Feed.presenca(jogo);
    // A fala dela perde legibilidade conforme ele se afasta.
    deformar(1 - presenca);

    /* ---- ela ---- */

    if (presenca > 0.01) {
      const alt = h * 0.42 * jogo.tamanho * presenca;
      const cx = w * 0.62;
      const base = h * 0.94;

      // O tranco do golpe: ela sacode no quadro em que é atingida, e cresce.
      const tranco = jogo.golpeAgora ? h * 0.012 : 0;

      ctx.fillStyle = c.white;
      ctx.globalAlpha = lerp(0.35, 1, presenca);
      // Quanto mais golpeada, mais irregular: o desalinhamento de camada sobe
      // com o tamanho dela. Ela não fica mais bonita, fica mais barulhenta.
      const desalinho = 1 + jogo.ataques * 0.7;
      misregister(ctx, desalinho, -desalinho * 0.6, 0.4, () => {
        silhueta(ctx, cx, base + tranco, { h: alt });
      });
      ctx.globalAlpha = 1;

      // Os contornos se desfazendo conforme ele se afasta.
      const desfaz = 1 - presenca;
      if (desfaz > 0.02) {
        ctx.fillStyle = c.void;
        const passos = Math.round(30 * desfaz);
        for (let i = 0; i < passos; i++) {
          const a = (i / 30) * Math.PI * 2 + t * 5;
          const r = alt * (0.1 + 0.3 * Math.abs(fbm(i * 0.9, jogo.fuga * 0.01, 2)));
          ctx.beginPath();
          ctx.ellipse(
            cx + Math.cos(a) * alt * 0.3,
            base - alt * 0.5 + Math.sin(a) * alt * 0.42,
            r * desfaz,
            r * 0.6 * desfaz,
            a,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      }
    }

    /* ---- ele ---- */

    // Ele se afasta para a esquerda. A distância entre os dois é a mecânica.
    const bx = lerp(w * 0.34, w * 0.04, jogo.fuga / Feed.FUGA);
    ctx.fillStyle = c.white;
    ctx.globalAlpha = 0.9;
    silhueta(ctx, bx, h * 0.94, { h: h * 0.3 });
    ctx.globalAlpha = 1;

    /* ---- os comandos ---- */

    // Primeiro só existe um. Depois existem dois. É a ampliação dos controles
    // que conta a virada — e ela só acontece depois de ele ter tentado.
    if (jogando && jogo.fase !== 'cinzas') {
      ctx.fillStyle = c.white;
      ctx.globalAlpha = 0.45;
      ctx.font = `600 ${Math.round(h * 0.022)}px ui-monospace, monospace`;
      ctx.textAlign = 'center';
      if (jogo.fase === 'atacar' && !input.hasUsed('space')) {
        ctx.fillText('SPACE', w / 2, h * 0.95);
      } else if (jogo.fase === 'livre' && !input.hasUsed('left')) {
        ctx.fillText('← →', w / 2, h * 0.95);
      }
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }

    registers.endB(0.07);
    applyGrain(ctx, w, h, 0.02 + jogo.ataques * 0.006);
  },

  hold(f: SceneFrame): number | null {
    // Enquanto só há o botão, ele fica. Quando os controles se ampliam, o
    // caminho se abre — e o caminho é para o outro lado.
    if (jogo.fase === 'atacar' && f.progress >= ATAQUE_EM) return TETO_ATAQUE;
    if (jogo.fase === 'livre' && f.progress >= FUGA_EM) return TETO_FUGA;
    return null;
  },
};

export default S18;
