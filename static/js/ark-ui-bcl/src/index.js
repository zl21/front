import Vue from 'vue'
import ArkUi from '@syman/ark-ui'
import './assets/tailwindcss/index.css'
import '@syman/ark-ui/dist/styles/ark-ui.css'
import '@syman/ark-ui/dist/styles/bjIconfonts/iconfont.css'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// import './utils/extent.js';
// import { Button, Card } from '@syman/ark-ui';
import App from './App.vue'
import router from './router/index'
import VueDND from 'awe-dnd'
// 全局指令
import inputNumber from './directive/inputNumber'

Vue.use(inputNumber)

Vue.use(ArkUi)
Vue.use(Viewer)
Vue.use(VueDND)

new Vue({
  el: '#app',
  router,
  render: (h) => h(App),
})

// router.beforeEach(async (to, from, next) => {
// });
