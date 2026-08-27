/**
 * A Batcaverna como composição — usada por S01, S02 e, na Fase 2, S04.
 *
 * A caverna é mais alta que a tela: 320px de largura por várias alturas de
 * viewport. A câmera desce dentro dela conforme o scroll, como quem desce uma
 * escada. Nada aqui depende de relógio — tudo é função do scroll (§13).
 *
 * A geometria é gerada uma única vez, com semente fixa, e reaproveitada. Toda
 * a arte nasce em código: rocha por perfil de ruído, monitor por retângulo,
 * gota por pixel. Nenhuma imagem, em nenhuma forma.
 */

import { fbm, mulberry32 } from '../visual/grain';
import { A_H, A_W } from '../visual/registers';
import type { Palette } from '../visual/palettes';

/** Altura da caverna em pixels internos. Cinco telas de queda. */
export const CAVE_H = A_H * 5;

/** Onde o chão da caverna está, no mundo. */
export const FLOOR_Y = CAVE_H - 34;
/** Altura em que Bruce pisa. */
export const STAND_Y = FLOOR_Y - 24;

interface EdgeProfile {
  /** Deslocamento da parede a cada linha do mundo. */
  readonly left: Float32Array;
  readonly right: Float32Array;
  readonly colorKey: string;
}

interface Stalactite {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly layer: number;
}

export interface Monitor {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Duração do ciclo desta tela, em unidades de progresso. Irregular. */
  readonly period: number;
  readonly phase: number;
  /** Fração do ciclo em que a tela fica acesa. */
  readonly duty: number;
}

export interface Drop {
  readonly x: number;
  readonly top: number;
  readonly fall: number;
  readonly phase: number;
  readonly speed: number;
}

export interface CaveWorld {
  readonly layers: readonly EdgeProfile[];
  readonly stalactites: readonly Stalactite[];
  readonly monitors: readonly Monitor[];
  readonly drops: readonly Drop[];
  /** A tela contaminada: a única que passa a repetir o mesmo quadro. */
  readonly contaminated: number;
  readonly benchY: number;
}

/** Parallax por camada. A da frente corre mais que a do fundo. */
const PARALLAX = [0.62, 0.86, 1.14];

function buildEdges(seed: number, colorKey: string, amp: number, inset: number): EdgeProfile {
  const left = new Float32Array(CAVE_H);
  const right = new Float32Array(CAVE_H);
  for (let y = 0; y < CAVE_H; y++) {
    // Duas frequências: a lenta dá a forma da caverna, a rápida quebra a
    // silhueta para que a parede leia como rocha e nunca como laje.
    const lSlow = (fbm(seed * 0.37, y * 0.021, 3) + 1) * 0.5;
    const lFast = (fbm(seed * 1.9 + 11, y * 0.11, 2) + 1) * 0.5;
    const rSlow = (fbm(seed * 0.71 + 40, y * 0.019, 3) + 1) * 0.5;
    const rFast = (fbm(seed * 2.3 + 63, y * 0.13, 2) + 1) * 0.5;
    left[y] = inset + lSlow * amp + lFast * amp * 0.22;
    right[y] = A_W - inset - rSlow * amp - rFast * amp * 0.22;
  }
  return { left, right, colorKey };
}

