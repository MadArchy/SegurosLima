/**
 * Remove white background from logo PNG using sharp
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const logoPath = path.join(__dirname, 'src', 'assets', 'logo.png');
const tmpPath = path.join(__dirname, 'src', 'assets', 'logo-tmp.png');

async function removeWhiteBackground() {
  console.log('Loading logo:', logoPath);

  const meta = await sharp(logoPath).metadata();
  console.log(`Image: ${meta.width}x${meta.height} ${meta.format}`);

  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Processing ${width}x${height} (${channels}ch)...`);

  const threshold = 228;
  const softEdge = 25;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r > threshold && g > threshold && b > threshold) {
      data[i + 3] = 0;
    } else if (r > (threshold - softEdge) && g > (threshold - softEdge) && b > (threshold - softEdge)) {
      const avg = (r + g + b) / 3;
      const ratio = (avg - (threshold - softEdge)) / softEdge;
      const existing = data[i + 3] ?? 255;
      data[i + 3] = Math.round((1 - ratio) * existing);
    }
  }

  // Write to temp file first (sharp can't read+write same file)
  await sharp(Buffer.from(data), {
    raw: { width, height, channels }
  })
    .png({ compressionLevel: 9 })
    .toFile(tmpPath);

  // Replace original with temp
  fs.unlinkSync(logoPath);
  fs.renameSync(tmpPath, logoPath);

  console.log('✅ Done! White background removed from logo.');
}

removeWhiteBackground().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

