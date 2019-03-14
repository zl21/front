import axios from 'axios';
import router from '../__config__/router.config';

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
