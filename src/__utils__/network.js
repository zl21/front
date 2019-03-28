import axios from 'axios';
import router from '../__config__/router.config';
import store from '../__config__/store/global.store';

import { ignoreGateWay, enableGateWay, globalGateWay } from '../__config__/global';

axios.interceptors.request.use((config) => {
  const url = config.url;
  const globalServiceId = window.sessionStorage.getItem('serviceId');
  const serviceId = store.state.serviceIdMap;
  const serviceName = store.state.activeTab.tableName;
  const serviceIdArray = [];
  if (!enableGateWay) {
    return config;
  }
  if (ignoreGateWay.indexOf(url) !== -1) { 
    return config;
  }
  if (globalGateWay.indexOf(url) !== -1) { 
    config.url = globalServiceId ? `/${globalServiceId}${url}` : url;
    return config;
  }
  Object.values(serviceId).forEach((b) => {
    serviceIdArray.push(b);
  });
  if (serviceIdArray.indexOf(serviceName) === -1) {
    alert('根据serviceIdMap判断');
    const serviceIdMapApi = serviceId[serviceName];
    config.url = serviceIdMapApi ? `/${serviceIdMapApi}${url}` : url;
    return config;
  }
});

axios.interceptors.response.use((response) => {
  if (response.data.code === -1) {
    alert(response.data.message);
  }
  return response;
}, (error) => {
  const { status } = error.response;
  if (status === 403) {
    router.push('/login');
  }
  Promise.reject(error);
});

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
