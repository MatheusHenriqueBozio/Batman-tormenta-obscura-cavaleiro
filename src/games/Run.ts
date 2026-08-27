/**
 * S10 — A CORRIDA · DIRECAO.md §S10
 *
 * SPACE pula. Não há HUD, score, vidas nem game over.
 *
 * Os obstáculos não são inimigos: são as mesmas frases da S07 aparecendo no
 * caminho como formas. Ele não está lutando, está atravessando.
 *
 * **Esta é a única cena em que a solução realmente é pular, sem armadilha e
 * sem ironia.** O leitor precisa aprender o que é um controle honesto antes
 * que a S18 minta para ele. A relação S10 ↔ S18 é estrutural — por isso a
 * física aqui é justa, previsível e generosa, e nada nela engana.
 *
 * Colisão não pune: a câmera volta alguns metros e ele corre de novo. Depois
 * de três colisões seguidas o trecho fica mais fácil, em silêncio.
 */

import { CONFIRMACAO } from '../content/narrative';
import { measure } from '../visual/bitfont';
import type { Input } from '../engine/input';

/** Pixels internos por segundo. */
const SPEED = 150;
/** Gravidade, em pixels por segundo ao quadrado. */
const GRAVITY = 800;
/** Impulso do pulo. Dá 52px de altura e 109px de alcance — folga confortável
 *  sobre o obstáculo mais largo somado ao corpo. A cena não pode ser injusta:
 *  é a única da obra em que pular resolve mesmo, e o leitor precisa aprender
 *  aqui o que é um controle honesto (§S10). */
const JUMP = 290;

/** Comprimento da pista. A 150px/s dá cerca de 28 segundos. */
export const TRACK = 4200;
/** Com movimento reduzido, uma travessia curta com um obstáculo só. */
const TRACK_REDUCED = 900;

/** Quanto a câmera volta numa colisão. Alguns metros, e nada mais. */
const REWIND = 260;
/** Depois de tantas colisões seguidas, o trecho afrouxa. */
const EASE_AFTER = 3;
/**
 * E depois de tantas, os obstáculos adiante somem de vez.
 *
 * Nunca punir (§S10) não é só não mostrar game over: é garantir que ninguém
 * fique preso. Um leitor que não queira ou não consiga pular precisa
 * atravessar assim mesmo, e a obra precisa ser completável do início ao fim
 * (§23). Quando ele insiste e não passa, o pensamento simplesmente para de
 * aparecer no caminho — em silêncio, como tudo nesta cena.
 */
const RELIEF_AFTER = EASE_AFTER * 2;

export interface Obstacle {
  /** Posição na pista. */
  readonly x: number;
  /** As linhas da frase, como ela aparece no caminho. */
  readonly rows: readonly string[];
  readonly w: number;
  readonly h: number;
}

export interface RunState {
  /** Distância percorrida na pista. */
  dist: number;
  /** Altura acima do chão. */
  y: number;
  vy: number;
  obstacles: Obstacle[];
  /** Colisões seguidas. Zera a cada obstáculo vencido. */
  streak: number;
  /** O trecho já afrouxou. */
  eased: boolean;
  /** O obstáculo que ele ainda precisa vencer. */
  next: number;
  done: boolean;
  track: number;
}

/**
 * Quebra a frase em duas linhas equilibradas, para virar um bloco compacto.
 *
 * O equilíbrio importa: uma quebra desigual deixa o obstáculo largo demais
 * para o alcance do pulo, e a cena passaria a ser injusta sem parecer.
 */
