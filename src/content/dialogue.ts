/**
 * Diálogos das cenas em caixa — DIRECAO.md §8 e §S06.
 *
 * Registro A: caixa na base, retrato de 32×32, texto revelado caractere a
 * caractere, avanço por ENTER. É a forma mais estável da obra, e o leitor
 * precisa sentir esse conforto para sentir a falta dele depois.
 *
 * As cenas de diálogo (S06 Bárbara, S09 Alfred) entram na Fase 2. O tipo já
 * está aqui para que o texto possa ser escrito antes da cena existir.
 */

export interface DialogueLine {
  /** Quem fala. Vazio quando é narração dentro da caixa. */
  readonly speaker: string;
  /** Chave do retrato de 32×32, ou null quando não há. */
  readonly portrait: string | null;
  readonly text: string;
}

export interface DialogueScript {
  readonly scene: string;
  readonly lines: readonly DialogueLine[];
}

export const DIALOGUES: readonly DialogueScript[] = [];

export function scriptOf(sceneId: string): DialogueScript | undefined {
  return DIALOGUES.find((d) => d.scene === sceneId);
}
