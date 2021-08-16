import { filterURL } from '../constants/global';

const urls = [/\/p\/c\/code\/login*/g, /\/p\/c\/message\/login*/g].concat(filterURL);

export const matchedUrl = (url) => urls.some(v => url.match(v));
