/**
 * Gera public/og.png e public/favicon.png — DIRECAO.md §28.
 *
 * A imagem de preview precisa ser gerada pelo próprio projeto: um frame do
 * Registro A, exportado do canvas, nunca arte de terceiros. Este script
 * importa os mesmos módulos que a obra usa em execução — a mesma paleta, a
 * mesma fonte bitmap, o mesmo ruído — e desenha o quadro da S00.
 *
 * Não há canvas no Node, então o contexto é um remendo de duas propriedades:
 * `fillStyle` e `fillRect`. É tudo que o Registro A usa, por definição.
 *
 * O PNG é escrito à mão com o zlib do próprio Node. Zero dependência.
 *
 *   node scripts/generate-og.mjs
 */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fbm } from '../src/visual/grain.ts';
import { P_TITLE } from '../src/visual/palettes.ts';
import { drawText, LINE_H } from '../src/visual/bitfont.ts';
import { BAT_FRAMES } from '../src/visual/sprites.ts';

const W = 320;
const H = 180;
/** Fator inteiro, como o blit da obra. 320×180 × 4 = 1280×720. */
const SCALE = 4;

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '..', 'public');

/* ---------- o contexto mínimo ---------- */

function parse(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Um contexto de duas propriedades. É tudo que o Registro A usa. */
function surface(w, h) {
  const pixels = new Uint8Array(w * h * 3);
  return {
    w,
    h,
    pixels,
    fillStyle: '#000000',
    fillRect(x, y, rw, rh) {
      const [r, g, b] = parse(this.fillStyle);
      const x0 = Math.max(0, Math.round(x));
      const y0 = Math.max(0, Math.round(y));
      const x1 = Math.min(w, Math.round(x + rw));
      const y1 = Math.min(h, Math.round(y + rh));
      for (let py = y0; py < y1; py++) {
        for (let px = x0; px < x1; px++) {
          const i = (py * w + px) * 3;
          pixels[i] = r;
          pixels[i + 1] = g;
          pixels[i + 2] = b;
        }
      }
    },
  };
}

const ctx = surface(W, H);

/* ---------- o quadro da S00 ---------- */

const c = P_TITLE.colors;

ctx.fillStyle = c.void;
ctx.fillRect(0, 0, W, H);

// A mesma sugestão de caverna da cena, com a mesma função de ruído.
ctx.fillStyle = c.caveDeep;
for (let x = 0; x < W; x++) {
  const top = 26 + (fbm(x * 0.014, 0.5, 3) + 1) * 14;
  ctx.fillRect(x, 0, 1, Math.round(top));
  const bottom = H - 22 - (fbm(x * 0.011, 8.2, 3) + 1) * 12;
  ctx.fillRect(x, Math.round(bottom), 1, H - Math.round(bottom));
}
ctx.fillStyle = c.caveEdge;
for (let x = 0; x < W; x++) {
  const top = 26 + (fbm(x * 0.014, 0.5, 3) + 1) * 14;
  ctx.fillRect(x, Math.round(top), 1, 1);
}

// A gota, parada no meio da queda.
ctx.fillStyle = c.cyanDim;
ctx.fillRect(W - 18, 128, 1, 2);

const cx = W / 2;
drawText(ctx, 'BATMAN', cx, 68, c.cyan, { align: 'center', spacing: 3 });
drawText(ctx, 'E A TORMENTA OBSCURA DO CAVALEIRO', cx, 68 + LINE_H + 4, c.cyan, {
  align: 'center',
  spacing: 1,
});
drawText(ctx, 'uma obra de Matheus Henrique Bozio', cx, 68 + LINE_H * 2 + 12, c.cyanDim, {
  align: 'center',
  spacing: 1,
});

/* ---------- blit em escala inteira, sem suavização ---------- */

/** Blit em fator inteiro, sem suavização — o mesmo que a obra faz na tela. */
function upscale(src, scale) {
  const ow = src.w * scale;
  const oh = src.h * scale;
  const big = new Uint8Array(ow * oh * 3);
  for (let y = 0; y < oh; y++) {
    const sy = (y / scale) | 0;
    for (let x = 0; x < ow; x++) {
      const sx = (x / scale) | 0;
      const si = (sy * src.w + sx) * 3;
      const di = (y * ow + x) * 3;
      big[di] = src.pixels[si];
      big[di + 1] = src.pixels[si + 1];
      big[di + 2] = src.pixels[si + 2];
    }
  }
  return { w: ow, h: oh, pixels: big };
}

/* ---------- PNG ---------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c2 = n;
    for (let k = 0; k < 8; k++) c2 = c2 & 1 ? 0xedb88320 ^ (c2 >>> 1) : c2 >>> 1;
    t[n] = c2 >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c2 = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c2 = CRC_TABLE[(c2 ^ buf[i]) & 0xff] ^ (c2 >>> 8);
  return (c2 ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(img) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0);
  ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; // profundidade
  ihdr[9] = 2; // truecolor RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Cada linha começa com o byte de filtro 0: sem filtro.
  const stride = img.w * 3;
  const raw = Buffer.alloc(img.h * (1 + stride));
  for (let y = 0; y < img.h; y++) {
    const o = y * (1 + stride);
    raw[o] = 0;
    Buffer.from(img.pixels.buffer, img.pixels.byteOffset + y * stride, stride).copy(raw, o + 1);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(pub, { recursive: true });

const ogPng = encodePng(upscale(ctx, SCALE));
writeFileSync(join(pub, 'og.png'), ogPng);
console.log(`og.png gerado — ${W * SCALE}x${H * SCALE}, ${(ogPng.length / 1024).toFixed(1)} kB`);

/* ---------- favicon: o mesmo morcego do gate, em 32x32 ---------- */

const F = 16;
const fav = surface(F, F);
fav.fillStyle = c.void;
fav.fillRect(0, 0, F, F);
const bat = BAT_FRAMES[0];
const bx = Math.round((F - bat.w) / 2);
const by = Math.round((F - bat.h) / 2);
for (let row = 0; row < bat.h; row++) {
  for (let col = 0; col < bat.w; col++) {
    if (bat.rows[row][col] === '.') continue;
    fav.fillStyle = c.cyan;
    fav.fillRect(bx + col, by + row, 1, 1);
  }
}
const favPng = encodePng(upscale(fav, 2));
writeFileSync(join(pub, 'favicon.png'), favPng);
console.log(`favicon.png gerado — ${F * 2}x${F * 2}, ${(favPng.length / 1024).toFixed(1)} kB`);
