/**
 * Sprites do Registro A — DIRECAO.md §5.
 *
 * Toda a arte é gerada em código. Nada é traçado, copiado ou adaptado de
 * imagem alguma. Cada sprite é um mapa de pixels escrito à mão aqui.
 *
 * Personagens têm 24px de altura. Batman, Alfred, Bárbara e Coringa no mesmo
 * padrão. Nenhum movimento subpixel: toda posição é arredondada antes do
 * desenho, e o desenho acontece no canvas interno de 320×180.
 *
 * Legenda dos caracteres:
 *   '.' transparente
 *   as demais letras são chaves da paleta da cena, resolvidas em desenho —
 *   por isso o mesmo sprite serve à caverna, ao corredor e à mansão.
 */

import type { Palette } from './palettes';

export interface Sprite {
  readonly w: number;
  readonly h: number;
  readonly rows: readonly string[];
  /** char → chave de cor na paleta da cena. */
  readonly legend: Readonly<Record<string, string>>;
}

function sprite(rows: string[], legend: Record<string, string>): Sprite {
  const w = Math.max(...rows.map((r) => r.length));
  const padded = rows.map((r) => r.padEnd(w, '.'));
  return { w, h: padded.length, rows: padded, legend };
}

/** Legenda padrão de figura: silhueta escura com um fio de luz na borda. */
const FIGURE = { d: 'figureDark', m: 'figureMid', e: 'figureEdge' };

/**
 * Bruce de costas, diante da parede de monitores. É assim que o leitor o
 * encontra na S01: pequeno, de costas, recortado contra a luz das telas.
 */
export const BATMAN_BACK: Sprite = sprite(
  [
    '...d........d...',
    '...dd......dd...',
    '...ddd....ddd...',
    '....dddddddd....',
    '....dddddddd....',
    '....dddddddd....',
    '.....dddddd.....',
    '....dmdddddm....',
    '...edddddddde...',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '...edddddddde...',
    '...edddddddde...',
    '...edddddddde...',
    '....dddddddd....',
    '....dd....dd....',
    '....dd....dd....',
    '....dd....dd....',
    '...ddd....ddd...',
    '...ddd....ddd...',
  ],
  FIGURE,
);

/** Passo com a perna esquerda à frente. */
export const BATMAN_BACK_WALK_A: Sprite = sprite(
  [
    '...d........d...',
    '...dd......dd...',
    '...ddd....ddd...',
    '....dddddddd....',
    '....dddddddd....',
    '....dddddddd....',
    '.....dddddd.....',
    '....dmdddddm....',
    '...edddddddde...',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '...edddddddde...',
    '...edddddddde...',
    '...edddddddde...',
    '....dddddddd....',
    '...ddd.....dd...',
    '...dd......dd...',
    '..ddd.......dd..',
    '..ddd.......dd..',
    '.dddd.......dd..',
  ],
  FIGURE,
);

/** Passo com a perna direita à frente. */
export const BATMAN_BACK_WALK_B: Sprite = sprite(
  [
    '...d........d...',
    '...dd......dd...',
    '...ddd....ddd...',
    '....dddddddd....',
    '....dddddddd....',
    '....dddddddd....',
    '.....dddddd.....',
    '....dmdddddm....',
    '...edddddddde...',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '..edddddddddde..',
    '...edddddddde...',
    '...edddddddde...',
    '...edddddddde...',
    '....dddddddd....',
    '...dd.....ddd...',
    '...dd......dd...',
    '..dd.......ddd..',
    '..dd.......ddd..',
    '..dd.......dddd.',
  ],
  FIGURE,
);

/** Ciclo de caminhada, na ordem de reprodução. */
export const BATMAN_WALK_CYCLE: readonly Sprite[] = [
  BATMAN_BACK_WALK_A,
  BATMAN_BACK,
  BATMAN_BACK_WALK_B,
  BATMAN_BACK,
];

/**
 * Morcego pequeno do gate desktop. Idle lento, três quadros de asa.
 * Deliberadamente leve: o gate não carrega nada da experiência principal.
 */
export const BAT_FRAMES: readonly Sprite[] = [
  sprite(
    [
      '..d.......d..',
      '.ddd.....ddd.',
      'ddddd.d.ddddd',
      '.ddddddddddd.',
      '...dd.d.dd...',
      '....d...d....',
    ],
    FIGURE,
  ),
  sprite(
    [
      '.............',
      '.d.........d.',
      'dddd.ddd.dddd',
      '.ddddddddddd.',
      '...dd.d.dd...',
      '....d...d....',
    ],
    FIGURE,
  ),
  sprite(
    [
      '.............',
      '.............',
      '.dd..ddd..dd.',
      'ddddddddddddd',
      '..ddd.d.ddd..',
      '....d...d....',
    ],
    FIGURE,
  ),
];

/**
 * Desenha um sprite no contexto do Registro A.
 *
 * `x` e `y` são o canto superior esquerdo, em pixels do canvas interno de
 * 320×180, e são arredondados: nenhum movimento subpixel, nunca.
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  x: number,
  y: number,
  palette: Palette,
  overrides?: Record<string, string>,
): void {
  const px = Math.round(x);
  const py = Math.round(y);
  for (let row = 0; row < s.h; row++) {
    const line = s.rows[row];
    let col = 0;
    while (col < s.w) {
      const ch = line[col];
      if (ch === '.') {
        col++;
        continue;
      }
      // Junta pixels iguais em sequência num único fillRect — menos chamadas,
      // mesmo resultado, e o canvas interno é pequeno o bastante para importar.
      let run = 1;
      while (col + run < s.w && line[col + run] === ch) run++;
      const key = s.legend[ch] ?? ch;
      const color = overrides?.[key] ?? palette.colors[key];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(px + col, py + row, run, 1);
      }
      col += run;
    }
  }
}

/** Silhueta chapada do sprite, numa cor só. Usada quando a figura é recorte. */
export function drawSilhouette(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  x: number,
  y: number,
  color: string,
): void {
  const px = Math.round(x);
  const py = Math.round(y);
  ctx.fillStyle = color;
  for (let row = 0; row < s.h; row++) {
    const line = s.rows[row];
    let col = 0;
    while (col < s.w) {
      if (line[col] === '.') {
        col++;
        continue;
      }
      let run = 1;
      while (col + run < s.w && line[col + run] !== '.') run++;
      ctx.fillRect(px + col, py + row, run, 1);
      col += run;
    }
  }
}
