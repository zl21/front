import Vue from 'vue';
import VueDND from 'awe-dnd';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css'

import CompositeForm from '../../__component__/CompositeForm.vue';
import panelForm from '../../__component__/FormComponents/PanelForm/panelForm.vue'
import listsForm from '../../__component__/FormComponents/list/listsForm.vue'

import '../../__utils__/i18n' // 挂载i18n方法
import '../../constants/dateApi';
import '../../__utils__/getChildComponent'
import R3Dialog from '../../__globalComponentModule__/dialog';
import { createWatermark } from '../../__utils__/waterMark';
import store from '../../__config__/store.config';
import { addSearch } from '../../__utils__/indexedDB'
import SvgIcon from '../../__component__/SvgIcon/index.vue'// svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('../svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

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
