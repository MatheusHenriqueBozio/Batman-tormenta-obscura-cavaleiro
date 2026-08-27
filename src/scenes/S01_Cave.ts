/**
 * S01 — A CAVERNA · Registro A · 5 viewports · vertical lento
 *
 * Abre quase preto, sem informação. A câmera desce conforme o scroll,
 * revelando a caverna de cima para baixo, como quem desce uma escada. Bruce é
 * um sprite de 24px na base, de costas, diante de uma parede de monitores.
 *
 * A escala entre figura e ambiente é absurda de propósito — é a primeira aula
 * de gramática que o leitor recebe.
 *
 * Por volta da terceira viewport, um único monitor passa a repetir exatamente
 * o mesmo frame a cada dois ciclos. Sem destaque, sem som, sem texto.
 */

import { P_CAVE } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { BATMAN_BACK, drawSilhouette } from '../visual/sprites';
import { easeInOut, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCave, cameraY, drawCave, STAND_Y, type CaveWorld } from './cave';

/** Terceira das cinco viewports. É onde a repetição entra, sem avisar. */
const CONTAMINATION_AT = 0.52;

let world: CaveWorld | null = null;

export const S01: Scene = {
  id: 'S01',
  register: 'A',
  viewports: 5,
  palette: P_CAVE,

  enter(): void {
    world ??= buildCave();
  },

  exit(): void {
    // A geometria é barata e determinística; mantê-la evita reconstruir a
    // caverna toda vez que o leitor rola para trás.
  },

  draw({ progress, registers }: SceneFrame): void {
    const w = (world ??= buildCave());
    const c = P_CAVE.colors;
    const ctx = registers.beginA(c.void);

    // A descida desacelera perto do chão: a caverna termina, não corta.
    const camera = easeInOut(progress);

    drawCave(ctx, w, P_CAVE, {
      camera,
      time: progress,
      contaminationAt: CONTAMINATION_AT,
    });

    // Bruce aparece na última descida, pequeno, de costas, recortado contra a
    // luz das telas. A escala é a mensagem: ele não domina este espaço.
    const camY = cameraY(camera);
    const bruceSy = Math.round(STAND_Y - camY);
    if (bruceSy > -24 && bruceSy < A_H) {
      // Silhueta chapada, não sprite iluminado: ele está entre o leitor e a
      // única fonte de luz da caverna, e é isso que a figura precisa dizer.
      drawSilhouette(ctx, BATMAN_BACK, A_W / 2 - 8, bruceSy, c.figureDark);
    }

    // Vinheta de rocha: as bordas da tela fecham um pouco, e fecham mais no
    // começo, quando ainda não há informação nenhuma para ver.
    const closed = 1 - range(progress, 0, 0.3);
    if (closed > 0) {
      ctx.fillStyle = c.void;
      const band = Math.round(closed * 46);
      ctx.fillRect(0, 0, A_W, band);
    }

    registers.presentA();
  },
};

export default S01;
