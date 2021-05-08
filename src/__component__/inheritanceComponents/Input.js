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
import { SetPlaceholder ,SetDisable} from './setProps';

let Input = Ark.Input

// const nativeInput = deepClone(Input);
class CustomInput {
  constructor(item) {
    this.item = item;
    this.Vm = Input;
    this.mergeProps();   
    this.mergeMethods(); 
  }

  init() {
    return {
      Components:this.Vm,
      props:this.props
    };

  }

  // 合并props
  mergeProps() {
    this.item.props = {};
    this.props = {
      maxlength:this.item.length,
      placeholder:new SetPlaceholder(this.item).init(),
      disabled:new SetDisable(this.item).init(), 
    }
  
    if (this.item.isuppercase) {
      this.uppercase();
    }
    if (this.item.type === 'NUMBER') {
      this.numericTypes();
      
    }
    if(this.item.props.regx){
        this.props.regx = this.item.props.regx;
    }
    
    if(this.item.display === 'OBJ_TEXTAREA'){

      this.props.type = 'textarea';
      if((this.item.webconf && this.item.webconf.ispassword) || this.item.ispassword){
        this.props.encrypt = true;
      }

      

      this.props.autosize ={
        minRows: this.item.row + 1
      }
     
      
    }else{
      // 处理ispassword属性
   
      if((this.item.webconf && this.item.webconf.ispassword) || this.item.ispassword){
        this.props.type = 'password';
      }

    }
  
  }

  // 合并methods
  mergeMethods() {
    
    new InputMethod(this.item,this.Vm)
    
    
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
      string = `^(-|\\+)?\\d{0,${this.item.length - this.item.scale}}(\\\.[0-9]{${this.item.scale-1},${
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
