/**
 * O texto da obra, por cena — DIRECAO.md Parte III.
 *
 * A fonte deste arquivo é `TEXTO-REVISADO.md`, na raiz: a revisão 90/10
 * aprovada pelo autor. Os parágrafos abaixo foram transferidos de lá sem
 * alteração de uma única palavra.
 *
 * Este arquivo existe para que qualquer parágrafo possa ser editado sem tocar
 * em componente visual. Trocar uma palavra aqui e ver o resultado no navegador
 * não exige rebuild: o Vite recarrega sozinho.
 *
 * Se editar aqui, edite também `TEXTO-REVISADO.md` — ele é a fonte, e as duas
 * versões precisam continuar iguais.
 *
 * As cenas S03 a S25 têm o texto pronto em `TEXTO-REVISADO.md` e entram aqui à
 * medida que cada fase implementa as cenas correspondentes.
 */

export type TextRegister = 'A' | 'B';

export interface NarrativeBlock {
  /** Identificador estável do bloco. A cena é o prefixo. */
  readonly id: string;
  /** ID da cena a que o bloco pertence (S00–S25). */
  readonly scene: string;
  /** Janela de progresso da cena em que o bloco está presente, de 0 a 1. */
  readonly from: number;
  readonly to: number;
  /** O registro decide a tipografia: bitmap no A, sans pesada no B. */
  readonly register: TextRegister;
  /** Posição do bloco na tela. */
  readonly place?: 'left' | 'center' | 'right';
  readonly paragraphs: readonly string[];
  /** Marcado enquanto o trecho do original não foi trazido para cá. */
  readonly placeholder?: boolean;
}

export const NARRATIVE: readonly NarrativeBlock[] = [
  // ---------------------------------------------------------------------
  // S01 — A CAVERNA · 5 viewports, a câmera descendo
  //
  // O terceiro parágrafo cai depois de a contaminação já ter começado (0.52):
  // quando o leitor lê "repetitivo", o monitor que repete já está repetindo há
  // um tempo. A palavra confirma o que ele viu sem saber que viu.
  // ---------------------------------------------------------------------
  {
    id: 'S01-a',
    scene: 'S01',
    from: 0.1,
    to: 0.34,
    register: 'A',
    place: 'left',
    paragraphs: [
      "Bruce estava pensativo em seu quartel general. A caverna era escura, e o silêncio nunca era completo: as paredes rochosas e úmidas faziam seus próprios ruídos, e gotas d'água caíam no rio que corria para a saída.",
    ],
  },

  {
    id: 'S01-b',
    scene: 'S01',
    from: 0.4,
    to: 0.66,
    register: 'A',
    place: 'left',
    paragraphs: [
      "Seu rosto era coberto pela luz de dezenas de monitores em azul claro, que ligavam e desligavam sutilmente. Foi em um desses intervalos que ele se deu conta de que vinha sendo perturbado por pensamentos intrusos havia tempo demais para que aquilo fosse normal.",
    ],
  },

  {
    id: 'S01-c',
    scene: 'S01',
    from: 0.74,
    to: 1,
    register: 'A',
    place: 'left',
    paragraphs: [
      "Angústia e incerteza. Sempre tivera planos e padrões de contingência para qualquer desafio em missão, mas nos últimos tempos vinha notando algo diferente. Mais intenso. E... repetitivo.",
    ],
  },

  // ---------------------------------------------------------------------
  // S02 — ALGUMA COISA ESTÁ REPETINDO · 2 viewports, pinned
  //
  // O primeiro parágrafo acompanha as repetições. O segundo só aparece no
  // quarto segmento, quando ele enfim completa a caminhada — "num estalo"
  // acontece na tela e no texto ao mesmo tempo.
  // ---------------------------------------------------------------------
  {
    id: 'S02-a',
    scene: 'S02',
    from: 0.05,
    to: 0.45,
    register: 'A',
    place: 'left',
    paragraphs: [
      "Sempre se sentira tranquilo por ser diferente dos colegas de profissão. Entre os membros da Liga, sua maneira de viver e de pensar era a exceção, e isso nunca o incomodou.",
    ],
  },

  {
    id: 'S02-b',
    scene: 'S02',
    from: 0.7,
    to: 0.98,
    register: 'A',
    place: 'left',
    paragraphs: [
      "Mas naquela noite, num estalo, Wayne percebeu que precisava de respostas antes de chegar a qualquer conclusão.",
    ],
  },
];

/** Os blocos de uma cena, na ordem em que aparecem. */
export function blocksOf(sceneId: string): readonly NarrativeBlock[] {
  return NARRATIVE.filter((b) => b.scene === sceneId);
}

/** Quantos blocos ainda aguardam o texto revisado. */
export function pendingBlocks(): number {
  return NARRATIVE.filter((b) => b.placeholder).length;
}
