import { filterURL } from '../constants/global';

const urls = filterURL ? [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g].concat(filterURL) : [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g];

export const filterUrl = (url) => urls.some(v => url.match(v));
