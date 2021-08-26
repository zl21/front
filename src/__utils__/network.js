import axios from 'axios';
import md5 from 'md5';
import router from '../__config__/router.config';
import store from '../__config__/store.config';
import { filterUrl, isJSON } from "./utils";

import {
  ignoreGateWay, ignorePattern, enableGateWay, globalGateWay, getProjectQuietRoutes, REQUEST_PENDDING_EXPIRE, getTouristRoute, logoutTips, Version, filterUrlForNetworkScript, getFilterUrlForNetworkData,autoGatewayUrl
} from '../constants/global';
import { addNetwork } from './indexedDB';

// import FilterUrlForNetwork from '../launchApplicationConfig/filterUrlForNetwork';
import {
  updateSessionObject, removeSessionObject, getSessionObject
} from './sessionStorage';




const CancelToken = axios.CancelToken;
window.cancle = null;

// const axios = Axios.create();

let tableNameForGet = '';
let closeMessage = false;
const pendingRequestMap = {};
window.pendingRequestMap = pendingRequestMap;

// const getProjectQuietRoutes = () => {
//   const { quietRoutes } = window.ProjectConfig || {};
//   return (defaultQuietRoutes.concat(quietRoutes || [])) || [];
// };

const matchGateWay = (url) => {
  const { tableName, customizedModuleName } = router.currentRoute.params;
  const globalServiceId = window.localStorage.getItem('serviceId');
  const serviceIdMap = Object.assign({}, store.state.global.serviceIdMap, JSON.parse(window.localStorage.getItem('serviceIdMap')));
  // eslint-disable-next-line no-empty
  if (!enableGateWay() || url.indexOf('/getMsgCnt') >= 0) {
    return undefined;
  }
  if (ignoreGateWay.includes(url) || ignorePattern().some(d => url.match(d))) {
    return undefined;
  }

  if (globalGateWay().includes(url)) {
    return globalServiceId || undefined;
  }
  if (tableName || tableNameForGet) {
    if (serviceIdMap[tableName || tableNameForGet]) {
      const serviceIdMapApi = serviceIdMap[tableName || tableNameForGet];
      if (tableNameForGet) {
        tableNameForGet = '';
      }
      return serviceIdMapApi || undefined;
    }
  } else if (customizedModuleName) {
    if (serviceIdMap[customizedModuleName]) {
      const serviceIdMapApi = serviceIdMap[customizedModuleName];
      return serviceIdMapApi || undefined;
    }
  }
  return undefined;
};

const getRequestMd5 = data => md5(JSON.stringify(data));

