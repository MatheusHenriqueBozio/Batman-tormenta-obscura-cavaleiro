/**
 * Os dois registros e o limiar — DIRECAO.md §5.
 *
 * REGISTRO A — MUNDO. O espaço é quantizado: grid rígido, posição inteira,
 * cor livre. 320×180 internos, blit em fator de escala inteiro, sem suavização.
 *
 * REGISTRO B — MENTE. O inverso exato: o espaço é livre e contínuo, e a cor é
 * que está quantizada. Duas ou três cores, massa e silhueta, grão permanente.
 *
 * REGISTRO C — LIMIAR. A passagem entre os dois, aqui numa função única e
 * parametrizada. Ela é usada seis vezes na obra e precisa ser sempre a mesma.
 */

import { applyGrain } from './grain';
import { collapse, type Palette } from './palettes';

/** Resolução interna do Registro A. Fixa. */
export const A_W = 320;
export const A_H = 180;

/** Fator de escala em que o pixel ainda é pixel. O limiar parte daqui. */
export const BASE_SCALE = 6;
/** Fator em que o pixel já virou mancha. */
export const DILATED_SCALE = 40;

export interface ThresholdState {
  /** 0 = mundo, 1 = mente. */
  t: number;
  /** Fator de escala do blit. Sobe de BASE_SCALE até DILATED_SCALE. */
  blitScale: number;
  /** Quanto a paleta já colapsou de 16 cores para 2. */
  paletteCollapse: number;
  /** Opacidade do grão. Entra só no fim. */
  grain: number;
  /** Deslocamento entre camadas, em px. Começa só no fim. */
  misregister: number;
}

/**
 * O limiar, parametrizado. `t` vem do scroll, de 0 a 1.
 *
 * O pixel dilata primeiro e a paleta colapsa junto. O grão e o desalinhamento
 * entram só no terço final — é o que faz a passagem parecer um evento
 * narrativo e não uma transição técnica.
 */
export function threshold(t: number): ThresholdState {
  const k = Math.max(0, Math.min(1, t));
  const late = Math.max(0, (k - 0.65) / 0.35);
  return {
    t: k,
    blitScale: BASE_SCALE + (DILATED_SCALE - BASE_SCALE) * (k * k),
    paletteCollapse: k,
    grain: late * 0.06,
    misregister: late * 2,
  };
}

/** A paleta da cena no ponto `t` do limiar. Em t=0 ela é ela mesma. */
export function thresholdPalette(p: Palette, t: number): string[] {
  return collapse(p, t);
}

export interface Viewport {
  /** Tamanho em pixels de CSS. */
  w: number;
  h: number;
  dpr: number;
  /** Maior fator inteiro em que 320×180 ainda cabe. */
  scale: number;
}

/**
 * Dono do canvas único da obra. Um `<canvas>` em tela cheia, um offscreen de
 * 320×180 para o Registro A, e um canvas minúsculo reaproveitado pelo limiar.
 */
export class Registers {
  readonly main: HTMLCanvasElement;
  readonly mainCtx: CanvasRenderingContext2D;
  readonly a: HTMLCanvasElement;
  readonly aCtx: CanvasRenderingContext2D;
  private readonly tiny: HTMLCanvasElement;
  private readonly tinyCtx: CanvasRenderingContext2D;
  viewport: Viewport = { w: 0, h: 0, dpr: 1, scale: BASE_SCALE };

  constructor(main: HTMLCanvasElement) {
    this.main = main;
    const mc = main.getContext('2d', { alpha: false });
    if (!mc) throw new Error('Canvas 2D indisponível.');
    this.mainCtx = mc;

    this.a = document.createElement('canvas');
    this.a.width = A_W;
    this.a.height = A_H;
    const ac = this.a.getContext('2d', { alpha: false });
    if (!ac) throw new Error('Canvas 2D indisponível.');
    this.aCtx = ac;

    this.tiny = document.createElement('canvas');
    const tc = this.tiny.getContext('2d', { alpha: false });
    if (!tc) throw new Error('Canvas 2D indisponível.');
    this.tinyCtx = tc;
  }

