/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * DocUpload组件自定义
 */

 import Vue from 'vue';
 import { Docfile } from '@syman/ark-ui-bcl';
 import network, { getGateway } from '../../__utils__/network';
//  import Docfile from 'arkui_BCL/Docfile';

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
 
 class CustomDocUpload {
   constructor(item) {
     this.item = item; 
     // if (this.item.Components) {
     //   this.Input = this.item.Components;
     // } else {
     // this.Input = deepClone(test);
     // }
     const DefaultInput = Vue.extend(Docfile);
     
     this.Input = new DefaultInput().$options;
     // console.log(this.Input);
     delete this.Input._Ctor;
   }
 
   init() {
     this.mergeProps();
 
     if (this.item.Components) {
       return this.item.Components;
     }
     
     const Con = Vue.extend(this.Input);
     
     const obj = { ...new Con().$options };
     this.item.Components = obj;
     return this.Input;
   }
 
   // 合并props
   mergeProps() {
     const defaultProps = { ...this.Input.props };
    defaultProps.accept = {
      default: () => {
          return this.item.webconf && this.item.webconf.UploadAccept || '*'
      }
    };
    defaultProps.itemWebconf = {
      default: () => {
        return this.item.webconf || {}
      }
    };
    defaultProps.webConfSingle = {
      default: () => {
        return this.item.webConfSingle || {}
      }
    };
    defaultProps.http.default = () => {
      return network;
    };
    defaultProps.dataitem.default = () => {

      return {
        readonly: this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true), //控制字段是否可编辑
        url: getGateway('/p/cs/batchUpload'),
        filesLength:this.item.webconf && this.item.webconf.filesLength ? this.item.webconf.filesLength : null,
        filesize:this.item.webconf && this.item.webconf.filesize ? parseFloat(this.item.webconf.filesize*1024*1024) : null,
        accept: this.item.webconf && this.item.webconf.UploadAccept ? this.item.webconf.UploadAccept : null,
        sendData:{
          path: `${this.item.tableName}/${this.item.itemId}/`,
        },
        //valuedata:Array.isArray(this.item.valuedata) ? this.item.valuedata : JSON.parse(this.item.valuedata)
      };
    };
     
     // this.settingPlaceholder();
     // if (this.item.type === 'NUMBER') {
     //   this.numericTypes();
     // }
     // if (this.item.isuppercase) {
     //   this.uppercase();
     // }
     
 
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
 
 
 
 }
 
 export default CustomDocUpload;