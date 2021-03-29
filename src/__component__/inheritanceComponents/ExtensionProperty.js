/**
 * 扩展属性组件的自定义逻辑处理
 */
 import { ExtensionProperty } from '@syman/ark-ui-bcl';
//  import ExtensionProperty from 'arkui_BCL/ExtensionProperty';
 import network from '../../__utils__/network'

// 深拷贝
const deepClone = (arr) => {  
  const obj = arr.constructor == Array ? [] : {};
  for (const item in arr) {
    if (typeof arr[item] === 'object') {
      obj[item] = deepClone(arr[item]);
    } else {
      obj[item] = arr[item];
    }
  }
  return obj;
};

class CustomExtensionProperty {
  constructor(item) {
    this.item = item; 
    this.Input = deepClone(ExtensionProperty)
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
      default:() => this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true)
    }

    defaultProps.defaultData = {
      default: () => (this.item.valuedata || {})
    }

    defaultProps.webconf = {
      default: () => (this.item.webconf || {})
    }

    defaultProps.network = {
      default: () => network
    }

    defaultProps.extentionConfig = {
      default: () => (this.item.extentionConfig || {})
    }

    defaultProps.ctrlOptions = {
      default: () => (this.item.ctrlOptions || {rows: 8})
    }

    this.Input.props = defaultProps;
  }

  // 合并methods
  mergeMethods() {

  }

  
}

export default CustomExtensionProperty;