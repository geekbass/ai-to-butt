// Generates the raster icon files without third-party packages. Run with:
// deno run --allow-write=/tmp scripts/generate-icons.ts
const size = 512;
const pixels = new Uint8Array(size * size * 3);

function insideEllipse(
  x: number,
  y: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rotation = 0
) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const dx = x - cx;
  const dy = y - cy;
  const localX = dx * cosine + dy * sine;
  const localY = -dx * sine + dy * cosine;
  return (localX * localX) / (rx * rx) + (localY * localY) / (ry * ry) <= 1;
}

function colorAt(x: number, y: number): [number, number, number] {
  let color: [number, number, number] = [255, 243, 232];

  if (insideEllipse(x, y, 184, 292, 125, 164, -0.18)) {
    color = [255, 154, 118];
  }
  if (insideEllipse(x, y, 328, 292, 125, 164, 0.18)) {
    color = [255, 131, 100];
  }
  if (insideEllipse(x, y, 317, 120, 75, 29, -0.55)) {
    color = [73, 166, 111];
  }

  const creaseX = 256 + 0.00035 * (y - 275) * (y - 275);
  if (y > 170 && y < 429 && Math.abs(x - creaseX) < 8) {
    color = [185, 78, 67];
  }

  return color;
}

for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const color = colorAt(x, y);
    const offset = (y * size + x) * 3;
    pixels[offset] = color[0];
    pixels[offset + 1] = color[1];
    pixels[offset + 2] = color[2];
  }
}

const header = new TextEncoder().encode(`P6\n${size} ${size}\n255\n`);
const ppm = new Uint8Array(header.length + pixels.length);
ppm.set(header);
ppm.set(pixels, header.length);
await Deno.writeFile("/tmp/ai-to-butt-icon.ppm", ppm);
