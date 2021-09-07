import Vue from 'vue';
import R3 from './r3.publish/r3.min';
//  import '@syman/ark-ui/dist/styles/ark-ui.css'
import './src/assets/theme/custom.less';
 import '@syman/ark-ui/dist/styles/bjIconfonts/iconfont.css';
 import './r3.publish/r3.min.css';
 import externalTreeDatasConfig from './demo/treeData/treeData.config.js';//

// const R3 = window.R3.default

const {
  network,
  urlSearchParams
} = R3;

Vue.prototype.$network = network;
Vue.prototype.$urlSearchParams = urlSearchParams;
R3.launchApplication({
  layoutDirection: false,
  externalTreeDatas: externalTreeDatasConfig,
  // appLayout: require('./src/config/appLayout.js').default,
  ignoreGateWayPattern: [/\/jflow\/*/g, /\/api\/*/g], // 框架默认禁用的网关逻辑的正则模式匹配
  Version: '1.4', // 版本号
  messageSwitch:true,
  layoutDirectionSlot:{  // 模板渲染
    //NavigatorSubMenu:require('./src/demo/NavigatorSubMenu.vue').default,  // 模板渲染
    //NaVertical:require('./src/demo/NaVerticalslot.vue').default  // 模板渲染
    listFormButton:require('./demo/detailbuttons.vue').default,  // 定制列表button
  },
  enableGateWay: true, // 网关是否打开,
  enableLoginPro: true, // 是否开启普通登录模式 false普通 true手机验证码
  filterURL: [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g],
  routerFilter:true, // 跳转是否过滤
  listFormWebconf: [],
  domPortal: {
    // params对象属性,fromComponent用于区别哪个组件的水印,type区分布局结构
    waterMark(params) {
      if(params.fromComponent === 'SingleObjectButtons') {
        return params.type === 'horizontal'? '.panelForm': '.verticalTableDetailContent'
      }
      return false
    }
  },
  lang: 'en',
  imageAssets: {
    // 与projectConfig.image区别在于这个图片是含有文字的,用于国际化场景
    // 格式必须是 （变量+语言）方便解析
    'login-zh': require('./src/assets/image/delete.png'), // 中文登录logo
    'login-en': require('./src/assets/image/home.png'),// 英文登录logo,
    'banner-zh': require('./src/assets/image/delete.png'), // 中文导航栏logo
    'banner-en': require('./src/assets/image/home.png'), // 英文导航栏logo
    'welcome-zh': require('./src/assets/image/delete.png'), // 中文欢迎页背景
    'welcome-en': require('./src/assets/image/home.png'), // 英文欢迎页背景
    'bigData-zh': require('./src/assets/image/delete.png'), // 中文海量数据提示
    'bigData-en': require('./src/assets/image/home.png'), // 英文海量数据提示
  }
});
