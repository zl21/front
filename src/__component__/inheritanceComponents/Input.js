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


function deepProxy(obj, cb) {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        obj[key] = deepProxy(obj[key], cb);
      }
    }
  }

  return new Proxy(obj, {

    /**
       * @param {Object, Array} target 设置值的对象
       * @param {String} key 属性
       * @param {any} value 值
       * @param {Object} receiver this
       */
    set(target, key, value, receiver) {
      if (typeof value === 'object') {
        value = deepProxy(value, cb);
      }

      const cbType = target[key] == undefined ? 'create' : 'modify';

      // 排除数组修改length回调
      if (!(Array.isArray(target) && key === 'length')) {
        cb(cbType, { target, key, value });
      }
      return Reflect.set(target, key, value, receiver);
    },
    deleteProperty(target, key) {
      cb('delete', { target, key });
      return Reflect.deleteProperty(target, key);
    }

  });
}


class CustomInput {
  constructor(item) {
    this.item = JSON.parse(JSON.stringify(item));
    // Input.props = deepClone(defaultProps);
    console.log(Input);
    this.Input = deepProxy(Input, (type, data) => {
      // console.log(type, data);
    });

    console.log(this.Input);
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
        this.Input.props[item].default = () => this.item.props[item];
      }
      return item;
    });
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
