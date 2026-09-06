/**
 * Generate Venabustallen brand assets:
 * - outlined wordmark paths from Inter Bold
 * - PNG exports (logo @2x, logo-square 512, apple-icon 180)
 *
 * Palette (locked):
 *   Primary  #1E3A32  deep forest / pine plateau
 *   Accent   #C4782A  saddle leather / warm copper
 *   Dark     #0F1915
 *   Light    #F2F5F3  cool mist paper
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imgDir = path.join(root, "public", "img");
const appDir = path.join(root, "app");

const PRIMARY = "#1E3A32";
const ACCENT = "#C4782A";
const DARK = "#0F1915";
const LIGHT = "#F2F5F3";

/** Geometric horse head (profile, facing right) — solid single-colour mark */
function horsePath(ox = 0, oy = 0, s = 1) {
  const t = (x, y) => `${(ox + x * s).toFixed(2)} ${(oy + y * s).toFixed(2)}`;
  // Outer silhouette + eye cutout (evenodd)
  return [
    // neck → ear → forehead → muzzle → jaw → neck
    `M ${t(17, 54)}`,
    `C ${t(15, 44)} ${t(17, 35)} ${t(23, 29)}`,
    `C ${t(22, 24)} ${t(23, 17)} ${t(27, 11)}`,
    `L ${t(33, 19)}`,
    `C ${t(40, 15)} ${t(50, 17)} ${t(56, 25)}`,
    `C ${t(60, 30)} ${t(60, 37)} ${t(54, 41)}`,
    `C ${t(49, 44)} ${t(43, 41)} ${t(39, 36)}`,
    `C ${t(35, 42)} ${t(28, 50)} ${t(17, 54)}`,
    `Z`,
    // eye (cutout)
    `M ${t(34, 27)}`,
    `C ${t(36.5, 25)} ${t(39, 27)} ${t(37.5, 29.5)}`,
    `C ${t(36, 31)} ${t(33, 29.5)} ${t(34, 27)}`,
    `Z`,
  ].join(" ");
}

function markSvg({ fill = PRIMARY, bg = null, size = 512, padding = 0.14 } = {}) {
  const vb = 64;
  const inner = vb * (1 - 2 * padding);
  const scale = inner / 64;
  const ox = vb * padding;
  const oy = vb * padding;
  const bgRect = bg
    ? `<rect width="${vb}" height="${vb}" rx="12" fill="${bg}"/>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}" width="${size}" height="${size}" role="img" aria-label="Venabustallen">
  ${bgRect}
  <path fill="${fill}" fill-rule="evenodd" d="${horsePath(ox, oy, scale)}"/>
</svg>
`;
}

function faviconSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="7" fill="${PRIMARY}"/>
  <path fill="${LIGHT}" fill-rule="evenodd" d="${horsePath(2.5, 2.5, 0.42)}"/>
