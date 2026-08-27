/**
 * O texto da obra, por cena — DIRECAO.md Parte III.
 *
 * Este arquivo existe para que qualquer parágrafo possa ser editado sem tocar
 * em componente visual. Trocar uma palavra aqui e ver o resultado no navegador
 * não exige rebuild: o Vite recarrega sozinho.
 *
 * ---------------------------------------------------------------------------
 * ATENÇÃO — O TEXTO ORIGINAL AINDA NÃO ESTÁ NO REPOSITÓRIO.
 *
 * `DIRECAO.md` e `MAPA-DE-CENAS.md` citam a história por fragmentos ("do
 * início até 'intenso e… Repetitivo.'"), mas o arquivo com a história em si
 * nunca chegou. A regra 90/10 (§9) diz que a história é do autor e que no
 * máximo cerca de 10% pode mudar, e só estilisticamente — então escrever a
 * prosa aqui seria uma reescrita de 100%, exatamente o que a regra proíbe.
 *
 * Os blocos abaixo estão marcados com `placeholder: true` e dizem qual trecho
 * do original ocupa cada lugar. Eles existem só para que o ritmo, a quebra de
 * linha e a densidade de tela possam ser testados agora.
 *
 * PARA SUBSTITUIR: cole o trecho revisado em `paragraphs` e apague o
 * `placeholder: true`. Nada mais precisa mudar — nem cena, nem animação.
 * ---------------------------------------------------------------------------
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
  /** Marcado enquanto o trecho do original não foi colado aqui. */
  readonly placeholder?: boolean;
}

export const NARRATIVE: readonly NarrativeBlock[] = [
  // ---------------------------------------------------------------------
  // S01 — A CAVERNA
  // Texto de origem: do início até "…intenso e… Repetitivo."
  //
  // Nota de revisão (DIRECAO.md §S01): a abertura é funcional mas expositiva.
  // "Uma caverna escura, cujo silêncio não era perpétuo" é a construção menos
  // natural do parágrafo — simplificar. Preservar integralmente a ideia dos
  // monitores ligando e desligando: ela já é cinema.
  // ---------------------------------------------------------------------
  {
    id: 'S01-a',
    scene: 'S01',
    from: 0.12,
    to: 0.32,
    register: 'A',
    place: 'left',
    placeholder: true,
    paragraphs: [
      '[S01 · trecho 1 de 4 — a abertura, até a caverna se apresentar. Cole aqui o texto original revisado.]',
    ],
  },
  {
    id: 'S01-b',
    scene: 'S01',
    from: 0.36,
    to: 0.56,
    register: 'A',
    place: 'left',
    placeholder: true,
    paragraphs: [
      '[S01 · trecho 2 de 4 — os monitores que ligam e desligam. Preservar esta imagem quase intacta.]',
    ],
  },
  {
    id: 'S01-c',
    scene: 'S01',
    from: 0.6,
    to: 0.8,
    register: 'A',
    place: 'left',
    placeholder: true,
    paragraphs: ['[S01 · trecho 3 de 4 — Bruce diante da parede de telas.]'],
  },
  {
    id: 'S01-d',
    scene: 'S01',
    from: 0.84,
    to: 1,
    register: 'A',
    place: 'left',
    placeholder: true,
    paragraphs: ['[S01 · trecho 4 de 4 — até "intenso e… Repetitivo."]'],
  },

  // ---------------------------------------------------------------------
  // S02 — ALGUMA COISA ESTÁ REPETINDO
  // Texto de origem: "Sempre se sentira tranquilo com o fato de ser
  // diferente…" até "…ir atrás de algumas respostas."
  //
  // Sem texto explicando a repetição. Se o leitor não perceber, tudo bem —
  // ele vai perceber na S07.
  // ---------------------------------------------------------------------
  {
    id: 'S02-a',
    scene: 'S02',
    from: 0.08,
    to: 0.42,
    register: 'A',
    place: 'left',
    placeholder: true,
    paragraphs: [
      '[S02 · trecho 1 de 2 — "Sempre se sentira tranquilo com o fato de ser diferente…" Cole aqui.]',
    ],
  },
  {
    id: 'S02-b',
    scene: 'S02',
    from: 0.55,
    to: 0.96,
    register: 'A',
    place: 'left',
    placeholder: true,
    paragraphs: ['[S02 · trecho 2 de 2 — até "…ir atrás de algumas respostas."]'],
  },
];

/** Os blocos de uma cena, na ordem em que aparecem. */
export function blocksOf(sceneId: string): readonly NarrativeBlock[] {
  return NARRATIVE.filter((b) => b.scene === sceneId);
}

/** Quantos blocos ainda aguardam o texto original. */
export function pendingBlocks(): number {
  return NARRATIVE.filter((b) => b.placeholder).length;
}
