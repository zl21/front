/**
 * 下拉单选外健关联业务组件的自定义逻辑处理
 */
import { DropDownSelectFilter } from '@syman/ark-ui-bcl';
// import DropDownSelectFilter from 'arkui_BCL/DropDownSelectFilter';

import Vue from 'vue';
import {
  defaultrange
} from '../../constants/global';
import network from '../../__utils__/network';
import {
  SetPlaceholder
} from './setProps';
import {
  setisShowPopTip,
  postData,
  postTableData
} from '../ExtendedAttributes/refcolval.js'


// console.log(BusDropDown);
// 处理传参form格式转换


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


class BusDropDownSelectFilter extends Vue {
  constructor(item) {
    super();
    this.item = item;
    // const BusDropDownSelectFilter = require('arkui_BCL/DropDownSelectFilter').default;
    const BusDropDown = Vue.extend(DropDownSelectFilter);
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
    const BusDropDownTer = Vue.extend(this.BusDropDown);

    const obj = {
      ...new BusDropDownTer().$options
    };
    this.item.Components = obj;
    // this.item.Components = obj;
    return obj;
  }

  // 合并props
  mergeProps() {
    const propsData = {
      ...this.BusDropDown.props
    };
    // 处理Url
    this.propsUrl(propsData);
    // 处理传参
    this.propsParams(propsData);

    propsData.PropsData = {
      default: () => ({
        disabled: this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true),
        hidecolumns: ['id', 'value'],
        isShowPopTip: setisShowPopTip(this, this.item.webconf,network),
        placeholder: new SetPlaceholder(this.item).init()
      })
    }
    this.BusDropDown.props = {
      ...propsData
    };
  }

  propsUrl(props) { // 处理props中的url属性
    props.Url.default = () => ({
      autoUrl: '/p/cs/fuzzyquerybyak',
      tableUrl: '/p/cs/QueryList'
    });
  }

  propsParams(props) { // 处理props中的AutoRequest,TableRequest
    props.AutoRequest.default = () => ({
      colid: this.item.colid,
      fixedcolumns: {},
    });

    props.TableRequest.default = () => ({
      isdroplistsearch: true,
      fixedcolumns: {},
      refcolid: this.item.colid,
    });
    props.http.default = () => {
      return network;
    };
  }

  // 合并data
  mergeDatas() {
    const data = {
      ...this.BusDropDown.mixins[0].data()
    };
    // 处理前端配置的默认分页数
    data.pageSize = defaultrange() ? defaultrange() : data.pageSize;
    this.BusDropDown.mixins[0].data = () => data;
  }

  // 合并methods
  mergeMethods() {

    //console.log( this.BusDropDown,'12121212');
    let self = this;
    this.BusDropDown.methods.postTableData = function (url) {
      // 字段联动 表格数据查询
      return new Promise((resolve) => {
       postTableData.call(this,self,url).then((res)=>{
          resolve(res)
       });
      })
      
    };
    this.BusDropDown.methods.postData = function (url) {
      // 字段联动 模糊查询数据
       return new Promise((resolve) => {
        postData.call(this,self,url).then((res)=>{
           resolve(res)
        });
       })   
    };

    


    this.BusDropDown.methods['on-keydown'] = function (event) {
      if (event.code === 'Enter') {
        this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName).searchClickData();
      }
    };
  }
}

export default BusDropDownSelectFilter;

