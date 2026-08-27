/**
 * O corredor da casa abandonada — usado por S11, S12, S13 e, na Fase 5, S20.
 *
 * É uma composição horizontal: mais larga que a tela, atravessada de lado
 * enquanto o leitor rola para baixo. Janelas passando, madeira apodrecida, luz
 * entrando em fatias.
 *
 * A iluminação é um parâmetro, e não uma propriedade do desenho. É isso que
 * permite a S12 amarrar a luz inteira ao scroll e apagar o corredor em alguns
 * quadros sem que nada aqui precise saber disso.
 */

import { fbm, mulberry32 } from '../visual/grain';
import type { Palette } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import { CORINGA, drawSprite } from '../visual/sprites';

/** Largura do corredor em pixels internos. Quatro telas de travessia. */
export const CORRIDOR_W = A_W * 4;

/** Teto e chão, em pixels internos. */
export const CEILING = 20;
export const FLOOR = 150;

/** Onde o Coringa está, no fim do corredor. */
export const JOKER_X = CORRIDOR_W - 40;
export const JOKER_Y = FLOOR - 24;

interface Window_ {
  readonly x: number;
  readonly w: number;
  readonly top: number;
  readonly h: number;
  /** Ripas quebradas atravessando o vão. */
  readonly slats: number;
}

interface Board {
  readonly x: number;
  readonly w: number;
  readonly tone: number;
}

export interface CorridorWorld {
  readonly windows: readonly Window_[];
  readonly boards: readonly Board[];
  readonly debris: readonly { x: number; w: number; h: number }[];
}

export function buildCorridor(): CorridorWorld {
  const rand = mulberry32(0x0c07);

  const windows: Window_[] = [];
  for (let x = 60; x < CORRIDOR_W - 80; x += 78 + Math.floor(rand() * 22)) {
    windows.push({
      x,
      w: 24 + Math.floor(rand() * 10),
      top: 38 + Math.floor(rand() * 8),
      h: 44 + Math.floor(rand() * 12),
      slats: Math.floor(rand() * 3),
    });
  }

  // Tábuas da parede. A variação de tom é o apodrecimento.
  const boards: Board[] = [];
  for (let x = 0; x < CORRIDOR_W; ) {
    const w = 5 + Math.floor(rand() * 7);
    boards.push({ x, w, tone: rand() });
    x += w;
  }

  const debris: { x: number; w: number; h: number }[] = [];
  for (let i = 0; i < 46; i++) {
    debris.push({
      x: Math.floor(rand() * CORRIDOR_W),
      w: 2 + Math.floor(rand() * 9),
      h: 1 + Math.floor(rand() * 3),
    });
  }

  return { windows, boards, debris };
}

/** Posição da câmera dentro do corredor, de 0 a 1. */
export function cameraX(t: number): number {
  return t * (CORRIDOR_W - A_W);
}

export interface CorridorOptions {
  /** 0 = começo do corredor, 1 = fim. */
  camera: number;
  /**
   * Quanto do corredor está iluminado, de 0 a 1.
   *
   * Em 0 sobra só o vão das janelas: a casa não tem luz própria, e o que
   * entra vem de fora. É por isso que apagar não deixa a tela preta chapada.
   */
  light: number;
  /** Escala inteira do sprite do Coringa. Ele só cresce na S12. */
  jokerScale?: number;
  /** Posição do Coringa. Ver `jokerAnchor` para o que este número significa. */
  jokerX?: number;
  /**
   * Onde o número de `jokerX` mora.
   *
   * 'world' prende o Coringa a um ponto do corredor — é o que a S12 usa, em
   * que ele salta de posição a cada volta da luz.
   *
   * 'screen' o prende à tela. Parece um truque e não é: num corredor visto de
   * lado, quem está num ponto fixo do mundo entra pela direita e sai pela
   * esquerda conforme a câmera anda. Só que na S11 ele não passa — ele está
   * sempre no fim do corredor, e o fim do corredor é o lugar aonde não se
   * chega. Prendê-lo à tela é a tradução exata disso: a casa inteira desfila
   * e a distância entre os dois não diminui um pixel.
   */
  jokerAnchor?: 'world' | 'screen';
  /** Desenha o Coringa. */
  joker?: boolean;
  /**
   * Apaga o corredor por inteiro.
   *
   * Diferente de `light: 0`, que ainda deixa o vão das janelas: aqui não
   * sobra nada. É o que a S12 usa nos quadros completamente pretos.
   */
  blackout?: boolean;
}

/** Mistura duas cores da paleta conforme a luz. Sem degradê: passo, não rampa. */
function tone(p: Palette, dark: string, lit: string, light: number, at: number): string {
  return light >= at ? p.colors[lit] : p.colors[dark];
}

