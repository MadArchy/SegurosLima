const sharp = require('sharp');
const path = require('path');

const input = path.join(__dirname, 'src', 'assets', 'favicon.png');
const outputDir = path.join(__dirname, 'src', 'assets');

async function generate() {
  // favicon-32x32.png
  await sharp(input).resize(32, 32).png().toFile(path.join(outputDir, 'favicon-32x32.png'));
  console.log('favicon-32x32.png done');

  // favicon-48x48.png
  await sharp(input).resize(48, 48).png().toFile(path.join(outputDir, 'favicon-48x48.png'));
  console.log('favicon-48x48.png done');

  // favicon-192x192.png (Android/PWA)
  await sharp(input).resize(192, 192).png().toFile(path.join(outputDir, 'favicon-192x192.png'));
  console.log('favicon-192x192.png done');

  // apple-touch-icon.png 180x180
  await sharp(input).resize(180, 180).png().toFile(path.join(outputDir, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png done');

  console.log('All favicons generated!');
}

generate().catch(console.error);
