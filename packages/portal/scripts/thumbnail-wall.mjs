#!/usr/bin/env node
/**
 * Genera un "wall" di thumbnail dei giochi, da usare come sfondo statico.
 *
 * Le copertine vengono scaricate da list.php, mescolate e ritagliate in una
 * griglia. L'output ha esattamente la dimensione richiesta: la griglia viene
 * centrata e rifilata ai bordi.
 *
 * Uso:
 *   npm run wall
 *   npm run wall -- --width=1920 --height=1080
 *   npm run wall -- --width=2560 --height=1440 --tile=180x101 --gap=6 --seed=42
 *   npm run wall -- --out=public/competizioni/img/wall.png --shade=0.35
 *
 * Opzioni:
 *   --width=<px>       larghezza finale (default: 1920)
 *   --height=<px>      altezza finale (default: 1080)
 *   --tile=<wxh>       dimensione thumbnail (default: 160x90)
 *   --gap=<px>         spazio tra le thumbnail (default: 4)
 *   --out=<file>       file di output (default: public/competizioni/img/thumbnail-wall.webp)
 *   --seed=<testo>     seed per un risultato ripetibile
 *   --quality=<1-100>  qualità webp/jpeg (default: 82)
 *   --bg=<colore>      colore dei margini (default: #111522)
 *   --shade=<0-1>      velo scuro sopra il wall (default: 0)
 *   --concurrency=<n>  download paralleli (default: 8)
 *   --no-cache         non usa la cache locale
 *   --help             mostra questo aiuto
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIST_URL =
  "https://gmitalia.altervista.org/competizioni/thumbnails/list.php";
const THUMBNAIL_BASE =
  "https://gmitalia.altervista.org/competizioni/thumbnails/";
const DEFAULT_OUT = "public/competizioni/img/thumbnail-wall.webp";
const CACHE_DIR = ".cache/thumbnail-wall";

/* ------------------------------------------------------------
 * Argomenti
 * ------------------------------------------------------------ */
function parseArgs(argv) {
  const options = {
    width: 1366,
    height: 758,
    tile: "80x45",
    gap: 4,
    out: DEFAULT_OUT,
    seed: null,
    quality: 82,
    bg: "#111522",
    shade: 0,
    concurrency: 8,
    cache: true,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }
    if (arg === "--no-cache") {
      options.cache = false;
      continue;
    }

    const match = arg.match(/^--([^=]+)(?:=(.*))?$/);
    if (!match) continue;

    const key = match[1];
    const value = match[2] ?? argv[++i];
    if (value === undefined) {
      throw new Error(`Manca il valore per --${key}`);
    }

    if (key in options) options[key] = value;
  }

  return options;
}

function printHelp() {
  console.log(`Genera un wall di thumbnail dei giochi.

Uso:
  npm run wall -- [opzioni]

Opzioni:
  --width=<px>       larghezza finale (default: 1920)
  --height=<px>      altezza finale (default: 1080)
  --tile=<wxh>       dimensione thumbnail (default: 160x90)
  --gap=<px>         spazio tra le thumbnail (default: 4)
  --out=<file>       file di output (default: ${DEFAULT_OUT})
  --seed=<testo>     seed per un risultato ripetibile
  --quality=<1-100>  qualità webp/jpeg (default: 82)
  --bg=<colore>      colore dei margini (default: #111522)
  --shade=<0-1>      velo scuro sopra il wall (default: 0)
  --concurrency=<n>  download paralleli (default: 8)
  --no-cache         non usa la cache locale
  --help             mostra questo aiuto

Esempi:
  npm run wall
  npm run wall -- --width=2560 --height=1440 --seed=42
  npm run wall -- --tile=200x112 --gap=6 --shade=0.4 --out=public/competizioni/img/wall.webp
`);
}

function parseInteger(value, name, { min = 0 } = {}) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min) {
    throw new Error(`Valore non valido per ${name}: ${value}`);
  }
  return parsed;
}

function parseTile(value) {
  const [widthValue, heightValue] = String(value).toLowerCase().split("x");
  const width = parseInteger(widthValue, "--tile (larghezza)", { min: 8 });
  const height = heightValue
    ? parseInteger(heightValue, "--tile (altezza)", { min: 8 })
    : Math.round((width * 9) / 16);
  return { width, height };
}

function parseShade(value) {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new Error(`Valore non valido per --shade: ${value} (usa 0-1)`);
  }
  return parsed;
}

