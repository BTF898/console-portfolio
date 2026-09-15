/* ==========================================================================
   generate-og.mjs — writes a placeholder public/og.png (1200×630) with no
   dependencies: raw RGBA scanlines, zlib-deflated, wrapped in PNG chunks.

   It's a branded gradient — good enough for social previews out of the box.
   Replace it with a designed 1200×630 image whenever you like (this is a
   one-time asset, not part of the build). Run: `npm run og`
   ========================================================================== */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 630;

/* Palette — matches the 'forest' dark preset (edit to match your preset). */
const TOP = [0x1a, 0x2b, 0x21];
const BOTTOM = [0x0c, 0x13, 0x10];
const GRID = [0xa3, 0xdc, 0xb4];
const ACCENT = [0xa3, 0xb9, 0xff];

/* --- CRC32 --- */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/* --- pixels --- */
const raw = Buffer.alloc(H * (1 + W * 3));

const lerp = (a, b, t) => Math.round(a + (b - a) * t);

for (let y = 0; y < H; y++) {
  const rowStart = y * (1 + W * 3);
  raw[rowStart] = 0; // filter: none
  const t = y / H;

  for (let x = 0; x < W; x++) {
    const i = rowStart + 1 + x * 3;

    let r = lerp(TOP[0], BOTTOM[0], t);
    let g = lerp(TOP[1], BOTTOM[1], t);
    let b = lerp(TOP[2], BOTTOM[2], t);

    /* blueprint grid: 96px coarse + 24px fine */
    const onGrid = x % 96 === 0 || y % 96 === 0;
    const onFine = x % 24 === 0 || y % 24 === 0;
    const mix = onGrid ? 0.14 : onFine ? 0.05 : 0;
    r = lerp(r, GRID[0], mix);
    g = lerp(g, GRID[1], mix);
    b = lerp(b, GRID[2], mix);

    /* diagonal accent glow from top-left */
    const d = 1 - Math.min(1, (x / W + y / H) / 2) ** 2;
    r = lerp(r, ACCENT[0], d * 0.1);
    g = lerp(g, ACCENT[1], d * 0.1);
    b = lerp(b, ACCENT[2], d * 0.12);

    raw[i] = r;
    raw[i + 1] = g;
    raw[i + 2] = b;
  }
}

/* --- assemble PNG --- */
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: truecolor

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../public/og.png');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`og.png written → ${join(relative(), 'public/og.png')} (${(png.length / 1024).toFixed(0)} KB)`);

function relative() {
  return '.';
}
