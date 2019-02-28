import axios from 'axios';
import router from '../__config__/router.config';

axios.interceptors.response.use(response => response, (error) => {
  if (error.response.status === 403) {
    router.push('/login');
  }
  Promise.reject(error);
});

export const urlSearchParams = (data) => {
  const params = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    params.append(key, data[key]);
  });
  return params;
};

export default axios;
