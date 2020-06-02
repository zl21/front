// 此分支用于开发矩阵功能

const path = require('path');

module.exports = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: path.join(__dirname, './favicon.ico'), // 项目icon,
  // target: 'http://47.99.229.124:1024', // 框架研发网关关闭环境
  // target: 'http://r3-8098.dev.burgeononline.com/', // 框架研发网关开启环境
  // target: 'http://syman-jflow-standard.dev.burgeononline.com/', // 新版本jflow测试环境
  // target: 'http://r3dev.qiaodan.com:28889', // 乔丹开发环境
  // target: 'http://r3dev.qiaodan.com:26666', // 乔丹开发环境
  // target: 'http://r3-know-dev.dev.burgeononline.com/', // 知晓测试环境(启用网关)
  // target: 'http://zhixiao.burgeononline.com:32769/', // 知晓正式环境(启用网关)
  // target: 'http://dev.burgeononline.com:8098', // 掌云测试环境(启用网关)
  // target: 'http://r3.burgeon.cn:28888', // 李宁
  // target: 'http://106.15.24.156:19093', // 李宁AD
  // target: 'http://139.224.169.76:28888', // 沁园
  // target: 'http://10.14.5.196', // 商飞开发环境
  // target: 'http://10.14.3.71', // 商飞预发环境
  // target: 'http://jflow-shangfei-yf-r3.dev.burgeononline.com/', // 商飞测试环境
  // target: 'http://r3-ishop.dev.burgeononline.com/', // ishop网关开启环境
  // target: 'http://r3.burgeon.cn:19999/', // 'http://106.15.154.165:19999/', // Cube
  // target: 'http://cmsqas.lining.com', // 卡宾
  // target: 'http://r3.burgeon.cn:28888/', // 李宁
  // target: 'http://jflow-shangfei-r3.dev.burgeononline.com/', // 商飞测试环境
  // target: 'http://ark-share-dev.dev.burgeononline.com', // ArkShare环境
  target: 'http://47.102.164.111:26666/', // 卡宾环境

  
  Version: '1.3', // 版本号
  interlocks: true, // 是否打开三级联动装置
  enableGateWay: false, // 网关是否打开,
  enableHistoryAndFavorite: true, // 是否开启收藏与最近使用功能
  ignoreGateWayPattern: [/\/jflow\/*/g, /\/api\/*/g], // 框架默认禁用的网关逻辑的正则模式匹配
  enableNetworkMonitor: true, // 是否开启网络监控功能
  enableModuleKA: true, // 默认启用keepAlive功能
  enableJflow: false, // 默认禁用JFlow插件功能
  closeJflowIcon: false, // 控制是否是tab显示，既是否显示顶部的jflow图标
  encryptionJflow: false, // 控制jflow传参是否加密
  // jflowRequestDomain: 'http://jflow-zhixiao.dev.burgeononline.com', // jflow后台地址(知晓)
  // jflowRequestDomain: 'http://jflow-qiaodan.dev.burgeononline.com', // jflow后台地址（乔丹）
  // jflowRequestDomain: 'http://106.15.24.156:32940', // jflow后台地址(李宁)
  jflowRequestDomain: 'http://jflow-syman-dev.dev.burgeononline.com/', // jflow后台地址(商飞)
  
  enableTabLists: true, // 是否启用Tab页签切换模块的能力，默认启用
  touristRoute: '/login', // 游客路由：等用户未登录的时候，需要跳转的页面
  enableInitializationRequest: true, // 是否开启初始化请求
  // enableCustomInterface: false // 是否开启自定义接口,
  customizeWaterMark: {}, // 启用外部自定义水印配置,
  // specifiedGlobalGateWay: 'ad-app',
  encryptedPassword: false, // 是否允许login接口password加密
  isItemTableNewValidation: true, // 是否允许子表新增有必填项时，输入值才触发子表必填项校验，不输入值则只校验主表
  isCommonTable: true, // 是否开启普通表格，默认关闭
  custommizedJflow: true, // jflow定制版开关,默认为true
  functionPowerRequestURL: '', // 功能权限获取检索项数据接口名称
  cbs: undefined, // 框架回调，形如 { loginCb: function() {} }
  layoutDirection: false, // 默认是false ,水平排版 ，true 是垂直排版
  backDashboardRoute: [], // 配置刷新浏览器回到Dashboard界面
  custommizedRequestURL: {
   
  }, // 配置内置自定义界面requestURL


};
