

module.exports = {
  projectsTitle: 'Burgeon R3 Erp Frame', // 项目title
  projectIconPath: '', // 项目icon,
  // target: 'http://47.99.229.124:1024', // 框架研发网关关闭环境
  target: 'http://r3-8098.dev.syman.cn/', // 框架研发网关开启环境
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
  // target: 'http://cmsqas.lining.com', // 卡宾
 // target: 'http://r3.burgeon.cn:28888/', // 李宁
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

  Version: '1.4', // 版本号
  interlocks: true, // 是否打开三级联动装置
  enableGateWay: true, // 网关是否打开,
  enableHistoryAndFavorite: true, // 是否开启收藏与最近使用接口请求
  enableHistoryAndFavoriteUI: true, // 是否显示收藏与最近使用UI
  ignoreGateWayPattern: [/\/jflow\/*/g, /\/api\/*/g], // 框架默认禁用的网关逻辑的正则模式匹配
  enableNetworkMonitor: true, // 是否开启网络监控功能
  enableModuleKA: true, // 默认启用keepAlive功能
  enableTabLists: true, // 是否启用Tab页签切换模块的能力，默认启用
  touristRoute: '/login', // 游客路由：等用户未登录的时候，需要跳转的页面
  enableInitializationRequest: true, // 是否开启初始化请求
  // enableCustomInterface: false // 是否开启自定义接口,
  customizeWaterMark: {
    // extremely: {
    //   text: '大家',
    //   color: '#2d8cf0',
    //   top: '10px',
    //   left: '10px',
    //   width: '50px'
    // }
  }, // 启用外部自定义水印配置,
  // specifiedGlobalGateWay: 'ad-app',
  // specifiedGlobalGateWay: 'user-center',
  encryptedPassword: false, // 是否允许login接口password加密
  isItemTableNewValidation: true, // 是否允许子表新增有必填项时，输入值才触发子表必填项校验，不输入值则只校验主表
  isCommonTable: false, // 是否开启普通表格，默认关闭
  functionPowerRequestURL: '', // 功能权限获取检索项数据接口名称
  cbs: undefined, // 框架回调，形如 { loginCb: function() {} }
  layoutDirection: false, // 默认是false ,水平排版 ，true 是垂直排版
  layoutDirectionSlot:{  // 模板渲染
    //NavigatorSubMenu:require('./src/demo/NavigatorSubMenu.vue').default,  // 模板渲染
    //NaVertical:require('./src/demo/NaVerticalslot.vue').default  // 模板渲染
    // listFormButton:require('./demo/detailbuttons.vue').default,  // 定制列表button
    // standardTableList:{
    //   defined:require('./demo/standardTableListdefind.vue').default,
    // }  // 定制列表button
  },
  backDashboardRoute: [], // 配置刷新浏览器回到Dashboard界面
  custommizedRequestURL: {

  }, // 配置内置自定义界面requestURL
  requestPenddingExpire: 1000 * 0.5, // 单位S
  enableRestrictSave: true, // 是否限制保存，默认为true,true:界面未修改值则点击保存按钮不调用保存服务，false:无论是否修改值都会调用保存服务
  // externalPluginModules: {
  //   INSTANCEMANAGEMENTLIST: { // jflow插件列表界面
  //     component: 123,
  //     name: '工作流'
  //   },
  // },
  enableActivateSameCustomizePage: true, // 跳转自定义界面，当自定义界面标识相同，是否只激活同一个tab,默认为false,自定义界面ID不同会打开多个tab
  logoutTips: false, // 失去会话是否需要登出提示 默认false直接登出
  enableKAQueryDataForUser: false, // 是否开启存储全表查询条件
  dateStorageTime: 1, // 查询条件存储时间，默认1天,建议不要设置太大影响性能
  enableOpenNewTab: false, // 列表界面打开 同表 单对象是否新开tab,默认为false
  blockFullOperation: false, // 禁止不选数据时的批量修改操作,
  customizeMixins: { // 获取所有外部接入的mixins对象
    setPanel: null,
    // verticalTableDetailCustomize: require('./src/demo/horizontalTableDetailCustomize.js').default,
    // standardTableListsCustomize: {
    //   methods: {
    //     R3_processColumns(columns) {
    //       columns.forEach(item => {
    //         item.tdAlign = 'center'
    //       })
    //       return columns
    //     },

    //     R3_processAgOptions(options) {
    //       options.rowSelection = 'single'
    //       options.floatingFilter = false
    //       return options
    //     },

    //     R3_processRows(rows) {
    //       rows.forEach(item => {
    //         item.NAME.val = `格式化-${item.NAME.val}`
    //       })
    //       return rows
    //     }
    //   }
    // },
    // horizontalTableDetailCustomize: require('./src/demo/horizontalTableDetailCustomize.js').default,
    taskList: null,
    // tableDetailCollectionMixin: {
    //   methods: {
    //     R3_processColumns(columns) {
    //       console.log('列', columns)
    //       columns.forEach(item => {
    //         item.tdAlign = 'left'
    //         delete item.webconf
    //       })
    //       return columns
    //     }
    //   }
    // }
  },
  imgProgressController: false, // 是否显示图片上传进度
  ossRealtimeSave: false,
  notificationOfMain: false, // 是否开启主表数据修改通知
  filterUrlForNetwork: {// 过滤不需要用框架报错提示信息的接口请求
    // configPage: {// 自定义弹框
    //   AD_COLUMN: ['/ad-app/p/cs/QueryList', '/ad-app/p/cs/getTableQuery'],
    // },
    // customizePage: ['FUNCTIONPERMISSION'], // 自定义界面
  },
  filterUrlForNetworkScript: () => true, // 框架默认true,
  listDefaultColumn: 4,
  setComponentsProps: (type, props) => {  // 框架自定义表单配置
    //列表支持联动查询
    // if (type === 'OBJ_FK') {
    //   if(props.PropsData && (props.PropsData.fkobj.searchmodel ==='mrp' || props.PropsData.fkobj.searchmodel ==='drp')){
    //     props.PropsData.Query = true;
    //   }
    // }
    // return props;
  },
  agGridOptions: { // ag表格的配置
    // rowHeight: 100
  },
  messageSwitch: false, // 消息开关
  // useAgGrid: true, // 明细界面的表格全局用ag表格进行渲染
  // (data) => {
  //   if (data.router.params) {
  //     if (data.router.params.tableName && data.config().configPage[data.router.params.tableName].filter(u => u === data.url).length > 0) { // 筛选出配置界面不需要根据框架code报错提示框的接口
  //       return false;
  //     } if (data.router.params.customizedModuleName && data.router.meta.routePrefix === '/CUSTOMIZED' && data.config().customizePage.filter(r => data.router.params.customizedModuleName.toLocaleLowerCase() === r.toLocaleLowerCase()).length > 0) {
  //       // 筛选出定制界面不需要根据框架code,报错提示框的接口
  //       return false;
  //     }
  //   }
  //   return true;
  // }
  // },
  // standardTableCellRenderer: { // 标准列表里，定制ag-grid的单元格
  //   customlink: params => `<div onclick="console.log('${params.value}')">-定制-${params.value}</div>`
  // }
  // formItemMixins:require('./src/demo/formItemMixins'),
  isFilterTable: true, // 是否开启表格过滤功能
  // DashboardComponent: {
  //   compontent: () => import(
  //     './src/__component__/Login.vue'
  //   ),
  //   iconClass: 'iconfont iconmd-grid'
  // }
  // classFix: 'r3-', // 样式前缀
  classFix: '', // 样式前缀
  // openTabNumber:2,

  autoGatewayUrl:false,  // 是否请求网关
  computeForSubtable: false,
  routerFilter:true, // 跳转是否过滤
  enableLoginPro: true, // 是否开启普通登录模式 false普通 true手机验证码
  filterURL: [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g],
  filterHistory:[], // 过滤不需要历史记录的表
  listFormWebconf:['filtercolval'], // 列表是否支持webcof 字段
  // // 转义节点位置
  // domPortal: {
  //   // params对象属性,fromComponent用于区别哪个组件的水印,type区分布局结构
  //   waterMark(params) {
  //     if(params.fromComponent === 'SingleObjectButtons') {
  //       return params.type === 'horizontal'? '.panelForm': '.verticalTableDetailContent'
  //     }
  //     return false
  //   }
  // }
};
