import router from './__config__/router.config';
import routerPrototype from './__config__/router.prototype';
import store from './__config__/store.config';
// import App from './App';
// import i18n from './assets/js/i18n';
// import network from './__utils__/network';
// import { DispatchEvent } from './__utils__/dispatchEvent';
import {
  mock, backDashboardRoute, enableGateWay, enableInitializationRequest, specifiedGlobalGateWay, HAS_BEEN_DESTROYED_MODULE
} from './constants/global';
// import { removeSessionObject, getSessionObject } from './__utils__/sessionStorage';
import customizedModalConfig from './__config__/customizeDialog.config';
import Loading from './__utils__/loading';
// import { getLocalObject } from './__utils__/localStorage';

// import getObjdisType from './__utils__/getObjdisType';

import { getCategory, getGateWayServiceId, init } from './assets/js/entry.constant'
import './assets/js/entry.common'


// import './assets/css/loading.css';
import './assets/css/custom-ext.less';





// const createRouter = routes => new VueRouter({
//   routes,
//   mode: mock() ? 'hash' : 'history'
// });
const mode = mock() ? 'hash' : 'history';

const createRouter = routes => new VueRouter({
  routes,
  mode
});

// const init = () => {
//   removeSessionObject(HAS_BEEN_DESTROYED_MODULE);
//   const rootDom = createDOM();
//   window.vm = new Vue({
//     router,
//     store,
//     i18n,
//     render: createElement => createElement(App)
//   }).$mount(rootDom);
  
//   window.R3message = (data) => {
//     window.vm.$Modal.fcError({
//       mask: data.mask,
//       titleAlign: 'center',
//       title: data.title,
//       // content: formatJsonEmg
//       render: h => h('div', {
//         style: {
//           padding: '10px 20px 0',
//           display: 'flex',
//           // alignItems: 'center',
//           lineHeight: '16px'
//         }
//       }, [
        
//         h('i', {
//           props: {
//           },
//           style: {
//             marginRight: '5px',
//             display: 'inline-block',
//             'font-size': '28px',
//             'margin-right': ' 10px',
//             'line-height': ' 1',
//             padding: ' 10px 0',
//             color: 'red'
//           },
//           class: 'iconfont iconbj_error fcError '
//         }),
//         h('div', {
//           attrs: {
//           },
//           domProps: {
//           },
//           style: `width: 80%;
//               margin: 1px;
//               margin-bottom: -8px;
//               box-sizing: border-box;
//               padding: 5px;
//               resize: none;
//               max-height: 100px;
//               max-width: 300px;
//               overflow: auto;
//               `
//         }, data.content)
//       ])
//     });
//   };

//   window.getObjdisType = getObjdisType;
//   if (backDashboardRoute().filter(path => path === router.currentRoute.fullPath).length > 0) {
//     router.push('/');
//     setTimeout(() => {
//       store.commit('global/updataOpenedMenuLists', []);
//     }, 500);
//   }
//   DispatchEvent('initReady');
// };


// const setMessage = (data) => {
//   window.vm.$Modal.fcError({
//     title: i18n.t('feedback.alert'),
//     content: data.content,
//     cancelType: true,
//     titleAlign: 'left',
//     mask: true,
//     draggable: true,
//     closable: false,
//     onCancel: () => {
//       backTouristRoute();
//     },
//     onOk: () => {
//       backTouristRoute();
//     },
//   });
// };

// const getCategory = () => {
//   if (enableInitializationRequest()) {
//     network.post('/p/cs/getSubSystems').then((res) => {
//       if (res.data.code === '-1') {
//         backTouristRoute();
       
//       } else if (res.data.data.length > 0) {
//         store.commit('global/updateMenuLists', res.data.data);
//         const serviceIdMaps = res.data.data.map(d => d.children)
//           .reduce((a, c) => a.concat(c), [])
//           .map(d => d.children)
//           .reduce((a, c) => a.concat(c), [])
//           .filter(d => d.type === 'table' || d.type === 'action' || d.type === 'tree')
//           .reduce((a, c) => { a[c.value.toUpperCase()] = c.serviceId; return a; }, {});
//         window.localStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMaps));
//         DispatchEvent('gatewayReady');
//       } else if (getLocalObject('loginStatus') === true) {
//         // getSessionObject('loginStatus') === true
//         setMessage({ content: i18n.t('messages.NoMenuPermission') });
//       }
//     }).catch(() => {
//       // router.push({ path: getTouristRoute() });
//       if (getSessionObject('loginStatus') === true) {
//         setMessage({ content: i18n.t('messages.NoMenuPermission') });
//       }
//     });
//   }
// };

// const getGateWayServiceId = () => {
//   if (enableInitializationRequest()) {
//     if (specifiedGlobalGateWay()) {
//       window.localStorage.setItem('serviceId', specifiedGlobalGateWay());
//       getCategory();
//       setTimeout(() => {
//         init();
//       }, 0);
//     } else {
//       network.get('/p/c/get_service_id').then((res) => {
//         window.localStorage.setItem('serviceId', res.data.data.serviceId);
//         getCategory();
//         setTimeout(() => {
//           DispatchEvent('serviceIdReady', {
//             detail: {
//               serviceId: res.data.data.serviceId
//             }
//           });
//           init();
//         }, 0);
//       });
//     }
//   }
// };

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

  // 初始化图片配置
  if (projectConfig.image) {
    store.commit('global/updateImage', projectConfig.image);
  }

  // 挂载外部路由
  if (Object.prototype.toString.call(projectRoutes) === '[object Array]') {
    router.matcher = createRouter(routerPrototype.concat(projectRoutes)).matcher;
  } else {
    router.matcher = createRouter(routerPrototype).matcher;
  }

  // 等路由挂载完毕再注册，避免丢失路由
  Vue.use(Loading);

  // 注册自定义全局弹框（模态框）组件
  const modalConfig = Object.assign({}, customizedModalConfig, externalModals);
  Object.keys(modalConfig).forEach((modalName) => {
    Vue.component(modalName, ((modalConfig[modalName] || {}).component) || {});
  });
  // 启动
  if (enableGateWay()) {
    getGateWayServiceId();
  } else {
    init();
    getCategory();
  }
};
