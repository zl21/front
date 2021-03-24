/**
 * 扩展属性组件的自定义逻辑处理
 */
//  import { ExtensionProperty } from '@syman/ark-ui-bcl';
 import ExtensionProperty from 'arkui_BCL/ExtensionProperty';
 import network from '../../__utils__/network'

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

class CustomExtensionProperty {
  constructor(item) {
    this.item = item; 
    // const DefaultCheckbox = Vue.extend(Checkbox);
    
    this.Input =  deepClone(ExtensionProperty);;
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

    defaultProps.webconf = {
      default: () => (this.item.webconf || {})
    }

    defaultProps.network = {
      default: () => network
    }

    console.log("🚀 ~ ", this.item, this.Input.props, defaultProps)
    console.log(defaultProps.webconf);
    this.Input.props = defaultProps;
  }

  // 合并methods
  mergeMethods() {

  }

  
}

export default CustomExtensionProperty;