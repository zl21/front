/**
 * DatePicker组件的自定义逻辑处理
 */

import { DatePicker } from 'ark-ui';
import dataProp from '../../__config__/props.config';

// 深拷贝
const deepClone = (target) => {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(deepClone(target[i]));
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if (target === null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
      result = target;
    } else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (const i in target) {
        result[i] = deepClone(target[i]);
      }
    }
    // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result;
};

class CustomDatePicker {
  constructor(item) {
    this.item = item;
    if (this.item.Components) {
      this.DatePicker = this.item.Components;
    } else {
      this.DatePicker = deepClone(DatePicker);
    }
    
    delete this.DatePicker._Ctor;
  }

  init() {
    this.mergeProps();
    this.mergeMethods();
    if (this.item.Components) {
      return this.item.Components;
    }
    
    const obj = { ...this.DatePicker };
    this.item.Components = obj;
    return obj;
  }

  // 合并props
  mergeProps() {
    const defaultProps = { ...this.DatePicker.props };

    defaultProps.type={
      default: () => {
        switch(this.item.display){
          case 'OBJ_DATE':
            return 'datetimerange';
            break;
          case 'OBJ_DATENUMBER':
            return 'daterange';
            break;
          default:
            return 'date';
            break;
        }
      }
    }
    defaultProps.transfer = {
      default: () => true
    };

    defaultProps.placeholder = {
      default: () => `请选择${this.item.coldesc}`
    }

    this.DatePicker.props  = defaultProps;
    // this.DatePicker._Ctor[0].options.props  = Object.assign(this.DatePicker._Ctor[0].options.props,defaultProps);
    // this.DatePicker._Ctor[0].options.mixins.props  = Object.assign(this.DatePicker._Ctor[0].options.props,defaultProps);
  }

  mergeMethods(){

    this.DatePicker.methods = {
      handleClose:function(event) {
        console.log(event)
        // const pickerPanel = this.$refs.pickerPanel && this.$refs.pickerPanel.$el;
        // console.log(event,pickerPanel.contains(event.target))
        // this.handleClose(event)
        
      }
    }
  }
}

export default CustomDatePicker;
