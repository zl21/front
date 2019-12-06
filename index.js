import Vue from 'vue';
import VueDND from 'awe-dnd';
import BurgeonUi from 'burgeon-ui';
import axios from 'axios';
import { getGuid } from './src/__utils__/random';
import router from './src/__config__/router.config';
import store from './src/__config__/store.config';
import App from './src/App';
import './src/constants/dateApi';
import network from './src/__utils__/network';
import {
  enableGateWay, enableJflow, jflowRequestDomain, closeJflowIcon, enableInitializationRequest, HAS_BEEN_DESTROYED_MODULE
} from './src/constants/global';
import { removeSessionObject } from './src/__utils__/sessionStorage';
import CompositeForm from './src/__component__/CompositeForm';
import customizedModalConfig from './src/__config__/customizeDialog.config';
import Loading from './src/__utils__/loading';
// css import
import './node_modules/ag-grid/dist/styles/ag-grid.css';
import './src/assets/r3.iconfont/iconfont.css';
import './src/assets/css/ag-theme-balham.less';
import './src/assets/theme/custom.less';
import './src/assets/css/loading.css';
import './src/assets/css/custom-ext.less';

import jflowplugin from './src/plugin/jflow-plugin';

Vue.use(VueDND);

if (enableJflow() && jflowRequestDomain()) {
  Vue.use(jflowplugin, {
    router,
    axios,
    store,
    jflowIp: jflowRequestDomain(),
    closeJflowIcon: closeJflowIcon()
  });
}


// 注册自定义模态框组件
const registerCustomizedModal = () => {
  Object.keys(customizedModalConfig).forEach((modalName) => {
    Vue.component(modalName, ((customizedModalConfig[modalName] || {}).component) || {});
  });
};
registerCustomizedModal();

Vue.component('CompositeFormpop', CompositeForm);
Vue.use(BurgeonUi);
Vue.use(Loading);

const createDOM = () => {
  const div = document.createElement('div');
  div.setAttribute('id', getGuid());
  document.body.appendChild(div);
  return div;
};
const init = () => {
  removeSessionObject(HAS_BEEN_DESTROYED_MODULE);
  const rootDom = createDOM();
  window.vm = new Vue({
    router,
    store,
    render: createElement => createElement(App)
  }).$mount(rootDom);
};
const getCategory = () => {
  if (enableInitializationRequest()) {
    network.post('/p/cs/getSubSystems').then((res) => {
      if (res.data.data) {
        store.commit('global/updateMenuLists', res.data.data);
        const serviceIdMaps = res.data.data.map(d => d.children)
          .reduce((a, c) => a.concat(c))
          .map(d => d.children)
          .reduce((a, c) => a.concat(c))
          .filter(d => d.type === 'table' || d.type === 'action')
          .reduce((a, c) => {
            let menuType = '';
            if (c.url) {
              menuType = c.url.substring(c.url.lastIndexOf('/') + 1, c.url.length);
            }
            if (menuType === 'New') {
              const i = c.url.substring(c.url.indexOf('/') + 1, c.url.lastIndexOf('/'));
              const n = i.substring(i.indexOf('/') + 1, i.lastIndexOf('/'));
              const name = n.substring(n.lastIndexOf('/') + 1, n.length);
              a[name.toUpperCase()] = c.serviceId;
            } else {
              a[c.value.toUpperCase()] = c.serviceId; 
            }
            return a;
          }, {});
        window.sessionStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMaps));
      }
    });
  }
};
const getSubSystems = () => {
  if (enableInitializationRequest()) {
    network.post('/p/cs/getSubSystems').then((res) => {
      if (res.data.data) {
        store.commit('global/updateMenuLists', res.data.data);
      }
    });
  }
};
const getGateWayServiceId = () => {
  if (enableInitializationRequest()) {
    network.get('/p/c/get_service_id').then((res) => {
      window.sessionStorage.setItem('serviceId', res.data.data.serviceId);
      getCategory();
      setTimeout(() => {
        init();
      }, 0);
    });
  }
};
if (enableGateWay()) {
  getGateWayServiceId();
} else {
  getSubSystems();
  init();
}
