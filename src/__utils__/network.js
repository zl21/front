import axios from 'axios';
import router from '../__config__/router.config';
import store from '../__config__/store/global.store';
import { ignoreGateWay, enableGateWay, globalGateWay } from '../constants/global';

axios.interceptors.request.use(
  (config) => {
    const { tableName, customizedModuleName } = router.currentRoute.params;
    const url = config.url;
    const globalServiceId = window.sessionStorage.getItem('serviceId');
    const serviceId = JSON.parse(window.sessionStorage.getItem('serviceIdMap'));
    if (!enableGateWay) {
      return config;
    }

    if (config.serviceId) {
    // 外键 配置网关

      config.url = config.serviceId ? `/${config.serviceId}${url}` : url;
      return config;
    }
    if (ignoreGateWay.includes(url)) {
      return config;
    }
    if (globalGateWay.includes(url)) {
      config.url = globalServiceId ? `/${globalServiceId}${url}` : url;
      return config;
    }

    if (tableName) {
      if (serviceId[tableName] !== 'undefined') {
        const serviceIdMapApi = serviceId[tableName];
        config.url = serviceIdMapApi ? `/${serviceIdMapApi}${url}` : url;
        return config;
      }
    }

    if (customizedModuleName) {
      if (serviceId[customizedModuleName] !== 'undefined') {
        const serviceIdMapApi = serviceId[customizedModuleName];
        config.url = serviceIdMapApi ? `/${serviceIdMapApi}${url}` : url;
        return config;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    if (response.data.code === -1) {
      window.vm.$Modal.fcError({
        title: '错误',
        content: response.data.message || 'No Error Message.'
      });
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 403) {
        router.push('/login');
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

export default axios;
