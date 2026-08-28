/**
 * S20 — O FINAL QUE ME DEIXA LIVRE · limiar → Registro A · curta
 *
 * O preto se resolve em pixel de novo — é o limiar de volta, na direção
 * inversa: a quantização espacial reentra, a paleta reexpande, o grão sai.
 *
 * Batman ofegante no chão do corredor. O Coringa observando, e **pela
 * primeira vez ele não está rindo**. Braços cruzados. Curioso.
 *
 * **Não existe boss fight.** Nem aqui nem em lugar nenhum da obra. A batalha
 * da noite foi a S18 e já acabou; uma luta convencional aqui destruiria o
 * projeto inteiro. Por isso esta cena é curta, e por isso ela não tem
 * mecânica: os dois se falam e um deles vai embora.
 *
 * Fim: as luzes apagam, ele corre, e a tela fica preta com o corredor ainda
 * presente por um instante.
 */

import { P_HALL } from '../visual/palettes';
import { threshold } from '../visual/registers';
import { BATMAN_KNEEL, drawSilhouette } from '../visual/sprites';
import { clamp, easeInOut, range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCorridor, drawCorridor, FLOOR, type CorridorWorld } from './corridor';

/** Até aqui o pixel ainda está voltando. */
const RESOLVE_ATE = 0.136;
/** Onde as luzes apagam e ele vai embora — no bloco que diz isso. */
const APAGA_EM = 0.697;

const BRUCE_X = 74;

let world: CorridorWorld | null = null;

export const S20: Scene = {
  id: 'S20',
  register: 'C',
  viewports: 2.5,
  palette: P_HALL,
  ambience: ['passos'],

  enter(): void {
    world ??= buildCorridor();
  },

  draw({ progress, registers }: SceneFrame): void {
    const w = (world ??= buildCorridor());
    const t = clamp(progress);
    const c = P_HALL.colors;

    // O inverso da S14: o limiar corre de 1 para 0, e o mundo volta a ter grid.
    const resolve = easeInOut(range(t, 0, RESOLVE_ATE));
    const limiar = 1 - resolve;

    // As luzes apagam no fim, e o corredor fica ali por um instante depois.
    const apaga = range(t, APAGA_EM, 0.9);
    const luz = 1 - apaga;

    const ctx = registers.beginA(c.void);
    drawCorridor(ctx, w, P_HALL, {
      camera: 0.96,
      light: luz,
      // Ele não está mais em cima dele: está de braços cruzados, olhando. E
      // some junto com a luz, sem que a saída seja mostrada.
      jokerScale: 2,
      jokerAnchor: 'screen',
      jokerX: 214,
      joker: luz > 0.35,
    });

    // Ofegante no chão. Ele não se levanta nesta cena: a noite já acabou.
    drawSilhouette(ctx, BATMAN_KNEEL, BRUCE_X, FLOOR - 24, c.figureDark);

    registers.presentA(limiar > 0.01 ? threshold(limiar) : undefined);
  },
};

export default S20;
