
import network, { urlSearchParams } from '../../../../__utils__/network';

export const fkQueryList = function fkQueryList(params) {
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject }), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};

export const fkFuzzyquerybyak = function fkFuzzyquerybyak(params) {
  network.post('/p/cs/fuzzyquerybyak', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const fkGetMultiQuery = function fkGetMultiQuery(params) {
  network.post('/p/cs/getMultiQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res.data.data);
    }
  });
};
export const fkDelMultiQuery = function fkDelMultiQuery(params) {
  network.post('/p/cs/delMultiQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const fkQueuploadProgressry = function fkQueuploadProgressry(params) {
  network.post('/p/cs/uploadProgress', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const fkObjectSave = function fkObjectSave(params) {
  network.post('/p/cs/objectSave', params.searchObject, { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};

export const fkModify = function fkModify(params) {
  network.post('/p/cs/getObjectForUpTmp', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const fksaveModify = function fksaveModify(params) {
  network.post('/p/cs/batchSave', params.searchObject).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const getTableQuery = function getTableQuery(params) {
  network.post('/p/cs/getTableQuery', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const fkQueryListPop = function fkQueryListPop(params) {
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject }), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const itemTableDelete = function itemTableDelete({ params, success }) { // 表格删除方法
  const { path } = params;
  network.post(path || '/p/cs/objectDelete', params).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
