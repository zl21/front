/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * ImageUpload组件自定义
 */

import Vue from 'vue';
import { Wangeditor } from '@syman/ark-ui-bcl';
// import Wangeditor from 'arkui_BCL/Wangeditor';
import network from '../../__utils__/network';

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

class CustomWangeditor {
  constructor(item) {
    this.item = item; 
    // if (this.item.Components) {
    //   this.Input = this.item.Components;
    // } else {
    // this.Input = deepClone(test);
    // }
    const DefaultInput = Vue.extend(Wangeditor);
    
    this.Input = new DefaultInput().$options;
    // console.log(this.Input);
    delete this.Input._Ctor;
  }

  init() {
    this.mergeProps();

    if (this.item.Components) {
      return this.item.Components;
    }
    
    const Con = Vue.extend(this.Input);
    
    const obj = { ...new Con().$options };
    this.item.Components = obj;
    return this.Input;
  }

  // 合并props
  mergeProps() {
    const defaultProps = { ...this.Input.props };
    defaultProps.tabAction = {
      default: () => {
        return false;
      }
    };

    defaultProps.isActives = {
      default: () => {
        return this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true);
      }
    };

    defaultProps.http = {
      default: () => {
        return network;
      }
    };
    

    Object.keys(this.item.props).map((item) => {
      // console.log(item, this.item.props.regx, this.item.props[item], this.Input.props[item]);
      if (defaultProps[item]) {
        defaultProps[item].default = () => (function (value) {
          return value;
        }(this.item.props[item]));
      }
      return item;
    });
    

    this.Input.props = defaultProps;
  }



}

export default CustomWangeditor;