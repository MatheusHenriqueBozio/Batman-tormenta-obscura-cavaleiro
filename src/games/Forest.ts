/**
 * MICROGAME 3 — SEGUIR A LUZ · DIRECAO.md §S15
 *
 * ← → caminha. O jogador vê pontos de luz ao longe e naturalmente vai até
 * eles. Cada luz o traz de volta à mesma clareira. Duas ou três vezes.
 *
 * Depois existe uma direção **sem luz nenhuma**. Segui-la exige caminhar de
 * seis a oito segundos no escuro sem nenhuma confirmação visual de que a
 * direção está certa. Quem aguentar, sai.
 *
 * **Este é o coração conceitual do projeto.** É incerteza convertida em
 * mecânica, e por isso a regra mais importante deste arquivo é o que ele *não*
 * faz: não há barra de progresso, não há contagem, não há texto, não há som,
 * não há mudança de cor que confirme que a direção está certa. O jogo não
 * confirma. Se confirmasse, não seria sobre nada.
 *
 * E não pune: voltar para as luzes é permitido, quantas vezes o leitor
 * quiser, e não custa nada além do caminho de volta.
 */

import type { Input } from '../engine/input';

/** Pixels internos por segundo. */
const SPEED = 46;
/** Distância da clareira até uma luz. */
export const LIGHT_DIST = 210;
/**
 * Distância no escuro que a saída exige.
 *
 * A 46px/s dá cerca de sete segundos de caminhada sem nenhuma confirmação —
 * dentro dos seis a oito que a §S15 pede. É pouco tempo de relógio e muito
 * tempo de quem não sabe se está indo para o lugar certo.
 */
export const DARK_DIST = 320;
/** Quantas voltas antes de uma das direções ficar sem luz. */
const VOLTAS_ATE_ESCURO = 3;

export interface ForestState {
  /** Posição em relação à clareira. Negativo é a direção que escurece. */
  x: number;
  /** Para que lado ele está virado. */
  facing: -1 | 1;
  /** Quantas vezes uma luz já o trouxe de volta. */
  voltas: number;
  /** Ele saiu. */
  done: boolean;
  /** Ele está andando agora. */
  moving: boolean;
}

export function newForest(reduced: boolean): ForestState {
  return { x: 0, facing: 1, voltas: reduced ? VOLTAS_ATE_ESCURO : 0, done: false, moving: false };
}

/** A direção `dir` tem luz? Depois de três voltas, uma delas não tem mais. */
export function hasLight(state: ForestState, dir: -1 | 1): boolean {
  if (state.voltas < VOLTAS_ATE_ESCURO) return true;
  return dir === 1;
}

/**
 * Um quadro. O relógio manda aqui — é um microgame (§13).
 *
 * Com movimento reduzido a floresta já começa sem a luz da esquerda: uma
 * interação única, sem as voltas (§16).
 */
export function update(state: ForestState, input: Input, dt: number, reduced: boolean): void {
  if (state.done) return;
  const s = Math.min(dt, 50) / 1000;

  const esq = input.isDown('left');
  const dir = input.isDown('right');
  state.moving = esq !== dir;
  if (!state.moving) return;

  const sentido: -1 | 1 = dir ? 1 : -1;
  state.facing = sentido;
  state.x += sentido * SPEED * s;

  // Chegar a uma luz devolve à clareira. Não é castigo nem truque: é o que
  // acontece quando se anda na direção de algo que só parece uma saída.
  if (hasLight(state, 1) && state.x >= LIGHT_DIST) {
    state.x = 0;
    state.voltas++;
    return;
  }
  if (hasLight(state, -1) && state.x <= -LIGHT_DIST) {
    state.x = 0;
    state.voltas++;
    return;
  }

  // O escuro. Nenhuma confirmação até o fim, e o fim não é anunciado.
  if (!hasLight(state, -1) && state.x <= -(reduced ? LIGHT_DIST : DARK_DIST)) {
    state.done = true;
  }
}

/** Quanto do trecho escuro já foi andado, de 0 a 1. Só a cena usa — nunca a tela. */
export function darkProgress(state: ForestState): number {
  if (hasLight(state, -1) || state.x >= 0) return 0;
  return Math.min(1, -state.x / DARK_DIST);
}
