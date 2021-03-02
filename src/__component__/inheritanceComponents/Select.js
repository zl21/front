/**
 * select组件的自定义逻辑处理
 */
import Vue from 'vue';
import { Select } from 'ark-ui';
import dataProp from '../../__config__/props.config';
import regExp from '../../constants/regExp';
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
class CustomSelect {
  constructor(item) {
    this.item = item; 
    const DefaultSelect = Vue.extend(Select);
    this.Input = new DefaultSelect().$options;
    delete this.Input._Ctor;
  }

  init() {
    this.mergeProps();
    this.mergeMethods();

    if (this.item.Components) {
      return this.item.Components;
    }
    
    const obj = { ...this.Input };
    this.item.Components = obj;
    return obj;
  }

  // 合并props
  mergeProps() {
    const defaultProps = { ...this.Input.props };
    this.settingPlaceholder();
    this.settingOptions();
    
    defaultProps.transfer = {
      default: () => true
    };

    defaultProps.multiple = {
      default: () => true
    };

    defaultProps.clearable = {
      default: () => true
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

  // 合并methods
  mergeMethods() {
    this.Input.methods.handleEnter = function () {
      this.$_live_getChildComponent(window.vm, 'S.TEST.23729').searchClickData();
      // this.$parent.$parent.$parent.searchClickData();
    };
  }

  settingPlaceholder() { // 设置Placeholder属性
    const placeholder = this.item.webconf && this.item.webconf.placeholder ? this.item.webconf.placeholder : null;
    this.item.props.placeholder = placeholder || `${(dataProp.select && dataProp.select.props) ? dataProp.select.props.placeholder : '请选择'}${this.item.coldesc}`;
  }
  
  settingOptions() {
    if (this.item.combobox) {
      this.item.props.options = this.item.combobox.map((item) => {
        item.value = item.limitval;
        item.label = item.limitdesc;
        return item;
      });
    }

    // 合并类型字段
    if (this.item.conds) {
      const arr = [];
      this.item.conds.map((item) => {
        item.combobox.map((temp) => {
          temp.value = `${item.colname}|${temp.limitval}`;
          temp.label = temp.limitdesc;
          arr.push(temp);
          return temp;
        });
        return item;
      });

      this.item.props.options = arr;
    }
  }
}

export default CustomSelect;
