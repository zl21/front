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
  enableGateWay: true, // 网关是否打开,
});