const dispatchR3Event = (data) => {
  const globalServiceId = window.localStorage.getItem('serviceId');
  const gateWay = matchGateWay((data.url || '').replace(`${globalServiceId ? `/${globalServiceId}` : ''}`, ''));
  if (gateWay) {
    data.url = data.url.replace(`/${gateWay}`, '');
  }
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('network', {
      detail: Object.assign({}, data || {}, { urlGateway: gateWay })
    }));
  }, 10);
};
//http request 拦截器
axios.interceptors.request.use(
  config => {
      // if(window.ProjectConfig.enciphered){}


        let number = Math.floor(Math.random() * 10000);
        let sessionCookie = window.localStorage.getItem('sessionCookie');
        config.headers['SSSSS-A'] = new Date().getTime();
        if(sessionCookie === 'undefined'){
          config.headers['SSSSS-B'] = md5('qwertburgeon'+new Date().getTime()+number);
        }else{
          config.headers['SSSSS-B'] = md5('qwertburgeon'+new Date().getTime()+number+sessionCookie);
        }

        config.headers['SSSSS-C'] = number;

      return config
  }
)
axios.interceptors.response.use(

  (response) => {
    const { config } = response;
    const isJson = (config.headers['Content-Type'] || '').indexOf('application/json') > -1;
    let data = {};

    if (config.method === 'get' && config) {
      if (config.params) {
        data = config.params;
      } else {
        data = config.data;
      }
    } else {
      data = config.data;
    }

    let isJsonObject = false;
    try {
      JSON.parse(data);
      isJsonObject = true;
    } catch (e) {
      isJsonObject = false;
    }
    const requestMd5 = md5(JSON.stringify({
      data: isJson && isJsonObject ? JSON.parse(data) : data,
      url: config.url,
      method: config.method
    }));

    // 记录每次网络请求的时间
    if (pendingRequestMap[requestMd5]) {
      try {
        addNetwork([{
          timecost: Date.now() - pendingRequestMap[requestMd5].reqTime,
          url: config.url,
          data: isJson ? JSON.parse(config.data) : config.data,
          method: config.method,
          isJson,
          reqTime: pendingRequestMap[requestMd5].reqTime
        }]);
      } catch (e) {
        console.warn(e);
      }
    }
    const filterUrlParams = {
      url: response.config.url,
      router: router.currentRoute,
      config: getFilterUrlForNetworkData
    };
    // window.ProjectConfig = {
    //   filterUrlForNetworkScript: FilterUrlForNetwork
    // };
    if (filterUrlForNetworkScript(filterUrlParams)) {
      if ((response.data.code === -1 || response.data.code === -2)) {
        let errorHTML = Array.isArray(response.data.error || response.data.data) && (response.data.error || response.data.data).reduce((arr, x) => {
          arr.push(`<p>${x.objid ? `objid${x.objid}` : '修改失败'}:${x.message}</p>`); return arr;
        }, []).join('') || '';
        // if (!config.url.includes('/p/cs/batchSave')) {
        //   errorHTML = '';
        // }
        // 处理1.4版本的error明细报错
        if (response.data.data && Array.isArray(response.data.data.errors)) {
          errorHTML = response.data.data.errors.reduce((arr, x) => {
            arr.push(`<p>${x.id ? `明细${x.id}` : '修改失败'}:${x.message}</p>`); return arr;
          }, []).join('') || '';
        }
        let Modalflag = true;
        let innerHTML = '';

        if (response.data.message + errorHTML !== 'undefined') {
          innerHTML = response.data.message + errorHTML;
        } else if (response.data.msg + errorHTML !== 'undefined') {
          innerHTML = response.data.msg + errorHTML;
        } else {
          Modalflag = false;
        }
        if (Modalflag) {
          window.vm.$Modal.fcError({
            mask: true,
            titleAlign: 'center',
            title: '错误',
            // content: formatJsonEmg
            render: h => h('div', [
              h('div', {
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
                  // rows: 8,
                  // readonly: 'readonly',
                  },
                  domProps: {
                    innerHTML,
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
                })
              ])

            ])

          });
        }
      }
    }

    dispatchR3Event({
      url: config.url,
      response: JSON.parse(JSON.stringify(response)),
      fulfilled: true,
      rejected: false,
    });
    if (config.url.indexOf('/p/c/login') !== -1 && response.status === 200) {
      // 由于 1.3与 1.4登录 接口返回值层级不同，所以需要单独做逻辑处理
      if (Version() === '1.4' && response.data.data) {
        window.sessionStorage.setItem('loginStatus', true);
        window.localStorage.setItem('loginStatus', true);
      } else if (Version() === '1.3' && response.data) {
        window.sessionStorage.setItem('loginStatus', true);
        window.localStorage.setItem('loginStatus', true);
      }
    }
    if (config.url.indexOf('/p/cs/getSubSystems') !== -1) {
      if (response.status === 200 && response.data.data && response.data.data.length > 0) {

      } else {
        updateSessionObject('saveNetwork', { k: 'name', v: '/p/cs/getSubSystems' });
        // window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      // const isJson = (config.headers['Content-Type'] || '').indexOf('application/json') > -1;
      // const requestMd5 = md5(JSON.stringify({
      //   data: isJson ? JSON.parse(config.data) : config.data,
      //   url: config.url,
      //   method: config.method
      // }));
      // delete pendingRequestMap[requestMd5];
      if (status === 403) {
        if (logoutTips() && getProjectQuietRoutes().indexOf(router.currentRoute.path) === -1) {
          window.vm.$Modal.fcWarning({
            title: '警告',
            content: '您已失去会话，是否退出登录?',
            mask: true,
            showCancel: true,
            onOk: () => {
              // 清楚对应登陆用户信息
              window.sessionStorage.setItem('loginStatus', false);
              window.localStorage.setItem('loginStatus', false);
              window.localStorage.setItem('sessionCookie', '');
              store.commit('global/updataUserInfoMessage', {
                userInfo: {}
              });
              removeSessionObject('userInfo');
              // console.log(1, router.currentRoute.path);
              if (getProjectQuietRoutes().indexOf(router.currentRoute.path) === -1) {
                if (config.url !== '/p/cs/logout') {
                  // store.dispatch('global/signout');
                  router.push(getTouristRoute());
                }
              }
            }
          });
        } else {
          // 清楚对应登陆用户信息
          window.sessionStorage.setItem('loginStatus', false);
          window.localStorage.setItem('loginStatus', false);
          window.localStorage.setItem('sessionCookie', '');

          store.commit('global/updataUserInfoMessage', {
            userInfo: {}
          });
          removeSessionObject('userInfo');
          if (getProjectQuietRoutes().indexOf(router.currentRoute.path) === -1) {
            if (config.url !== '/p/cs/logout') {
              // store.dispatch('global/signout');
              router.push(getTouristRoute());
            }
          }
        }
      } else if (status === 500 || status === 404) {
      // 如果http状态码正常，则直接返回数据
        const emg = error.response.data.message || error.response.data.msg;
        if (!filterUrl(config && config.url) || !isJSON(emg)) {
          window.vm.$Modal.fcError({
            mask: true,
            titleAlign: 'center',
            title: '错误',
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
                  // rows: 8,
                  // readonly: 'readonly',
                },
                domProps: {
                  innerHTML: emg,
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
              })
            ])
            // render: createElement => createElement('textarea', {
            //   domProps: {
            //     value: formatJsonEmg,
            //     rows: 8,
            //     style: `width: 99%;
            //     margin: 1px;
            //     margin-bottom: -8px;
            //     box-sizing: border-box;
            //     padding: 5px;
            //     resize: none;
            //     `
            //   },
            //   attrs: {
            //     readonly: 'readonly',
            //   }
            // })
          });
        }
        // let formatJsonEmg = null;
        // try {
        //   formatJsonEmg = JSON.stringify(JSON.parse(emg), null, 4);
        // } catch (e) {
        //   if (typeof emg === 'string') {
        //     formatJsonEmg = emg.replace(/<br\/>/g, '\r\n');
        //   }
        // }
      }
      dispatchR3Event({
        url: config.url,
        response: JSON.parse(JSON.stringify(error.response)),
        fulfilled: false,
        rejected: true
      });
    }
    return Promise.reject(error);
  }
);

