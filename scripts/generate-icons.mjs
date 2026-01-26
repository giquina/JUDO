import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

async function generateIcons() {
  console.log('Generating PWA icons...');

  const sizes = [192, 512];

  for (const size of sizes) {
    const svgPath = resolve(publicDir, `icon-${size}.svg`);
    const pngPath = resolve(publicDir, `icon-${size}.png`);

    console.log(`Converting icon-${size}.svg to PNG...`);

    const svgBuffer = readFileSync(svgPath);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);

    console.log(`Created: icon-${size}.png`);
  }

  // Also create a favicon.ico alternative (32x32 PNG)
  const svg192 = readFileSync(resolve(publicDir, 'icon-192.svg'));
  await sharp(svg192)
    .resize(32, 32)
    .png()
    .toFile(resolve(publicDir, 'favicon.png'));
  console.log('Created: favicon.png (32x32)');

  // Create Apple Touch Icon (180x180)
  await sharp(svg192)
    .resize(180, 180)
    .png()
    .toFile(resolve(publicDir, 'apple-touch-icon.png'));
  console.log('Created: apple-touch-icon.png (180x180)');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
