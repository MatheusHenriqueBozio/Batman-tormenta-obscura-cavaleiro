/**
 * S04 — A ESCOLHA DO OUVINTE · Registro A · 2 viewports · sem pin
 *
 * Volta a caverna. Respiro deliberado, quase sem motion. Depois da S03 o
 * leitor precisa de ar, e dar ar é a função inteira desta cena.
 *
 * Por isso ela não inventa nada: é a mesma caverna da S01, no mesmo lugar,
 * com a câmera quase parada. O que muda é o texto, e o texto é o assunto.
 */

import { P_CAVE } from '../visual/palettes';
import { A_W } from '../visual/registers';
import { BATMAN_BACK, drawSilhouette } from '../visual/sprites';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCave, cameraY, drawCave, STAND_Y, type CaveWorld } from './cave';

let world: CaveWorld | null = null;

export const S04: Scene = {
  id: 'S04',
  register: 'A',
  viewports: 2,
  palette: P_CAVE,

  enter(): void {
    world ??= buildCave();
  },

  draw({ progress, registers }: SceneFrame): void {
    const w = (world ??= buildCave());
    const c = P_CAVE.colors;
    const ctx = registers.beginA(c.void);

    // A câmera sobe dois por cento ao longo da cena inteira. É quase nada, de
    // propósito: o leitor precisa sentir que a cena está viva sem ser puxado.
    const camera = 1 - progress * 0.02;

    drawCave(ctx, w, P_CAVE, {
      camera,
      time: 2 + progress * 0.25,
      contaminationAt: 0,
    });

    const sy = Math.round(STAND_Y - cameraY(camera));
    drawSilhouette(ctx, BATMAN_BACK, A_W / 2 - 8, sy, c.figureDark);

    registers.presentA();
  },
};

export default S04;
