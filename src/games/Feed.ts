/**
 * MICROGAME CENTRAL — LUTAR PIORA · DIRECAO.md §S18
 *
 * O jogo oferece um comando único:
 *
 *     SPACE — atacar
 *
 * O jogador ataca. A criatura **cresce**. Ataca de novo, cresce mais.
 *
 * Depois de cinco ataques ela diz o que precisa dizer, e **só então** os
 * controles se ampliam:
 *
 *     ← →
 *
 * E a solução é andar embora.
 *
 * **Por que este é o melhor momento da obra:** o jogo mentiu para o jogador.
 * Ofereceu um botão e o botão era a armadilha. O jogador descobre isso do
 * mesmo jeito que Bruce — tentando e piorando. Isso só funciona porque a S10
 * estabeleceu um SPACE honesto antes; sem aquela cena, esta aqui não tem
 * contraste.
 *
 * Se o jogador voltar a atacar, ela recupera tamanho instantaneamente. Sem
 * punição, sem texto, só o fato.
 *
 * **Proibido:** tela de vitória, parabéns, qualquer frase do tipo "você
 * aprendeu a não alimentar seus pensamentos". Quando a criatura acaba, a tela
 * fica vazia e o scroll volta. Nada mais.
 */

import type { Input } from '../engine/input';

/** Ataques até ela dizer o que precisa dizer e os controles se ampliarem. */
export const ATAQUES_ATE_LIBERAR = 5;
/**
 * Quanto ela cresce por golpe.
 *
 * Calibrado para que depois dos cinco golpes ela ainda caiba no quadro com a
 * cabeça e as orelhas visíveis: uma criatura que transborda vira parede
 * branca, e parede branca não é ameaça, é ausência de forma.
 */
const CRESCE = 0.16;
/** Distância que é preciso caminhar sem voltar. */
export const FUGA = 420;
/** Pixels por segundo ao se afastar. */
const SPEED = 62;

export type Fase = 'atacar' | 'livre' | 'cinzas';

export interface FeedState {
  ataques: number;
  /** Escala da criatura. Cresce a cada golpe. */
  tamanho: number;
  /** Quanto ele já se afastou sem voltar. */
  fuga: number;
  fase: Fase;
  /** Um golpe aconteceu neste quadro — a cena usa para o tranco. */
  golpeAgora: boolean;
}

export function newFeed(): FeedState {
  return { ataques: 0, tamanho: 1, fuga: 0, fase: 'atacar', golpeAgora: false };
}

/** O quanto ela ainda existe, de 1 a 0. */
export function presenca(state: FeedState): number {
  return Math.max(0, 1 - state.fuga / FUGA);
}

/**
 * Um quadro. O relógio manda aqui — é um microgame (§13).
 *
 * Com movimento reduzido basta um golpe para os controles se ampliarem: a
 * mentira do botão continua inteira, e só o número de repetições cai (§16).
 */
export function update(state: FeedState, input: Input, dt: number, reduced: boolean): void {
  state.golpeAgora = false;
  if (state.fase === 'cinzas') return;
  const s = Math.min(dt, 50) / 1000;

  if (input.wasPressed('space')) {
    state.ataques++;
    state.tamanho += CRESCE;
    state.golpeAgora = true;
    // Voltar a atacar devolve tudo, na hora. Sem punição, sem texto.
    state.fuga = 0;
    if (state.ataques >= (reduced ? 1 : ATAQUES_ATE_LIBERAR)) state.fase = 'livre';
    return;
  }

  if (state.fase !== 'livre') return;

  // Andar embora. Só afastar-se conta; aproximar-se desfaz o que foi andado,
  // e isso não é castigo — é a mesma coisa que atacar, mais devagar.
  const esq = input.isDown('left');
  const dir = input.isDown('right');
  if (esq === dir) return;
  state.fuga = Math.max(0, state.fuga + (esq ? SPEED : -SPEED) * s);
  if (state.fuga >= FUGA) state.fase = 'cinzas';
}
