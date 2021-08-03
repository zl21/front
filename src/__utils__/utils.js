import { filterURL } from '../constants/global';

export const matchedUrl = (url) => filterURL.some(v => url.match(v));
