import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MARKS_DIR = path.join(__dirname, '../public/TEPATE_Marcas');
const OUT_SUFFIX = '_transparent.png';

// Threshold above which a pixel is considered "white background"
const WHITE_THRESHOLD = 238;
// How many corner pixels to sample to decide if there's a white bg
const CORNER_SAMPLE = 8;

async function hasWhiteBackground(data, width, height, channels) {
  // Sample top-left, top-right, bottom-left, bottom-right corners
  const corners = [
    0, // top-left
    (CORNER_SAMPLE - 1) * channels, // top-left area
    (width - CORNER_SAMPLE) * channels, // top-right
    (width - 1) * channels, // top-right corner
    (height - 1) * width * channels, // bottom-left
    ((height - 1) * width + width - 1) * channels, // bottom-right
  ];
  let whiteCount = 0;
  for (const idx of corners) {
    if (idx + 2 < data.length) {
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) whiteCount++;
    }
  }
  return whiteCount >= 4; // majority of corners are white
}

async function removeWhiteBg(inputPath) {
  const outDir = path.dirname(inputPath);
  const base = path.basename(inputPath, path.extname(inputPath));
  const outPath = path.join(outDir, base + OUT_SUFFIX);

  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  if (!await hasWhiteBackground(data, width, height, channels)) {
    return null; // skip - no white background detected
  }

  // Remove white pixels (and near-white)
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      // Soft edge: fade pixels that are near the threshold
      const whiteness = Math.min(r, g, b);
      const alpha = Math.round(((255 - whiteness) / (255 - WHITE_THRESHOLD)) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  await sharp(Buffer.from(data), { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  return outPath;
}

async function processDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await processDir(full));
    } else if (/\.(png|webp|jpeg|jpg)$/i.test(entry.name) && !entry.name.includes('_transparent')) {
      try {
        const out = await removeWhiteBg(full);
        if (out) {
          results.push({ input: full, output: out });
          console.log(`✓ ${path.relative(MARKS_DIR, full)} → ${path.basename(out)}`);
        }
      } catch (e) {
        console.warn(`✗ ${entry.name}: ${e.message}`);
      }
    }
  }
  return results;
}

const results = await processDir(MARKS_DIR);
console.log(`\nProcessed ${results.length} file(s) with white backgrounds.`);
