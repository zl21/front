const path = require('path');
const compressing = require('compressing');

const srcPath = path.join(__dirname, 'dist');
const targetPath = path.join(__dirname, 'dist.zip');

compressing.zip.compressDir(srcPath, targetPath)
  .then(() => {
    console.log('compress success');
  })
  .catch(() => {});
