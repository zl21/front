import { filterURL, REQUEST_PENDDING_EXPIRE } from '../constants/global';

const urls = filterURL ? [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g].concat(filterURL) : [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g];

export const filterUrl = (url) => urls.some(v => url.match(v));


export const isJSON = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (obj && typeof obj === 'object' && obj !== null) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
};

export const checkTime = (lastTime) => new Date().getTime() - lastTime < REQUEST_PENDDING_EXPIRE()
