/**
 * MICROGAME 5 — O NAVIO · DIRECAO.md §S23
 *
 * Clique solta um objeto. Cada objeto que cai, o navio sobe. Devagar.
 *
 * **Sem quantidade certa, sem contador, sem falha possível, sem fim
 * obrigatório.** O leitor solta quantos quiser e a cena segue quando ele
 * parar — por isso esta cena não segura ninguém: parar é uma das respostas.
 *
 * **Regra absoluta: nada escrito nas caixas.** Nada de "CULPA", "MEDO",
 * "TRAUMA". São caixas. O significado já está na ação, e escrevê-lo seria
 * dizer ao leitor o que ele acabou de fazer.
 *
 * A mecânica é a última das cinco e é a única em que largar é ganho. Todas as
 * outras foram sobre segurar.
 */

import { mulberry32 } from '../visual/grain';
import type { Input } from '../engine/input';

export interface Carga {
  /** Posição no convés, em fração da largura do navio. */
  readonly u: number;
  /** Altura da pilha, em frações da altura da caixa. */
  readonly nivel: number;
  readonly w: number;
  readonly h: number;
  /** Girado um pouco, para a pilha não parecer alinhada. */
  readonly gira: number;
  /** Solta: caindo. */
  caindo: boolean;
  /** Quanto já caiu, em pixels. */
  queda: number;
  readonly deriva: number;
}

export interface ShipState {
  carga: Carga[];
  /** Altura ganha. Sobe a cada objeto solto, e nunca desce. */
  altura: number;
  /** Altura que ela está buscando. A subida é lenta de propósito. */
  alvo: number;
}

/** Quanto o navio sobe por objeto solto. */
const SUBIDA = 62;

export function newShip(): ShipState {
  const rand = mulberry32(0x5417);
  const carga: Carga[] = [];
  for (let i = 0; i < 14; i++) {
    carga.push({
      u: 0.1 + rand() * 0.8,
      nivel: Math.floor(rand() * 3),
      w: 26 + rand() * 26,
      h: 20 + rand() * 18,
      gira: (rand() - 0.5) * 0.24,
      caindo: false,
      queda: 0,
      deriva: (rand() - 0.5) * 40,
    });
  }
  return { carga, altura: 0, alvo: 0 };
}

/** Caixas ainda no convés. */
export function aBordo(state: ShipState): Carga[] {
  return state.carga.filter((c) => !c.caindo);
}

/**
 * Um quadro. `pontos` traz onde cada caixa está na tela, para o acerto do
 * clique — a cena sabe desenhar, o jogo não.
 */
export function update(
  state: ShipState,
  input: Input,
  dt: number,
  caixas: ReadonlyArray<{ carga: Carga; x: number; y: number; w: number; h: number }>,
): void {
  const s = Math.min(dt, 50) / 1000;

  if (input.pointer.clicked) {
    const p = input.pointer;
    // A de cima primeiro: é a que o leitor vê e é a que ele quer.
    for (let i = caixas.length - 1; i >= 0; i--) {
      const b = caixas[i];
      if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) {
        b.carga.caindo = true;
        state.alvo += SUBIDA;
        break;
      }
    }
  }

  // A subida persegue o alvo devagar. Nunca alcança de uma vez, e nunca volta.
  state.altura += (state.alvo - state.altura) * Math.min(1, s * 0.9);

  for (const c of state.carga) {
    if (c.caindo) c.queda += (220 + c.queda * 1.4) * s;
  }
}

/** O ponteiro está sobre alguma caixa. */
export function sobreCaixa(
  input: Input,
  caixas: ReadonlyArray<{ x: number; y: number; w: number; h: number }>,
): boolean {
  const p = input.pointer;
  if (!p.over) return false;
  return caixas.some((b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h);
}
