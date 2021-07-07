import { urlSearchParams } from '../utils/http.js';


export const fkQueryList = function fkQueryList(http,params) {
  http
    .post(
      '/p/cs/QueryList',
      urlSearchParams({ searchdata: params.searchObject }),
      { serviceId: params.serviceId }
    )
    .then((res) => {
      if (typeof params.success === 'function') {
        const resdata = Object.assign({}, res);
        if(!resdata.data.data){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
        }

        params.success(resdata);
      }
    });
};

export const fkFuzzyquerybyak = function fkFuzzyquerybyak(http,params) {
  // window.cancle();
  const timeOut = new Date().getTime();
  http
    .post('/p/cs/fuzzyquerybyak', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        const resdata = Object.assign({}, res);
        if(!resdata.data.data){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
        }
        params.success(resdata, timeOut);
      }
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log('Rquest canceled'); // 请求如果被取消，这里是返回取消的message
      } else {
        // handle error
        console.log(err);
      }
    });
};
export const fkGetMultiQuery = function fkGetMultiQuery(http,params) {
  http
    .post('/p/cs/getMultiQuery', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        const resdata = Object.assign({}, res);
        if(!resdata.data.data){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
        }
        params.success(resdata.data.data);
      }
    });
};
export const fkDelMultiQuery = function fkDelMultiQuery(http,params) {
  // 弹窗多选 气泡删除请求
  http
    .post('/p/cs/delMultiQuery', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        const resdata = Object.assign({}, res);
        if(!resdata.data.data){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
        }

        params.success(resdata);
      }
    });
};
export const fkQueuploadProgressry = function fkQueuploadProgressry(http,params) {
  const url = params.url || '/p/cs/uploadProgress'
  // 获取上传图片进度
  // 此处hash的作用是防止被框架的请求节流机制给屏蔽阻止调请求
  http
    .post(`${url}?hash=${new Date().getTime()}`, urlSearchParams(params.searchObject))
    .then((res) => {
      if (typeof params.success === 'function') {
        const resdata = Object.assign({}, res);
        if(!resdata.data.data){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
        }
        params.success(resdata);
      }
    });
};
export const fkObjectSave = function fkObjectSave(http,params) {
  // 保存
  http
    .post(params.url || '/p/cs/objectSave', params.searchObject)
    .then((res) => {
      if (typeof params.success === 'function') {
        const resdata = Object.assign({}, res);
        if(!resdata.data.data){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
        }
        params.success(resdata);
      }
    });
};

export const fkModify = function fkModify(http,params) {
  // 弹窗批量 请求
  http
    .post('/p/cs/getObjectForUpTmp', urlSearchParams(params.searchObject))
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const fksaveModify = function fksaveModify(http,params) {
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

  http.post(jflowpath || requestUrlPath || '/p/cs/batchSave', params.searchObject).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const getTableQuery = function getTableQuery(http,params) {
  // 弹窗单选 请求form
  http.post('/p/cs/getTableQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const fkQueryListPop = function fkQueryListPop(http,params) {
  // 弹窗单选 请求列表
  http
    .post(
      '/p/cs/QueryList',
      urlSearchParams({ searchdata: params.searchObject }),
      { serviceId: params.serviceId }
    )
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const itemTableDelete = function itemTableDelete(http,{
  params,
  path,
  success
}) {
  // 表格删除方法
  http.post(path || '/p/cs/objectDelete', params).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
export const editorUpload = function editorUpload(http,{ params, success }) {
  // 上传图片
  const { path } = params;
  let url = params.url;
  const customUploadImg = new FormData();
  customUploadImg.append('file', params.customUploadImg.file);
  customUploadImg.append('path', params.customUploadImg.path);

  http.post(url || '/p/cs/upload2', customUploadImg).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
export const deleteImg = function deleteImg(http,{ params, success }) {
  // 删除图片保存
  const { path } = params;
  delete params.path;
  http.post(path || '/p/cs/users/save', params).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};

export const batchUploadProgress = function batchUploadProgress(http,params) {
  // 上传文件进度
  http.post('/p/cs/batchUploadProgress', urlSearchParams(params.searchObject)).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res.data);
    }
  });
};
export const equalformRequest = function equalformRequest(http,params) {
  // 服务端赋值
  http.post(params.url, params.searchObject, { serviceId: '' }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res.data);
    }
  });
};