/* ------------------------------------------------------------
 * Random ripetibile
 * ------------------------------------------------------------ */
function seedToNumber(seed) {
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(array, random) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Le stesse copertine compaiono più volte con il prefisso dell'edizione
 * (19_123.webp, 20_123.webp, 29_123_timestamp.webp). Le raggruppiamo per
 * gioco, così il wall non si riempie della stessa immagine.
 */
function candidateKey(name) {
  const clean = name.replace(/\.(webp|png|jpe?g)$/i, "");
  const contestCopy = clean.match(/^\d+_(\d+)(?:_\d+)?$/);
  if (contestCopy) return `game:${contestCopy[1]}`;
  return `file:${clean.toLowerCase()}`;
}

/* ------------------------------------------------------------
 * Download e cache
 * ------------------------------------------------------------ */
function cachePathFor(name) {
  const hash = crypto.createHash("sha1").update(name).digest("hex");
  const extension = path.extname(name).toLowerCase() || ".webp";
  return path.join(CACHE_DIR, `${hash}${extension}`);
}

async function loadThumbnail(name, { cache }) {
  const cached = cachePathFor(name);

  if (cache) {
    try {
      return await fs.readFile(cached);
    } catch {
      // non è in cache: la scarichiamo
    }
  }

  const url = `${THUMBNAIL_BASE}${encodeURIComponent(name)}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(25000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`non è un'immagine (${contentType || "tipo sconosciuto"})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 128) throw new Error("file troppo piccolo");

  if (cache) {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(cached, buffer);
  }

  return buffer;
}

async function downloadWallImages(candidates, needed, { cache, concurrency }) {
  const selected = [];
  const seenHashes = new Set();
  let failures = 0;

  for (
    let start = 0;
    start < candidates.length && selected.length < needed;
    start += concurrency
  ) {
    const batch = candidates.slice(start, start + concurrency);
    const settled = await Promise.allSettled(
      batch.map((name) => loadThumbnail(name, { cache }))
    );

    settled.forEach((result, offset) => {
      if (result.status === "rejected") {
        failures += 1;
        return;
      }

      const buffer = result.value;
      const hash = crypto.createHash("sha1").update(buffer).digest("hex");
      if (seenHashes.has(hash)) return;

      seenHashes.add(hash);
      selected.push({ index: start + offset, buffer });
    });

    if (selected.length > 0) {
      const done = Math.min(selected.length, needed);
      process.stdout.write(`\r  scaricate ${done}/${needed} thumbnail…`);
    }
  }

  process.stdout.write("\n");
  selected.sort((a, b) => a.index - b.index);
  return { selected: selected.slice(0, needed), failures };
}

/* ------------------------------------------------------------
 * Composizione
 * ------------------------------------------------------------ */
async function renderTile(buffer, tile) {
  return sharp(buffer)
    .rotate()
    .resize(tile.width, tile.height, {
      fit: "cover",
      position: "centre",
    })
    .png()
    .toBuffer();
}

function outputFormat(outPath) {
  const extension = path.extname(outPath).toLowerCase();
  if (extension === ".webp") return "webp";
  if (extension === ".png") return "png";
  if (extension === ".jpg" || extension === ".jpeg") return "jpeg";
  if (extension === ".avif") return "avif";
  throw new Error(
    `Formato non supportato per --out: ${extension || "nessuna estensione"}`
  );
}

function applyFormat(pipeline, format, quality) {
  if (format === "webp") return pipeline.webp({ quality });
  if (format === "jpeg") return pipeline.jpeg({ quality, mozjpeg: true });
  if (format === "avif") return pipeline.avif({ quality });
  return pipeline.png({ compressionLevel: 9 });
}

/* ------------------------------------------------------------
 * Main
 * ------------------------------------------------------------ */
async function main() {
  const rawOptions = parseArgs(process.argv.slice(2));

  if (rawOptions.help) {
    printHelp();
    return;
  }

  const width = parseInteger(rawOptions.width, "--width", { min: 16 });
  const height = parseInteger(rawOptions.height, "--height", { min: 16 });
  const tile = parseTile(rawOptions.tile);
  const gap = parseInteger(rawOptions.gap, "--gap");
  const quality = parseInteger(rawOptions.quality, "--quality", { min: 1 });
  const concurrency = parseInteger(rawOptions.concurrency, "--concurrency", {
    min: 1,
  });
  const shade = parseShade(rawOptions.shade);
  const outPath = path.resolve(ROOT, rawOptions.out);
  const format = outputFormat(outPath);

  if (quality > 100) throw new Error("--quality deve essere tra 1 e 100");

  const seed =
    rawOptions.seed !== null
      ? String(rawOptions.seed)
      : String(Date.now() + Math.floor(Math.random() * 100000));

  const columns = Math.ceil((width + gap) / (tile.width + gap));
  const rows = Math.ceil((height + gap) / (tile.height + gap));
  const needed = columns * rows;
  const gridWidth = columns * tile.width + (columns - 1) * gap;
  const gridHeight = rows * tile.height + (rows - 1) * gap;

  console.log("Wall thumbnail giochi");
  console.log(`  seed: ${seed}`);
  console.log(
    `  output: ${path.relative(ROOT, outPath)} · ${width}x${height}`
  );
  console.log(
    `  griglia: ${columns}x${rows} = ${needed} tile da ${tile.width}x${tile.height}, gap ${gap}px`
  );
  console.log(
    `  cache: ${rawOptions.cache ? CACHE_DIR : "disattivata"}`
  );

  console.log("· leggo l'elenco delle thumbnail…");
  const listResponse = await fetch(LIST_URL, {
    signal: AbortSignal.timeout(25000),
  });
  if (!listResponse.ok) {
    throw new Error(`list.php ha risposto ${listResponse.status}`);
  }

  const list = await listResponse.json();
  if (!Array.isArray(list)) {
    throw new Error("list.php non ha restituito un array");
  }

  const candidates = list
    .filter(
      (name) =>
        typeof name === "string" && /\.(webp|png|jpe?g)$/i.test(name)
    )
    .map((name) => path.basename(name));

  if (candidates.length === 0) {
    throw new Error("Nessuna thumbnail trovata in list.php");
  }

  const random = mulberry32(seedToNumber(seed));
  const grouped = new Map();
  for (const name of candidates) {
    const key = candidateKey(name);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(name);
  }

  const uniqueCandidates = [...grouped.values()].map(
    (names) => names[Math.floor(random() * names.length)]
  );
  const shuffled = shuffle(uniqueCandidates, random);

  console.log(
    `· ${candidates.length} file, ${uniqueCandidates.length} giochi unici: ne provo a scaricare ${needed}…`
  );
  const { selected, failures } = await downloadWallImages(shuffled, needed, {
    cache: rawOptions.cache,
    concurrency,
  });

  if (selected.length === 0) {
    throw new Error("Non sono riuscito a scaricare nessuna thumbnail");
  }

  if (selected.length < needed) {
    console.warn(
      `  ! ho trovato solo ${selected.length} immagini valide (${failures} errori): riuso alcune copertine`
    );
  }

  console.log("· preparo le thumbnail…");
  const renderedTiles = [];
  for (let index = 0; index < needed; index += 1) {
    const source = selected[index % selected.length];
    renderedTiles.push(await renderTile(source.buffer, tile));
    if (index > 0 && index % 24 === 0) {
      process.stdout.write(`\r  preparate ${index}/${needed}…`);
    }
  }
  process.stdout.write(`\r  preparate ${needed}/${needed}…\n`);

  console.log("· compongo il wall…");
  const composite = renderedTiles.map((input, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      input,
      left: column * (tile.width + gap),
      top: row * (tile.height + gap),
    };
  });

  if (shade > 0) {
    composite.push({
      input: {
        create: {
          width: gridWidth,
          height: gridHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: shade },
        },
      },
      left: 0,
      top: 0,
    });
  }

  const left = Math.max(0, Math.floor((gridWidth - width) / 2));
  const top = Math.max(0, Math.floor((gridHeight - height) / 2));

  // Composito prima su tutta la griglia, poi ritaglio: sharp applica
  // l'extract prima del composite se stanno nella stessa pipeline.
  const assembled = await sharp({
    create: {
      width: gridWidth,
      height: gridHeight,
      channels: 3,
      background: rawOptions.bg,
    },
  })
    .composite(composite)
    .png()
    .toBuffer();

  const pipeline = sharp(assembled).extract({
    left,
    top,
    width,
    height,
  });

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await applyFormat(pipeline, format, quality).toFile(outPath);

  const stat = await fs.stat(outPath);
  console.log(
    `✓ creato ${path.relative(ROOT, outPath)} · ${Math.round(stat.size / 1024)} KB`
  );
  if (failures > 0) console.log(`  ${failures} download falliti`);
}

main().catch((error) => {
  console.error("Errore:", error.message || error);
  process.exitCode = 1;
});
