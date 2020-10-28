import network, { urlSearchParams } from '../../../../__utils__/network';

export const fkQueryList = function fkQueryList(params) {
  network
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

export const fkFuzzyquerybyak = function fkFuzzyquerybyak(params) {
  const timeOut = new Date().getTime();

  network
    .post('/p/cs/fuzzyquerybyak', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res, timeOut);
      }
    });
};
export const fkGetMultiQuery = function fkGetMultiQuery(params) {
  network
    .post('/p/cs/getMultiQuery', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res.data.data);
      }
    });
};
export const fkDelMultiQuery = function fkDelMultiQuery(params) {
  // 弹窗多选 气泡删除请求
  network
    .post('/p/cs/delMultiQuery', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const fkQueuploadProgressry = function fkQueuploadProgressry(params) {
  // 获取上传图片进度
  network
    .post('/p/cs/uploadProgress', urlSearchParams(params.searchObject), {
      serviceId: params.serviceId
    })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const fkObjectSave = function fkObjectSave(params) {
  // 保存
  network
    .post(params.url || '/p/cs/objectSave', params.searchObject)
    .then((res) => {
      if (typeof params.success === 'function') {
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

  network.post(jflowpath || requestUrlPath || '/p/cs/batchSave', params.searchObject).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
export const getTableQuery = function getTableQuery(params) {
  // 弹窗单选 请求form
  network.post('/p/cs/getTableQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId })
    .then((res) => {
      if (typeof params.success === 'function') {
        params.success(res);
      }
    });
};
export const fkQueryListPop = function fkQueryListPop(params) {
  // 弹窗单选 请求列表
  network
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
export const itemTableDelete = function itemTableDelete({
  params,
  path,
  success
}) {
  // 表格删除方法
  network.post(path || '/p/cs/objectDelete', params).then((res) => {
    if (typeof success === 'function') {
      success(res);
    }
  });
};
export const editorUpload = function editorUpload({ params, success }) {
  // 上传图片
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
export const deleteImg = function deleteImg({ params, success }) {
  // 删除图片保存
  const { path } = params;
  delete params.path;
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