  resize(w: number, h: number, dpr: number): void {
    const scale = Math.max(1, Math.floor(Math.min(w / A_W, h / A_H)));
    this.viewport = { w, h, dpr, scale };
    this.main.width = Math.round(w * dpr);
    this.main.height = Math.round(h * dpr);
    this.main.style.width = `${w}px`;
    this.main.style.height = `${h}px`;
    this.mainCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.mainCtx.imageSmoothingEnabled = false;
  }

  /** Limpa o viewport inteiro, inclusive as bordas fora do blit. */
  clear(color: string): void {
    const { w, h } = this.viewport;
    this.mainCtx.setTransform(this.viewport.dpr, 0, 0, this.viewport.dpr, 0, 0);
    this.mainCtx.fillStyle = color;
    this.mainCtx.fillRect(0, 0, w, h);
  }

  /**
   * Abre o Registro A: devolve o contexto interno de 320×180, já limpo.
   * A cena desenha aqui, em coordenadas inteiras.
   */
  beginA(background: string): CanvasRenderingContext2D {
    this.aCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.aCtx.imageSmoothingEnabled = false;
    this.aCtx.fillStyle = background;
    this.aCtx.fillRect(0, 0, A_W, A_H);
    return this.aCtx;
  }

  /**
   * Fecha o Registro A e blita para o viewport.
   *
   * Sem limiar, o blit usa o maior fator inteiro que cabe — o pixel é pixel.
   * Com limiar, o quadro é primeiro reduzido para uma resolução menor e só
   * então ampliado: é assim que o pixel dilata até virar mancha, sem que nada
   * na cena precise saber que isso está acontecendo.
   */
  presentA(state?: ThresholdState): void {
    const { w, h, scale } = this.viewport;
    const ctx = this.mainCtx;
    ctx.imageSmoothingEnabled = false;

    let source: HTMLCanvasElement = this.a;
    let sw = A_W;
    let sh = A_H;

    if (state && state.t > 0) {
      const factor = Math.max(1, state.blitScale / BASE_SCALE);
      sw = Math.max(2, Math.round(A_W / factor));
      sh = Math.max(2, Math.round(A_H / factor));
      if (this.tiny.width !== sw || this.tiny.height !== sh) {
        this.tiny.width = sw;
        this.tiny.height = sh;
      }
      this.tinyCtx.imageSmoothingEnabled = false;
      this.tinyCtx.drawImage(this.a, 0, 0, sw, sh);
      source = this.tiny;
    }

    // Sem limiar o destino é o retângulo inteiro em escala inteira, centrado.
    // Com limiar ele passa a cobrir o viewport: a mancha não tem grid a
    // respeitar, e a borda preta desapareceria de qualquer jeito.
    let dw: number;
    let dh: number;
    if (state && state.t > 0.001) {
      const intW = A_W * scale;
      const intH = A_H * scale;
      dw = intW + (w - intW) * state.t;
      dh = intH + (h - intH) * state.t;
    } else {
      dw = A_W * scale;
      dh = A_H * scale;
    }
    const dx = Math.round((w - dw) / 2);
    const dy = Math.round((h - dh) / 2);
    ctx.drawImage(source, 0, 0, sw, sh, dx, dy, Math.round(dw), Math.round(dh));

    if (state && state.misregister > 0) {
      ctx.save();
      ctx.globalAlpha = 0.35 * state.t;
      ctx.drawImage(
        source,
        0,
        0,
        sw,
        sh,
        dx + state.misregister,
        dy - state.misregister * 0.5,
        Math.round(dw),
        Math.round(dh),
      );
      ctx.restore();
    }
    if (state && state.grain > 0) applyGrain(ctx, w, h, state.grain);
  }

  /**
   * Abre o Registro B: o contexto do viewport, em resolução nativa.
   * Sem grid, sem quantização espacial, sem sprite.
   */
  beginB(background: string): CanvasRenderingContext2D {
    this.clear(background);
    const ctx = this.mainCtx;
    ctx.imageSmoothingEnabled = true;
    return ctx;
  }

  /** Fecha o Registro B aplicando o grão permanente. */
  endB(amount = 0.06): void {
    applyGrain(this.mainCtx, this.viewport.w, this.viewport.h, amount);
  }
}
