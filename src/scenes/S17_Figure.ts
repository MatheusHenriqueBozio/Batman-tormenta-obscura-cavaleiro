/**
 * S17 — A FIGURA · Registro B · preto + branco · pinned
 *
 * Sólida, enorme, simétrica. **Perfeita demais** — simetria exata, sem grão,
 * sem desalinhamento de camada, contra um fundo que tem os dois. É a única
 * coisa limpa da tela, e essa limpeza é sinistra justamente porque toda a obra
 * até aqui teve grão.
 *
 * A ordem de desenho é o método: o fundo recebe o grão primeiro, e a figura
 * entra depois dele. Não há efeito nenhum aplicado a ela — a ausência é que é
 * o efeito.
 *
 * **Direção de personagem, o ponto mais importante desta cena:** esta figura
 * não é vilã. É o sistema que salvou Bruce a vida inteira, e ela tem razão
 * sobre o passado. É por isso que largá-la é difícil. Se ela soar como monstro
 * desde o início, a cena inteira se perde — e é por isso que ela só começa a
 * se desfazer no último terço, quando o texto já a levou de razoável a
 * insistente a carente.
 */

import { applyGrain, fbm, misregister, renderMass } from '../visual/grain';
import { silhueta } from '../visual/figures';
import { P_VOID } from '../visual/palettes';
import { clamp, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

/** Onde ela começa a virar mancha. Não antes: até aqui ela tem razão. */
const DESFAZ_EM = 0.62;

let fundo: HTMLCanvasElement | null = null;
let fundoW = 0;

export const S17: Scene = {
  id: 'S17',
  register: 'B',
  viewports: 3,
  pinned: true,
  palette: P_VOID,

  exit(): void {
    fundo = null;
  },

  draw({ progress, registers }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_VOID.colors;
    const ctx = registers.beginB(c.void);
    const { w, h } = registers.viewport;

    /* ---- o fundo: sujo, deslocado, com grão ---- */

    if (!fundo || fundoW !== w) {
      fundo = renderMass(Math.ceil(w), Math.ceil(h), c.white, {
        scale: 0.011,
        threshold: 0.3,
        octaves: 4,
      });
      fundoW = w;
    }
    ctx.save();
    ctx.globalAlpha = 0.05;
    misregister(ctx, 3, -2, 0.5, () => {
      if (fundo) ctx.drawImage(fundo, 0, 0);
    });
    ctx.restore();

    // O grão entra aqui, e só aqui. Tudo que for desenhado depois fica limpo.
    applyGrain(ctx, w, h, 0.07);

    /* ---- ela ---- */

    const desfaz = range(t, DESFAZ_EM, 1);
    const alt = h * 0.78;
    const cx = w / 2;
    const base = h * 0.98;

    ctx.fillStyle = c.white;
    // Nenhum misregister, nenhum grão, nenhuma variação. A silhueta já é
    // espelhada por construção, então a simetria é exata e não aproximada.
    silhueta(ctx, cx, base, { h: alt });

    /* ---- e depois, aos poucos, ela deixa de ser limpa ---- */

    if (desfaz > 0) {
      // A mancha come a figura pela borda. Não é ela virando monstro: é ela
      // perdendo a forma que a fazia parecer certa.
      ctx.save();
      ctx.beginPath();
      ctx.rect(cx - alt * 0.42, base - alt * 1.2, alt * 0.84, alt * 1.25);
      ctx.clip();
      ctx.fillStyle = c.void;
      const passos = Math.round(26 * desfaz);
      for (let i = 0; i < passos; i++) {
        const a = (i / 26) * Math.PI * 2 + t * 3;
        const r = alt * (0.2 + 0.24 * Math.abs(fbm(i * 0.7, t * 2, 2)));
        const bx = cx + Math.cos(a) * alt * 0.34;
        const by = base - alt * 0.5 + Math.sin(a) * alt * 0.44;
        ctx.beginPath();
        ctx.ellipse(bx, by, r * 0.5 * desfaz, r * 0.34 * desfaz, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },
};

export default S17;
