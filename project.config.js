const path = require('path');

module.exports = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: path.join(__dirname, './favicon.ico'), // 项目icon,
  // target: 'http://47.99.229.124:1024', // 框架研发网关关闭环境
  // target: 'http://47.99.229.124:8098', // 框架研发网关开启环境
  target: 'http://r3dev.qiaodan.com:28889', // 乔丹开发环境
  // target: 'http://r3dev.qiaodan.com:26666', // 乔丹开发环境
  // target: 'http://dev.burgeononline.com:8120', // 掌云测试环境(启用网关)
  // target: 'http://dev.burgeononline.com:8098', // 掌云测试环境(启用网关)
  // target: 'http://r3.burgeon.cn:28888', // 李宁
  // target: 'http://139.224.169.76:28888', // 沁园

  
  Version: '1.3', // 版本号
  interlocks: true, // 是否打开三级联动装置
  enableGateWay: false, // 网关是否打开,
  enableHistoryAndFavorite: true, // 是否开启收藏与最近使用功能
  ignoreGateWayPattern: [/\/jflow\/*/g], // 框架默认禁用的网关逻辑的正则模式匹配。
  enableNetworkMonitor: true, // 是否开启网络监控功能
  enableModuleKA: true, // 默认启用keepAlive功能
  enableJflow: false, // 默认禁用JFlow插件功能
  showTab: false, // 控制是否是tab显示，既是否显示顶部的jflow图标
  jflowRequestDomain: '123123', // jflow后台地址
  enableTabLists: true, // 是否启用Tab页签切换模块的能力，默认启用
  touristRoute: '/login', // 游客路由：等用户未登录的时候，需要跳转的页面
  enableInitializationRequest: true // 是否开启初始化请求
};
