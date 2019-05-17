
import network, { urlSearchParams } from '../../../__utils__/network';

export const fkQueryList = function fkQueryList(params) {
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject }), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.datas;
      params.success(res);
    }
  });
};

export const fkFuzzyquerybyak = function fkFuzzyquerybyak(params) {
  network.post('/p/cs/fuzzyquerybyak', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.data;
      params.success(res);
    }
  });
};
export const fkGetMultiQuery = function fkGetMultiQuery(params) {
  network.post('/p/cs/getMultiQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.data;
      params.success(res.data.data);
    }
  });
};
export const fkDelMultiQuery = function fkDelMultiQuery(params) {
  network.post('/p/cs/delMultiQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.datas;
      params.success(res);
    }
  });
};
export const fkQueuploadProgressry = function fkQueuploadProgressry(params) {
  network.post('/p/cs/uploadProgress', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.datas;
      params.success(res);
    }
  });
};
export const fkObjectSave = function fkObjectSave(params) {
  network.post('/p/cs/objectSave', params.searchObject, { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.datas;
      params.success(res);
    }
  });
};
