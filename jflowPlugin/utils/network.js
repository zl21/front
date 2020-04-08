import axios from 'axios';
import { global } from './global.config';

function uuidGenerator() {
  const originStr = 'xxxxxxxxxxxxxxxx';
  const originChar = '0123456789abcdef';
  const len = originChar.length;
  return originStr.replace(/x/g, match => originChar.charAt(Math.floor(Math.random() * len)));
}

// import store from '../config/store.config'
axios.interceptors.request.use((config) => {
  config.headers.accessToken = localStorage.getItem('accesstoken');
  config.headers['Content-Type'] = 'application/json';

  config.url = `/jflow${config.url}`;
  // 加密处理
  if (global.encrypt) {
    const aesKey = uuidGenerator();// 秘钥
    // 对传参进行aes加密
    const key = CryptoJS.enc.Utf8.parse(aesKey);// 将秘钥转换成Utf8字节数组
    const encrypt = CryptoJS.AES.encrypt(JSON.stringify(config.data), key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    config.data = encrypt.toString();// 加密后的数据
    
    
    // uuid加密 设置请求头
    const uuidEncrypt = new JSEncrypt();
    uuidEncrypt.setPublicKey(`
    -----BEGIN PUBLIC KEY-----
    ${global.PUBLIC_KEY}
    -----END PUBLIC KEY-----`);
    config.headers['encrypt-key'] = uuidEncrypt.encrypt(aesKey);
    config.headers['encrypt-type'] = 'RSA';
  }
  
  return config;
});

axios.interceptors.response.use((response) => {
  if (response.data.resultCode === -1) {
    // alert(response.data.message);
    window.vm.$Modal.fcError({
      title: '错误',
      content: response.data.resultMsg,
      mask: true
    });
  }
  return response;
}, (error) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 403) {
      window.vm.$Modal.fcError({
        title: '错误',
        content: error.response.data.resultMsg,
        mask: true,
        onOk: () => {
          localStorage.setItem('accesstoken', null);
          localStorage.removeItem('username', null);
        }
      });
    }
  }


  Promise.reject(error);
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

export default axios;
