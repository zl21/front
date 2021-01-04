
import axios from 'axios';
import network, { urlSearchParams } from '../../../../__utils__/network';
import router from '../../../router.config';


export const fkQueryList = function fkQueryList(params) {
  network.post('/p/cs/QueryList', urlSearchParams({ searchdata: params.searchObject }), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.datas;
      params.success(res);
    }
  });
};

export const fkFuzzyquerybyak = function fkFuzzyquerybyak(params) {
  window.cancle();
  const timeOut = new Date().getTime();
  network.post('/p/cs/fuzzyquerybyak', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      res.data.data = res.data && res.data.data;
      params.success(res, timeOut);
    }
  })
  .catch((err) => {
    if (axios.isCancel(err)) {
      console.log('Rquest canceled'\); // 请求如果被取消，这里是返回取消的message
    } else {
      // handle error
      console.log(err);
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
  let jflowpath = '';
  let requestUrlPath = '';
  if (params && params.buttonData) {
    if (params.buttonData.jflowpath) {
      jflowpath = params.buttonData.jflowpath;
    }
    if (params.buttonData.requestUrlPath) {
      requestUrlPath = params.buttonData.requestUrlPath;
    }
  }
  network.post(jflowpath || requestUrlPath || '/p/cs/batchSave', urlSearchParams(params.searchObject)).then((res) => {
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
      params.success(res);
    }
  });
};
export const itemTableDelete = function itemTableDelete({ params, path, success }) { // 表格删除方法
  const { itemId } = router.currentRoute.params;
  let arrayID = [];
  const objItem = {};
  Object.keys(params.tabItem).reduce((obj, crr) => {
    arrayID = params.tabItem[crr].map(item => item.ID.toString());
    objItem[crr] = arrayID;
    return obj;
  }, {});
  const paramsValue = {
    table: params.table,
    objid: itemId,
    isdelmtable: false,
    data: objItem
  };
  network.post('/p/cs/objectDelete', urlSearchParams(paramsValue)).then((res) => {
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
export const batchUploadProgress = function batchUploadProgress(params) {
  // 上传文件进度
  network.post('/p/cs/batchUploadProgress', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res.data);
    }
  });
};

export const equalformRequest = function equalformRequest(params) {
  // 服务端赋值
  network.post(params.url, params.searchObject, { serviceId: '' }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res.data);
    }
  });
};
