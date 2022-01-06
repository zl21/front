const projectconfig  = require('./project.config.common');

const project = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: '', // 项目icon,
  // target: 'http://47.99.229.124:1024', // 框架研发网关关闭环境
  // target: 'http://r3-8098.dev.syman.cn/', // 框架研发网关开启环境
  // target: 'http://r3-java.dev.burgeononline.com', // java环境
  // target: 'http://syman-jflow-standard.dev.burgeononline.com/', // 新版本jflow测试环境
  // target: 'http://r3dev.qiaodan.com:28888', // 乔丹开发环境
  // target: 'http://r3dev.qiaodan.com:26666', // 乔丹开发环境
  // target: 'http://r3-know-dev.dev.burgeononline.com/', // 知晓测试环境(启用网关)
  // target: 'http://zhixiao.burgeononline.com:32769/', // 知晓正式环境(启用网关)
  // target: 'http://dev.burgeononline.com:8098', // 掌云测试环境(启用网关)
  // target: 'http://106.15.24.156:19093', // 李宁AD
  // target: 'http://139.224.169.76:28888', // 沁园
  // target: 'http://10.14.6.84', // 商飞开发环境
  // target: 'http://10.14.3.71', // 商飞预发环境
  // target: 'http://syman-jflow-standard.dev.burgeononline.com/', // 商飞测试环境
  // target: 'http://r3-ishop.dev.burgeononline.com/', // ishop网关开启环境
  // target: 'http://r3.burgeon.cn:19999/', // 'http://106.15.154.165:19999/', // Cube
 // target: 'http://120.79.145.203/', // 卡宾
   //target: 'http://r3.burgeon.cn:28888/', // 李宁
  // target: 'http://jflow-shangfei-r3.dev.burgeononline.com/', // 商飞测试环境
  // target: 'http://ark-share-dev.dev.burgeononline.com', // ArkShare环境
  // target: 'http://r3.burgeon.cn:28888/', // lining环境
  // target: 'http://47.102.164.111:26666/', // 卡宾
  // target: 'http://172.18.34.122:8001/', // ishop环境
  // target: 'http://r3-ishop.dev.burgeononline.com/', // ishop环境
  // target: 'http://47.103.175.111:26666/', // 千百度环境
  // target: 'http://syman-jflow-standard.dev.burgeononline.com',
  // target: 'http://139.196.221.193:38888/', // 巧厨环境
  // target: 'http://47.103.6.45:27777/', // 森马测试环境
  // target: 'http://47.103.6.45:26666/', // 森马开发环境
  // target: 'http://r3dev.qiaodan.com:26666/', // 乔丹
  // target: 'http://oneretail-test.dev.syman.cn/', // 微淘氪
  // target: 'http://101.133.142.45:27777/', // 乔丹
  // target: 'http://r3.ecsemir.com/', // 森马
  // target: ' http://47.103.6.45:27777/', // 森马
  // target: 'http://cs.yqdev.burgeononline.com/', // 云雀
  // target: 'http://47.102.164.111:27777', // 卡宾
  // target: 'http://dev.dev.lark-erp.cn/',
  // target: 'http://139.224.134.69:58000', // OMS
  target: 'http://120.78.163.25/', // 斯凯奇
  Version: '1.3', // 版本号
  enableGateWay: false, // 网关是否打开,
  enableLoginPro:false,
  ...projectconfig,
};
module.exports  = project;