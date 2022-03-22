
module.exports = {
  enableHistoryAndFavorite: true, // 是否开启收藏与最近使用接口请求
  enableHistoryAndFavoriteUI: true, // 是否显示收藏与最近使用UI
  ignoreGateWayPattern: [/\/jflow\/*/g, /\/api\/*/g], // 框架默认禁用的网关逻辑的正则模式匹配
  enableNetworkMonitor: true, // 是否开启网络监控功能
  enableModuleKA: true, // 默认启用keepAlive功能
  enableTabLists: true, // 是否启用Tab页签切换模块的能力，默认启用
  touristRoute: '/login', // 游客路由：等用户未登录的时候，需要跳转的页面
  enableInitializationRequest: true, // 是否开启初始化请求
  // enableCustomInterface: false // 是否开启自定义接口,
  externalTreeDatas: require('../demo/treeData/treeData.config.js'),
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
  isItemTableNewValidation: false, // 是否允许子表新增有必填项时，输入值才触发子表必填项校验，不输入值则只校验主表
  isCommonTable: false, // 是否开启普通表格，默认关闭
  functionPowerRequestURL: '', // 功能权限获取检索项数据接口名称
  cbs: {
    // customizeReportCb:function(data,userInfo,POSNAME){
    //   // `${data.url}&session_id=${data.sessionid}&userid=${userInfo.name ? userInfo.name : POSNAME}`
    //   return `${data.url}&session_id=${data.sessionid}&userid=${userInfo.name ? userInfo.id : POSNAME}`
    // } 
  }, // 框架回调，形如 { loginCb: function() {} }
  layoutDirection: false, // 默认是false ,水平排版 ，true 是垂直排版
  layoutDirectionSlot:{  // 模板渲染
    //NavigatorSubMenu:require('./src/demo/NavigatorSubMenu.vue').default,  // 模板渲染
    //NaVertical:require('./src/demo/NaVerticalslot.vue').default  // 模板渲染
    // listFormButton:()=>import('../demo/detailbuttons.vue'),  // 定制列表button
    // standardTableList:{
    //   // defined:()=>import('../demo/standardTableListdefind.vue'),
    //   tableName:{
    //     'AD_TABLE':{
    //       defined:()=>import('../demo/standardTableListdefind.vue'),
    //     },
    //     'V_STORE':{ // 一对多子表
    //       layout:()=>import('../demo/standardTableList.vue')
    //     }
    //   }
    // },  // 表单
    // panelForm:{
    //   // 左右结构的单对象
    //   tableName:{
    //     'V_STORE':{ // 一对多子表
    //       CollapseComponent:()=>import('../demo/collaps.vue'),
    //       // layout:()=>import('../demo/HTableDetail.vue')
    //     }
    //   }
    // },
    // VTableDetail:{
    //   tableName:{
    //     'V_STORE':{ // 一对多子表
    //       layout:()=>import('../demo/VTableDetail.vue')
    //     }
    //   }

    // }


  },
  domPortal: {
    // params对象属性,fromComponent用于区别哪个组件的水印,type区分布局结构
    waterMark(params) {
      if (params.fromComponent === 'SingleObjectButtons') {
        return params.type === 'horizontal'
          ? '.panelForm'
          : '.verticalTableDetailContent'
      }
      return false
    },
  },
  lang: 'zh',
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
  enableOpenNewTab: true, // 列表界面打开 同表 单对象是否新开tab,默认为false
  blockFullOperation: false, // 禁止不选数据时的批量修改操作,
  customizeMixins: { // 获取所有外部接入的mixins对象
    // singleObjectButtonGroup: require('../demo/singleObjectButtonGroup').default,
    //verticalTableDetailCustomize: require('../demo/horizontalTableDetailCustomize.js').default,
    setPanel:{
      mounted(){
        // 重写退出点击
        this.clickSignout = ()=>{
            console.log('退出点击')
            this.signout();
        }
      }
    },  
    standardTableListsCustomize: {
      // created(){
      //   let getQueryListPromise = this.getQueryListPromise;
      //   this.getQueryListPromise = function(data, searchDataRes){
      //     可以修改传参参数
      //     getQueryListPromise.call(this,data, searchDataRes)
      //   }

      // },  
      methods: {
        // R3_processColumns(columns) {
        //   columns.forEach(item => {
        //     item.tdAlign = 'center'
        //   })
        //   return columns
        // },

        // R3_processAgOptions(options) {
        //   options.rowSelection = 'single'
        //   options.floatingFilter = false
        //   return options
        // },

        // R3_processRows(rows) {
        //   rows.forEach(item => {
        //     item.NAME.val = `格式化-${item.NAME.val}`
        //   })
        //   return rows
        // }
      }
     },
    // horizontalTableDetailCustomize: require('./src/demo/horizontalTableDetailCustomize.js').default,
    taskList: null,
    tableDetailCollectionMixin: {
      // slotArray:{
      //   detailbuttonsa:()=>import('../demo/detailbuttonsa')  //子表按钮的文件
      //  }, 
      //  slotTableTemplate:()=>import('../demo/tableDetailCollectionSlot'), //  修改子表全局渲染的逻辑的文件,
      //  tableName:{
      //     'ORDER_MANAGEMWNT':{
      //       layout:()=>import('../demo/ORDER_MANAGEMWNT.vue')
      //     }
      //  }

      // methods: {
      //   R3_processColumns(columns) {
      //     console.log('列', columns)
      //     columns.forEach(item => {
      //       item.tdAlign = 'left'
      //       delete item.webconf
      //     })
      //     return columns
      //   }
      // }
    }
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
  // setComponentsProps: (type, props) => {  // 框架自定义表单配置
  //   //列表支持联动查询
  //   if (type === 'OBJ_FK') {
  //     if(props.PropsData && (props.PropsData.fkobj.searchmodel ==='mrp' || props.PropsData.fkobj.searchmodel ==='drp')){
  //       console.log(props);
  //     }
  //   }
  //    return props;
  // },
  agGridOptions: { // ag表格的配置
    // rowHeight: 100
  },
  messageSwitch: true, // 消息开关
  enableTaskNotice: true,
  useAgGrid: false, // 明细界面的表格全局用ag表格进行渲染
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
  DashboardComponent: {
    compontent: () => import(
      '../demo/detailbuttons.vue'
    ),
    iconClass: 'iconfont iconmd-grid'
  },
  // classFix: 'r3-', // 样式前缀
  classFix: '', // 样式前缀
  // openTabNumber:2,

  autoGatewayUrl:false,  // 是否请求网关
  computeForSubtable: false,
  routerFilter:false, // 跳转是否过滤
  setXss:false, // 是否xss 攻击过滤
  filterHistory:[], // 过滤不需要历史记录的表
  enableChangeLang: false, // 是否开启切换语言 false关闭 true开启
  //filterURL: [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g],
  listFormWebconf:[], // 列表是否支持webcof 字段
  // imageAssets: {
  //   // 与projectConfig.image区别在于这个图片是含有文字的,用于国际化场景
  //   // 格式必须是 （变量+语言）方便解析
  //   zh: {
  //     login: require('../src/assets/image/delete.png'), // 登录logo
  //     banner: require('../src/assets/image/delete.png'),// 导航栏logo
  //     welcome: require('../src/assets/image/delete.png'),// 欢迎页背景
  //     bigData: require('../src/assets/image/delete.png'),// 海量数据提示
  //   },
  //   en: {
  //     login: require('../src/assets/image/home.png'),
  //     banner: require('../src/assets/image/home.png'),
  //     welcome: require('../src/assets/image/home.png'),
  //     bigData: require('../src/assets/image/home.png'),
  //   }
  // },
  enableSystemUpdate: false, // 开启系统升级功能
  moveBar:false,  // 是否开启登录bar
  // queryConditionExpansion:true, // 一直收拉条件
  filterTablesOpenTab:['CUSTOMIZEREPORT'],   // 过滤表明新开
  noticeDuration: 60, // 异步通知停留时间
  // enableAsyncTaskTip: true, // 点击导出，如果是异步则立即弹出提示弹框。用于兼容旧版异步消息提示
  // filterComponentData:{    // 过滤框架的数据
  //     button:(data,$this)=>{
  //       if(Array.isArray(data)){
  //         //  子表
  //         let buttondata = data.reduce((arr,item)=>{
  //           // 去除导出导入
  //           if(item.eName !== 'actionEXPORT' && item.eName !== "actionIMPORT"){
  //               arr.push(item);
  //           }
  //           return arr;
  //         },[]);
  //         return buttondata;
  //       }else{
  //         // 标准列表加单对象主表
  //         let {buttonGroupShow} = data.buttonGroupShowConfig;
  //         if(Array.isArray(buttonGroupShow)){
  //           buttonGroupShow = buttonGroupShow.reduce((arr,item)=>{
  //             // 去除导出导入
  //             if(item.eName !== 'actionEXPORT' && item.eName !== "actionIMPORT"){
  //                 arr.push(item);
  //             }
  //             return arr;
  //           },[]);
  //           data.buttonGroupShowConfig.buttonGroupShow = buttonGroupShow;
  //         }

  //       }
  //       return data;
  //     }
  // },
  R3BrowserPrompt:true,
  asyncTaskScheme: 'skq',
  ResetrouterBackLogic:true,  // 显示返回按钮
  closedChangePassword:false // 是否关闭展示侧边修改密码配置
}