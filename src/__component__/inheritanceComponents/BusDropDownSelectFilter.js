/**
 * 外健关联业务组件的自定义逻辑处理
 */
import { defaultrange } from '../../constants/global';

const BusDropDownSelectFilter = () => import('arkui_BCL/DropDownSelectFilter');

// 处理传参form格式转换
const urlSearchParams = (data) => {
  const params = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    const dataType = Object.prototype.toString.call(data[key]);

    if (dataType === '[object Object]' || dataType === '[object Array]') {
      data[key] = JSON.stringify(data[key]);
    }

    params.append(key, data[key]);
  });
  return params;
};

// 深拷贝
const deepClone = (arr) => {  
  const obj = arr.constructor == Array ? [] : {};
  // 第二种方法 var obj=arr instanceof Array?[]:{}
  // 第三种方法 var obj=Array.isArray(arr)?[]:{}
  for (const item in arr) {
    if (typeof arr[item] === 'object') {
      obj[item] = deepClone(arr[item]);
    } else {
      obj[item] = arr[item];
    }
  }
  return obj;
};

// 重构方法
const methods = {
  postTableData(url) {
    return new Promise((resolve) => {
      this.post(url, urlSearchParams({
        searchdata: this.searchdata
      }), (response) => {
        resolve(response);
      });
    });
  }
};

// 重构初始化数据
const defaultData = (data) => {
  const json = deepClone(data);
  json.pageSize = defaultrange() ? defaultrange() : json.pageSize;
  return () => deepClone(json);
};

BusDropDownSelectFilter().then((data) => {
  data.default.data = defaultData(data.default.data());
  Object.assign(data.default.methods, methods);
  return data;
});


class DropDownSelectFilter {
  constructor(item) {
    this.item = item;
  }

  init() {
    return BusDropDownSelectFilter;
  }
}


export default DropDownSelectFilter;