export function buildCave(): CaveWorld {
  const rand = mulberry32(0x0b47);

  const layers: EdgeProfile[] = [
    buildEdges(1, 'rockDeep', 30, 0),
    buildEdges(2, 'rockDark', 46, 8),
    buildEdges(3, 'rockMid', 30, 26),
  ];

  // Estalactites: só silhueta, nunca desenho. Descem do teto e das saliências.
  const stalactites: Stalactite[] = [];
  for (let i = 0; i < 46; i++) {
    const layer = i % 3;
    const w = 3 + Math.floor(rand() * 9);
    stalactites.push({
      x: Math.floor(rand() * A_W),
      y: Math.floor(rand() * (CAVE_H - 220)),
      w,
      h: w * (2 + rand() * 3),
      layer,
    });
  }

  // A parede de monitores, no fundo da caverna. Bruce está diante dela.
  const monitors: Monitor[] = [];
  const cols = 9;
  const rows = 3;
  const mw = 18;
  const mh = 12;
  const gap = 3;
  const wallW = cols * mw + (cols - 1) * gap;
  const x0 = Math.round((A_W - wallW) / 2);
  // A parede vai da altura dos ombros de Bruce até os pés dele: ele fica
  // diante dela, e é a luz das telas que o recorta.
  const y0 = STAND_Y - 18;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      monitors.push({
        x: x0 + c * (mw + gap),
        y: y0 + r * (mh + gap),
        w: mw,
        h: mh,
        // Períodos irregulares e primos entre si: o ciclo nunca fecha igual.
        period: 0.035 + rand() * 0.075,
        phase: rand(),
        // A maioria fica acesa a maior parte do tempo: a parede precisa ser
        // um campo de luz contínuo, não um mosaico piscando.
        duty: 0.62 + rand() * 0.3,
      });
    }
  }

  const drops: Drop[] = [];
  for (let i = 0; i < 14; i++) {
    const top = Math.floor(rand() * (CAVE_H - 160));
    drops.push({
      x: Math.floor(rand() * A_W),
      top,
      fall: 40 + rand() * 120,
      phase: rand(),
      speed: 2.5 + rand() * 3.5,
    });
  }

  return {
    layers,
    stalactites,
    monitors,
    drops,
    // Uma só. Sem destaque, sem som, sem texto.
    contaminated: 9,
    benchY: FLOOR_Y - 12,
  };
}

/** Posição da câmera dentro da caverna, de 0 (teto) a 1 (chão). */
export function cameraY(t: number): number {
  return t * (CAVE_H - A_H);
}

function fillEdges(
  ctx: CanvasRenderingContext2D,
  edge: EdgeProfile,
  camY: number,
  parallax: number,
  color: string,
): void {
  ctx.fillStyle = color;
  for (let sy = 0; sy < A_H; sy++) {
    const wy = Math.round((sy + camY) * parallax);
    if (wy < 0 || wy >= CAVE_H) continue;
    const l = Math.round(edge.left[wy]);
    const r = Math.round(edge.right[wy]);
    if (l > 0) ctx.fillRect(0, sy, l, 1);
    if (r < A_W) ctx.fillRect(r, sy, A_W - r, 1);
  }
}

/**
 * Estado de uma tela num dado ponto do scroll.
 *
 * A contaminação (§S01) mora aqui: a partir de `contaminationAt`, uma única
 * tela passa a repetir exatamente o mesmo quadro a cada dois ciclos. Quem
 * repete é o índice, não o desenho — por isso não há como destacá-la.
 */
export function monitorLit(
  m: Monitor,
  index: number,
  t: number,
  world: CaveWorld,
  contaminationAt: number,
): boolean {
  let cycle = (t + m.phase) / m.period;
  if (index === world.contaminated && t >= contaminationAt) {
    cycle = Math.floor(cycle / 2) * 2;
  }
  return cycle - Math.floor(cycle) < m.duty;
}

export interface CaveDrawOptions {
  /** 0 = teto, 1 = chão. */
  camera: number;
  /** Progresso usado para os ciclos de tela e gota. Normalmente o da cena. */
  time: number;
  /** A partir de que ponto a tela contaminada começa a repetir. */
  contaminationAt?: number;
  /** Escurece a parede de monitores, para cenas que precisam de menos luz. */
  monitorGain?: number;
}

