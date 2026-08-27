/**
 * A gramática das cenas de conversa — DIRECAO.md §S06 e §S09.
 *
 * Duas cenas usam esta forma: Bárbara e Alfred. Elas dividem tudo que é
 * mecânico — paginação, revelação caractere a caractere, avanço por ENTER,
 * a caixa na base — e diferem só no que é encenação: a paleta, o
 * enquadramento e quem está em cena.
 *
 * O leitor fica segurado enquanto a conversa não termina. Segurar aqui é o
 * oposto de scrolljacking: só o teto é aparado, então voltar continua
 * funcionando, e a conversa acaba porque o leitor a conduz, não porque ele
 * rolou por cima dela.
 */

import { advance, drawBox, finished, paginate, reveal, type BoxColors, type BoxState, type Page } from '../visual/dialoguebox';
import type { Palette } from '../visual/palettes';
import { scriptOf } from '../content/dialogue';
import type { Scene, SceneFrame } from '../engine/scene';

export interface DialogueStage {
  /** Desenha o cenário, antes da caixa. */
  (ctx: CanvasRenderingContext2D, palette: Palette, f: SceneFrame, done: boolean): void;
}

export interface DialogueSceneOptions {
  readonly id: string;
  readonly palette: Palette;
  readonly viewports: number;
  readonly colors: BoxColors;
  /** Chave da cor de fundo na paleta. */
  readonly background: string;
  readonly stage: DialogueStage;
}

/**
 * O estado da conversa vive fora da cena, no módulo.
 *
 * O motor descarta cenas que saem da janela ativa, e se o estado morresse com
 * elas o leitor que rolasse de volta cairia numa conversa reiniciada — e seria
 * segurado nela outra vez. Isto guarda o progresso da conversa pela sessão
 * inteira, que é o que o leitor espera.
 */
const estados = new Map<string, { pages: Page[]; box: BoxState }>();

export function makeDialogueScene(opts: DialogueSceneOptions): Scene {
  const { id, palette, viewports, colors, background, stage } = opts;

  function estado(): { pages: Page[]; box: BoxState } {
    let e = estados.get(id);
    if (!e) {
      const script = scriptOf(id);
      e = { pages: script ? paginate(script.lines) : [], box: { page: 0, revealed: 0 } };
      estados.set(id, e);
    }
    return e;
  }

  return {
    id,
    register: 'A',
    viewports,
    palette,

    enter(): void {
      estado();
    },

    draw(f: SceneFrame): void {
      const { pages, box } = estado();
      const { registers, input, dt } = f;

      // ENTER completa a página; se ela já está inteira, vai para a próxima.
      if (input.wasPressed('enter')) advance(box, pages);
      // A revelação é o único lugar da obra, fora dos microgames, em que o
      // relógio manda: o texto sai no ritmo de quem fala, não no de quem rola.
      reveal(box, pages, dt);

      const ctx = registers.beginA(palette.colors[background]);
      const pronto = finished(box, pages);
      stage(ctx, palette, f, pronto);
      drawBox(ctx, pages, box, palette, colors, !input.hasUsed('enter'));
      registers.presentA();
    },

    hold(): number | null {
      const { pages, box } = estado();
      if (pages.length === 0) return null;
      // Enquanto a conversa não terminar, o leitor não passa do começo da
      // cena. O teto é fixo e folgado: dentro dele a página ainda responde ao
      // scroll, e nada é arrancado da mão de quem está lendo.
      return finished(box, pages) ? null : 0.04;
    },
  };
}