export function drawCorridor(
  ctx: CanvasRenderingContext2D,
  world: CorridorWorld,
  p: Palette,
  opts: CorridorOptions,
): void {
  const {
    camera,
    light,
    jokerScale = 1,
    jokerX = JOKER_X,
    jokerAnchor = 'world',
    joker = true,
    blackout = false,
  } = opts;
  const cam = cameraX(camera);
  const c = p.colors;

  ctx.fillStyle = c.void;
  ctx.fillRect(0, 0, A_W, A_H);
  if (blackout) return;

  // Teto.
  ctx.fillStyle = tone(p, 'greenDeep', 'greenDark', light, 0.35);
  ctx.fillRect(0, 0, A_W, CEILING);

  // Parede, tábua por tábua. O tom de cada uma é fixo — a madeira não muda,
  // só a luz que cai nela.
  for (const b of world.boards) {
    const x = Math.round(b.x - cam);
    if (x + b.w < 0 || x > A_W) continue;
    const claro = b.tone > 0.62;
    ctx.fillStyle = claro
      ? tone(p, 'greenDark', 'greenMid', light, 0.3)
      : tone(p, 'greenDeep', 'greenDark', light, 0.3);
    ctx.fillRect(x, CEILING, b.w, FLOOR - CEILING);
    // A junta entre tábuas, sempre visível: é o que dá o ritmo do corredor.
    ctx.fillStyle = c.void;
    ctx.fillRect(x, CEILING, 1, FLOOR - CEILING);
  }

  // Janelas e as fatias de luz que elas jogam no chão.
  for (const w of world.windows) {
    const x = Math.round(w.x - cam);
    if (x + w.w < -60 || x > A_W + 20) continue;

    ctx.fillStyle = light >= 0.3 ? c.purpleLit : c.purpleDark;
    ctx.fillRect(x, w.top, w.w, w.h);
    ctx.fillStyle = light >= 0.3 ? c.purpleGlow : c.purpleMid;
    ctx.fillRect(x + 1, w.top + 1, w.w - 2, w.h - 2);

    // Ripas quebradas atravessando o vão.
    ctx.fillStyle = c.greenDeep;
    for (let i = 0; i < w.slats; i++) {
      ctx.fillRect(x, w.top + 8 + i * 14, w.w, 2);
    }

    // A fatia: um paralelogramo do peitoril até o chão, inclinado.
    const desce = FLOOR - (w.top + w.h);
    ctx.fillStyle = light >= 0.3 ? c.purpleMid : c.purpleDeep;
    for (let k = 0; k < desce; k++) {
      const off = Math.round(k * 0.55);
      ctx.fillRect(x + off, w.top + w.h + k, w.w, 1);
    }
  }

  // Chão.
  ctx.fillStyle = tone(p, 'greenDeep', 'greenDark', light, 0.3);
  ctx.fillRect(0, FLOOR, A_W, A_H - FLOOR);
  ctx.fillStyle = tone(p, 'void', 'greenDeep', light, 0.3);
  ctx.fillRect(0, FLOOR, A_W, 1);

  // Entulho, e as tábuas do assoalho.
  ctx.fillStyle = tone(p, 'greenDeep', 'greenMid', light, 0.45);
  for (const d of world.debris) {
    const x = Math.round(d.x - cam);
    if (x + d.w < 0 || x > A_W) continue;
    const y = FLOOR + 4 + Math.round((fbm(d.x * 0.11, 7.7, 2) + 1) * 9);
    if (y < A_H) ctx.fillRect(x, y, d.w, d.h);
  }

  if (joker) {
    const jx = Math.round(jokerAnchor === 'screen' ? jokerX : jokerX - cam);
    if (jx > -30 * jokerScale && jx < A_W + 30) {
      // Escala inteira, sempre: o Registro A não admite meio pixel.
      const s = Math.max(1, Math.round(jokerScale));
      if (s === 1) {
        drawSprite(ctx, CORINGA, jx, FLOOR - 24, p);
      } else {
        // Ampliação por repetição de pixel, para o grid continuar de pé.
        for (let row = 0; row < CORINGA.h; row++) {
          const line = CORINGA.rows[row];
          for (let col = 0; col < CORINGA.w; col++) {
            const ch = line[col];
            if (ch === '.') continue;
            const key = CORINGA.legend[ch] ?? ch;
            const color = c[key];
            if (!color) continue;
            ctx.fillStyle = color;
            ctx.fillRect(jx + col * s, FLOOR - CORINGA.h * s + row * s, s, s);
          }
        }
      }
    }
  }
}
