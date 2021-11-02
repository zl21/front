const path = require('path');
const compressing = require('compressing');

const srcPath = path.join(process.cwd() , 'dist');
const targetPath = path.join(process.cwd() , 'dist.zip');

compressing.zip.compressDir(srcPath, targetPath)
  .then(() => {
    console.log('compress success');
  })
  .catch(() => {});
