/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */
/**
 * Input 组件自定义
 * 
*/

import Vue from 'vue';
import dataProp from '../../__config__/props.config';
import regExp from '../../constants/regExp';

let Input = Ark.Input
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
// const nativeInput = deepClone(Input);
class CustomInput {
  constructor(item) {
    this.item = item; 
    // if (this.item.Components) {
    //   this.Input = this.item.Components;
    // } else {
    this.Input = deepClone(Input);
    // }
    // const DefaultInput = Vue.extend(Input);
    // thixs.Input = new DefaultInput().$options;
    delete this.Input._Ctor;
  }

  init() {
    this.mergeProps();
    this.mergeMethods();
    if (this.item.Components) {
      return this.item.Components;
    }
    
    const Con = Vue.extend(this.Input);
    const obj = { ...new Con().$options };
    this.item.Components = obj;
    return obj;
  }

  // 合并props
  mergeProps() {
    const defaultProps = { ...this.Input.props };
    this.settingPlaceholder();
    if (this.item.type === 'NUMBER') {
      this.numericTypes();
    }
    if (this.item.isuppercase) {
      this.uppercase();
    }
    

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

  // 合并methods
  mergeMethods() {
    const handleEnter = this.Input.methods.handleEnter;
    
    this.Input.methods.handleEnter = function () {
      handleEnter.call(this, ...arguments);
      this.$_live_getChildComponent(window.vm, this.$store.state.global.activeTab.keepAliveModuleName).searchClickData();
    };
  }

  settingPlaceholder() { // 设置Placeholder属性
    const placeholder = this.item.webconf && this.item.webconf.placeholder ? this.item.webconf.placeholder : null;
    this.item.props.placeholder = placeholder || `${(dataProp.input && dataProp.input.props) ? dataProp.input.props.placeholder : '请输入'}${this.item.coldesc}`;
  }

  numericTypes() { // 数字类型输入控制
    // 只能输入 正整数 
    let string = '';
    this.item.length = 100;

    if (this.item.webconf && this.item.webconf.ispositive) {
      string = `^\\d{0,${this.item.length}}(\\\.[0-9]{0,${
        this.item.scale
      }})?$`;
    } else {
      string = `^(-|\\+)?\\d{0,${this.item.length - this.item.scale}}(\\\.[0-9]{0,${
        this.item.scale
      }})?$`;
    }
    
    const typeRegExp = new RegExp(string);
    if (this.item.scale > 0) {
      this.item.props.regx = typeRegExp;
    } else if (this.item.webconf && this.item.webconf.ispositive) {
      this.item.props.regx = regExp.Number;
    } else {
      this.item.props.regx = regExp.Digital;
    }
  }

  uppercase() { // 大写转换
    if (this.item.isuppercase) {
      this.item.props.regx = /^[A-Z0-9\u4e00-\u9fa5]*$/;
    }
  }
}

export default CustomInput;