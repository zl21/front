/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */
/**
 * Input 组件自定义
 * 
*/

import Vue from 'vue';
import dataProp from '../../__config__/props.config';
import regExp from '../../constants/regExp';
import InputMethod from '../ExtendedMethods/Input';

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
    // this.item.rules = {
    //   required: {
    //     type:true,
    //     message: '请输入数据', 
    //     trigger: 'blur'
    //   }, 
    //   trigger:{
    //       blur:{
    //         max:3,
    //         message: '失去光标最大长度为3', 
    //       },
    //       // change:{
    //       //   regx:'',
    //       //   min:3,
    //       //   max:10,
    //       //   message: '最大长度为10,最小长度为3', 
    //       // },
    //       // change:{
    //       //   regx:'\\d',
    //       //   message: '只能输入数字', 
    //       // },
    //       // change:{
    //       //   callback:function(val){
    //       //       console.log(val);
    //       //       return `${val} 的值不对`
    //       //   },
    //       // },
    //       change:{
    //         callback:function(val){
    //           return new Promise((resolve) => {
    //                   resolve(` 获取的值${val}`);
    //           });
    //         },
    //       }            
    //   },
      
    // }
    if (this.item.type === 'NUMBER') {
      this.numericTypes();
    }
    // if (this.item.isuppercase) {
    //   this.uppercase();
    // }

    if(this.item.display === 'OBJ_TEXTAREA'){
      defaultProps.type = {
        default:() => 'textarea'
      }

      defaultProps.autosize = {
        default:() => ({
          minRows: this.item.row + 1 
        })
      }
    }
    
    // 处理ispassword属性
    if((this.item.webconf && this.item.webconf.ispassword) || this.item.ispassword){
      defaultProps.type = {
        default:() => 'password'
      }
    }

    defaultProps.disabled = {
      default:() => this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true)
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

    new InputMethod(this.item,this.Input)
    
    
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
    if (this.item.scale >= 0) {
      this.item.props.regx = typeRegExp;
    } else if (this.item.webconf && this.item.webconf.ispositive) {
      this.item.props.regx = typeRegExp;
    }
  }

  uppercase() { // 大写转换
    if (this.item.isuppercase) {
      this.item.props.regx = /^[A-Z0-9\u4e00-\u9fa5]*$/;
    }
  }
}

export default CustomInput;
