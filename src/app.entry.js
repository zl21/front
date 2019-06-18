import Vue from 'vue';
import VueRouter from 'vue-router';
import BurgeonUi from 'burgeon-ui';
import './assets/iconfont-r3/iconfont.css';
import { getGuid } from './__utils__/random';
import router from './__config__/router.config';
import routerPrototype from './__config__/router.prototype';
import store from './__config__/store.config';
import App from './App';
import 'burgeon-ui/src/styles/common/iconfont/bjIconfonts/iconfont';
import './assets/theme/custom.less';
import './constants/dateApi';

import network from './__utils__/network';
import { enableGateWay } from './constants/global';
import CompositeForm from './__component__/CompositeForm';


Vue.component('CompositeForm', CompositeForm);
Vue.use(BurgeonUi);

const createRouter = routes => new VueRouter({
  routes,
  mode: 'history'
});

const createDOM = () => {
  const div = document.createElement('div');
  div.setAttribute('id', getGuid());
  document.body.appendChild(div);
  return div;
};

const init = () => {
  const rootDom = createDOM();
  window.vm = new Vue({
    router,
    store,
    render: createElement => createElement(App)
  }).$mount(rootDom);
};

const getCategory = () => {
  network.post('/p/cs/getSubSystems').then((res) => {
    if (res.data.data) {
      store.commit('global/updateMenuLists', res.data.data);
      const serviceIdMaps = res.data.data.map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .filter(d => d.type === 'table' || d.type === 'action')
        .reduce((a, c) => { a[c.value.toUpperCase()] = c.serviceId; return a; }, {});
      window.sessionStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMaps));
    }
  });
};

const getGateWayServiceId = () => {
  network.get('/p/c/get_service_id').then((res) => {
    window.sessionStorage.setItem('serviceId', res.data.data.serviceId);
    getCategory();
    setTimeout(() => {
      init();
    }, 0);
  });
};

export default (projectConfig = { globalComponent: undefined, Login: undefined }) => {
  const globalComponent = projectConfig.globalComponent || {};
  routerPrototype.forEach((d) => {
    if (d.children) {
      d.children.forEach((c) => {
        if (c.component.name === 'WelcomePage' && globalComponent.WelcomePage) {
          c.component = globalComponent.WelcomePage;
        }
      });
    }
    if (d.component.name === 'Login' && globalComponent.Login) {
      d.component = globalComponent.Login;
    }
  });
  router.matcher = createRouter(routerPrototype).matcher;
  if (enableGateWay) {
    getGateWayServiceId();
  } else {
    init();
  }
};
