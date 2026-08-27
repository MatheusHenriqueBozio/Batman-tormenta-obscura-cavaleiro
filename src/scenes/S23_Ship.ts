/**
 * S23 — O NAVIO · Registro B · azul-claro + branco + dourado · MICROGAME 5
 *
 * **Esta é a razão de existir todo o sistema de registros.** É a primeira vez
 * na obra que o vocabulário visual da mente — silhueta, escala livre, cor
 * chapada, grão — não é opressivo. O mesmo idioma que significou aprisionamento,
 * repetição, distorção e peso passa a significar espaço, altura, silêncio e
 * leveza. Sem uma palavra de explicação.
 *
 * É também a única cena com movimento ascendente contínuo. Tudo antes desceu,
 * travou, repetiu ou andou para o lado.
 *
 * O dourado aparece aqui pela segunda e última vez na obra.
 *
 * A cena não segura ninguém: sem quantidade certa, sem contador, sem falha
 * possível, sem fim obrigatório. Parar é uma das respostas.
 */

import { applyGrain, fbm } from '../visual/grain';
import { P_SHIP } from '../visual/palettes';
import * as Ship from '../games/Ship';
import { clamp } from '../engine/math';
import type { Scene, SceneFrame } from '../engine/scene';

const jogo = Ship.newShip();

/** O canvas, guardado para devolver o cursor ao sair da cena. */
let palco: HTMLCanvasElement | null = null;

/** Nuvens: massas chapadas, passando para baixo enquanto ele sobe. */
const NUVENS = Array.from({ length: 14 }, (_, i) => ({
  u: (i * 0.137) % 1,
  y: i * 190,
  escala: 0.5 + ((i * 37) % 10) / 10,
}));

export const S23: Scene = {
  id: 'S23',
  register: 'B',
  viewports: 4,
  palette: P_SHIP,
  ambience: ['vento'],

  draw({ progress, registers, input, dt }: SceneFrame): void {
    const t = clamp(progress);
    const c = P_SHIP.colors;
    const ctx = registers.beginB(c.sky);
    const { w, h } = registers.viewport;

    /* ---- o navio ---- */

    // Ele fica um pouco abaixo do centro e sobe muito devagar. O que sobe de
    // verdade é o mundo passando por baixo dele.
    const cascoW = w * 0.44;
    const cascoH = h * 0.1;
    const cx = w * 0.5;
    // A subida do scroll e a subida ganha ao soltar peso somam.
    const subiu = jogo.altura + t * h * 0.5;
    const conves = h * 0.72 - cascoH;

    /* ---- as nuvens, passando para baixo ---- */

    ctx.fillStyle = c.white;
    for (const n of NUVENS) {
      const y = ((n.y + subiu) % (h * 3.2)) - h * 0.6;
      const x = n.u * w * 1.3 - w * 0.15;
      const rw = w * 0.16 * n.escala;
      const rh = h * 0.03 * n.escala;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.ellipse(x, y, rw, rh, 0, 0, Math.PI * 2);
      ctx.ellipse(x + rw * 0.7, y + rh * 0.3, rw * 0.7, rh * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    /* ---- a carga, e onde ela está na tela ---- */

    const caixas: Array<{ carga: Ship.Carga; x: number; y: number; w: number; h: number }> = [];
    for (const carga of jogo.carga) {
      const bx = cx - cascoW / 2 + carga.u * cascoW - carga.w / 2;
      const by = conves - carga.h - carga.nivel * carga.h * 0.92 + carga.queda;
      caixas.push({ carga, x: bx, y: by, w: carga.w, h: carga.h });
    }

    Ship.update(jogo, input, dt, caixas);

    /* ---- o casco ---- */

    ctx.fillStyle = c.white;
    ctx.beginPath();
    ctx.moveTo(cx - cascoW / 2, conves);
    ctx.lineTo(cx + cascoW / 2, conves);
    ctx.lineTo(cx + cascoW * 0.38, conves + cascoH);
    ctx.lineTo(cx - cascoW * 0.38, conves + cascoH);
    ctx.closePath();
    ctx.fill();
    // O dourado: uma faixa, e nada mais. É a segunda das duas aparições da
    // cor na obra inteira, e ela precisa ser rara para significar.
    ctx.fillStyle = c.gold;
    ctx.fillRect(cx - cascoW / 2, conves - Math.max(2, h * 0.004), cascoW, Math.max(2, h * 0.004));

    /* ---- as caixas ---- */

    // Nada escrito nelas. São caixas.
    for (const b of caixas) {
      if (b.y > h + 80) continue;
      ctx.save();
      ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
      ctx.rotate(b.carga.gira + (b.carga.caindo ? b.carga.queda * 0.004 : 0));
      if (b.carga.caindo) ctx.translate((b.carga.queda / h) * b.carga.deriva, 0);
      ctx.fillStyle = c.white;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.fillStyle = c.sky;
      ctx.fillRect(-b.w / 2 + 3, -b.h / 2 + 3, b.w - 6, b.h - 6);
      ctx.fillStyle = c.white;
      ctx.fillRect(-b.w / 2 + 3, -2, b.w - 6, 4);
      ctx.restore();
    }

    /* ---- ele, no convés ---- */

    const alt = h * 0.07;
    ctx.fillStyle = c.white;
    ctx.beginPath();
    ctx.ellipse(cx + cascoW * 0.36, conves - alt * 0.8, alt * 0.2, alt * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx + cascoW * 0.36 - alt * 0.16, conves - alt * 0.6, alt * 0.32, alt * 0.6);

    // Sem dica escrita. O ponteiro muda de forma sobre uma caixa e isso basta.
    palco = registers.main;
    palco.style.cursor = Ship.sobreCaixa(input, caixas) ? 'pointer' : '';

    // Um fio de textura no céu, para o azul não ficar morto.
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = c.white;
    for (let i = 0; i < 40; i++) {
      const y = ((i * 97 + subiu * 0.4) % h) | 0;
      if (fbm(i * 0.4, 2.1, 2) > 0.1) ctx.fillRect(0, y, w, 1);
    }
    ctx.globalAlpha = 1;

    registers.endB(0.04);
    applyGrain(ctx, w, h, 0.015);
  },

  exit(): void {
    if (palco) palco.style.cursor = '';
  },
};

export default S23;
