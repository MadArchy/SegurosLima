// Detect Jimp API
try {
  const jimp = require('jimp');
  console.log('Module type:', typeof jimp);
  console.log('Is class?', typeof jimp === 'function' ? 'YES - use new Jimp()' : 'No');
  console.log('Keys:', Object.keys(jimp).join(', '));
  if (jimp.read) console.log('has read');
  if (jimp.Jimp) console.log('has jimp.Jimp');
} catch(e) {
  console.error(e.message);
}
