const path = require('path');

module.exports = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: path.join(__dirname, './favicon.ico'), // 项目icon,
  // target: 'http://47.99.229.124:1024', // 框架研发网关关闭环境
  target: 'http://47.99.229.124:10001', // 框架研发网关开启环境
  // target: 'http://r3dev.qiaodan.com:28888', // 乔丹开发环境
  // target: 'http://dev.burgeononline.com:8099', // 掌云测试环境(启用网关)
  Version: '1.4', // 版本号
  interlocks: true, // 是否打开三级联动装置
  enableGateWay: true, // 网关是否打开,
  ignoreGateWayPattern: [
    /\/api\/rpt\/preview/
  ], // 框架默认禁用的网关逻辑的正则模式匹配。
  enableNetworkMonitor: true, // 是否开启网络监控功能
};
