const sharp = require('sharp');
const path = require('path');

const logoPath = path.join(__dirname, 'src', 'assets', 'logo.png');

sharp(logoPath).metadata().then(m => {
  console.log('Format:', m.format);
  console.log('Width:', m.width);
  console.log('Height:', m.height);
  console.log('Channels:', m.channels);
  console.log('Has alpha:', m.hasAlpha);
  console.log('File size OK');
}).catch(e => console.error('Error:', e.message));
