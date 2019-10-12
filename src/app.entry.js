import Vue from 'vue';
import VueRouter from 'vue-router';
import BurgeonUi from 'burgeon-ui';
import axios from 'axios';

import { getGuid } from './__utils__/random';
import router from './__config__/router.config';
import routerPrototype from './__config__/router.prototype';
import store from './__config__/store.config';
import App from './App';
import './constants/dateApi';
import network from './__utils__/network';
import { enableGateWay, enableJflow, jflowRequestDomain } from './constants/global';
import customizedModalConfig from './__config__/customizeDialog.config';
import CompositeForm from './__component__/CompositeForm';
import Loading from './__utils__/loading';
// css import
import '../node_modules/ag-grid/dist/styles/ag-grid.css';
import './assets/css/ag-theme-balham.less';
import './assets/css/loading.css';
import './assets/css/custom-ext.less';

import jflowplugin from './plugin/jflow-plugin';

Vue.component('CompositeFormpop', CompositeForm);
Vue.use(BurgeonUi);
Vue.use(Loading);

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

export default (projectConfig = {
  globalComponent: undefined,
  projectRoutes: undefined,
  externalModals: undefined
}) => {
  const globalComponent = projectConfig.globalComponent || {};
  const projectRoutes = projectConfig.projectRoutes || [];
  const externalModals = projectConfig.externalModals || {};
  // 替换登录页 | 欢迎页
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

  // 挂载外部路由
  if (Object.prototype.toString.call(projectRoutes) === '[object Array]') {
    router.matcher = createRouter(routerPrototype.concat(projectRoutes)).matcher;
  } else {
    router.matcher = createRouter(routerPrototype).matcher;
  }

  // 注册自定义全局弹框（模态框）组件
  const modalConfig = Object.assign({}, customizedModalConfig, externalModals);
  Object.keys(modalConfig).forEach((modalName) => {
    Vue.component(modalName, ((modalConfig[modalName] || {}).component) || {});
  });

  // 启动
  if (enableJflow() && jflowRequestDomain()) {
    Vue.use(jflowplugin, {
      router,
      axios,
      store,
      jflowIp: jflowRequestDomain()
    });
  }
  if (enableGateWay()) {
    getGateWayServiceId();
  } else {
    init();
    getCategory();
  }
};
