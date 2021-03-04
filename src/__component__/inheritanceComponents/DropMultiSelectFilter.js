/**
 * 下拉多选外健关联业务组件的自定义逻辑处理
 */

/**
 * 下拉单选外健关联业务组件的自定义逻辑处理
 */
import { defaultrange } from '../../constants/global';
import { DropMultiSelectFilter } from '@syman/ark-ui-bcl';


// const BusDropDownSelectFilter = () => import('arkui_BCL/DropDownSelectFilter');
// console.log(BusDropDown);
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


class CustomDropMultiSelectFilter {
  constructor(item) {
    this.item = item;
    // const BusDropDownSelectFilter = require('arkui_BCL/DropDownSelectFilter').default;
    // this.BusDropDown = deepClone(DropMultiSelectFilter);
    const BusDropDown = Vue.extend(DropMultiSelectFilter);
    this.BusDropDown = new BusDropDown().$options;
    delete this.BusDropDown._Ctor;
  }

  init() {
    this.mergeProps();
    this.mergeDatas();
    this.mergeMethods();
    
    if (this.item.Components) {
      return this.item.Components;
    }
    const Con = Vue.extend(this.BusDropDown);
    
    const obj = { ...new Con().$options };
    this.item.Components = obj;
    return { ...obj };
  }

  // 合并props
  mergeProps() {
    const propsData = { ...this.BusDropDown.props };
    // 处理Url
    this.propsUrl(propsData);
    // 处理传参
    this.propsParams(propsData);
    this.BusDropDown.props = { ...propsData };
  } 

  propsUrl(props) { // 处理props中的url属性
    props.Url.default = () => ({
      autoUrl: `/p/cs/fuzzyquerybyak`,
      tableUrl: `/p/cs/QueryList`
    });
  }

  propsParams(props) { // 处理props中的AutoRequest,TableRequest
    props.AutoRequest.default = () => ({
      colid: this.item.colid,
      fixedcolumns: {}
    });

    props.TableRequest.default = () => ({
      isdroplistsearch: true,
      refcolid: this.item.colid,
    });
  }

  // 合并data
  mergeDatas() {
    const data = { ...this.BusDropDown.mixins[0].data() };
    // 处理前端配置的默认分页数
    data.pageSize = defaultrange() ? defaultrange() : data.pageSize;
    this.BusDropDown.mixins[0].data = () => data;
  }

  // 合并methods
  mergeMethods() {
    this.BusDropDown.mixins[0].methods.postTableData = function postTableData(url) {
      return new Promise((resolve) => {
        this.post(url, urlSearchParams({
          searchdata: this.searchdata
        }), (response) => {
          resolve(response);
        });
      });
    };
  }
}

export default CustomDropMultiSelectFilter;