export function drawCave(
  ctx: CanvasRenderingContext2D,
  world: CaveWorld,
  p: Palette,
  opts: CaveDrawOptions,
): void {
  const { camera, time, contaminationAt = 2, monitorGain = 1 } = opts;
  const camY = cameraY(camera);
  const c = p.colors;

  // Três camadas de parallax, no máximo (§5).
  for (let i = 0; i < world.layers.length; i++) {
    fillEdges(ctx, world.layers[i], camY, PARALLAX[i], c[world.layers[i].colorKey]);
  }

  for (const s of world.stalactites) {
    const sy = Math.round(s.y * PARALLAX[s.layer] - camY);
    if (sy + s.h < 0 || sy > A_H) continue;
    ctx.fillStyle = s.layer === 2 ? c.rockMid : s.layer === 1 ? c.rockDark : c.rockDeep;
    // Triângulo por linhas: a ponta afina até um pixel.
    const steps = Math.round(s.h);
    for (let k = 0; k < steps; k++) {
      const w = Math.max(1, Math.round(s.w * (1 - k / steps)));
      ctx.fillRect(Math.round(s.x - w / 2), sy + k, w, 1);
    }
  }

  // O derrame de luz na rocha em volta da parede. Sem isso a parede flutua,
  // e a caverna deixa de ter um lugar onde ele fica.
  if (world.monitors.length > 0) {
    const first = world.monitors[0];
    const last = world.monitors[world.monitors.length - 1];
    const gx = first.x - 7;
    const gy = Math.round(first.y - 6 - camY);
    const gw = last.x + last.w + 7 - gx;
    const gh = last.y + last.h + 6 - first.y + 12;
    if (gy + gh > 0 && gy < A_H) {
      // Sem contorno: um contorno viraria moldura, e moldura vira card.
      // A luz apenas encontra a rocha, com a borda quebrada pelo ruído.
      ctx.fillStyle = c.rockMid;
      for (let y = 0; y < gh; y++) {
        const bite = Math.round((fbm(y * 0.09, 3.1, 2) + 1) * 2.5);
        ctx.fillRect(gx + bite, gy + y, gw - bite * 2, 1);
      }
    }
  }

  // A parede de monitores. Luz fria, o único lugar da caverna que não é rocha.
  for (let i = 0; i < world.monitors.length; i++) {
    const m = world.monitors[i];
    const sy = Math.round(m.y - camY);
    if (sy + m.h < 0 || sy > A_H) continue;
    const lit = monitorLit(m, i, time, world, contaminationAt);
    ctx.fillStyle = c.screenOff;
    ctx.fillRect(m.x, sy, m.w, m.h);
    if (lit) {
      // Corpo apagado e uma varredura acesa. A tela é fonte de luz, não
      // superfície de interface — nada aqui pode virar card.
      ctx.fillStyle = c.screenDim;
      ctx.fillRect(m.x + 1, sy + 1, m.w - 2, m.h - 2);
      ctx.fillStyle = monitorGain >= 1 ? c.screenOn : c.screenDim;
      ctx.fillRect(m.x + 2, sy + 3, m.w - 4, 1);
      ctx.fillRect(m.x + 2, sy + m.h - 4, Math.round((m.w - 4) * 0.55), 1);
    } else {
      ctx.fillStyle = c.screenOff;
      ctx.fillRect(m.x + 1, sy + m.h - 2, m.w - 2, 1);
    }
  }

  // Chão e poça. A água só devolve a luz das telas.
  const floorSy = Math.round(FLOOR_Y - camY);
  if (floorSy < A_H) {
    // A borda do chão é irregular: rocha não tem régua.
    ctx.fillStyle = c.rockDark;
    for (let x = 0; x < A_W; x++) {
      const lip = Math.round((fbm(x * 0.06, 21.4, 3) + 1) * 2);
      ctx.fillRect(x, floorSy + lip, 1, A_H - floorSy - lip);
    }
    ctx.fillStyle = c.waterDark;
    ctx.fillRect(0, floorSy + 7, A_W, A_H - floorSy - 7);
    ctx.fillStyle = c.waterLit;
    for (let x = 0; x < A_W; x += 3) {
      const n = fbm(x * 0.05, time * 2, 2);
      if (n > 0.42) ctx.fillRect(x, floorSy + 9 + Math.round(n * 3), 2, 1);
    }
  }

  // Gotas: a cadência é do scroll, não do relógio. Parar de rolar para de pingar.
  ctx.fillStyle = c.drop;
  for (const d of world.drops) {
    const phase = (time * d.speed + d.phase) % 1;
    const wy = d.top + phase * d.fall;
    const sy = Math.round(wy - camY);
    if (sy < -2 || sy > A_H) continue;
    ctx.fillRect(d.x, sy, 1, phase > 0.25 ? 2 : 1);
  }
}
