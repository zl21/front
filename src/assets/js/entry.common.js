import VueDND from 'awe-dnd';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css'

import CompositeForm from '../../__component__/CompositeForm.vue';
import panelForm from '../../__component__/FormComponents/PanelForm/panelForm.vue'
import listsForm from '../../__component__/FormComponents/list/listsForm.vue'

import R3Dialog from '../../__globalComponentModule__/dialog';
import { createWatermark } from '../../__utils__/waterMark';
import '../../__utils__/i18n' // 挂载i18n方法
import '../../constants/dateApi';
import '../../__utils__/getChildComponent'

Vue.use(VueDND);
Vue.use(Viewer);
Vue.use(R3Dialog); // 注册全局api调用组件

Vue.component('panelForm',panelForm)
Vue.component('listsForm',listsForm)
Vue.component('CompositeFormpop', CompositeForm);

Vue.prototype.$createWatermark = createWatermark;// 挂在水印

