/**
 * MICROGAME 1 — A CONFIRMAÇÃO · DIRECAO.md §S07
 *
 *   CONFIRMAR → TEM CERTEZA? → VERIFICAR → E SE NÃO FOR? → CONFIRMAR NOVAMENTE
 *
 * Cada confirmação gera a próxima. A sequência nunca termina: ela cicla.
 *
 * Depois da quinta, o scroll — que estava travado — volta a funcionar em
 * silêncio. Sem aviso, sem dica, sem seta. A saída não é completar. É rolar.
 * É parar de alimentar.
 *
 * Esta é a mecânica inteira, e ela é a tese da cena: não há nada a vencer, e
 * quem procura o fim da sequência fica ali. A pergunta do §19 — "esta mecânica
 * expressa alguma coisa sobre o que Bruce está vivendo?" — se responde
 * sozinha aqui.
 */

import { CONFIRMACAO } from '../content/narrative';
import type { Input } from '../engine/input';

/** Depois de tantas confirmações o scroll destrava, sem avisar. */
export const FREE_AT = 5;
/** E a partir daqui a gravidade começa: o botão esmaece a cada clique. */
export const FADE_AT = 8;

export interface ConfirmState {
  /** Quantas vezes o leitor confirmou. */
  count: number;
  /** O scroll já voltou a funcionar. */
  freed: boolean;
}

export interface Hitbox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function newConfirm(): ConfirmState {
  return { count: 0, freed: false };
}

/** A palavra da vez. A sequência nunca acaba — ela volta ao começo. */
export function label(state: ConfirmState): string {
  return CONFIRMACAO[state.count % CONFIRMACAO.length];
}

/**
 * Opacidade do botão.
 *
 * Até a oitava confirmação ele está inteiro. Depois dela começa a perder
 * presença a cada clique — não é tutorial, é gravidade. O leitor que insistir
 * vai ver a própria insistência apagando o objeto da insistência.
 */
export function opacity(state: ConfirmState): number {
  if (state.count < FADE_AT) return 1;
  return Math.max(0.18, 1 - (state.count - FADE_AT) * 0.12);
}

/** Quanto do texto da cena seguinte já assoma na borda de baixo, de 0 a 1. */
export function gravity(state: ConfirmState): number {
  if (state.count < FADE_AT) return 0;
  return Math.min(1, (state.count - FADE_AT) / 6);
}

/**
 * Um quadro do microgame. Devolve true se houve confirmação agora.
 *
 * Com movimento reduzido, uma interação única basta para destravar (§16).
 */
export function update(
  state: ConfirmState,
  input: Input,
  hit: Hitbox,
  reduced: boolean,
): boolean {
  const p = input.pointer;
  const dentro = p.x >= hit.x && p.x <= hit.x + hit.w && p.y >= hit.y && p.y <= hit.y + hit.h;
  // ENTER também confirma: quem está no teclado não deveria precisar do mouse.
  const confirmou = (p.clicked && dentro) || input.wasPressed('enter');
  if (confirmou) {
    state.count++;
    if (state.count >= (reduced ? 1 : FREE_AT)) state.freed = true;
  }
  return confirmou;
}

/** O ponteiro está sobre o botão. */
export function hovering(input: Input, hit: Hitbox): boolean {
  const p = input.pointer;
  return p.over && p.x >= hit.x && p.x <= hit.x + hit.w && p.y >= hit.y && p.y <= hit.y + hit.h;
}
