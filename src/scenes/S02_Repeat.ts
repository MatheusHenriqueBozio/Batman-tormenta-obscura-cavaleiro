/**
 * S02 — ALGUMA COISA ESTÁ REPETINDO · Registro A degradando · 2 viewports · pinned
 *
 * O scroll continua respondendo, mas a caverna não avança. O leitor rola e
 * Bruce anda três passos até a bancada. Rola mais e ele anda os mesmos três
 * passos, do mesmo ponto de partida.
 *
 * Acontece exatamente três vezes. Na quarta ele completa o movimento e a cena
 * solta.
 *
 * A execução decide esta cena. Não pode parecer bug. Cada repetição avança
 * dois ou três pixels a mais que a anterior — progride, mas quase nada. A
 * sensação-alvo é "acho que já vi isso", nunca "o site travou".
 *
 * Sem texto, sem som, sem destaque.
 */

import { applyGrain } from '../visual/grain';
import { P_CAVE } from '../visual/palettes';
import { A_W } from '../visual/registers';
import { BATMAN_BACK, BATMAN_WALK_CYCLE, drawSilhouette } from '../visual/sprites';
import { clamp } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCave, cameraY, drawCave, STAND_Y, type CaveWorld } from './cave';

/** Três repetições e a passagem final. Nunca mais que isso. */
const LOOPS = 3;
const SEGMENTS = LOOPS + 1;

/** Onde ele começa e onde a bancada está, em pixels internos. */
const START_X = A_W / 2 - 8;
const BENCH_X = A_W / 2 + 54;
/** O trecho que ele consegue andar antes de voltar ao início. */
const SHORT_WALK = 26;
/** O quanto cada repetição avança além da anterior. Dois pixels e meio. */
const CREEP = 2.5;

let world: CaveWorld | null = null;

export const S02: Scene = {
  id: 'S02',
  register: 'A',
  viewports: 2,
  pinned: true,
  palette: P_CAVE,

  enter(): void {
    world ??= buildCave();
  },

  draw({ progress, registers, reduced }: SceneFrame): void {
    const w = (world ??= buildCave());
    const c = P_CAVE.colors;
    const ctx = registers.beginA(c.void);

    // Com movimento reduzido a repetição acontece uma vez só, não três.
    const segments = reduced ? 2 : SEGMENTS;
    const raw = clamp(progress) * segments;
    const index = Math.min(segments - 1, Math.floor(raw));
    const local = raw - index;
    const isLast = index === segments - 1;

    // A câmera não avança. A caverna está parada porque ele está parado.
    const camera = 1;

    drawCave(ctx, w, P_CAVE, {
      camera,
      // Os ciclos de tela seguem correndo — a caverna não travou, ele travou.
      time: 1 + progress * 0.4,
      contaminationAt: 0,
    });

    // O percurso: nas três primeiras vezes ele anda um trecho curto e volta ao
    // ponto de partida. Cada volta o deixa um punhado de pixels adiante do que
    // a anterior deixou. Na quarta, o caminho inteiro até a bancada.
    const distance = isLast
      ? BENCH_X - START_X
      : SHORT_WALK + index * CREEP;
    const x = START_X + local * distance;

    const camY = cameraY(camera);
    const sy = Math.round(STAND_Y - camY);

    // Ele para de andar quando chega: o último quadro do trecho é parado.
    const moving = local < 0.94;
    const frame = moving
      ? BATMAN_WALK_CYCLE[Math.floor(local * distance * 0.28) % BATMAN_WALK_CYCLE.length]
      : BATMAN_BACK;
    drawSilhouette(ctx, frame, x, sy, c.figureDark);

    registers.presentA();

    // "Registro A degradando": um fio de grão que sobe ao longo da cena e
    // ainda fica abaixo da faixa do Registro B. Não é para ser percebido —
    // é para ser sentido quando a S03 cortar seco.
    if (!reduced) {
      const decay = clamp(progress) * 0.03;
      if (decay > 0.002) {
        applyGrain(registers.mainCtx, registers.viewport.w, registers.viewport.h, decay);
      }
    }
  },
};

export default S02;
