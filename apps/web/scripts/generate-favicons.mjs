// Regenerate existing brand assets without redesigning the logo.
import { createRequire } from "node:module";
import { Buffer } from "node:buffer";
import { readFile, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const sharp = require(
  require.resolve("sharp", { paths: [require.resolve("next/package.json")] }),
);
const source = await readFile(
  new URL("../public/favicons/android-chrome-512x512.png", import.meta.url),
);
const render = (size) =>
  sharp(source)
    .resize(size, size)
    .flatten({ background: "#F4EFE8" })
    .ensureAlpha()
    .png()
    .toBuffer();

for (const size of [16, 32, 48, 96]) {
  await writeFile(
    new URL(`../public/favicons/favicon-${size}x${size}.png`, import.meta.url),
    await render(size),
  );
}

// ICO directory with PNG frames; include larger sizes for search and high-DPI displays.
const sizes = [16, 32, 48, 96, 256];
const frames = await Promise.all(sizes.map(render));
const directory = Buffer.alloc(6 + 16 * frames.length);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(frames.length, 4);
let offset = directory.length;
frames.forEach((frame, index) => {
  const entry = 6 + 16 * index;
  directory[entry] = sizes[index] === 256 ? 0 : sizes[index];
  directory[entry + 1] = directory[entry];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(frame.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await writeFile(
  new URL("../app/favicon.ico", import.meta.url),
  Buffer.concat([directory, ...frames]),
);
console.log("Generated branded favicon.ico and 16, 32, 48, and 96 px PNGs.");
