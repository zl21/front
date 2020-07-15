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
import { DispatchEvent } from './__utils__/dispatchEvent';
import {
  mock, backDashboardRoute, enableGateWay, enableJflow, jflowRequestDomain, closeJflowIcon, encryptionJflow, enableInitializationRequest, specifiedGlobalGateWay, HAS_BEEN_DESTROYED_MODULE
} from './constants/global';
import { removeSessionObject, getSeesionObject } from './__utils__/sessionStorage';
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
// const createRouter = routes => new VueRouter({
//   routes,
//   mode: mock() ? 'hash' : 'history'
// });
const mode = mock() ? 'hash' : 'history';

const createRouter = routes => new VueRouter({
  routes,
  mode
});


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
  window.R3message = (data) => {
    window.vm.$Modal.fcError({
      mask: data.mask,
      titleAlign: 'center',
      title: data.title,
      // content: formatJsonEmg
      render: h => h('div', {
        style: {
          padding: '10px 20px 0',
          display: 'flex',
          // alignItems: 'center',
          lineHeight: '16px'
        }
      }, [
        
        h('i', {
          props: {
          },
          style: {
            marginRight: '5px',
            display: 'inline-block',
            'font-size': '28px',
            'margin-right': ' 10px',
            'line-height': ' 1',
            padding: ' 10px 0',
            color: 'red'
          },
          class: 'iconfont iconbj_error fcError '
        }),
        h('div', {
          attrs: {
          },
          domProps: {
          },
          style: `width: 80%;
              margin: 1px;
              margin-bottom: -8px;
              box-sizing: border-box;
              padding: 5px;
              resize: none;
              max-height: 100px;
              max-width: 300px;
              overflow: auto;
              `
        }, data.content)
      ])
    });
  };
  if (backDashboardRoute().filter(path => path === router.currentRoute.fullPath).length > 0) {
    router.push('/');
    setTimeout(() => {
      store.commit('global/updataOpenedMenuLists', []);
    }, 500);
  }
};
const backTouristRoute = () => {
  // window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
  // router.push({ path: getTouristRoute() });
  store.dispatch('global/signout');
};

const setMessage = (data) => {
  window.vm.$Modal.fcError({
    title: '提示',
    content: data.content,
    cancelType: true,
    titleAlign: 'left',
    mask: true,
    draggable: true,
    closable: false,
    onCancel: () => {
      backTouristRoute();
    },
    onOk: () => {
      backTouristRoute();
    },
  });
};

const getCategory = () => {
  if (enableInitializationRequest()) {
    network.post('/p/cs/getSubSystems').then((res) => {
      if (res.data.code === '-1') {
        backTouristRoute();
      } else if (res.data.data.length > 0) {
        store.commit('global/updateMenuLists', res.data.data);
        const serviceIdMaps = res.data.data.map(d => d.children)
          .reduce((a, c) => a.concat(c), [])
          .map(d => d.children)
          .reduce((a, c) => a.concat(c), [])
          .filter(d => d.type === 'table' || d.type === 'action' || d.type === 'tree')
          .reduce((a, c) => { a[c.value.toUpperCase()] = c.serviceId; return a; }, {});
        window.sessionStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMaps));
        DispatchEvent('gatewayReady');
      } else if (getSeesionObject('loginStatus') === true) {
        setMessage({ content: '当前用户无菜单权限,将为您跳转到登陆界面' });
      }
    }).catch(() => {
      // router.push({ path: getTouristRoute() });
      if (getSeesionObject('loginStatus') === true) {
        setMessage({ content: '当前用户无菜单权限,将为您跳转到登陆界面' });
      }
    });
  }
};

const getGateWayServiceId = () => {
  if (enableInitializationRequest()) {
    if (specifiedGlobalGateWay()) {
      window.sessionStorage.setItem('serviceId', specifiedGlobalGateWay());
      getCategory();
      setTimeout(() => {
        init();
      }, 0);
    } else {
      network.get('/p/c/get_service_id').then((res) => {
        window.sessionStorage.setItem('serviceId', res.data.data.serviceId);
        getCategory();
        setTimeout(() => {
          init();
        }, 0);
      });
    }
  }
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
      jflowIp: jflowRequestDomain(),
      closeJflowIcon: closeJflowIcon(),
      encryptionJflow: encryptionJflow()
    });
  }
  if (enableGateWay()) {
    getGateWayServiceId();
  } else {
    init();
    getCategory();
  }
};
