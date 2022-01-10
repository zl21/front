import Vue from 'vue'
import R3 from '../r3.publish/r3.min'
import '../src/assets/theme/custom.less'
import '@syman/ark-ui/dist/styles/bjIconfonts/iconfont.css'
import '../r3.publish/r3.min.css'

import projectConfig from '../projectConfig/project.config';

// const R3 = window.R3.default
Window.R3 = R3;

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
  ...projectConfig
})
