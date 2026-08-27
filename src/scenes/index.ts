/**
 * O registro de cenas, em ordem narrativa — DIRECAO.md §13 e §27.
 *
 * Cada cena entra por `import()` dinâmico: é assim que o code splitting
 * acontece, com as cenas adiante carregando enquanto o leitor lê a atual.
 *
 * Toda cena tem ID fixo (S00 a S25). O autor pede ajustes por ID. Não renomeie.
 *
 * As cenas das fases seguintes entram aqui, na ordem, à medida que existirem.
 */

import type { SceneEntry } from '../engine/scene';

export const SCENES: readonly SceneEntry[] = [
  { id: 'S00', viewports: 1, load: () => import('./S00_Title').then((m) => m.default) },
  { id: 'S01', viewports: 5, load: () => import('./S01_Cave').then((m) => m.default) },
  { id: 'S02', viewports: 2, load: () => import('./S02_Repeat').then((m) => m.default) },
];
