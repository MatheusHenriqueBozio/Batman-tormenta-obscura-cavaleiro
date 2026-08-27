/**
 * MICROGAME 2 — TOC. TOC. · DIRECAO.md §S13
 *
 *   ATENDER?
 *   SIM        NÃO
 *
 * SIM → a porta abre. Não há nada atrás dela. O corredor continua.
 * NÃO → nada acontece. O corredor continua.
 *
 * Não existe indicação de qual era certa. Não existe consequência. Não existe
 * ramificação. **Não existe opção certa e isso jamais é dito.**
 *
 * Os dois caminhos duram o mesmo tempo, têm o mesmo peso visual e o Coringa
 * comenta a mesma coisa em ambos. A simetria é o que comunica intenção em vez
 * de bug.
 *
 * O valor da cena está nos dois segundos que o leitor gasta escolhendo.
 */

import type { Input } from '../engine/input';

export type Escolha = 'sim' | 'nao';

/** Quanto tempo a consequência leva, em ms. Igual para as duas. */
export const RESOLUCAO = 2600;

export interface KnockState {
  escolha: Escolha | null;
  /** Milissegundos desde a escolha. */
  desde: number;
}

export interface Hitbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function newKnock(): KnockState {
  return { escolha: null, desde: 0 };
}

function dentro(input: Input, h: Hitbox): boolean {
  const p = input.pointer;
  return p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h;
}

export function hovering(input: Input, h: Hitbox): boolean {
  return input.pointer.over && dentro(input, h);
}

/**
 * Um quadro. `sim` e `nao` são as caixas na tela, em pixels de CSS.
 *
 * As setas também escolhem: quem está no teclado não deveria precisar do
 * mouse, e ← → já são comandos da obra (§15).
 */
export function update(state: KnockState, input: Input, sim: Hitbox, nao: Hitbox, dt: number): void {
  if (state.escolha) {
    state.desde += dt;
    return;
  }
  if (input.pointer.clicked && dentro(input, sim)) state.escolha = 'sim';
  else if (input.pointer.clicked && dentro(input, nao)) state.escolha = 'nao';
  else if (input.wasPressed('left')) state.escolha = 'sim';
  else if (input.wasPressed('right')) state.escolha = 'nao';
}

/** A consequência terminou. Vale para as duas escolhas, no mesmo tempo. */
export function resolved(state: KnockState): boolean {
  return state.escolha !== null && state.desde >= RESOLUCAO;
}
