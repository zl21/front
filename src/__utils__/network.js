import axios from 'axios';
import md5 from 'md5';
import router from '../__config__/router.config';
import store from '../__config__/store/global.store';
import {
  ignoreGateWay, enableGateWay, globalGateWay, defaultQuietRoutes 
} from '../constants/global';

const pendingRequestMap = {};
window.pendingRequestMap = pendingRequestMap;

const getProjectQuietRoutes = () => {
  const { quietRoutes } = window.ProjectConfig || {};
  return (defaultQuietRoutes.concat(quietRoutes || [])) || [];
};

const matchGateWay = (url) => {
  const { tableName, customizedModuleName } = router.currentRoute.params;
  const globalServiceId = window.sessionStorage.getItem('serviceId');
  const serviceIdMap = JSON.parse(window.sessionStorage.getItem('serviceIdMap'));
  // eslint-disable-next-line no-empty
  if (!enableGateWay) {
    return undefined;
  }
  if (ignoreGateWay.includes(url)) {
    return undefined;
  }
  if (globalGateWay.includes(url)) {
    return globalServiceId || undefined;
  }
  if (tableName) {
    if (serviceIdMap[tableName] !== 'undefined') {
      const serviceIdMapApi = serviceIdMap[tableName];
      return serviceIdMapApi || undefined;
    }
  } else if (customizedModuleName) {
    if (serviceIdMap[customizedModuleName] !== 'undefined') {
      const serviceIdMapApi = serviceIdMap[customizedModuleName];
      return serviceIdMapApi || undefined;
    }
  }
  return undefined;
};

const getRequestMd5 = data => md5(JSON.stringify(data));

const dispatchR3Event = (data) => {
  const globalServiceId = window.sessionStorage.getItem('serviceId');
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

axios.interceptors.response.use(
  (response) => {
    const { config } = response;
    const isJson = (config.headers['Content-Type'] || '').indexOf('application/json') > -1;
    const requestMd5 = md5(JSON.stringify({
      data: isJson ? JSON.parse(config.data) : config.data,
      url: config.url,
      method: config.method
    }));
    delete pendingRequestMap[requestMd5];
    if (response.data.code === -1) {
      window.vm.$Modal.fcError({
        mask: true,
        title: '错误',
        content: response.data.message || 'No Error Message.'
      });
    }
    dispatchR3Event({
      url: config.url,
      response: JSON.parse(JSON.stringify(response)),
      fulfilled: true,
      rejected: false,
    });
    return response;
  },
  (error) => { 
    if (error.response) {
      const { status, config } = error.response;
      const isJson = (config.headers['Content-Type'] || '').indexOf('application/json') > -1;
      const requestMd5 = md5(JSON.stringify({
        data: isJson ? JSON.parse(config.data) : config.data,
        url: config.url,
        method: config.method
      }));
      delete pendingRequestMap[requestMd5];
      if (status === 403) {
        if (getProjectQuietRoutes().indexOf(router.currentRoute.path) === -1) {
          router.push('/login');
        }
      } else if (status === 500) {
      // 如果http状态码正常，则直接返回数据
        const emg = error.response.data.message;
        let formatJsonEmg = null;
        try {
          formatJsonEmg = JSON.stringify(JSON.parse(emg), null, 4);
        } catch (e) {
          if (typeof emg === 'string') {
            formatJsonEmg = emg.replace(/<br\/>/g, '\r\n');
          }
        }
        window.vm.$Modal.info({
          mask: true,
          titleAlign: 'center',
          title: '错误',
          render: createElement => createElement('textarea', {
            domProps: {
              value: formatJsonEmg,
              rows: 8,
              style: `width: 100%;
              margin-bottom: -8px;
              box-sizing: border-box;
              padding: 5px;
              resize: none;
              `
            },
            attrs: {
              readonly: 'readonly',
            }
          })
        });
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
  const globalServiceId = window.sessionStorage.getItem('serviceId');
  const serviceId = store.state.serviceIdMap;
  const serviceName = store.state.activeTab.tableName;
  if (!enableGateWay) {
    return url;
  }
  if (ignoreGateWay.includes(url)) {
    return url;
  }
  if (globalGateWay.includes(url)) {
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
      data[key] = JSON.stringify(data[key]);
    }
    params.append(key, data[key]);
  });
  return params;
};

function NetworkConstructor() {
  // equals to axios.post(url, config)
  this.post = (url, config) => {
    const gateWay = matchGateWay(url);
    const matchedUrl = gateWay ? `/${gateWay}${url}` : url;
    const requestMd5 = getRequestMd5({
      data: config instanceof URLSearchParams ? config.toString() : config,
      url: matchedUrl,
      method: 'post'
    });
    if (pendingRequestMap[requestMd5]) {
      console.warn(`request [${requestMd5}]: [${matchedUrl}] is pending.`);
      return { then: () => {} };
    }
    pendingRequestMap[requestMd5] = {
      reqTime: Date.now()
    };
    return axios.post(matchedUrl, config);
  };

  // equals to axios.get(url, config)
  this.get = (url, config) => {
    const gateWay = matchGateWay(url);
    const matchedUrl = gateWay ? `/${gateWay}${url}` : url;
    const requestMd5 = getRequestMd5({
      data: config,
      url: matchedUrl,
      method: 'get'
    });
    if (pendingRequestMap[requestMd5]) {
      console.warn(`request: [${matchedUrl}] is pending.`);
      return { then: () => {} };
    }
    pendingRequestMap[requestMd5] = {
      reqTime: Date.now()
    };
    return axios.get(matchedUrl, config);
  };

  // make axios available
  this.axios = axios;
}

const network = new NetworkConstructor();

export default network;