</svg>
`;
}

async function main() {
  const require = createRequire(import.meta.url);
  const toolsRequire = createRequire(
    path.join(root, ".brand-tools", "package.json")
  );
  let opentype;
  let sharp;
  try {
    opentype = toolsRequire("opentype.js");
    sharp = toolsRequire("sharp");
  } catch (err) {
    console.error(
      "Install deps first: cd .brand-tools && npm install opentype.js sharp"
    );
    console.error(err);
    process.exit(1);
  }

  fs.mkdirSync(imgDir, { recursive: true });

  const fontPath = path.join(root, "public", "fonts", "Inter-Bold.otf");
  const buf = fs.readFileSync(fontPath);
  const font = opentype.parse(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  );
  const fontSize = 72;
  const text = "Venabustallen";
  // Avoid Inter's unsupported GSUB lookups — build glyph-by-glyph
  let penX = 0;
  const parts = [];
  let x1 = Infinity,
    y1 = Infinity,
    x2 = -Infinity,
    y2 = -Infinity;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const gpath = glyph.getPath(penX, 0, fontSize);
    const bb = gpath.getBoundingBox();
    x1 = Math.min(x1, bb.x1);
    y1 = Math.min(y1, bb.y1);
    x2 = Math.max(x2, bb.x2);
    y2 = Math.max(y2, bb.y2);
    parts.push(gpath.toPathData(2));
    penX += (glyph.advanceWidth / font.unitsPerEm) * fontSize;
  }
  const wordPathData = parts.join(" ");
  const bbox = { x1, y1, x2, y2 };
  const wordW = bbox.x2 - bbox.x1;
  const wordH = bbox.y2 - bbox.y1;

  // Lockup layout: mark (square) + gap + wordmark
  const markSize = 96;
  const gap = 28;
  const wordScale = markSize / (wordH * 1.35);
  const scaledWordW = wordW * wordScale;
  const scaledWordH = wordH * wordScale;
  const padX = 8;
  const padY = 12;
  const totalW = padX + markSize + gap + scaledWordW + padX;
  const totalH = padY * 2 + markSize;

  const markOx = padX;
  const markOy = padY;
  const wordTx = padX + markSize + gap - bbox.x1 * wordScale;
  const wordTy =
    padY + (markSize + scaledWordH) / 2 - bbox.y2 * wordScale + scaledWordH * 0.05;

  function lockup(fill, file) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW.toFixed(1)} ${totalH.toFixed(1)}" width="${(totalW * 2).toFixed(0)}" height="${(totalH * 2).toFixed(0)}" role="img" aria-label="Venabustallen">
  <path fill="${fill}" fill-rule="evenodd" d="${horsePath(markOx + markSize * 0.08, markOy + markSize * 0.08, (markSize * 0.84) / 64)}"/>
  <g transform="translate(${wordTx.toFixed(2)} ${wordTy.toFixed(2)}) scale(${wordScale.toFixed(5)})">
    <path fill="${fill}" d="${wordPathData}"/>
  </g>
</svg>
`;
    fs.writeFileSync(path.join(imgDir, file), svg);
    console.log("wrote", file);
    return svg;
  }

  lockup(PRIMARY, "logo.svg");
  lockup(LIGHT, "logo-dark.svg");

  const markOnly = markSvg({ fill: PRIMARY, bg: null, size: 512 });
  fs.writeFileSync(path.join(imgDir, "logo-mark.svg"), markOnly);
  console.log("wrote logo-mark.svg");

  const markOnBrand = markSvg({ fill: LIGHT, bg: PRIMARY, size: 512, padding: 0.18 });
  fs.writeFileSync(path.join(imgDir, "logo-square.svg"), markOnBrand);
  console.log("wrote logo-square.svg");

  fs.writeFileSync(path.join(appDir, "icon.svg"), faviconSvg());
  console.log("wrote app/icon.svg");

  // PNG exports
  const logoSvg = fs.readFileSync(path.join(imgDir, "logo.svg"));
  await sharp(logoSvg)
    .resize(Math.round(totalW * 2), Math.round(totalH * 2), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(imgDir, "logo.png"));
  console.log("wrote logo.png");

  const logoDarkSvg = fs.readFileSync(path.join(imgDir, "logo-dark.svg"));
  await sharp(logoDarkSvg)
    .resize(Math.round(totalW * 2), Math.round(totalH * 2), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(imgDir, "logo-dark.png"));
  console.log("wrote logo-dark.png");

  await sharp(Buffer.from(markOnBrand))
    .resize(512, 512)
    .png()
    .toFile(path.join(imgDir, "logo-square.png"));
  console.log("wrote logo-square.png");

  // Apple touch icon 180×180 with safe margin
  const appleSvg = markSvg({ fill: LIGHT, bg: PRIMARY, size: 180, padding: 0.2 });
  await sharp(Buffer.from(appleSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, "apple-icon.png"));
  console.log("wrote app/apple-icon.png");

  // Contrast sanity (relative luminance)
  function lum(hex) {
    const c = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) => {
      const v = parseInt(c.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  }
  console.log("contrast primary/light:", contrast(PRIMARY, LIGHT).toFixed(2));
  console.log("contrast light/primary:", contrast(LIGHT, PRIMARY).toFixed(2));
  console.log("palette", { PRIMARY, ACCENT, DARK, LIGHT });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
