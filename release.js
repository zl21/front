const fs = require('fs')
const { execSync } = require('child_process')
const packageInfo = JSON.parse(fs.readFileSync('package.json'))
const { exec } = require('child_process');
exec(`git  tag -a ${packageInfo.version} -m "my ${packageInfo.version}" && git push origin ${packageInfo.version}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`执行出错: ${error}`);
    return;
  }
  console.log(`stderr: ${stderr}`);
});

