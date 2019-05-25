const path = require('path');

module.exports = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: path.join(__dirname, './favicon.ico'), // 项目icon,
  target: 'http://dev.burgeononline.com:8099', // 代理路径地址
  Version: '1.4', // 版本号
  interlocks: true, // 是否打开三级联动装置
  enableGateWay: true // 网关是否打开
};
