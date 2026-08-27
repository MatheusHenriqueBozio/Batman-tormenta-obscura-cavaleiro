/**
 * S11 — O CORREDOR · Registro A degradando · 2 viewports pinned · travessia horizontal
 *
 * O leitor rola para baixo e a câmera anda para o lado ao longo do corredor.
 * Janelas passando, madeira apodrecida, luz em fatias.
 *
 * O Coringa é sprite, pequeno, longe, no fim do corredor. Ele permanece
 * pequeno durante toda a cena e só cresce na S12 — a câmera para antes de
 * chegar nele, e é isso que o mantém distante.
 */

import { applyGrain } from '../visual/grain';
import { P_HALL } from '../visual/palettes';
import { BATMAN_WALK_CYCLE, drawSilhouette } from '../visual/sprites';
import { clamp } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCorridor, drawCorridor, FLOOR, type CorridorWorld } from './corridor';

/** Onde Bruce fica na tela. A câmera o acompanha. */
const BRUCE_X = 64;

let world: CorridorWorld | null = null;

export const S11: Scene = {
  id: 'S11',
  register: 'A',
  viewports: 2,
  pinned: true,
  palette: P_HALL,

  enter(): void {
    world ??= buildCorridor();
  },

  draw({ progress, registers, reduced }: SceneFrame): void {
    const w = (world ??= buildCorridor());
    const c = P_HALL.colors;
    const ctx = registers.beginA(c.void);

    // A câmera para antes do fim: o Coringa continua lá no fundo, e a
    // distância entre os dois é o assunto da cena.
    const camera = clamp(progress) * 0.86;

    // Ele fica no fim do corredor, e o fim do corredor não chega. Por isso
    // está preso à tela e não ao mundo: a casa desfila, ele não se aproxima.
    drawCorridor(ctx, w, P_HALL, {
      camera,
      light: 1,
      jokerAnchor: 'screen',
      jokerX: 262,
    });

    // Ele avança com a câmera. O passo é do scroll, não do relógio: parar de
    // rolar para o corredor e para ele junto.
    const passo = BATMAN_WALK_CYCLE[Math.floor(progress * 46) % BATMAN_WALK_CYCLE.length];
    drawSilhouette(ctx, passo, BRUCE_X, FLOOR - 24, c.figureDark);

    registers.presentA();

    // "Registro A degradando": um fio de grão que sobe ao longo do corredor.
    // Não é para ser percebido — é para a S14 ter de onde vir.
    if (!reduced) {
      const decay = clamp(progress) * 0.025;
      if (decay > 0.002) {
        applyGrain(registers.mainCtx, registers.viewport.w, registers.viewport.h, decay);
      }
    }
  },
};

export default S11;
