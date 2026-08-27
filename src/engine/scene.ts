/**
 * Contrato de cena — DIRECAO.md §13.
 *
 * Cada cena é um objeto com `id`, `registro` e `draw`. A cena só desenha em
 * função do `progress` normalizado que o scroll fornece. Nenhuma cena depende
 * de relógio, exceto durante microgames.
 *
 * A consequência é desejada: se o leitor para de rolar, o mundo para. Se rola
 * para trás, o mundo volta. Isso ensina, sem texto, que o scroll é tempo.
 */

import type { Palette, Register } from '../visual/palettes';
import type { Registers } from '../visual/registers';
import type { Input } from './input';

export interface SceneFrame {
  /** 0 a 1 dentro da cena, vindo do scroll. É o tempo da obra. */
  progress: number;
  /** Milissegundos desde o carregamento. Só microgames têm direito a isto. */
  time: number;
  /** Delta do último quadro, em ms. Idem. */
  dt: number;
  palette: Palette;
  registers: Registers;
  input: Input;
  /** Rascunho persistente da cena, entre quadros. */
  state: Record<string, unknown>;
  /** O leitor pediu menos movimento. */
  reduced: boolean;
}

export interface Scene {
  readonly id: string;
  readonly register: Register;
  /** Altura da cena em alturas de viewport. Pode ser fracionária. */
  readonly viewports: number;
  readonly palette: Palette;
  /** A cena fica presa enquanto o scroll corre. */
  readonly pinned?: boolean;
  draw(f: SceneFrame): void;
  /** Chamada quando a cena entra na janela ativa. */
  enter?(): void;
  /** Chamada quando ela sai e é descartada. */
  exit?(): void;
}

/** Uma cena carregada sob demanda — é assim que o code splitting acontece. */
export interface SceneEntry {
  readonly id: string;
  readonly viewports: number;
  readonly load: () => Promise<Scene>;
}
