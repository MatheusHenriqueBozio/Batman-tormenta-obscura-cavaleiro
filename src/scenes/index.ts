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
  { id: 'S03', viewports: 1.5, load: () => import('./S03_Idiot').then((m) => m.default) },
  { id: 'S04', viewports: 2, load: () => import('./S04_Listener').then((m) => m.default) },
  { id: 'S05', viewports: 3, load: () => import('./S05_Void').then((m) => m.default) },
  { id: 'S06', viewports: 1.5, load: () => import('./S06_Barbara').then((m) => m.default) },
  { id: 'S07', viewports: 4, load: () => import('./S07_Spring').then((m) => m.default) },
  { id: 'S08', viewports: 0.5, load: () => import('./S08_Interlude').then((m) => m.default) },
  { id: 'S09', viewports: 1.5, load: () => import('./S09_Alfred').then((m) => m.default) },
  { id: 'S10', viewports: 2, load: () => import('./S10_Run').then((m) => m.default) },
  { id: 'S11', viewports: 2, load: () => import('./S11_Hallway').then((m) => m.default) },
  { id: 'S12', viewports: 2, load: () => import('./S12_Lights').then((m) => m.default) },
  { id: 'S13', viewports: 2, load: () => import('./S13_Knock').then((m) => m.default) },
  { id: 'S14', viewports: 4, load: () => import('./S14_Light').then((m) => m.default) },
  { id: 'S15', viewports: 3, load: () => import('./S15_Forest').then((m) => m.default) },
  { id: 'S16', viewports: 2, load: () => import('./S16_White').then((m) => m.default) },
  { id: 'S17', viewports: 3, load: () => import('./S17_Figure').then((m) => m.default) },
  { id: 'S18', viewports: 5, load: () => import('./S18_Feed').then((m) => m.default) },
  { id: 'S19', viewports: 1.5, load: () => import('./S19_Rise').then((m) => m.default) },
];
