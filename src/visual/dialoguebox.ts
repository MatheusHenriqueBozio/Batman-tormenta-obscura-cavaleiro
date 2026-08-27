/**
 * A caixa de diálogo do Registro A — DIRECAO.md §8, §S06 e §S09.
 *
 * Caixa na base, retrato de 32×32 ao lado, texto revelado caractere a
 * caractere, avanço por ENTER. É a forma mais estável e mais organizada da
 * obra, e o leitor precisa sentir esse conforto para sentir a falta dele
 * depois.
 *
 * A caixa pagina sozinha: `dialogue.ts` guarda a fala inteira, e é aqui que
 * ela é quebrada em páginas do tamanho que couber. Assim o autor escreve a
 * fala como fala, e nunca como recorte de tela.
 */

import { drawText, LINE_H, measure, wrap } from './bitfont';
import type { Palette } from './palettes';
import { drawSprite, PORTRAITS } from './sprites';
import { A_H, A_W } from './registers';
import type { DialogueLine } from '../content/dialogue';

/** Geometria da caixa, em pixels do canvas interno. */
const MARGIN = 10;
const BOX_H = 54;
const BOX_Y = A_H - BOX_H - MARGIN;
const PAD = 6;
const PORTRAIT = 32;
/** Linhas de texto que cabem na caixa. */
const LINES_PER_PAGE = 3;
/** Caracteres por segundo na revelação. */
const CHARS_PER_SEC = 45;

export interface Page {
  /** Índice da fala em `script.lines`. */
  readonly line: number;
  readonly rows: readonly string[];
  readonly portrait: string | null;
  /** Total de caracteres da página, para a revelação. */
  readonly chars: number;
}

/** Largura útil do texto, que muda conforme haja retrato ou não. */
function textWidth(hasPortrait: boolean): number {
  const left = MARGIN + PAD + (hasPortrait ? PORTRAIT + PAD : 0);
  return A_W - MARGIN - PAD - left;
}

/**
 * Quebra o roteiro inteiro em páginas. Feito uma vez, na entrada da cena:
 * paginar é caro e o resultado nunca muda.
 */
export function paginate(lines: readonly DialogueLine[]): Page[] {
  const pages: Page[] = [];
  lines.forEach((line, index) => {
    const rows = wrap(line.text, textWidth(line.portrait !== null));
    for (let i = 0; i < rows.length; i += LINES_PER_PAGE) {
      const slice = rows.slice(i, i + LINES_PER_PAGE);
      pages.push({
        line: index,
        rows: slice,
        portrait: line.portrait,
        chars: slice.reduce((n, r) => n + r.length, 0),
      });
    }
  });
  return pages;
}

export interface BoxState {
  /** Página atual. */
  page: number;
  /** Quanto da página já foi revelado, em caracteres. */
  revealed: number;
}

/** Avança a revelação. Devolve true quando a página está inteira na tela. */
export function reveal(state: BoxState, pages: readonly Page[], dt: number): boolean {
  const page = pages[state.page];
  if (!page) return true;
  state.revealed = Math.min(page.chars, state.revealed + (dt / 1000) * CHARS_PER_SEC);
  return state.revealed >= page.chars;
}

/**
 * ENTER faz duas coisas, nesta ordem: primeiro completa a revelação da página,
 * e só depois avança para a próxima. É o comportamento que todo leitor de
 * caixa de diálogo já tem no corpo.
 *
 * Devolve true se ainda há página adiante.
 */
export function advance(state: BoxState, pages: readonly Page[]): boolean {
  const page = pages[state.page];
  if (!page) return false;
  if (state.revealed < page.chars) {
    state.revealed = page.chars;
    return true;
  }
  if (state.page < pages.length - 1) {
    state.page++;
    state.revealed = 0;
    return true;
  }
  return false;
}

/** O roteiro chegou ao fim e a última página está inteira na tela. */
export function finished(state: BoxState, pages: readonly Page[]): boolean {
  return state.page >= pages.length - 1 && state.revealed >= (pages[pages.length - 1]?.chars ?? 0);
}

export interface BoxColors {
  /** Fundo da caixa. */
  panel: string;
  /** Borda. */
  border: string;
  /** Texto. */
  text: string;
  /** Texto de apoio: a dica de comando, o indicador de continuar. */
  dim: string;
}

/**
 * Desenha a caixa. `hint` mostra a dica de ENTER — e ela some assim que o
 * leitor usa a tecla pela primeira vez (§15). Nunca faça tutorial.
 */
export function drawBox(
  ctx: CanvasRenderingContext2D,
  pages: readonly Page[],
  state: BoxState,
  palette: Palette,
  colors: BoxColors,
  hint: boolean,
): void {
  const page = pages[state.page];
  if (!page) return;

  ctx.fillStyle = colors.border;
  ctx.fillRect(MARGIN, BOX_Y, A_W - MARGIN * 2, BOX_H);
  ctx.fillStyle = colors.panel;
  ctx.fillRect(MARGIN + 1, BOX_Y + 1, A_W - MARGIN * 2 - 2, BOX_H - 2);

  let textX = MARGIN + PAD;
  if (page.portrait) {
    const sprite = PORTRAITS[page.portrait];
    if (sprite) {
      const px = MARGIN + PAD;
      const py = BOX_Y + Math.round((BOX_H - PORTRAIT) / 2);
      // Um fundo um tom acima do painel: o capuz do Bruce é quase preto e
      // sumiria contra a caixa sem isto.
      ctx.fillStyle = colors.border;
      ctx.fillRect(px - 1, py - 1, PORTRAIT + 2, PORTRAIT + 2);
      drawSprite(ctx, sprite, px, py, palette);
      textX = px + PORTRAIT + PAD;
    }
  }

  // Revelação caractere a caractere, atravessando as linhas da página.
  let restante = Math.floor(state.revealed);
  const y0 = BOX_Y + PAD + 2;
  for (let i = 0; i < page.rows.length; i++) {
    if (restante <= 0) break;
    const row = page.rows[i];
    const visivel = row.slice(0, restante);
    restante -= row.length;
    drawText(ctx, visivel, textX, y0 + i * LINE_H, colors.text);
  }

  const completa = state.revealed >= page.chars;
  if (completa) {
    if (state.page < pages.length - 1) {
      // Indicador de continuar: um triângulo de três pixels, no canto.
      const tx = A_W - MARGIN - PAD - 4;
      const ty = BOX_Y + BOX_H - PAD - 4;
      ctx.fillStyle = colors.dim;
      ctx.fillRect(tx, ty, 5, 1);
      ctx.fillRect(tx + 1, ty + 1, 3, 1);
      ctx.fillRect(tx + 2, ty + 2, 1, 1);
    }
    if (hint) {
      const label = 'ENTER';
      drawText(ctx, label, A_W - MARGIN - PAD - measure(label), BOX_Y - LINE_H - 1, colors.dim);
    }
  }
}

/** Onde a caixa começa, para que a cena saiba onde parar de desenhar. */
export const BOX_TOP = BOX_Y;
