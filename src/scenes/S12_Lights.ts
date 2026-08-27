/**
 * S12 — LUZES · Registro A/C · 2 viewports pinned
 *
 * A iluminação inteira do corredor está amarrada ao scroll. Alguns quadros
 * ficam completamente pretos. Quando a luz volta, o Coringa está em outra
 * posição — nunca com movimento visível entre uma posição e outra.
 *
 * Sem jumpscare, sem susto, sem glitch. O desconforto vem do ritmo irregular,
 * e o ritmo é irregular porque os intervalos são sorteados com semente fixa:
 * imprevisíveis para o leitor, sempre os mesmos para a obra.
 *
 * **O detalhe que faz a cena:** Bruce fica um quadro atrasado em relação ao
 * cenário. A luz muda e ele muda logo depois. Ninguém percebe conscientemente.
 * Todo mundo sente.
 *
 * E quando o Coringa entende que o problema nunca foi o interruptor, ele para
 * de brincar com a luz. A luz fica acesa, e isso é mais assustador do que
 * continuar.
 */

import { mulberry32 } from '../visual/grain';
import { P_HALL } from '../visual/palettes';
import { BATMAN_BACK, drawSilhouette } from '../visual/sprites';
import { clamp } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import { buildCorridor, drawCorridor, FLOOR, type CorridorWorld } from './corridor';

/** Depois daqui a luz não pisca mais. Ele parou de brincar. */
const LUZ_FIXA_EM = 0.62;

const BRUCE_X = 64;

/**
 * Os pontos em que a luz troca de estado, ao longo do progresso.
 *
 * Sorteados uma vez, com semente fixa. Os intervalos são desiguais de
 * propósito: um piscar regular vira metrônomo, e metrônomo não incomoda.
 */
const CORTES: readonly number[] = (() => {
  const rand = mulberry32(0x1c3b);
  const out: number[] = [];
  let t = 0.05;
  while (t < LUZ_FIXA_EM) {
    out.push(t);
    t += 0.016 + rand() * 0.062;
  }
  return out;
})();

/**
 * Onde o Coringa está a cada volta da luz, em pixels de tela.
 *
 * Presos à tela, e não ao corredor: ele não anda por lá, ele simplesmente
 * está em outro lugar quando a luz volta. Prender ao mundo faria a câmera
 * arrastá-lo, e arrastar é movimento — exatamente o que esta cena não pode
 * mostrar.
 */
const POSICOES = [210, 96, 250, 40, 170, 128, 264, 60, 190, 110];

/** Quantos cortes já passaram, e se a luz está acesa. */
function estadoDaLuz(progress: number): { acesa: boolean; volta: number } {
  if (progress >= LUZ_FIXA_EM) return { acesa: true, volta: CORTES.length };
  let n = 0;
  while (n < CORTES.length && progress >= CORTES[n]) n++;
  return { acesa: n % 2 === 0, volta: n };
}

let world: CorridorWorld | null = null;

export const S12: Scene = {
  id: 'S12',
  register: 'A',
  viewports: 2,
  pinned: true,
  palette: P_HALL,
  ambience: ['passos'],

  enter(): void {
    world ??= buildCorridor();
  },

  draw({ progress, registers, state }: SceneFrame): void {
    const w = (world ??= buildCorridor());
    const c = P_HALL.colors;
    const ctx = registers.beginA(c.void);

    const t = clamp(progress);
    const { acesa, volta } = estadoDaLuz(t);

    // A câmera quase não anda: a cena não é sobre atravessar, é sobre esperar.
    const camera = 0.86 + t * 0.1;

    // O Coringa nunca é visto andando. Ele só está em outro lugar quando a luz
    // volta, e é a troca de posição sem trajeto que faz a cena.
    const jokerX = POSICOES[volta % POSICOES.length];

    // Nem todo apagão é igual: alguns deixam o vão das janelas, outros não
    // deixam nada. É a desigualdade entre eles que incomoda, não o escuro.
    const total = volta % 3 === 1;

    drawCorridor(ctx, w, P_HALL, {
      camera,
      light: acesa ? 1 : 0,
      blackout: !acesa && total,
      jokerScale: 2,
      jokerX,
      jokerAnchor: 'screen',
      joker: acesa,
    });

    // Bruce um quadro atrasado. Ele reage à luz que já foi, não à que está.
    const anterior = (state.luzAnterior as boolean | undefined) ?? acesa;
    state.luzAnterior = acesa;
    if (anterior) {
      drawSilhouette(ctx, BATMAN_BACK, BRUCE_X, FLOOR - 24, c.figureDark);
    }

    registers.presentA();
  },
};

export default S12;
