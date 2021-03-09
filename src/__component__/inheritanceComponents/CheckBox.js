/**
 * checkbox组件的自定义逻辑处理
 */
import Vue from 'vue';


let Checkbox = Ark.Checkbox
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

class CustomCheckbox {
  constructor(item) {
    this.item = item; 
    // const DefaultCheckbox = Vue.extend(Checkbox);

    this.Input =  deepClone(Checkbox);;
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

    defaultProps.disabled = {
      default:() => this.item.readonly
    }
    this.settingOptions();

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

  }

  
  settingOptions() {
    if (this.item.combobox) {
      this.item.combobox.map((item) => {
        if(item.limitdis){
          this.item.props.trueValue = item.limitval
        }else{
          this.item.props.falseValue = item.limitval
        }
        return item;
      });
    }

  }
}

export default CustomCheckbox;