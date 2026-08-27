/**
 * S05 — O VAZIO PRETO · Registro B · preto + branco · 3 viewports · pinned longo
 *
 * Preto absoluto. Sem cenário, sem personagem, sem interface, sem cor. Só as
 * frases, que vivem no DOM e aparecem em posições e escalas diferentes da tela
 * — algumas próximas e grandes, outras distantes e pequenas. Uma ou outra
 * desaparece antes de terminar.
 *
 * "Isso precisa transmitir intimidade e vazio, não espetáculo. A tentação será
 * encher a tela. Não encha."
 *
 * Por isso esta cena desenha quase nada, e isso é a implementação correta e
 * não uma economia: o único elemento é o grão, que impede o preto de virar
 * um buraco morto sem impedir que ele seja um vazio.
 */

import { P_VOID } from '../visual/palettes';
import type { Scene, SceneFrame } from '../engine/scene';

export const S05: Scene = {
  id: 'S05',
  register: 'B',
  viewports: 3,
  pinned: true,
  palette: P_VOID,

  draw({ registers }: SceneFrame): void {
    registers.beginB(P_VOID.colors.void);
    registers.endB(0.05);
  },
};

export default S05;