export const getGateway = (url) => {
  const globalServiceId = window.localStorage.getItem('serviceId');
  const serviceId = store.state.global.serviceIdMap;
  // const serviceName = store.state.global.activeTab.tableName;
  const serviceName = router.currentRoute.params.tableName ? router.currentRoute.params.tableName : tableNameForGet;
  if (!(enableGateWay())) {
    return url;
  }
  if (ignoreGateWay.includes(url)) {
    return url;
  }
  if (globalGateWay().includes(url)) {
    url = globalServiceId ? `/${globalServiceId}${url}` : url;
    return url;
  }
  if (serviceId[serviceName] !== 'undefined') {
    const serviceIdMapApi = serviceId[serviceName];
    url = serviceIdMapApi ? `/${serviceIdMapApi}${url}` : url;
    return url;
  }
  return url;
};

// 当post请求content-Type: application/x-www-form-urlencoded时，需要将JSON参赛转换成如下函数输入的形式。
export const urlSearchParams = (data) => {
  const params = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    const dataType = Object.prototype.toString.call(data[key]);
    if (dataType === '[object Object]' || dataType === '[object Array]') {
      data[key] = JSON.stringify(typeof data[key] === 'string' ? data[key].trim() : data[key]);
    }
    params.append(key, data[key]);
  });
  return params;
};
//  判断网关
function setUrlSeverId(gateWay, url, serviceconfig) {
  const ServiceId = window.localStorage.getItem('serviceId');

  if (serviceconfig && ServiceId) {
    if (serviceconfig.noServiceId) {
      return url;
    }
    if (serviceconfig.serviceId) {
      return serviceconfig.serviceId ? `/${serviceconfig.serviceId}${url}` : url;
    }
  }
  return gateWay ? `/${gateWay}${url}` : url;
}
// 获取定制界面网关
export const getCenterByTable = async () => {
  const tableName = router.currentRoute.params.tableName || router.currentRoute.params.customizedModuleName;
  const getGlobalServiceId = window.localStorage.getItem('serviceId');
  const getserviceIdMap = Object.assign({}, store.state.global.serviceIdMap, JSON.parse(window.localStorage.getItem('serviceIdMap')));
  if (!enableGateWay()) {
    // 1.3 是无网关的
    return false;
  }
  if(!autoGatewayUrl()){
    // 配置不请求网关
    return false
  }
  if (!getGlobalServiceId) {
    return false;
  }
  if (!tableName) {
    return false;
  }
  if (getserviceIdMap[tableName]) {
    return false;
  }

  await axios.post(`/${getGlobalServiceId}/p/cs/getCenterByTable`, urlSearchParams({
    tableName
  })).then((res) => {
    if (res.data.code === 0) {
      const getserviceIdMapdata = Object.assign({}, store.state.global.serviceIdMap, JSON.parse(window.localStorage.getItem('serviceIdMap')));
      getserviceIdMapdata[tableName] = res.data.data;
      localStorage.setItem('serviceIdMap', JSON.stringify(getserviceIdMapdata));
    }
    return true;
  });
};

