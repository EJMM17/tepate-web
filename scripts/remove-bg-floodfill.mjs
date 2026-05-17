/**
 * Removes solid/gradient background from logo images.
 * Runs an independent flood fill from EACH corner using that corner's own color
 * as reference — handles logos with gradient or multi-tone backgrounds.
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARKS = path.join(__dirname, '../public/TEPATE_Marcas');

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

async function removeBg(inputPath, outputPath, tolerance = 40) {
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const buf = Buffer.from(data);

  // One independent BFS per corner — each uses its own corner's color
  const cornerPixels = [
    0,
    width - 1,
    (height - 1) * width,
    (height - 1) * width + (width - 1),
  ];

  const markedForRemoval = new Float32Array(width * height); // stores max alpha-reduction factor

  for (const startPx of cornerPixels) {
    const si = startPx * channels;
    if (buf[si + 3] < 10) continue; // transparent corner, skip

    const refR = buf[si], refG = buf[si + 1], refB = buf[si + 2];

    const visited = new Uint8Array(width * height);
    const queue = [startPx];
    visited[startPx] = 1;

    while (queue.length) {
      const px = queue.pop();
      const x = px % width, y = Math.floor(px / width);
      const idx = px * channels;
      const a = buf[idx + 3];
      if (a < 10) continue;

      const dist = colorDist(buf[idx], buf[idx+1], buf[idx+2], refR, refG, refB);
      if (dist > tolerance) continue;

      // Soft edge: pixels closer to the threshold fade out
      const factor = Math.max(0, 1 - dist / tolerance);
      if (factor > markedForRemoval[px]) markedForRemoval[px] = factor;

      // 4-directional neighbors
      if (x > 0         && !visited[px - 1])        { visited[px - 1] = 1;        queue.push(px - 1); }
      if (x < width - 1 && !visited[px + 1])        { visited[px + 1] = 1;        queue.push(px + 1); }
      if (y > 0         && !visited[px - width])     { visited[px - width] = 1;    queue.push(px - width); }
      if (y < height - 1&& !visited[px + width])     { visited[px + width] = 1;    queue.push(px + width); }
    }
  }

  // Apply removals
  let removed = 0;
  for (let px = 0; px < width * height; px++) {
    if (markedForRemoval[px] > 0) {
      buf[px * channels + 3] = Math.round(buf[px * channels + 3] * (1 - markedForRemoval[px]));
      removed++;
    }
  }

  if (removed === 0) return false;

  await sharp(buf, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  return true;
}

const targets = [
  [`${MARKS}/Materiales_Termoplasticos/Voller.webp`, `${MARKS}/Materiales_Termoplasticos/Voller_transparent.png`],
  [`${MARKS}/Laminas_Senalamiento/Ennis_Flint.webp`,  `${MARKS}/Laminas_Senalamiento/Ennis_Flint_transparent.png`],
  [`${MARKS}/Materiales_Termoplasticos/Crown_Technology.webp`, `${MARKS}/Materiales_Termoplasticos/Crown_Technology_transparent.png`],
  [`${MARKS}/Principales_Clientes/GP_Construccion.webp`, `${MARKS}/Principales_Clientes/GP_Construccion_transparent.png`],
];

for (const [src, dst] of targets) {
  try {
    const ok = await removeBg(src, dst, 45);
    console.log(ok ? `✓ ${path.basename(src)}` : `- skipped`);
  } catch (e) {
    console.error(`✗ ${path.basename(src)}: ${e.message}`);
  }
}
