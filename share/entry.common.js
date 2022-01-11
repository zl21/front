import Vue from 'vue';
import VueDND from 'awe-dnd';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css'

import CompositeForm from '../src/__component__/CompositeForm.vue';
import panelForm from '../src/__component__/FormComponents/PanelForm/panelForm.vue'
import listsForm from '.../src/__component__/FormComponents/list/listsForm.vue'

import '../src/__utils__/i18n' // 挂载i18n方法
import '../src/constants/dateApi';
import '../src/__utils__/getChildComponent'
import R3Dialog from '../src/__globalComponentModule__/dialog';
import { createWatermark } from '../src/__utils__/waterMark';
import store from '../src/__config__/store.config';
import { addSearch } from '../src/__utils__/indexedDB'

Vue.use(VueDND);
Vue.use(Viewer);
Vue.use(R3Dialog); // 注册全局api调用组件

Vue.component('panelForm',panelForm)
Vue.component('listsForm',listsForm)
Vue.component('CompositeFormpop', CompositeForm);

Vue.prototype.$createWatermark = createWatermark;// 挂在水印

// 提前挂载方法
window.changeNavigatorSetting = (data) => {
  store.commit('global/changeNavigatorSetting', data);
};

// 挂在indexDB方法
window.indexedDBApi = {
  addSearch
};