
import axios from 'axios';
import { global } from './global.config';

function uuidGenerator() {
  const originStr = 'xxxxxxxxxxxxxxxx';
  const originChar = '0123456789abcdef';
  const len = originChar.length;
  return originStr.replace(/x/g, match => originChar.charAt(Math.floor(Math.random() * len)));
}

axios.interceptors.request.use((config) => {
  let jflowInfo = null;
  
  if (global.jflowInfoMap) {
    const routeInfo = window.vm.$router.currentRoute.params;
    jflowInfo = global.jflowInfoMap[`${routeInfo.tableName}${routeInfo.itemId}`];
  }
  if (jflowInfo && Object.keys(jflowInfo).length > 0) {
    config.headers.jflow_event_param = JSON.stringify({
      instanceId: jflowInfo.instanceId,
      nodeId: jflowInfo.nodeId,
      taskId: jflowInfo.taskId
    });
  }
  
  return config;
});

export const getGateway = url => url;

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

function apiEncryptable(url, data, method) {
  // 加密处理
  if (global.apiEncryptable) {
    const aesKey = uuidGenerator();// 秘钥
    // 对传参进行aes加密
    const key = CryptoJS.enc.Utf8.parse(aesKey);// 将秘钥转换成Utf8字节数组
    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    data = encrypt.toString();// 加密后的数据
    
    
    // uuid加密 设置请求头
    const uuidEncrypt = new JSEncrypt();
    uuidEncrypt.setPublicKey(`
    -----BEGIN PUBLIC KEY-----
    ${global.PUBLIC_KEY}
    -----END PUBLIC KEY-----`);
    return axios({
      method,
      url,
      headers: {
        accountName: 'guest',
        'Content-Type': 'text/plain',
        'encrypt-type': 'RSA',
        'encrypt-key': uuidEncrypt.encrypt(aesKey)
      },
      data
    });
  }

  return axios({
    method,
    url,
    headers: {
      accountName: 'guest',
      'Content-Type': 'application/json',
    },
    data
  });
}

function NetworkConstructor() {
  // 错误拦截
  axios.interceptors.response.use((response) => {
    if (response.data.resultCode === -1) {
      window.R3message({
        title: '错误',
        content: response.data.resultMsg,
        mask: true
      });
    }
    return response;
  });
  this.post = (url, config) => apiEncryptable(global.gateway ? `/${global.gateway}${url}` : url, config, 'post');

  this.get = (url, config) => apiEncryptable(global.gateway ? `/${global.gateway}${url}` : url, config, 'get');

  this.axios = axios;
}

const network = new NetworkConstructor();

export default network;
