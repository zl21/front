
import { urlSearchParams } from '../utils/http.js';



const multipleSelectionTree = (http,params) => {
  // 获取弹窗多面板 组织树
  http.post('/p/cs/screen', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      params.success(res);
    }
  });
};
const multipleSelectionTable = (http,params) => {
  // 获取弹窗多面板 表格结果

  http.post('/p/cs/screenresult', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      const resdata = Object.assign({}, res);
       if(res.data.header){
          const data = Object.assign({}, resdata.data);
          resdata.data.data = data;
       }
      params.success(resdata);
    }
  });
};
const multipleScreenResultCheck = (http,params) => {
  // 获取弹窗多面板 行选中
  http.post('/p/cs/screenresultcheck', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
    if (typeof params.success === 'function') {
      const resdata = Object.assign({}, res);
      if(res.data.header){
        const data = Object.assign({}, resdata.data);
        resdata.data.data = data;
     }
      params.success(resdata);
    }
  });
};
const multipleSetMultiQuery = (http,params) => {
  // 获取弹窗多面板 保存模板
  http.post('/p/cs/setMultiQuery', urlSearchParams(params.searchObject), { serviceId: params.serviceId }).then((res) => {
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

const multipleComple = {
  multipleSelectionTree,
  multipleSelectionTable,
  multipleScreenResultCheck,
  multipleSetMultiQuery
};

export default multipleComple;
