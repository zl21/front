/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */
/**
 * Input 组件自定义
 * 
*/

import Vue from 'vue';
import { Input } from 'ark-ui';
import dataProp from '../../__config__/props.config';
import regExp from '../../constants/regExp';


function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

const defaultProps = Input.props;


class CustomInput {
  constructor(item) {
    this.item = JSON.parse(JSON.stringify(item));
    // Input.props = deepClone(defaultProps);
    this.Input = Input;
  }

  init() {
    this.mergeProps(this.Input);
    return this.Input;
  }

  // 合并props
  mergeProps() {
    this.settingPlaceholder();
    if (this.item.type === 'NUMBER') {
      this.numericTypes();
    }
    if (this.item.isuppercase) {
      this.uppercase();
    }

    // this.item.props = Object.assign(defaultProps, this.item.props);
    
    Object.keys(this.item.props).map((item) => {
      // console.log(item, this.item.props.regx, this.item.props[item], this.Input.props[item]);
      if (this.Input.props[item]) {
        if (this.Input.props[item].hasOwnProperty('default')) {
          // console.log(item, this.Input.props.regx, this.item.props[item]);
          this.Input.props.regx.default = () => new RegExp();
          this.Input.props[item].default = () => this.item.props[item];
        } else {
          this.Input.props.regx.default = () => new RegExp();
          this.Input.props[item].default = () => this.item.props[item];
          this.Input.props[item].type = [Object, String, Array, RegExp];
        }
      }
      // this.Input.props = JSON.parse(JSON.stringify(this.Input.props));
      
      return item;
    });
    return this.Input.props;
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
