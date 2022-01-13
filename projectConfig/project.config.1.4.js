const projectconfig  = require('./project.config.dev');

const project = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: '', // 项目icon,
  // target: 'http://47.99.229.124:1024', // 框架研发网关关闭环境
  target: 'http://r3-8098.dev.syman.cn/', // 框架研发网关开启环境
  // target: 'http://r3-java.dev.burgeononline.com/', // 框架后端测试分支
  // target: 'http://retail-service-center.dev.burgeononline.com/',
  // target: 'http://syman-jflow-standard.dev.burgeononline.com/', // 新版本jflow测试环境
  // target: 'http://r3-know-dev.dev.burgeononline.com/', // 知晓测试环境(启用网关)
  // target: 'http://zhixiao.burgeononline.com:32769/', // 知晓正式环境(启用网关)
  // target: 'http://dev.burgeononline.com:8098', // 掌云测试环境(启用网关)
  // target: 'http://syman-jflow-standard.dev.burgeononline.com/', // 商飞测试环境
  // target: 'http://r3-ishop.dev.burgeononline.com/', // ishop网关开启环境
  // target: 'http://r3.burgeon.cn:19999/', // 'http://106.15.154.165:19999/', // Cube
  // target: 'http://ark-share-dev.dev.burgeononline.com', // ArkShare环境
  // target: 'http://r3.burgeon.cn:28888/', // lining环
  // target: 'http://syman-jflow-standard.dev.burgeononline.com',
  // target: 'http://cs.yqdev.burgeononline.com/', // 云雀
  //target: 'http://dev.dev.lark-erp.cn/',
  // target: 'http://139.224.134.69:58000', // OMS
  // target:'http://retail-service-center.dev.burgeononline.com/', // 零售中台
  // target:'http://139.196.18.137/',  // 云促销
  Version: '1.4', // 版本号
  interlocks: true, // 是否打开三级联动装置
  enableGateWay: true, // 网关是否打开,
  enableLoginPro:false,
  ...projectconfig,
};
module.exports  = project;