function shape(phrase: string, easy: boolean): { rows: string[]; w: number; h: number } {
  const words = phrase.split(' ');
  // Afrouxar não é encurtar o obstáculo por fora: é o pensamento ficando mais
  // curto. Sobra a primeira palavra, e o resto some.
  if (easy || words.length === 1) {
    const rows = [words[0]];
    return { rows, h: 8, w: measure(rows[0]) };
  }
  let corte = 1;
  let melhor = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    if (Math.abs(a - b) < melhor) {
      melhor = Math.abs(a - b);
      corte = i;
    }
  }
  const rows = [words.slice(0, corte).join(' '), words.slice(corte).join(' ')];
  const w = Math.max(...rows.map((r) => measure(r)));
  return { rows, h: rows.length * 8, w };
}

function buildTrack(track: number, easy: boolean, reduced: boolean): Obstacle[] {
  const out: Obstacle[] = [];
  const gap = reduced ? 500 : easy ? 520 : 420;
  for (let i = 0, x = reduced ? 520 : 500; x < track - 240; i++, x += gap) {
    const { rows, w, h } = shape(CONFIRMACAO[i % CONFIRMACAO.length], easy);
    out.push({ x, rows, w, h });
  }
  return out;
}

export function newRun(reduced: boolean): RunState {
  const track = reduced ? TRACK_REDUCED : TRACK;
  return {
    dist: 0,
    y: 0,
    vy: 0,
    obstacles: buildTrack(track, false, reduced),
    streak: 0,
    eased: false,
    next: 0,
    done: false,
    track,
  };
}

/** Onde Bruce fica na tela, em pixels internos. */
export const RUNNER_X = 56;
const RUNNER_W = 12;
const RUNNER_H = 24;
/** Recuo da caixa de colisão em relação ao sprite: colidir de raspão não vale. */
const RUNNER_INSET = 4;

/** Um quadro da corrida. O relógio manda aqui — é um microgame (§13). */
export function update(state: RunState, input: Input, dt: number, reduced: boolean): void {
  if (state.done) return;
  const s = Math.min(dt, 50) / 1000;

  if (input.wasPressed('space') && state.y === 0) state.vy = -JUMP;

  state.vy += GRAVITY * s;
  state.y += state.vy * s;
  if (state.y > 0) {
    state.y = 0;
    state.vy = 0;
  }

  state.dist += SPEED * s;
  if (state.dist >= state.track) {
    state.done = true;
    return;
  }

  // Só o próximo obstáculo importa. Os que ficaram para trás já foram
  // vencidos, e os de adiante ainda não são problema dele.
  const o = state.obstacles[state.next];
  if (!o) return;

  const bx = state.dist + RUNNER_X + RUNNER_INSET;
  const by = -state.y;

  if (bx > o.x + o.w) {
    // Venceu este. A sequência de erros zera aqui, e não em qualquer lugar.
    state.next++;
    state.streak = 0;
    return;
  }

  const bateu = bx + RUNNER_W > o.x && bx < o.x + o.w && by < o.h && by + RUNNER_H > 0;
  if (!bateu) return;

  // Sem game over: a câmera volta alguns metros e ele corre de novo. O recuo
  // é maior que a largura de qualquer obstáculo, então ele nunca reaparece
  // dentro do que acabou de acertá-lo.
  state.streak++;
  state.dist = Math.max(0, state.dist - REWIND);
  state.y = 0;
  state.vy = 0;

  // Depois de três colisões seguidas o trecho afrouxa, sem dizer nada.
  if (!state.eased && state.streak >= EASE_AFTER) {
    state.eased = true;
    state.obstacles = buildTrack(state.track, true, reduced);
    // A pista nova tem outro espaçamento: reencontra onde ele está.
    state.next = Math.max(0, state.obstacles.findIndex((n) => n.x + n.w > state.dist + RUNNER_X));
    return;
  }

  // E se ainda assim ele não passa, o caminho se abre.
  if (state.streak >= RELIEF_AFTER) {
    state.obstacles = state.obstacles.slice(0, state.next);
  }
}

/** Quanto da pista já foi vencido, de 0 a 1. */
export function progressOf(state: RunState): number {
  return Math.min(1, state.dist / state.track);
}
