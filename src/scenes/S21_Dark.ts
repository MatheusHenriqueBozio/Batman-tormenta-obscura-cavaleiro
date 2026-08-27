/**
 * S21 — ESCURO · 1 viewport
 *
 * Preto. Sem texto, sem imagem, sem interação, sem som.
 *
 * O leitor rola e não acontece nada por uma tela inteira. É o único momento da
 * obra em que o scroll não produz nada, e por isso significa alguma coisa.
 *
 * **Não encurte esta cena. Não coloque nada nela.** Nem grão, nem respiro, nem
 * um fio de luz na borda — qualquer coisa aqui seria alguma coisa, e a cena é
 * sobre não haver nada. Este arquivo é curto porque a cena é curta, e ele não
 * está incompleto.
 */

import { P_VOID } from '../visual/palettes';
import type { Scene, SceneFrame } from '../engine/scene';

export const S21: Scene = {
  id: 'S21',
  register: 'B',
  viewports: 1,
  palette: P_VOID,

  draw({ registers }: SceneFrame): void {
    registers.beginB(P_VOID.colors.void);
  },
};

export default S21;
