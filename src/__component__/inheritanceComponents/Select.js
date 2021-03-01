/**
 * select组件的自定义逻辑处理
 */
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
    // if (this.item.Components) {
    //   this.Input = this.item.Components;
    // } else {
    //   this.Input = deepClone(Input);
    // }
    this.Input = deepClone(Select);
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
    
    defaultProps.transfer = {
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
    this.item.props.placeholder = placeholder || `${(dataProp.input && dataProp.input.props) ? dataProp.input.props.placeholder : '请输入'}${this.item.coldesc}`;
  }
}

export default CustomSelect;
