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
 * Legenda de figura com pele e roupa. Os retratos precisam distinguir três
 * pessoas em 32×32: só silhueta não basta, e cor de silhueta em rosto some.
 */
const FIGURE_SKIN = {
  d: 'figureDark',
  m: 'figureMid',
  e: 'figureEdge',
  h: 'hair',
  s: 'skin',
  c: 'cloth',
};

/**
 * Bruce de frente, como o leitor o vê nas cenas de conversa. Os dois vãos
 * claros na máscara são a única coisa que o rosto entrega — no Registro A não
 * há espaço para expressão, e a cena não precisa de expressão nenhuma.
 */
export const BATMAN_FRONT: Sprite = sprite(
  [
    '...d........d...',
    '...dd......dd...',
    '...ddd....ddd...',
    '....dddddddd....',
    '....dddddddd....',
    '....deeddeed....',
    '....dddddddd....',
    '.....mmmmmm.....',
    '...dddddddddd...',
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

/**
 * Bárbara na base dela, sentada diante do console. A cadeira faz parte da
 * silhueta porque faz parte dela — não é assunto da cena, e por isso não
 * recebe destaque nenhum: entra como qualquer outra linha do desenho.
 */
export const BARBARA: Sprite = sprite(
  [
    '..........h...........',
    '........hhhhh.........',
    '.......hhssshh........',
    '.......hsssssh........',
    '.......hsssssh........',
    '.......hsssssh........',
    '.......hhssshh........',
    '........hsssh.........',
    '.........sss..........',
    '......cccccccee.......',
    '......cccccccee.......',
    '......cccccccee.......',
    '......cccccccee.......',
    '......cccccccee.......',
    '......cccccccee.......',
    '.....ecccccccee.......',
    '....eccccccccce.......',
    '...eeccccccccce.......',
    '...eeeeeeeeeeee.......',
    '...eeeeeeeeeee........',
    '...ee.....ee..........',
    '...eee...eee..........',
    '....eeeeeee...........',
    '.....eeeee............',
  ],
  FIGURE_SKIN,
);

/**
 * Alfred de pé. A gramática é a mesma da Bárbara, mas o enquadramento da cena
 * dele é mais fechado e a paleta mais quente: Bárbara foi clínica, Alfred é
 * doméstico.
 */
export const ALFRED: Sprite = sprite(
  [
    '......hhhhh.....',
    '......hhhhh.....',
    '.....hhhhhhh....',
    '.....hhhhhhh....',
    '......sssss.....',
    '......sssss.....',
    '.......sss......',
    '.......ss.......',
    '....dddccddd....',
    '...ddddccdddd...',
    '...ddddccdddd...',
    '...ddddccdddd...',
    '...ddddccdddd...',
    '...ddddccdddd...',
    '...dddddddddd...',
    '...dddddddddd...',
    '...dddddddddd...',
    '....dddddddd....',
    '.....ddd.ddd....',
    '.....ddd.ddd....',
    '.....ddd.ddd....',
    '.....ddd.ddd....',
    '.....ddd.ddd....',
    '.....ddd.ddd....',
  ],
  FIGURE_SKIN,
);

/* ------------------------------------------------------------------ *
 * Retratos de 32×32 para a caixa de diálogo.
 *
 * São rostos, não ícones. Nenhum imita traço de artista nenhum: são massas de
 * pixel construídas aqui, com o mínimo de informação que ainda distingue as
 * três pessoas. Cada um é simétrico por construção — a metade da esquerda é
 * espelhada, e é por isso que nenhum deles entorta.
 * ------------------------------------------------------------------ */

/** Bruce está mascarado: o retrato dele é o capuz, e não há pele a mostrar. */
export const PORTRAIT_BRUCE: Sprite = sprite(
  [
    '................................',
    '................................',
    '......d..................d......',
    '......dd................dd......',
    '.....ddd................ddd.....',
    '.....dddd..............dddd.....',
    '.....ddddd............ddddd.....',
    '.....dddddd..........dddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....ddddeeeeddddddeeeedddd.....',
    '.....ddddeeeeddddddeeeedddd.....',
    '.....ddddeeeeddddddeeeedddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '.....dddddddddddddddddddddd.....',
    '......dddddddddddddddddddd......',
    '.......dddddddddddddddddd.......',
    '........dddddddddddddddd........',
    '.........dddddddddddddd.........',
    '..........dddddddddddd..........',
    '...........dddddddddd...........',
    '...........dddddddddd...........',
    '............mmmmmmmm............',
    '........mmmmmmmmmmmmmmmm........',
    '.....mmmmmmmmmmmmmmmmmmmmmm.....',
    '...mmmmmmmmmmmmmmmmmmmmmmmmmm...',
  ],
  FIGURE,
);

export const PORTRAIT_BARBARA: Sprite = sprite(
  [
    '................................',
    '.........hhhhhhhhhhhhhh.........',
    '.......hhhhhhhhhhhhhhhhhh.......',
    '......hhhhhhhhhhhhhhhhhhhh......',
    '.....hhhhhhhhhhhhhhhhhhhhhh.....',
    '.....hhhhhhhhhhhhhhhhhhhhhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhssddssssssssddsshhh.....',
    '.....hhhssddssssssssddsshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssddddddssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '.....hhhsssssssssssssssshhh.....',
    '......hhhsssssssssssssshhh......',
    '.......hhhsssssssssssshhh.......',
    '........hhhsssssssssshhh........',
    '.........hhhhhhhhhhhhhh.........',
    '..........hhsssssssshh..........',
    '..........hhsssssssshh..........',
    '............ssssssss............',
    '.....cccccccccccccccccccccc.....',
    '...cccccccccccccccccccccccccc...',
    '...cccccccccccccccccccccccccc...',
  ],
  FIGURE_SKIN,
);

export const PORTRAIT_ALFRED: Sprite = sprite(
  [
    '................................',
    '................................',
    '.........hhhhhhhhhhhhhh.........',
    '.......hhhhhhhhhhhhhhhhhh.......',
    '......hhhhhhhhhhhhhhhhhhhh......',
    '......hhsssssssssssssssshh......',
    '......hhsssssssssssssssshh......',
    '......hhsssssssssssssssshh......',
    '......ssssssssssssssssssss......',
    '......ssssssssssssssssssss......',
    '......ssssssssssssssssssss......',
    '......ssssssssssssssssssss......',
    '......ssssddssssssssddssss......',
    '......ssssddssssssssddssss......',
    '......ssssssssssssssssssss......',
    '......ssssssssssssssssssss......',
    '......ssssssssssssssssssss......',
    '......sshhhhhhhhhhhhhhhhss......',
    '......ssssssssssssssssssss......',
    '......ssssssssssssssssssss......',
    '.......ssssssssssssssssss.......',
    '.......ssssssssssssssssss.......',
    '........ssssssssssssssss........',
    '.........ssssssssssssss.........',
    '..........ssssssssssss..........',
    '...........ssssssssss...........',
    '............ssssssss............',
    '............ssssssss............',
    '............ssssssss............',
    '.....dddddddddddddddddddddd.....',
    '...dddddddddddddddddddddddddd...',
    '...dddddddddddddddddddddddddd...',
  ],
  FIGURE_SKIN,
);

/** Retratos por chave, como `dialogue.ts` os nomeia. */
export const PORTRAITS: Record<string, Sprite> = {
  bruce: PORTRAIT_BRUCE,
  barbara: PORTRAIT_BARBARA,
  alfred: PORTRAIT_ALFRED,
};

/** Sprites de corpo inteiro por chave. */
export const FIGURES: Record<string, Sprite> = {
  bruce: BATMAN_FRONT,
  barbara: BARBARA,
  alfred: ALFRED,
};

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
