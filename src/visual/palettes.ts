/**
 * Paletas por cena — DIRECAO.md §6.
 *
 * Registro A: paleta indexada, no máximo 16 cores por cena.
 * Registro B: exatamente as duplas ou trios indicados. Sem paleta cheia.
 *
 * O dourado aparece duas vezes na obra inteira: S19 e S23. Em nenhum outro
 * lugar. É a cor da agência recuperada e precisa ser rara para significar.
 */

export type Register = 'A' | 'B' | 'C';

export interface Palette {
  id: string;
  register: Register;
  /** Cores nomeadas. A ordem define o índice na paleta indexada. */
  colors: Record<string, string>;
}

/** Máximo de cores por registro, conforme a especificação. */
const MAX_COLORS: Record<Register, number> = { A: 16, B: 3, C: 16 };

function palette(id: string, register: Register, colors: Record<string, string>): Palette {
  const count = Object.keys(colors).length;
  if (count > MAX_COLORS[register]) {
    throw new Error(
      `Paleta "${id}" (registro ${register}) tem ${count} cores; o máximo é ${MAX_COLORS[register]}.`,
    );
  }
  return { id, register, colors };
}

/** S00 e S25 — preto + um único ciano. A obra abre e fecha na mesma cor. */
export const P_TITLE = palette('title', 'A', {
  void: '#04060a',
  caveDeep: '#070b12',
  caveEdge: '#0b111b',
  cyan: '#4fd6e0',
  cyanDim: '#1d5b63',
});

/** S01–S02 e S04 — Batcaverna. Azuis frios, ciano dos monitores, preto. */
export const P_CAVE = palette('cave', 'A', {
  void: '#04060a',
  rockDeep: '#070b12',
  rockDark: '#0a1019',
  rockMid: '#101a27',
  rockLit: '#18283a',
  rockEdge: '#22384f',
  waterDark: '#0a1622',
  waterLit: '#12324a',
  screenOff: '#070d14',
  screenDim: '#0e2831',
  screenOn: '#1b5f6b',
  screenHot: '#4fb8c6',
  figureDark: '#020407',
  figureMid: '#0b1420',
  figureEdge: '#1b2c3f',
  drop: '#7fd4de',
});

/** S03 — Idiota. Preto + vermelho. */
export const P_IDIOT = palette('idiot', 'B', {
  void: '#050505',
  red: '#c1121f',
});

/** S05, S17–S18 — o vazio e a figura. Preto + branco. */
export const P_VOID = palette('void', 'B', {
  void: '#050505',
  white: '#efefe9',
});

/** S06 — Bárbara. Verde-acinzentado + âmbar. */
export const P_ORACLE = palette('oracle', 'A', {
  void: '#060907',
  greenDeep: '#0c1512',
  greenDark: '#12201b',
  greenMid: '#1b2f27',
  greenLit: '#294338',
  greenEdge: '#3c5a4b',
  amberDim: '#6b4a1c',
  amberMid: '#a9762c',
  amber: '#e0a94a',
  amberHot: '#f6d089',
  figureDark: '#050807',
  figureMid: '#0f1a15',
  figureEdge: '#22362c',
  hair: '#a85f2a',
  skin: '#9b8570',
  cloth: '#24382e',
});

/** S07 — A mola. Preto + azul elétrico. */
export const P_SPRING = palette('spring', 'B', {
  void: '#03040a',
  blue: '#2f6bff',
});

/** S09 — Alfred. Âmbar quente. */
export const P_ALFRED = palette('alfred', 'A', {
  void: '#0a0703',
  brownDeep: '#150d05',
  brownDark: '#20150a',
  brownMid: '#33220f',
  brownLit: '#4b3216',
  amberDim: '#7a4f1d',
  amberMid: '#a97430',
  amber: '#d99f4c',
  amberHot: '#f3d18d',
  figureDark: '#070502',
  figureMid: '#1a1108',
  figureEdge: '#2e1f0e',
  hair: '#8f857a',
  skin: '#c49a72',
  cloth: '#3a2a16',
});

/** S10 — A corrida. Azul-noite + silhueta preta. */
export const P_RUN = palette('run', 'A', {
  void: '#02040c',
  nightDeep: '#050a18',
  nightDark: '#091326',
  nightMid: '#0f1e38',
  nightLit: '#182d4e',
  nightEdge: '#26436e',
  windowDim: '#2b4a72',
  window: '#4c7ab0',
  silhouette: '#010206',
});

/** S11–S13 e S20 — o corredor. Verde doentio + roxo. */
export const P_HALL = palette('hall', 'A', {
  void: '#060409',
  greenDeep: '#0b1209',
  greenDark: '#121c0e',
  greenMid: '#1d2c14',
  greenSick: '#33501f',
  greenGlow: '#5a7a2c',
  purpleDeep: '#120a1c',
  purpleDark: '#1d1030',
  purpleMid: '#2e1a4a',
  purpleLit: '#452a6b',
  purpleGlow: '#6b47a0',
  figureDark: '#030206',
});

