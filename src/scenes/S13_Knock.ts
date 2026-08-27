/**
 * S13 — TOC. TOC. · Registro A · MICROGAME 2
 *
 * O corredor congela. No centro, discreto, a pergunta e as duas respostas.
 *
 * As duas duram o mesmo tempo, têm o mesmo peso visual, e depois o corredor
 * continua igual. Não existe opção certa e isso jamais é dito — a mecânica
 * está em `games/Knock.ts` e a simetria é toda a mensagem.
 *
 * A porta que abre não revela nada. Isso não é conteúdo faltando: é a resposta
 * da cena.
 */

import { drawText, LINE_H, measure } from '../visual/bitfont';
import { P_HALL } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { BATMAN_BACK, drawSilhouette } from '../visual/sprites';
import * as Knock from '../games/Knock';
import { range } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';
import {
  buildCorridor,
  cameraX,
  drawCorridor,
  FLOOR,
  JOKER_X,
  type CorridorWorld,
} from './corridor';

const BRUCE_X = 64;
/** A porta em que ele bate, no corredor. */
const PORTA_X = JOKER_X - 118;
const PORTA_W = 30;
const PORTA_H = 58;

let world: CorridorWorld | null = null;
const jogo = Knock.newKnock();

/** Converte uma caixa do canvas interno para pixels de CSS, para o ponteiro. */
function paraTela(
  registers: SceneFrame['registers'],
  x: number,
  y: number,
  w: number,
  h: number,
): Knock.Hitbox {
  const { scale, w: vw, h: vh } = registers.viewport;
  const dx = Math.round((vw - A_W * scale) / 2);
  const dy = Math.round((vh - A_H * scale) / 2);
  return { x: dx + x * scale, y: dy + y * scale, w: w * scale, h: h * scale };
}

export const S13: Scene = {
  id: 'S13',
  register: 'A',
  viewports: 2,
  pinned: true,
  palette: P_HALL,
  ambience: ['passos'],

  enter(): void {
    world ??= buildCorridor();
  },

  draw({ progress, registers, input, dt, state, cue }: SceneFrame): void {
    const w = (world ??= buildCorridor());
    const c = P_HALL.colors;
    const ctx = registers.beginA(c.void);

    const camera = 0.96;

    // A batida. Um efeito, e não ambiência: acontece uma vez, no ponto em que
    // o texto diz "Toc. Toc.", e nunca mais. Sem arquivo de som registrado,
    // isto não faz nada.
    if (progress >= 0.19 && !state.bateu) {
      state.bateu = true;
      cue('batida');
    }

    // Ele está ao lado da porta em que acabou de bater, e não mais no fim do
    // corredor: é a primeira vez na obra que os dois dividem o mesmo quadro.
    drawCorridor(ctx, w, P_HALL, {
      camera,
      light: 1,
      jokerScale: 2,
      jokerX: PORTA_X + 40,
    });

    // A porta. Ela existe no corredor desde antes da pergunta.
    const px = Math.round(PORTA_X - cameraX(camera));
    const py = FLOOR - PORTA_H;
    const aberta = jogo.escolha === 'sim';
    ctx.fillStyle = c.greenDeep;
    ctx.fillRect(px, py, PORTA_W, PORTA_H);
    if (aberta) {
      // Atrás da porta não há nada. O vão é preto e é só isso.
      const quanto = range(jogo.desde, 0, 900);
      const vao = Math.round(PORTA_W * quanto);
      ctx.fillStyle = c.void;
      ctx.fillRect(px + 1, py + 1, vao, PORTA_H - 2);
      ctx.fillStyle = c.greenDark;
      ctx.fillRect(px + vao + 1, py + 1, PORTA_W - vao - 2, PORTA_H - 2);
    } else {
      ctx.fillStyle = c.greenDark;
      ctx.fillRect(px + 1, py + 1, PORTA_W - 2, PORTA_H - 2);
      ctx.fillStyle = c.greenDeep;
      ctx.fillRect(px + 4, py + 8, PORTA_W - 8, 1);
      ctx.fillRect(px + 4, py + PORTA_H - 16, PORTA_W - 8, 1);
    }
    ctx.fillStyle = c.greenGlow;
    ctx.fillRect(px + PORTA_W - 6, py + Math.round(PORTA_H / 2), 2, 2);

    drawSilhouette(ctx, BATMAN_BACK, BRUCE_X, FLOOR - 24, c.figureDark);

    /* --- a pergunta --- */

    const cx = A_W / 2;
    const cy = 62;
    const simW = measure('SIM');
    const naoW = measure('NÃO');
    const simX = cx - 34 - simW / 2;
    const naoX = cx + 34 - naoW / 2;
    const linhaY = cy + LINE_H + 6;

    const caixaSim = paraTela(registers, simX - 5, linhaY - 3, simW + 10, LINE_H + 4);
    const caixaNao = paraTela(registers, naoX - 5, linhaY - 3, naoW + 10, LINE_H + 4);

    // A pergunta só aparece depois que o corredor terminou de falar. Antes
    // disso ela roubaria a cena de um texto que ainda está acontecendo.
    const perguntaNoAr = progress >= 0.4;
    if (perguntaNoAr || jogo.escolha) Knock.update(jogo, input, caixaSim, caixaNao, dt);

    if (perguntaNoAr && !jogo.escolha) {
      // Uma placa escura atrás da pergunta. Sem ela o texto se perde nas
      // janelas — e uma pergunta que não se lê não é uma escolha, é um bug.
      const pergW = measure('ATENDER?');
      const plataW = Math.max(pergW, naoX + naoW - simX) + 16;
      ctx.fillStyle = c.void;
      ctx.fillRect(Math.round(cx - plataW / 2), cy - 5, plataW, LINE_H * 2 + 12);

      drawText(ctx, 'ATENDER?', cx, cy, c.greenGlow, { align: 'center' });
      const sobreSim = Knock.hovering(input, caixaSim);
      const sobreNao = Knock.hovering(input, caixaNao);
      // Mesmo peso visual para as duas. Nada aqui sugere uma resposta.
      drawText(ctx, 'SIM', simX, linhaY, sobreSim ? c.greenGlow : c.greenSick);
      drawText(ctx, 'NÃO', naoX, linhaY, sobreNao ? c.greenGlow : c.greenSick);
      if (sobreSim) ctx.fillRect(simX, linhaY + LINE_H - 1, simW, 1);
      if (sobreNao) ctx.fillRect(naoX, linhaY + LINE_H - 1, naoW, 1);
    }

    registers.presentA();
  },

  hold(): number | null {
    // O corredor congela até a escolha, e a consequência dura o mesmo tanto
    // nos dois casos. É a simetria que diz que aquilo foi de propósito.
    return Knock.resolved(jogo) ? null : 0.48;
  },
};

export default S13;
