import Vue from 'vue'
import R3 from '../r3.publish/r3.min'
import '../src/assets/theme/custom.less'
import '@syman/ark-ui/dist/styles/bjIconfonts/iconfont.css'
import '../r3.publish/r3.min.css'

import projectConfig from '../projectConfig/project.config';
import changeThemeColor from 'webpack-theme-color-replacer-syman/src/views/index';

// const R3 = window.R3.default
window.R3 = R3;

Vue.use(changeThemeColor);
const {
  network,
  urlSearchParams
} = R3;

// R3.setHookAJAX(function($ajax){
//   $ajax.setRequestHeader('SSSSS-Aq', new Date().getTime());
// })

const keyList = ['login', 'banner', 'welcome', 'bigData']
const zhImg = {}
const enImg = {}
keyList.forEach((key) => {
  zhImg[key] = require('../src/assets/image/delete.png')
})
keyList.forEach((key) => {
  enImg[key] = require('../src/assets/image/home.png')
})

Vue.prototype.$network = network
Vue.prototype.$urlSearchParams = urlSearchParams
R3.launchApplication({
  ...projectConfig,
  SetCustomModal:require('../demo/CustomModal').default,
})
