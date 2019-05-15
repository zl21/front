
import network, { urlSearchParams } from '../../../__utils__/network';

const multipleSelectionTree = (params) => {
  // 获取弹窗多面板 组织树
  network.post('/p/cs/screen', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
const multipleSelectionTable = (params) => {
  // 获取弹窗多面板 表格结果

  network.post('/p/cs/screenresult', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      // res.data.data.data = res.data.data;
      const resdata = Object.assign({}, res);
      const data = Object.assign({}, resdata.data);
      resdata.data.data = data;
      params.success(resdata);
    }
  });
};
const multipleScreenResultCheck = (params) => {
  // 获取弹窗多面板 行选中
  network.post('/p/cs/screenresultcheck', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      const resdata = Object.assign({}, res);
      const data = Object.assign({}, resdata.data);
      resdata.data.data = data;
      params.success(resdata);
    }
  });
};
const multipleSetMultiQuery = (params) => {
  // 获取弹窗多面板 保存模板
  network.post('/p/cs/setMultiQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      const resdata = Object.assign({}, res);
      const data = Object.assign({}, resdata.data);
      resdata.data.data = data;
      params.success(resdata);
    }
  });
};

const multipleComple = {
  multipleSelectionTree,
  multipleSelectionTable,
  multipleScreenResultCheck,
  multipleSetMultiQuery
};

export default multipleComple;