/** S14 — A luz. Preto + amarelo. Registro C (limiar). */
export const P_LIGHT = palette('light', 'C', {
  void: '#050505',
  yellowDim: '#7a6a10',
  yellow: '#e8d64a',
  yellowHot: '#fbf3b0',
});

/** S15 — A floresta. Preto + verde-escuro + amarelo (só as tochas). */
export const P_FOREST = palette('forest', 'B', {
  void: '#030604',
  green: '#16301f',
  torch: '#e8c24a',
});

/** S16 — Branco. Branco + cinza. Única cena de fundo claro da obra. */
export const P_WHITE = palette('white', 'B', {
  white: '#f2f2ee',
  grey: '#8d8d88',
});

/** S19 — Levantar. Transição de azul-frio para dourado. Primeira das duas vezes. */
export const P_RISE = palette('rise', 'B', {
  void: '#040810',
  cold: '#2c4a7a',
  gold: '#e8b34a',
});

/** S22 — Mansão. Registro A suavizado, âmbar e rosa de madrugada, contraste baixo. */
export const P_MANOR = palette('manor', 'A', {
  void: '#141018',
  duskDeep: '#1d1720',
  duskDark: '#2a2029',
  duskMid: '#3a2c33',
  duskLit: '#4d3b41',
  roseDim: '#6b4a52',
  roseMid: '#8f6169',
  rose: '#b98189',
  amberDim: '#8a6a48',
  amber: '#c19a68',
  amberHot: '#e0c49a',
  figureDark: '#100c13',
});

/** S23 — O navio. Azul-claro + branco + dourado. Segunda e última vez do dourado. */
export const P_SHIP = palette('ship', 'B', {
  sky: '#9fc6e0',
  white: '#f4f7f9',
  gold: '#e8b34a',
});

/** S24 — Fim. Dessatura até branco. */
export const P_END = palette('end', 'B', {
  white: '#f7f7f5',
  grey: '#b8b8b4',
});

/** Registro da paleta de cada cena, por ID. */
export const SCENE_PALETTES: Record<string, Palette> = {
  S00: P_TITLE,
  S01: P_CAVE,
  S02: P_CAVE,
  S03: P_IDIOT,
  S04: P_CAVE,
  S05: P_VOID,
  S06: P_ORACLE,
  S07: P_SPRING,
  S08: P_CAVE,
  S09: P_ALFRED,
  S10: P_RUN,
  S11: P_HALL,
  S12: P_HALL,
  S13: P_HALL,
  S14: P_LIGHT,
  S15: P_FOREST,
  S16: P_WHITE,
  S17: P_VOID,
  S18: P_VOID,
  S19: P_RISE,
  S20: P_HALL,
  S21: P_VOID,
  S22: P_MANOR,
  S23: P_SHIP,
  S24: P_END,
  S25: P_TITLE,
};

/**
 * A cor com que a cena escreve.
 *
 * É a última cor declarada na paleta — por convenção, a mais clara. Assim o
 * texto do Registro B nunca introduz uma terceira cor que a cena não tem: a
 * S03 acusa em vermelho, a S05 fala em branco, a S07 confirma em azul.
 */
export function inkOf(p: Palette): string {
  const cols = Object.values(p.colors);
  return cols[cols.length - 1];
}

/** A paleta como array indexado, na ordem de declaração. */
export function indexed(p: Palette): string[] {
  return Object.values(p.colors);
}

/** Converte "#rrggbb" para [r, g, b]. */
export function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Interpola duas cores hex. Usado só pelo limiar e pela S19. */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = rgb(a);
  const [br, bg, bb] = rgb(b);
  const k = Math.max(0, Math.min(1, t));
  const r = Math.round(ar + (br - ar) * k);
  const g = Math.round(ag + (bg - ag) * k);
  const bl = Math.round(ab + (bb - ab) * k);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}

/**
 * Colapso de paleta do limiar A → B (DIRECAO.md §5, Registro C).
 * Em t=0 a paleta indexada inteira. Em t=1 restam duas cores: o fundo e o
 * extremo mais claro. As intermediárias são puxadas para uma das duas pontas.
 */
export function collapse(p: Palette, t: number): string[] {
  const cols = indexed(p);
  if (cols.length === 0) return cols;
  const dark = cols[0];
  const light = cols[cols.length - 1];
  const k = Math.max(0, Math.min(1, t));
  return cols.map((c, i) => {
    const at = i / Math.max(1, cols.length - 1);
    return mix(c, at < 0.5 ? dark : light, k);
  });
}
