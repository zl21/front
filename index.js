import Vue from 'vue';
import VueDND from 'awe-dnd';
import { getGuid } from './src/__utils__/random';
import router from './src/__config__/router.config';
import store from './src/__config__/store.config';
import App from './src/App';
import './src/constants/dateApi';
import network from './src/__utils__/network';
import {
  backDashboardRoute, enableGateWay, enableInitializationRequest, HAS_BEEN_DESTROYED_MODULE, specifiedGlobalGateWay
} from './src/constants/global';
import { removeSessionObject, getSeesionObject } from './src/__utils__/sessionStorage';
import CompositeForm from './src/__component__/CompositeForm';
import customizedModalConfig from './src/__config__/customizeDialog.config';
import Loading from './src/__utils__/loading';
import getObjdisType from './src/__utils__/getObjdisType';
import projectConfig from './project.config';


// css import
import './node_modules/ag-grid/dist/styles/ag-grid.css';
import './src/assets/r3.iconfont/iconfont.css';
import './src/assets/css/ag-theme-balham.less';
import './src/assets/theme/custom.less';
import './src/assets/css/loading.css';
import './src/assets/css/custom-ext.less';
import '@syman/ark-ui/dist/styles/bjIconfonts/iconfont.css';

// Vue.use(VueDND);


// 注册自定义模态框组件
const registerCustomizedModal = () => {
  Object.keys(customizedModalConfig).forEach((modalName) => {
    Vue.component(modalName, ((customizedModalConfig[modalName] || {}).component) || {});
  });
};
registerCustomizedModal();

Vue.component('CompositeFormpop', CompositeForm);
Vue.use(Loading);

const createDOM = () => {
  const div = document.createElement('div');
  div.setAttribute('id', getGuid());
  document.body.appendChild(div);
  return div;
};

// 提前挂载方法
window.changeNavigatorSetting = (data) => {
  store.commit('global/changeNavigatorSetting', data);
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
const init = () => {
  removeSessionObject(HAS_BEEN_DESTROYED_MODULE);
  const rootDom = createDOM();
  window.vm = new Vue({
    router,
    store,
    render: createElement => createElement(App)
  }).$mount(rootDom);
  if (backDashboardRoute().filter(path => path === router.currentRoute.fullPath).length > 0) {
    router.push('/');
    setTimeout(() => {
      store.commit('global/updataOpenedMenuLists', []);
    }, 500);
  }
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
  

  window.getObjdisType = getObjdisType;
};
const getCategory = () => {
  if (enableInitializationRequest()) {
    network.post('/p/cs/getSubSystems').then((res) => {
      if (res.data.code === '-1') {
        backTouristRoute();
        // window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
        // router.push({ path: getTouristRoute() });
      } else if (res.data.data.length > 0) {
        store.commit('global/updateMenuLists', res.data.data);
        const serviceIdMaps = res.data.data.map(d => d.children)
          .reduce((a, c) => a.concat(c))
          .map(d => d.children)
          .reduce((a, c) => a.concat(c))
          .filter(d => d.type === 'table' || d.type === 'action' || d.type === 'tree')
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
          //
        const getServiceIdMap = JSON.parse(window.sessionStorage.getItem('serviceIdMap'));
        const serviceIdMapRes = Object.assign({}, getServiceIdMap, serviceIdMaps);
        window.sessionStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMapRes));
      } else if (getSeesionObject('loginStatus') === true) {
        setMessage({ content: '当前用户无菜单权限,将为您跳转到登陆界面' });
      }
    }).catch(() => { // 处理返回数据为空值情况，当返回数据为空时，避免直接跳转框架表单路由
      if (getSeesionObject('loginStatus') === true) {
        setMessage({ content: '当前用户无菜单权限,将为您跳转到登陆界面' });
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
    if (specifiedGlobalGateWay()) {
      window.sessionStorage.setItem('serviceId', specifiedGlobalGateWay());
      getCategory();
      setTimeout(() => {
        init();
      }, 0);
    } else {
      network.get('/p/c/get_service_id').then((res) => {
        if (res.data && res.data.data && res.data.data.serviceId) {
          window.sessionStorage.setItem('serviceId', res.data.data.serviceId);
        }
        getCategory();
        setTimeout(() => {
          init();
        }, 0);
      });
    }
  }
};


if (enableGateWay()) {
  getGateWayServiceId();
} else {
  getSubSystems();
  init();
}
window.ProjectConfig = projectConfig;

// 初始化配置的图片
store.commit('global/updateImage', window.ProjectConfig.image);
