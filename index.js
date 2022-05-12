import Vue from 'vue';
// import { getGuid } from './src/__utils__/random';
// import router from './src/__config__/router.config';
import store from './src/__config__/store.config';
// import App from './src/App.vue';
// import i18n from './src/assets/js/i18n';
import network from './src/__utils__/network';
import changeThemeColor from 'webpack-theme-color-replacer-syman/src/views/index';
// console.log(changeThemeColor,'====changeThemeColor');
import {
  backDashboardRoute, enableGateWay, enableInitializationRequest, HAS_BEEN_DESTROYED_MODULE, specifiedGlobalGateWay
} from './src/constants/global';
// import { removeSessionObject, getSessionObject } from './src/__utils__/sessionStorage';
// import { getLocalObject } from './src/__utils__/localStorage';

import customizedModalConfig from './src/__config__/customizeDialog.config';
import Loading from './src/__utils__/loading';
// import getObjdisType from './src/__utils__/getObjdisType';
import projectConfig from './projectConfig/project.config';
import './src/assets/js/entry.common'
import { packageMessage, hookAJAX, getCategory, getGateWayServiceId, init } from './src/assets/js/entry.constant'

// css import
// 组件css汇总
import './src/index.less';
import './src/assets/theme/custom.less';

// import jflowPlugin,  { components } from '@syman/jflow-plugin';
// import '@syman/jflow-plugin/dist/jflowPlugin.min.css'

// Vue.use(jflowPlugin, {
//   changePattern: true, // 控制待办列表转派的选择模式 true为单选,false为多选
//   gateway: null  //jflow网关配置
// });


// import jflowPlugin from './jflowPlugin/js/index';
// import './src/__utils__/encryptingParameter';




// import jflowPlugin from './jflowPlugin/js/index';
// import './src/__utils__/encryptingParameter';




// Vue.use(jflowPlugin, {
//   changePattern: true, // 控制待办列表转派的选择模式 true为单选,false为多选
//   gateway: '',
//   roleSwitch: false
// });

projectConfig.packageMessage = packageMessage;
window.ProjectConfig = projectConfig;

// 初始化图片配置
if (projectConfig.image) {
  store.commit('global/updateImage', projectConfig.image);
}

// 注册自定义模态框组件
const registerCustomizedModal = () => {
  Object.keys(customizedModalConfig).forEach((modalName) => {
    Vue.component(modalName, ((customizedModalConfig[modalName] || {}).component) || {});
  });
};
registerCustomizedModal();

Vue.use(Loading);
Vue.use(changeThemeColor);

// const backTouristRoute = () => {
//   // window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
//   // router.push({ path: getTouristRoute() });
//   store.dispatch('global/signout');
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

// const init = () => {
  // removeSessionObject(HAS_BEEN_DESTROYED_MODULE);

  // // 初始化配置的图片
  // if (projectConfig && projectConfig.image) {
  //   store.commit('global/updateImage', projectConfig.image);
  // }

  // const rootDom = createDOM();
  // window.vm = new Vue({
  //   router,
  //   store,
  //   i18n,
  //   render: createElement => createElement(App)
  // }).$mount(rootDom);
  // if (backDashboardRoute().filter(path => path === router.currentRoute.fullPath).length > 0) {
  //   router.push('/');
  //   setTimeout(() => {
  //     store.commit('global/updataOpenedMenuLists', []);
  //   }, 500);
  // }
  // window.R3message = (data) => {
  //   window.vm.$Modal.fcError({
  //     mask: data.mask,
  //     titleAlign: 'center',
  //     title: data.title,
  //     // content: formatJsonEmg
  //     render: h => h('div', {
  //       style: {
  //         padding: '10px 20px 0',
  //         display: 'flex',
  //         // alignItems: 'center',
  //         lineHeight: '16px'
  //       }
  //     }, [

  //       h('i', {
  //         props: {
  //         },
  //         style: {
  //           marginRight: '5px',
  //           display: 'inline-block',
  //           'font-size': '28px',
  //           'margin-right': ' 10px',
  //           'line-height': ' 1',
  //           padding: ' 10px 0',
  //           color: 'red'
  //         },
  //         class: 'iconfont iconbj_error fcError '
  //       }),
  //       h('div', {
  //         attrs: {
  //         },
  //         domProps: {
  //         },
  //         style: `width: 80%;
  //             margin: 1px;
  //             margin-bottom: -8px;
  //             box-sizing: border-box;
  //             padding: 5px;
  //             resize: none;
  //             max-height: 100px;
  //             max-width: 300px;
  //             overflow: auto;
  //             `
  //       }, data.content)
  //     ])
  //   });
  // };


  // window.getObjdisType = getObjdisType;
// };

// const getCategory = () => {
//   if (enableInitializationRequest()) {
//     network.post('/p/cs/getSubSystems').then((res) => {
//       if (res.data.code === '-1') {
//         backTouristRoute();
//         // window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
//         // router.push({ path: getTouristRoute() });
//       } else if (res.data.data.length > 0) {
//         store.commit('global/updateMenuLists', res.data.data);
//         const serviceIdMaps = res.data.data.map(d => d.children)
//           .reduce((a, c) => a.concat(c))
//           .map(d => d.children)
//           .reduce((a, c) => a.concat(c))
//           .filter(d => d.type === 'table' || d.type === 'action' || d.type === 'tree')
//           .reduce((a, c) => {
//             let menuType = '';
//             if (c.url) {
//               menuType = c.url.substring(c.url.lastIndexOf('/') + 1, c.url.length);
//             }
//             if (menuType === 'New') {
//               const i = c.url.substring(c.url.indexOf('/') + 1, c.url.lastIndexOf('/'));
//               const n = i.substring(i.indexOf('/') + 1, i.lastIndexOf('/'));
//               const name = n.substring(n.lastIndexOf('/') + 1, n.length);
//               a[name.toUpperCase()] = c.serviceId;
//             } else {
//               a[c.value.toUpperCase()] = c.serviceId;
//             }
//             return a;
//           }, {});
//           //
//         const getServiceIdMap = JSON.parse(window.localStorage.getItem('serviceIdMap'));
//         const serviceIdMapRes = Object.assign({}, getServiceIdMap, serviceIdMaps);
//         window.localStorage.setItem('serviceIdMap', JSON.stringify(serviceIdMapRes));
//       } else if (getLocalObject('loginStatus') === true) {
//         // getSessionObject('loginStatus') === true
//         setMessage({ content: i18n.t('messages.NoMenuPermission') });
//       }
//     });
//   }
// };

const getSubSystems = () => {
  if (enableInitializationRequest()) {
    network.post('/p/cs/getSubSystems').then((res) => {
      if (res.data.data) {
        store.commit('global/updateMenuLists', res.data.data);
      }
    });
  }
};


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
//         if (res.data && res.data.data && res.data.data.serviceId) {
//           window.localStorage.setItem('serviceId', res.data.data.serviceId);
//         }
//         getCategory();
//         setTimeout(() => {
//           init();
//         }, 0);
//       });
//     }
//   }
// };


if (enableGateWay()) {
  getGateWayServiceId();
} else {
  window.localStorage.setItem('serviceId', '') // 清除本地网关
  getSubSystems();
  init();
}


hookAJAX();

