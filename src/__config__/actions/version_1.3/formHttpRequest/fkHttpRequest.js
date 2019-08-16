
import network, { urlSearchParams } from '../../../../__utils__/network';

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
export const fkModify = function fkModify(params) {
  // 弹窗批量 请求
  network
    .post('/p/cs/getObjectForUpTmp', urlSearchParams(params.searchObject))
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const fksaveModify = function fksaveModify(params) {
  // 弹窗批量 保存
  network.post('/p/cs/batchSave', params.searchObject).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const getTableQuery = function getTableQuery(params) {
  // 弹窗单选 表格
  network.post('/p/cs/getTableQuery', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      // res.data.data = res.data && res.data;
      res.data.data = res.data;
      // res.data.data.datas = res.data && res.data.datas;
      params.success(res);
    }
  });
};
export const fkQueryListPop = function fkQueryListPop(params) {
  // 弹窗单选 请求
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject }), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.datas;
      console.log(res, 'resres');
      params.success(res);
    }
  });
};
export const itemTableDelete = function itemTableDelete({ params, path, success }) { // 表格删除方法
  network.post(path || '/p/cs/objectDelete', params).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
export const editorUpload = function editorUpload({ params, success }) { // 上传图片
  const { path } = params;
  const customUploadImg = new FormData();
  customUploadImg.append('file', params.customUploadImg.file);
  customUploadImg.append('path', params.customUploadImg.path);

  network.post(path || '/p/cs/upload2', customUploadImg).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
export const deleteImg = function deleteImg({ params, success }) { // 删除图片保存
  const { path } = params;
  network.post(path || '/p/cs/users/save', params).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
