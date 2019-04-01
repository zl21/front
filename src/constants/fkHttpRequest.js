
import network, { urlSearchParams } from '../__utils__/network';

export const fkQueryList = function fkQueryList(params) {
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject })).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};

export const fkFuzzyquerybyak = function fkFuzzyquerybyak(params) {
  network.post('/p/cs/fuzzyquerybyak', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const fkGetMultiQuery = function fkGetMultiQuery(params) {
  network.post('/p/cs/getMultiQuery', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res.data.data);
    }
  });
};
export const fkDelMultiQuery = function fkDelMultiQuery(params) {
  network.post('/p/cs/delMultiQuery', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