function NetworkConstructor() {
  // equals to axios.post(url, config)
  // 参数说明：
  //  url：Request URL
  //  config：参数
  //  serviceconfig：{网关设置
  //    noServiceId:true,当前请求不拼接网关
  //    serviceId：'',当前请求配置的网关
  //   }
  // 使用方法：
  // network.post(URL,params,serviceconfig)
  this.post = async (url, config, serviceconfig, close) => {
    closeMessage = close;
    await getCenterByTable();
    const gateWay = matchGateWay(url);
    // 判断菜单网关 gateWay ？ serviceId 外键网关 ？
    const matchedUrl = setUrlSeverId(gateWay, url, serviceconfig);
    const requestMd5 = getRequestMd5({
      data: config instanceof URLSearchParams ? config.toString() : config,
      url: matchedUrl,
      method: 'post',
    });
    const now = new Date();


    if (pendingRequestMap[requestMd5] && now.getTime() - pendingRequestMap[requestMd5].reqTime < REQUEST_PENDDING_EXPIRE()) {
      // return Promise.reject(new Error(`request: [${matchedUrl}] is pending.`));
      if (router.currentRoute.params.tableName) {
        const loadingName = router.currentRoute.meta.moduleName.replace(/\./g, '-');
        window.vm.$R3loading.hide(loadingName);
      }

      return new Promise(() => {});
    }
    // delete pendingRequestMap[requestMd5];
    let lastTime = null;
    if (pendingRequestMap[requestMd5]) {
      lastTime = pendingRequestMap[requestMd5].reqTime;
    }
    pendingRequestMap[requestMd5] = {
      reqTime: now.getTime()
    };
    if (Number(pendingRequestMap[requestMd5].reqTime) - Number(lastTime) < REQUEST_PENDDING_EXPIRE()) {
      // delete pendingRequestMap[requestMd5];
      // return Promise.reject(new Error(`request: [${matchedUrl}] 与上次请求间隔小于${REQUEST_PENDDING_EXPIRE() / 1000}秒.`));
      if (router.currentRoute.params.tableName) {
        const loadingName = router.currentRoute.meta.moduleName.replace(/\./g, '-');
        window.vm.$R3loading.hide(loadingName);
      }
      return new Promise(() => {});
    }

    let headers = {};
    if (url.includes('/p/cs/objectTab') || url.includes('/p/cs/itemObj')) {
      const { tableName } = router.currentRoute.params;
      headers = {
        headers: {
          'maintable-name': tableName,
        }
      };
    }
    if (url.includes('/p/cs/batchSubmit') || url.includes('/p/cs/objectSubmit')) {
      headers = {
        headers: {
          source: 'r3',
        }
      };
    }

    headers = Object.assign({}, headers, {
      cancelToken: new CancelToken(((c) => { // 在axios封装的函数中写上这句就可以了
        window.cancle = c;
      }))
    });

    return axios.post(matchedUrl, config, headers);
  };

  // equals to axios.get(url, config)
  this.get = async (url, config, serviceconfig) => {
    await getCenterByTable();
    const gateWay = matchGateWay(url);
    const matchedUrl = setUrlSeverId(gateWay, url, serviceconfig);
    let data = {};
    if (config && config.params) {
      data = config.params;
    } else {
      data = config;
    }
    const requestMd5 = getRequestMd5({
      data,
      url: matchedUrl,
      method: 'get'
    });
    const now = new Date();
    if (pendingRequestMap[requestMd5] && now.getTime() - pendingRequestMap[requestMd5].reqTime < REQUEST_PENDDING_EXPIRE()) {
      // return Promise.reject(new Error(`request: [${matchedUrl}] is pending.`));
      if (router.currentRoute.meta.moduleName) {
        const loadingName = router.currentRoute.meta.moduleName.replace(/\./g, '-');
        window.vm.$R3loading.hide(loadingName);
      }
      return new Promise(() => {});
    }
    let lastTime = null;
    if (pendingRequestMap[requestMd5]) {
      lastTime = pendingRequestMap[requestMd5].reqTime;
    }
    pendingRequestMap[requestMd5] = {
      reqTime: now.getTime()
    };
    if (Number(pendingRequestMap[requestMd5].reqTime) - Number(lastTime) < REQUEST_PENDDING_EXPIRE()) {
      // delete pendingRequestMap[requestMd5];
      // return Promise.reject(new Error(`request: [${matchedUrl}] 与上次请求间隔小于${REQUEST_PENDDING_EXPIRE() / 1000}秒.`));
      if (router.currentRoute.meta.moduleName) {
        const loadingName = router.currentRoute.meta.moduleName.replace(/\./g, '-');
        window.vm.$R3loading.hide(loadingName);
      }
      return new Promise(() => {});
    }
    return axios.get(matchedUrl, config);
  };

  // make axios available
  this.axios = axios;
}
export const GetTableName = ({ tableName }) => {
  tableNameForGet = tableName;
};

const network = new NetworkConstructor();

export default network;
